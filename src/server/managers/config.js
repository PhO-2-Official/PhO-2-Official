import { DB } from "../core/db.js";
import { z } from "zod";

export const ConfigManager = (() => {

  // User schema for validation
  const Config = z.object({
    key: z.string(),
    value: z.string(),
    type: z.enum(['text', 'date', 'url', 'int', 'duration']).default('text'),
    security: z.enum(['private', 'public']).default('private')
  })

  const QUERIES = {
    get_configs: new DB.Query('select all configs', 'SELECT * FROM config.config'),
    get_config_by_security: new DB.Query('select config by security', 'SELECT * FROM config.config WHERE security = $1'),
  }

  const get_configs = async () => {
    return {
      success: true,
      error: null, 
      data: await QUERIES.get_configs.execute()
    }
  }
  
  const get_config_by_security = async (security) => {
    return {
      success: true,
      error: null, 
      data: await QUERIES.get_config_by_security.execute([ security ])
    }
  }

  return {
    get_configs,
    get_config_by_security,
  }
})() 
