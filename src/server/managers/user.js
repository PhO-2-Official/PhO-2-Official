import { DB } from "../core/db.js"
import { z } from "zod";

export const UserManager = (() => {

  // User schema for validation
  const User = z.object({
    username: z.string(),
    password: z.string(),
    is_admin: z.boolean().default(false),
    category: z.enum(['junior', 'senior', 'open']).default('junior'),
    status: z.enum(['participating', 'disqualified', 'spectating']).default('participating'),
  })

  const QUERIES = {
    get_users: new DB.Query('select all users', 'SELECT * FROM public.users'),
    get_user_by_id: new DB.Query('select user by id', 'SELECT * FROM public.users WHERE id = $1'),
    get_user_by_username: new DB.Query('select user by username', 'SELECT * FROM public.users WHERE username = $1'),
    create_user: new DB.Query('insert new user', 'INSERT INTO public.users (username, password, is_admin, status, category) VALUES ($1, $2, $3, $4, $5)')
  }

  const get_users = async () => {
    return {
      success: true,
      errro: null,
      data: await QUERIES.get_users.execute(),
    }
  }

  const get_user_by_id = async (id) => {
    return {
      success: true,
      error: null,
      data: await QUERIES.get_user_by_id.execute([ id ])
    }
  }

  const get_user_by_username = async (username) => {
    return {
      success: true,
      error: null,
      data: await QUERIES.get_user_by_username.execute([ username ])
    }
  }

  const create_user = async (user) => {
    const { success, data = null, error = null } = User.safeParse(user);
    return {
      success,
      error,
      data: success ? await QUERIES.create_user.execute([ user.username, user.password, user.is_admin, user.status, user.category ]) : null,
    }
  }

  return {
    get_users,
    get_user_by_id,
    get_user_by_username,
    create_user,
  }
})() 