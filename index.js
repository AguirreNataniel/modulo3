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
    constructor(model){this.model = model}
    async getUsuario(req, response) {
        const usuario = await this.model.getUsuario()
        response.status(200).send(usuario)
    }
}

const model = new Model()
const controller = new Controlador(model)

app.get('/usuarios/age-avg', UsersController.getAvgAge.bind(UsersController));
app.get('/usuarios', controller.getUsuario.bind(controller))
app.post('/usuarios', UsersController.createUser.bind(UsersController));
app.get('/usuarios/:id', UsersController.getUser.bind(UsersController));
app.put('/usuarios/:id', UsersController.editUser.bind(UsersController));
app.delete('/usuarios/:id', UsersController.deleteUser.bind(UsersController));

app.listen(port, () =>{
    console.log(`Servidor de MVC en javascript en http://localhost:${port}`);
    console.log(controler)
})