export const createNotificationSchema = {
  body: {
    type: "object",
    additionalProperties: false,
    required: [
      "type",
      "source",
      "senderId",
      "receiverId",
      "message",
      "timestamp",
    ],
    properties: {
      type: {
        type: "string",
        enum: [
          "APPOINTMENT_CREATED",
          "APPOINTMENT_CANCELLED",
          "PATIENT_CREATED",
          "EXAM_RESULT_AVAILABLE",
          "SYSTEM",
        ],
      },

      source: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },

      senderId: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },

      receiverId: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },

      title: {
        type: "string",
        minLength: 1,
        maxLength: 200,
      },

      message: {
        type: "string",
        minLength: 1,
        maxLength: 2000,
      },

      data: {
        type: "object",
        additionalProperties: true,
      },

      timestamp: {
        type: "string",
        format: "date-time",
      },
    },
  },
} as const;
