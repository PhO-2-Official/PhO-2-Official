/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-01 03:53:41
 * @ Modified time: 2025-04-30 12:46:08
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

	// Listen to events
	client_pool.on('connect', async () => {
		console.log('Database connected.');
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
			if (!values) return await client_pool(this.query);
			else return await client_pool(this.query, values);
		}
	}

	// The transaction class handles creating robust sequences of queries
	class Transaction {
		
		/**
		 * Creates a transaction from a dict of named queries.
		 * 
		 * @param name			The name of the transaction. 
		 * @param queries		A dictionary of named queries. 
		 */
		constructor(name, queries) {
			this.name = name;
			this.queries = queries;
		}

		/**
		 * Executes the queries as a single transaction.
		 * 
		 * @param	values	A dictionary relating values to the names of each query.
		 */
		async execute(values) {
			
			// Attempt transaction
			try {	
				await client_pool.query('BEGIN');

				// Execute each query sequentially
				for (const [name, query] of this.queries) {
					if (!values[name]) await client_pool.query(query);
					else await client_pool.query(query, values[name]);
				}

				// Finalize the transaction
				return await client_pool.query('COMMIT');
				
			// Rollback transaction
			} catch(error) {
				return await client_pool.query('ROLLBACK');
				console.error(`Transaction "${this.name}" failed: ${error}`);
			}
		}
	}

	return {
		Query,
		Transaction
	}

})()
