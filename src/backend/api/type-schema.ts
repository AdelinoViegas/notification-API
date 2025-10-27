import { z } from "zod";

export const serviceRequestSchema = z.union([
  z.literal("consultation"),
  z.literal("exam"),
  z.literal("surgery")
], { error: "validos: consultation, exam ou surgery!"});

export type ServiceRequest = z.infer<typeof serviceRequestSchema>;

export const countIndicatorSchema = z.union([
  z.literal("req-consultation"),
  z.literal("req-exams"),
  z.literal("req-surgery"),
  z.literal("exam-schedules")
]);

export type CountIndicator  = z.infer<typeof countIndicatorSchema>;