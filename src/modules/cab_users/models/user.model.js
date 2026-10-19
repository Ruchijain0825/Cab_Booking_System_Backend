
import pool from "../../../config/db.js";

// REGISTER USER
export const createUser = async (
  name,
  email,
  password_hash,
  image_url
) => {
  try {
    const result = await pool.query(
      `INSERT INTO cab_users
       (name, email, password_hash, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, image_url, created_at`,
      [name, email, password_hash, image_url ?? null]
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      const duplicateEmail = new Error(
        "Email is already registered"
      );

      duplicateEmail.statusCode = 409;
      throw duplicateEmail;
    }

    throw error;
  }
};

// FIND USER BY EMAIL
// password_hash is needed for bcrypt.compare() during login.
export const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       email,
       password_hash,
       image_url,
       created_at
     FROM cab_users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

// GET ALL USERS
export const getUser = async () => {
  const result = await pool.query(
    `SELECT id, name, email, image_url, created_at
     FROM cab_users`
  );

  return result.rows;
};
