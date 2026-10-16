import pool from "../../../config/db.js"
export const createUser = async(name,email,vehicle_number,licence_hash,vehicle_type,password_hash,phone_number,image_url)=>

{
    try{
        console.log("Vehicle type received:", JSON.stringify(vehicle_type));
console.log(
  "Normalized vehicle type:",
  JSON.stringify(vehicle_type?.trim().toUpperCase())
);
          console.log("Registration field lengths:", {
      nameLength: name?.length,
      emailLength: email?.length,
      vehicleNumberLength: vehicle_number?.length,
      licenceHashLength: licence_hash?.length,
      vehicleTypeLength: vehicle_type?.length,
      passwordHashLength: password_hash?.length,
      phoneNumberLength: phone_number?.length,
      imageUrlLength: image_url?.length,
    });
    console.log("Values being inserted:", [
  name,
  email,
  vehicle_number,
  licence_hash,
  vehicle_type,
  password_hash?.length,
  phone_number,
  image_url,
]);

    const result = await pool.query(`INSERT INTO cab_drivers(name,email,vehicle_number,licence_hash,vehicle_type,password_hash,phone_number,image_url) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,name,email,vehicle_number,vehicle_type,phone_number,image_url,created_at`,[name,email,vehicle_number,licence_hash,vehicle_type,password_hash,phone_number,image_url]);
 
    return result.rows[0]??null
    
    }
    catch(error)
    {
        
  console.error("Message:", error.message);
  console.error("Code:", error.code);
  console.error("Schema:", error.schema);
  console.error("Table:", error.table);
  console.error("Column:", error.column);
  console.error("Constraint:", error.constraint);
  console.error("Stack:", error.stack);


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
    const result = await pool.query(`SELECT id,name,email,password_hash,licence_hash FROM cab_drivers WHERE email = $1 LIMIT 1`,[email]);
    return result.rows[0]
}

export const getUser = async()=>
{
   const result = await pool.query(`SELECT id,name,email,image_url,created_at FROM cab_drivers`);
   return result.rows;
}
export const getDriverAvailability = async (driverId) => {
  const result = await pool.query(
    `SELECT is_online
     FROM cab_drivers
     WHERE id = $1`,
    [driverId]
  );

  return result.rows[0] ?? null;
};

export const updateDriverAvailability = async (driverId, isOnline) => {
  const result = await pool.query(
    `UPDATE cab_drivers
     SET is_online = $1
     WHERE id = $2
     RETURNING is_online`,
    [isOnline, driverId]
  );

  return result.rows[0] ?? null;
};

