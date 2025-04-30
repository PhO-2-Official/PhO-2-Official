import { z } from "zod";

export const VerdictManager = (() => {

  // User schema for validation
  const Verdict = z.object({
    submission_id: z.string().uuid(),
    submission_answer_id: z.string().uuid(),
    problem_answer_id: z.string().uuid(),
    verdict: z.boolean(),
    timestamp: z.string().datetime(),
  })

  const QUERIES = {}

  return {

  }
})() 
