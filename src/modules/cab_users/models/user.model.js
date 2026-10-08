import pool from "../../../config/db.js"
export const createUser = async(name,email,password_hash,image_url)=>

{
    try{
    const result = await pool.query(`INSERT INTO cab_users(name,email,password_hash,image_url) VALUES($1,$2,$3,$4) RETURNING name,email,password_hash,image_url`,[name,email,password_hash,image_url])
    return result.rows[0]
    }
    catch(error)
    {
        if(error.code === "23505")
        {
            const duplicateEmail = new Error("Email is already registered");

            duplicateEmail.statusCode = 409

            throw duplicateEmail
        }
        throw error;
    }
}
export const getUserByEmail = async(email)=>
{
    const result = await pool.query(`SELECT id,name,email,password_hash,otp from cab_users WHERE email = $1`,[email]);
    return result.rows[0]
}
export const getUser = async()=>
{
   const result = await pool.query(`SELECT id,name,email,image_url,created_at FROM cab_users`);
   return result.rows;
}
export const saveOtp = async(otp,email,expiresAt)=>
{
   const result = await pool.query(`UPDATE cab_users SET otp = $1,otp_expires_at = $2,otp_verified = false WHERE email = $3 RETURNING id,email`,[otp,expiresAt,email])

   return result.rows[0];
}
export const verifyOtp = async(email)=>
{
   const result = await pool.query(`UPDATE cab_users SET otp_verified=true,otp=NULL WHERE email = $1 RETURNING id,email,otp_verified`,[email]);
   return result.rows[0]
}
export const resetPassword = async(reset_password_hash,email)=>
{
   const result = await pool.query(`UPDATE cab_users SET reset_password_hash =$1 where email = $2 RETURNING email,reset_password_hash`,[reset_password_hash,email]);
   return result.rows[0]
}