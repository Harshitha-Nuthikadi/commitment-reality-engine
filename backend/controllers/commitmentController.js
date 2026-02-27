import Commitment from "../models/Commitment.js";
import User from "../models/User.js";

const clampScore = (score) => Math.max(0, Math.min(100, score));

const calculateAverageGap = (commitments) => {
  if (!commitments.length) return 0;
  const totalGap = commitments.reduce((sum, item) => sum + (item.effortGap || 0), 0);
  return totalGap / commitments.length;
};

const biasFromAverageGap = (averageGap) => {
  const EPSILON = 0.01;
  if (averageGap > EPSILON) return "OPTIMISTIC";
  if (averageGap < -EPSILON) return "FEARFUL";
  return "REALISTIC";
};

export const createCommitment = async (req, res) => {
  const { title, estimatedEffort, startDate, endDate } = req.body;
  const user = await User.findById(req.userId);

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ message: "End date cannot be before start date" });
  }

  const commitment = await Commitment.create({
    title,
    estimatedEffort,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    phase: user?.currentPhase || 1,
    user: req.userId
  });

  res.status(201).json(commitment);
};

export const getCommitments = async (req, res) => {
  const commitments = await Commitment.find({
    user: req.userId,
    archived: false
  }).sort({ createdAt: -1 });

  const user = await User.findById(req.userId);

  res.json({
    commitments,
    realityScore: user.realityScore,
    biasType: user.biasType,
    currentPhase: user.currentPhase
  });
};

export const completeCommitment = async (req, res) => {
  const { actualEffort, inaccurateNote } = req.body;

  const commitment = await Commitment.findById(req.params.id);
  if (!commitment) {
    return res.status(404).json({ message: "Not found" });
  }
  if (commitment.user.toString() !== req.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  if (commitment.archived) {
    return res.status(400).json({ message: "Cannot update archived commitment" });
  }

  commitment.actualEffort = actualEffort;
  commitment.status = "COMPLETED";
  commitment.effortGap = actualEffort - commitment.estimatedEffort;
  commitment.effortRatio =
    actualEffort / commitment.estimatedEffort;
  commitment.inaccurateNote = inaccurateNote?.trim() || commitment.pendingReason || "";
  commitment.pendingReason = "";

  await commitment.save();

  const user = await User.findById(req.userId);

  if (commitment.effortGap === 0) user.realityScore += 5;
  else if (commitment.effortGap > 0) user.realityScore -= 10;
  else user.realityScore -= 5;

  user.realityScore = clampScore(user.realityScore);

  const lastFive = await Commitment.find({
    user: req.userId,
    status: "COMPLETED",
    archived: false
  })
    .sort({ createdAt: -1 })
    .limit(5);

  const averageGap = calculateAverageGap(lastFive);
  user.biasType = biasFromAverageGap(averageGap);

  await user.save();

  res.json({
    message: "Completed",
    commitment,
    realityScore: user.realityScore,
    biasType: user.biasType
  });
};

export const savePendingReason = async (req, res) => {
  try {
    const { pendingReason } = req.body;
    const commitment = await Commitment.findById(req.params.id);

    if (!commitment) {
      return res.status(404).json({ message: "Not found" });
    }
    if (commitment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (commitment.archived) {
      return res.status(400).json({ message: "Cannot edit archived commitment" });
    }
    if (commitment.status !== "PENDING") {
      return res.status(400).json({ message: "Only pending commitments can be edited" });
    }

    commitment.pendingReason = pendingReason?.trim() || "";
    await commitment.save();

    return res.json({ message: "Reason saved", commitment });
  } catch (err) {
    return res.status(500).json({ message: "Failed to save reason" });
  }
};

export const getCommitmentSuggestion = async (req, res) => {
  const lastFive = await Commitment.find({
    user: req.userId,
    status: "COMPLETED",
    archived: false
  })
    .sort({ createdAt: -1 })
    .limit(5);

  const averageGap = calculateAverageGap(lastFive);

  if (averageGap > 0) return res.json({ multiplier: 1.2 });
  if (averageGap < 0) return res.json({ multiplier: 0.9 });
  return res.json({ multiplier: 1 });
};

export const deleteCommitment = async (req, res) => {
  try {
    const commitment = await Commitment.findById(req.params.id);

    if (!commitment) {
      return res.status(404).json({ message: "Not found" });
    }
    if (commitment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (commitment.archived) {
      return res.status(400).json({ message: "Cannot delete archived commitment" });
    }
    if (commitment.status === "COMPLETED") {
      return res.status(400).json({ message: "Completed commitments cannot be deleted" });
    }

    await commitment.deleteOne();
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete commitment" });
  }
};

export const startNewPhase = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const now = new Date();

  await Commitment.updateMany(
    { user: req.userId, archived: false },
    { $set: { archived: true, archivedAt: now } }
  );

  user.realityScore = 100;
  user.biasType = "REALISTIC";
  user.currentPhase = (user.currentPhase || 1) + 1;
  await user.save();

  return res.json({
    message: "Started new phase",
    realityScore: user.realityScore,
    biasType: user.biasType,
    currentPhase: user.currentPhase
  });
};
