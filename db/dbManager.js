const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

// Debugging Section
console.log("ENV CHECK →", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



const getConnection = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306, // Add port support
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
};

const insertPassenger = async (passenger) => {
    try {
        const conn = await getConnection();

        const values = [
            passenger.name,
            passenger.passportNumber,
            passenger.temperature,
            passenger.hasOverseasHistory,
            passenger.airport,
        ];
        console.log("🚨 SQL Values:", values);

        await conn.execute(
            `INSERT INTO passengers (name, passportNumber, temperature, hasOverseasHistory, airport) VALUES (?, ?, ?, ?, ?)`, values);
        await conn.end();
    } catch (err) {
        console.log("❌ MySQL Insert Error:", err);
    }

};

module.exports = { insertPassenger };