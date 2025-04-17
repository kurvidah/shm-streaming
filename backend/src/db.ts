import mysql from "mysql2/promise"

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "shm_user",
    password: process.env.DB_PASSWORD || "shm_password",
    database: process.env.DB_NAME || "shm_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

// Test connection
async function testConnection() {
    try {
        const connection = await pool.getConnection()
        console.log("Database connection established successfully")
        connection.release()
    } catch (error) {
        console.error("Error connecting to database:", error)
    }
}

testConnection()

export default pool