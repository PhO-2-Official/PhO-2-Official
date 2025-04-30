import { z } from "zod";

export const ConfigManager = (() => {

  // User schema for validation
  const Config = z.object({
    key: z.string(),
    value: z.string(),
    type: z.enum(['text', 'date', 'url', 'duration']).default('text'),
    security: z.enum(['private', 'public']).default('private')
  })

  const QUERIES = {}

  return {

  }
})() 
