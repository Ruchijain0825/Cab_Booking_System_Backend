import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const {Pool} = pg;

const pool = new Pool({
    connectionString:process.env.POSTGRE_URL,
    max:20,
    min:2,
    idleTimeoutMillis:3000,
    connectionTimeoutMillis:5000,
    ssl:
    {
        rejectUnauthorized:false,
    },
    application_name:"cab_booking_api"
});
pool.on("error",(error)=>
{
    console.log("Unexpected PostgreSQL pool server",error)
});
export const connectionDb = async()=>
{
    try{
        await pool.query("SELECT 1");
        console.log("postgre connected successfully!");
    }
        catch(error)
        {
         console.error("postgre connection failed",error.message)
         throw error
        }
    }
export default pool;
