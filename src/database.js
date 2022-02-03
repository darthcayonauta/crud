const mysql = require('mysql');
const {promisify} =  require('util');
const { database } = require('./keys');


const pool = mysql.createPool(database);

pool.getConnection( (err,connection) =>{
    if(err)
    {
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('CONNECTION lost');
        }

        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('too many connections');
        }

        if(err.code === 'ECONREFUSED'){
            console.log('DATABASE CONNECRTION WAS REFUSED');
        }

    }

    if(connection) connection.release();
        console.log('DATABASE is CONNECTED');

    return;
});

//promisify pool queries
pool.query = promisify(pool.query);

module.exports = pool;