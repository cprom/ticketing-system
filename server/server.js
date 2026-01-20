import express from 'express';
import sql from 'mssql';
import 'dotenv/config';


const app = express();

const port = parseInt(process.env.PORT) || 1402;
const DB_Password = process.env.DB_PASSWORD;

// Configuration object for SQL Server connection
const config = {
    user: 'sa',
    password: DB_Password, // Use the SA password you set in the docker run command
    server: 'localhost', // Connect to localhost from the host machine
    port: port, // The mapped port (e.g., 1433 or 1400)
    database: 'Master', // Initial catalog/database name
    options: {
        encrypt: false, // Use false for Linux containers or if not using SSL
        trustServerCertificate: true // May be needed for local development
    }
};

// Function to connect to the database and start the server
async function connectToSql() {
    try {
        // Ensure that the connection is established
        await sql.connect(config);
        console.log('Connected to SQL Server');
        
        // Start Express server
        app.listen(3000, () => {
            console.log('Express server running on http://localhost:3000');
        });

    } catch (err) {
        console.error('Database Connection Failed! Error: ', err);
    }
}

connectToSql();

// Example Express route to query the database
app.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT name FROM sys.databases`;
        res.send(`Databases: ${result.recordset.map(db => db.name).join(', ')}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Make sure to close the connection when the app stops (optional but good practice)
process.on('SIGINT', () => {
    sql.close();
    console.log('SQL Server connection closed');
    process.exit();
});
