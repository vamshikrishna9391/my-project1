const express = require('express');
const path = require('path');

const {open} = require('sqlite');
const sqlite3 = require('sqlite3');

const dbPath = path.join(__dirname, 'mydb.db');

const app = express()

let db = null;

const initializeDBAndServer = async () => {
    try{
        db = await open({
            filename : dbPath,
            driver : sqlite3.Database
        })
        app.listen(3004, () => {
            console.log("Server Running At http://localhost:3004");
        })
    }catch (e){
        console.log(`DATABASE ERROR ${e.message}`);
        process.exit(1);
    }
}

initializeDBAndServer()

app.get('/page', (request, responce) => {
    responce.sendfile('./index.html', {root:__dirname})
})

// app.get('/page', (request, responce) => {
//     responce.sendfile('./exindex.js', {root:__dirname})
// })


app.get('/:id', async (request, responce) => {
    const {id} = request.params;
    const getNameQuery = `
        SELECT 
            * 
        FROM 
            USER
        WHERE 
            ID = ${id};`;
    const name = await db.get(getNameQuery);
    responce.send(name);
})
