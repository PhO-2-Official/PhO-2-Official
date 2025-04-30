import { z } from "zod";
import { DB } from "../core/db.js";

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

  const Answer = z.object({
    mantissa: z.number().nonnegative().min(1).lt(10),
    exponent: z.number().int(),
  })

  const QUERIES = {
    get_problems: new DB.Query('select all problems', 'SELECT * FROM problems JOIN answers ON problems.answer_id = answers.id'),
    get_problem_by_code: new DB.Query('select problem by code number and alpha', 'SELECT * FROM problems WHERE code_number = $1 AND code_alpha = $2'),
    create_problem: new DB.Query('create new problem and corresponding answer', `
      WITH inserted_answer AS (
        INSERT INTO public.answers (mantissa, exponent) 
          VALUES ($1, $2) 
          RETURNING id
      )
      INSERT INTO public.problems (name, code_number, code_alpha, answer_id, tolerance, points, status, type)
        SELECT $3, $4, $5, id, $6, $7, $8, $9 FROM inserted_answer
    `),
  }

  const get_problems = async () => {
    return {
      success: true,
      error: null,
      data: (await QUERIES.get_problems.execute()).map(problem => ({ 
        ...problem, 
        code: { number: problem.code_number, alpha: problem.code_alpha },
        answer: { mantissa: problem.mantissa, exponent: problem.exponent }, 
      })),
    }
  }

  const get_problem_by_code = async (code) => {
    const { success, data = null, error = null } = Code.safeParse(code);
    return {
      success,
      error,
      data: success ? await QUERIES.get_problem_by_code.execute([ code.number, code.alpha ]) : null,
    }
  }

  const create_problem = async (problem) => {
    
    // Verify code schema
    const code_parse = Code.safeParse({ 
      number: problem.code_number,
      alpha: problem.code_alpha,
    });

    // Wrong code schema
    if (code_parse.error) return { success: false, data: null, error: code_parse.error };

    // Verify answer schema
    const answer_parse = Answer.safeParse({ 
      mantissa: problem.answer_mantissa,
      exponent: problem.answer_exponent,
    });

    // Wrong code schema
    if (answer_parse.error) return { success: false, data: null, error: answer_parse.error };
    
    // Perform compound query
    const create_problem_result = await QUERIES.create_problem.execute([ 
      problem.answer_mantissa, problem.answer_exponent,
      problem.name, problem.code_number, problem.code_alpha, problem.tolerance, problem.points, problem.status, problem.type,
    ])

    return create_problem_result;
  }

  return {
    get_problems,
    get_problem_by_code,
    create_problem,
  }
})() 
