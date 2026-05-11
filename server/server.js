// import express from 'express';
import sql from 'mssql';
import dotenv from "dotenv";
dotenv.config();
import app from './app.js'


const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));

// Close the connection when the app stops 
process.on('SIGINT', () => {
    sql.close();
    console.log('SQL Server connection closed');
    process.exit();
});
