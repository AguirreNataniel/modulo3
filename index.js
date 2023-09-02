const express =  require("express");
const { Pool } = require("pg");
// var bodyParser = require('body-parser');


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
    
    async addID(id){
        await pool.query("insert into usuario (id) values($1);", [id])
    }

    async addCI(ci){
        await pool.query("insert into usuario (CI) values($1);", [ci])
    }

    async addNombre(nombre){
        await pool.query("insert into usuario (nombre) values($1);", [nombre])
    }

    async addPrimer_apellido(primer_apellido){
        await pool.query("insert into usuario (primer_apellido) values($1);", [primer_apellido])
    }
    
    async addSegundo_apellido(segundo_apellido){
        await pool.query("insert into usuario (segundo_apellido) values($1);", [segundo_apellido])
    }
    
    async addNacimiento(nacimiento){
        await pool.query("insert into usuario (nacimiento) values($1);", [nacimiento])
    }      

    async addEdad(edad){
        await pool.query("insert into usuario (edad) values($1);", [edad])
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
            html += `<li>${data[i].nombre}</li>`
        }
        return html;
    }
}

//Controlador

class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;
    }
    
    //Ale
    // async getUsuario(req, response) {
    //     const usuario = await this.model.getUsuario()
    //     response.status(200).send(usuario)
    // }
    
    async getUsuario(req, res){
        const data = await this.model.getUsuario()
        const html = this.view.render(data);
        res.send(html);
    }

    async addID(req, res) {
        const name = req.body.name;
        await this.model.addID(name)
        const data = await this.model.getUsuario();
        const html = this.view.render(data);
        res.send(html)
    }

async addNombre(req, res) {
    const name = req.body.name;
    await this.model.addNombre(name)
    const data = await this.model.getUsuario();
    const html = this.view.render(data);
    res.send(html)
}

async addPrimer_apellido(req, res) {
    const name = req.body.name;
    await this.model.addPrimer_apellido(name)
    const data = await this.model.getUsuario();
    const html = this.view.render(data);
    res.send(html)
}

async addSegundo_apellido(req, res) {
    const name = req.body.name;
    await this.model.addSegundo_apellido(name)
    const data = await this.model.getUsuario();
    const html = this.view.render(data);
    res.send(html)
}

async addNacimiento(req, res) {
    const name = req.body.name;
    await this.model.addNacimiento(name)
    const data = await this.model.getUsuario();
    const html = this.view.render(data);
    res.send(html)
}

async addEdad(req, res) {
    const name = req.body.name;
    await this.model.addEdad(name)
    const data = await this.model.getUsuario();
    const html = this.view.render(data);
    res.send(html)
}

async addNombre(req, res) {
    const name = req.body.name;
    await this.model.addTodo(name)
    const data = await this.model.getUsuario();
    const html = this.view.render(data);
    res.send(html)
}

}


//Instanciación

const model = new Model()
const view = new View();
const controller = new Controller(model, view)

//Levantar la App

// app.use(bodyParser.json());
// app.use(
//     bodyParser.urlencoded({
//     extended: true,
//     }),
// );

app.use(express.urlencoded({extend: true}))

app.get("/", controller.getUsuario.bind(controller));
app.post("/add", controller.addUsuario.bind(controller));
// app.get('/usuarios', controller.getUsuario.bind(controller))
// app.get('/usuarios/age-avg', UsersController.getAvgAge.bind(UsersController));
// app.post('/usuarios', UsersController.createUser.bind(UsersController));
// app.get('/usuarios/:id', UsersController.getUser.bind(UsersController));
// app.put('/usuarios/:id', UsersController.editUser.bind(UsersController));
// app.delete('/usuarios/:id', UsersController.deleteUser.bind(UsersController));





app.listen(port, () =>{
    console.log(`Servidor de MVC en javascript en http://localhost:${port}`);
    console.log(controller)
})