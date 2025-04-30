import { z } from "zod";

export const AnswerManager = (() => {

  // User schema for validation
  const Answer = z.object({
    mantissa: z.number().gte(1).lt(10),
    exponent: z.number().int(),
  })

  const QUERIES = {}

  return {

  }
})() 
