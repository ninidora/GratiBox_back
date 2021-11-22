/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import '../setup.js';
import connection from '../database.js';

export async function findUser(token) {
  const session = await connection.query(`
        SELECT *
        FROM sessions
        WHERE token=$1
    `, [token]);
  if (session) return session.user_id;
}
