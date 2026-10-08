import dotenv from "dotenv";

dotenv.config();
import app from "./app.js";

import { connectionDb } from "./config/db.js";
const PORT = process.env.PORT || 5000;

const startServer = async()=>
{
    try{
        await connectionDb();
        const server = app.listen(PORT,()=>
        {
            console.log(`Server running on port ${PORT}`)
        })
    }
    catch(error)
    {
        console.error("Server setup failed");
        process.exit(1)
    }
}
startServer();