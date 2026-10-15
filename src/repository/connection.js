import mysql from 'mysql2/promise';

export const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tcc',
    port: 3306
});