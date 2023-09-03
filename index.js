const express =  require("express");
const { Pool } = require("pg");

const bodyParser = require('body-parser');


const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    password: '21041983Nataniel',
    host: 'localhost',
    database: 'modulo3', 
    port: '54322',
})

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
    extended: true,
    }),
);

// Modelo, es lo que se comunica con la DB

class Model {
    async getUsuario() {
        const { rows } = await pool.query("select * from usuario;")
        return rows;
    }

    async addUsuario(ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad){
        await pool.query("insert into usuario (ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad) values($1, $2, $3, $4, $5, $6);", [ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad])
    }

    async getUsuarioID(id) {
        const { rows } = await pool.query("select * from usuario where id = $1;", [id])
        return rows;
    }

    async putUsuario(ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad) {
        const editarUsuario = `
            update users
            set ci= '${ci}',
            cl  nombre='${nombre}',
            first_lastname='${primer_apellido}',
            second_lastname='${segundo_apellido}',
            birth='${nacimiento}',
            age='${edad}'
            where id = ${id} RETURNING *
            `;
        const { rows } = await pool.query(editarUsuario);
        return rows;
    }    

    async deleteUsuario(id) {
        const editarUsuario = `
            update users
            set enabled = '${false}'
            where id = ${id} RETURNING *
            `;
        await pool.query(editarUsuario);
    }

    async promedioUsuario() {
        const avgQuery = 'select avg(extract(year from age(now(), birth))) as avg from users;';
        const { rows } = await dbClient.query(avgQuery);
        return rows;
    }
}

// Controlador

class Controller {
    constructor(model){
        this.model = model;
    }
    
    async getUsuario(req, res){
        const data = await this.model.getUsuario()
        res.send(data);
    }

    async addUsuario(req, res){
        const { ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad } = req.body
        await this.model.addUsuario(ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad)
        res.status(201).send()
    }

    async getUsuarioID(req, res){
        const {id} = req.params
        const data = await this.model.getUsuarioID(id)
        res.status(200).send(data) 
    }

    async putUsuario(req, res) {
        const { id } = req.params;
        if (!id) {
        res.status(400).send('Necesario ID');
        }
        const { ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad } = req.body;
        if (!ci || !nombre || !primer_apellido || !segundo_apellido || !nacimiento || !edad) {
        res.status(400).send('Requeridos todos los items');
        }
        const userEdited = await this.model.putUsuario(id, ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad);
        res.status(200).send({ ...userEdited });
    }

    async deleteUsuario(req, res) {
        const { id } = req.params;
        if (!id) {
        res.status(400).send('Necesario ID');
        }
        await this.model.deleteUsuario(id);
        res.status(200).send([]);
        }

    async promedioUsuario(req, res) {
        const avg = await this.model.promedioUsuario();
        res.status(200).send({ avg });
        }

    async getVersionApi(req, res) {
        const status = {
        nameSystem: 'api-usuario',
        version: '0.0.1',
        developer: 'Nataniel Octavio Aguirre Borcezi',
        email: 'natanielaguirre@gmail.com',
        };
        res.status(203).send(status);
        }
}
// Instanciación

const model = new Model();
const controller = new Controller(model);


app.get("/usuarios", controller.getUsuario.bind(controller));

app.get("/usuarios/:id", controller.getUsuarioID.bind(controller));

app.post("/usuarios", controller.addUsuario.bind(controller));

app.put("/usuarios/:id_usuario", controller.putUsuario.bind(controller));

app.delete("/usuarios/:id_usuario", controller.deleteUsuario.bind(controller));

app.get("/usuarios/promedio-edad", controller.promedioUsuario.bind(controller));

app.get("/usuarios/estado", controller.getVersionApi.bind(controller));

app.listen(port, () =>{
    console.log(`Servidor de MVC en javascript en http://localhost:${port}`);
    console.log(controller);
})