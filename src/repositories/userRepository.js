/* eslint-disable no-shadow */
import '../setup.js';
import connection from '../database.js';

export async function userExists(email) {
  const userExists = await connection.query(`
        SELECT *
        FROM clients
        WHERE email=$1
    `, [email]);
  if (userExists.rowCount !== 0) return userExists.rows[0];
  return false;
}

export async function newUser(name, email, hash) {
  await connection.query(`
        INSERT INTO clients 
        (name, email, password) 
        VALUES ($1, $2, $3)
    `, [name, email, hash]);
}

export async function newSession(userId, token) {
  await connection.query(`
        INSERT INTO sessions
        (user_id, token)
        VALUES ($1, $2)
    `, [userId, token]);
}

export async function userData(token) {
  const userData = await connection.query(`
        SELECT token, name 
        FROM sessions
        JOIN clients
        ON sessions.user_id = clients.id
        WHERE sessions.token = $1
    `, [token]);
  return userData.rows[0];
}
