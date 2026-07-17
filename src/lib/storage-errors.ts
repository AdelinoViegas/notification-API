const ERROR_MAPPER = {
  SERVICE_UNAVIABLE: 1,
  FILE_TOO_LARGE: 2,
  UNKNOWN_ERROR: 3,
  EMPTY_PAYLOAD: 4,
  PRE_ASSIGNED_URL: 5,
  S3_FILE_UPLOAD: 6,
  UPDATE_FILE_STATE: 7
} as const;

export type Error = keyof typeof ERROR_MAPPER;

export const error: Record<Error, number> = ERROR_MAPPER;

