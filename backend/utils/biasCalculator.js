export const calculateBias = (ratios) => {
  if (ratios.length < 5) return "REALISTIC";

  const avg =
    ratios.reduce((acc, val) => acc + val, 0) / ratios.length;

  if (avg > 1.15) return "OPTIMISTIC";
  if (avg < 0.85) return "FEARFUL";
  return "REALISTIC";
};