export const VALID_TARGET_TYPES = ["place", "group"] as const;
export type FeedbackTargetType = (typeof VALID_TARGET_TYPES)[number];

export function isFeedbackTargetType(value: unknown): value is FeedbackTargetType {
  return typeof value === "string" && VALID_TARGET_TYPES.includes(value as FeedbackTargetType);
}

export function isValidRating(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function normalizeComment(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
