/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-01 03:53:41
 * @ Modified time: 2025-04-30 22:56:26
 * @ Description:
 * 
 * Handles db related queries and what not.
 */

import { Env } from './env.js';
import pg from 'pg'

export const DB = (() => {

	// Create the client
	const client_pool = new pg.Pool({
		user: Env.get('DB_USERNAME'),
		password: Env.get('DB_PASSWORD'),
		port: Env.get('DB_PORT'),
		database: 'pho-2',
	})

	// Connect to db
	client_pool.connect();

	// One-time init config
	client_pool.once('connect', async () => {
		console.log('Database connected.');
	
		// Update config vars
		client_pool.query('SELECT * FROM config.config')
			.then(results => results.rows)
			.then(config => config.map(parameter => Env.set(parameter.key, parameter.value)))
	})

	// Something went wrong 
	client_pool.on('error', (error) => {
		console.error(error);
	})

	// Only a single query is involved
	class Query {
		
		/**
		 * Creates a single query.
		 * 
		 * @param name		The name of the transaction. 
		 * @param query 	The query string associated with it.
		 */
		constructor(name, query) {
			this.name = name;
			this.query = query;
		}

		/**
		 * Execute the query with the provided values.
		 * 
		 * @param values 
		 * @returns 
		 */
		async execute(values = null) {
			const results = 
				!values 
					? await client_pool.query(this.query) 
					: await client_pool.query(this.query, values);

			return results.rowCount ? results.rows : [];
		}
	}

	return {
		Query,
	}

})()
