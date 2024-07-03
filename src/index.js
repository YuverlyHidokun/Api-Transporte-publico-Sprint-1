import app from './server.js'
import connection from './database.js';
//Utilizar el metodo

connection()

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})
