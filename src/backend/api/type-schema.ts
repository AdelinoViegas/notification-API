import { z } from "zod";

export const serviceRequestSchema = z.union([
  z.literal("consultation"),
  z.literal("exam"),
  z.literal("surgery")
], { error: "validos: consultation, exam ou surgery!"});

export type ServiceRequest = z.infer<typeof serviceRequestSchema>;