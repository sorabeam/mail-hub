export const REQUEST_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "RUNNING",
  "DONE",
  "FAILED",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const APP_NAME = "Mail Hub";
