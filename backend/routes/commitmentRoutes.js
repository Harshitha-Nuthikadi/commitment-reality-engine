import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createCommitment,
  getCommitments,
  completeCommitment,
  getCommitmentSuggestion,
  deleteCommitment,
  startNewPhase,
  savePendingReason
} from "../controllers/commitmentController.js";

const router = express.Router();

router.use(protect);

router.post("/", createCommitment);
router.get("/", getCommitments);
router.get("/suggestion", getCommitmentSuggestion);
router.post("/start-new-phase", startNewPhase);
router.patch("/:id/pending-reason", savePendingReason);
router.patch("/:id/complete", completeCommitment);
router.delete("/:id", deleteCommitment);

export default router;
