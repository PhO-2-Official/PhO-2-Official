import { DB } from "../core/db.js";
import { z } from "zod";

export const ConfigManager = (() => {

  // User schema for validation
  const Config = z.object({
    key: z.string(),
    value: z.string(),
    type: z.enum(['text', 'date', 'url', 'duration']).default('text'),
    security: z.enum(['private', 'public']).default('private')
  })

  const QUERIES = {
    get_config_by_security: new DB.Query('select config by security', 'SELECT * FROM config.config WHERE security = $1'),
  }

  const get_config_by_security = async (security) => {
    return {
      success: true,
      error: null, 
      data: await QUERIES.get_config_by_security.execute([ security ])
    }
  }

  return {
    get_config_by_security,
  }
})() 
