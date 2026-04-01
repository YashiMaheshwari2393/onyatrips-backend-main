"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_TARGET_TYPES = void 0;
exports.isFeedbackTargetType = isFeedbackTargetType;
exports.isValidRating = isValidRating;
exports.normalizeComment = normalizeComment;
exports.VALID_TARGET_TYPES = ["place", "group"];
function isFeedbackTargetType(value) {
    return typeof value === "string" && exports.VALID_TARGET_TYPES.includes(value);
}
function isValidRating(value) {
    return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}
function normalizeComment(value) {
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}
