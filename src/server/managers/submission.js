import { z } from "zod";

export const SubmissionManager = (() => {

  // User schema for validation
  const Submission = z.object({
    user_id: z.string().uuid(),
    problem_id: z.string().uuid(),
    answer_id: z.string().uuid(),
    verdict_id: z.string().uuid(),
    timestamp: z.string().datetime(),
  })

  const QUERIES = {}

  return {

  }
})() 
