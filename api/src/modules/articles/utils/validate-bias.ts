import { Bias } from "../types/article-preview-query";

export const validateBias = (
  biasInput: string | string[] | undefined
): Bias | null => {
  if (!biasInput || Array.isArray(biasInput)) {
    return null;
  }

  const allowedBias: Array<Bias> = [
    "left",
    "lean-left",
    "center",
    "lean-right",
    "right",
  ];

  return allowedBias.includes(biasInput as Bias) ? (biasInput as Bias) : null;
};
