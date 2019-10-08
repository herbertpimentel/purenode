const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "supersimples",
  password: "12345678",
  port: 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  begin: async () => {
    const transaction = pool.connect();
    await transaction.query("BEGIN");
    return transaction;
  },
  commit: async transaction => {
    await transaction.query("COMMIT");
    transaction.release();
  },
  rollback: async transaction => {
    await transaction.query("ROLLBACK");
    transaction.release();
  }
};

// // https://node-postgres.com/features/transactions
// const { Pool } = require('pg')
// const pool = new Pool()

// (async () => {
//   // note: we don't try/catch this because if connecting throws an exception
//   // we don't need to dispose of the client (it will be undefined)
//   const client = await pool.connect()

//   try {
//     await client.query('BEGIN')
//     const { rows } = await client.query('INSERT INTO users(name) VALUES($1) RETURNING id', ['brianc'])

//     const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
//     const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
//     await client.query(insertPhotoText, insertPhotoValues)
//     await client.query('COMMIT')
//   } catch (e) {
//     await client.query('ROLLBACK')
//     throw e
//   } finally {
//     client.release()
//   }
// })().catch(e => console.error(e.stack))
