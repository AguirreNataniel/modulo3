const express =  require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    password: '21041983Nataniel',
    host: 'localhost',
    database: 'modulo3', 
    port: '54322',
})

class Model {
    async getUsuario() {
        const { rows } = await pool.query("select * from usuario;")
        return rows;
    }
}

class Controlador {
    constructor(model){this.model=model}
    async getUsuario(req, response) {
        const usuario= await this.model.getUsuario()
        response.status(200).send(usuario)
    }
}

const model= new Model()
const controler= new Controlador(model)

app.get('/usuarios', controler.getUsuario.bind(controler))

app.listen(port, () =>{
    console.log(`Servidor de MVC en javascript en http://localhost:${port}`);
    console.log(controler)
})