import { z } from "zod";

export const ProblemManager = (() => {

  // Problem schema for validation
  const Problem = z.object({
    name: z.string(),
    code_number: z.number().nonnegative().int(),
    code_alpha: z.string().max(2),
    answer_id: z.string().uuid(),
    tolerance: z.number(),
    points: z.number().nonnegative(),
    status: z.enum(['active', 'disabled']),
    type: z.enum(['official', 'debug']),
  })

  // Problem code schema
  const Code = z.object({
    number: z.number().nonnegative().int(),
    alpha: z.string().max(2),
  })

  const QUERIES = {
    get_problem_by_code: 'SELECT * FROM problems WHERE code_number = $1 AND code_alpha = $2',
  }

  const get_problem_by_code = async (code) => {
    const { success, data = null, error = null } = Code.safeParse(code);
    return {
      success,
      error,
      data: success ? await QUERIES.get_problem_by_code([ code.number, code.alpha ]) : null,
    }
  }

  return {

  }
})() 
