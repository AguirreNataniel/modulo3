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

// Modelo

class Model {
    async getUsuario() {
        const { rows } = await pool.query("select * from usuario;")
        return rows;
    }
}

// Vista
class View {
    render(data) {
        let html = `
        <form action="/add" method="post">
        <input type="text" name="name">
        <input type="submit">
        </form>
        `;
        for (let i = 0; i < data.length; i++){
            html += `<li>${data[i].todo}</li>`
        }
        return html;
    }
}

//Contolador

class Controlador {
    constructor(model, View){
        this.model = model;
        this.view = view;
    }
    // async getUsuario(req, response) {
    //     const usuario = await this.model.getUsuario()
    //     response.status(200).send(usuario)
    // }
    
    async getUsuarios(req, res){
        const data = await this.model.getUsuarios()
        const html = this.view.render(data);
        res.send(html);
    }

    async addUsuario(req, res) {
        const name = req.body.name;
        await this.model.addTodo(name)
        const data = await this.model.getUsuarios();
        const html = this.view.render(data);
        res.send(html)
    }
}

//Instanciación

const model = new Model()
const view = new View();
const controller = new Controlador(model)

//Levantar la App

app.get('/usuarios', controller.getUsuario.bind(controller))
// app.get('/usuarios/age-avg', UsersController.getAvgAge.bind(UsersController));
// app.post('/usuarios', UsersController.createUser.bind(UsersController));
// app.get('/usuarios/:id', UsersController.getUser.bind(UsersController));
// app.put('/usuarios/:id', UsersController.editUser.bind(UsersController));
// app.delete('/usuarios/:id', UsersController.deleteUser.bind(UsersController));

app.use(express.urlencoded({extend: true}))

app.get("/", controller.getTodos.bind(controller));
app.post("/add", controller.addUsuario.bind(controller));

app.listen(port, () =>{
    console.log(`Servidor de MVC en javascript en http://localhost:${port}`);
    console.log(controller)
})