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

    async putUsuario(id, ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad) {
        const editarUsuario = `
            update usuario
            set ci= '${ci}',
            nombre='${nombre}',
            primer_apellido='${primer_apellido}',
            segundo_apellido='${segundo_apellido}',
            nacimiento='${nacimiento}',
            edad='${edad}'
            where id = ${id} RETURNING *
            `;
        const { rows } = await pool.query(editarUsuario);
        return rows;

    }   
    async deleteUsuario(id_usuario) {
        await pool.query("delete FROM usuario WHERE id = $1", [id_usuario]);
    }

    async promedioUsuario() {
        const promedioQuery = 'select AVG(EXTRACT(YEAR FROM AGE(NOW(), nacimiento))) AS promedio_edades FROM usuario;';
        const { rows } = await pool.query(promedioQuery);
        return rows;
    }

    async getVersionApi() {
        const nameSystem="api-users";
        const version="1.0.0";
        const desarrollador="Nataniel Octavio Aguirre Borcezi";
        const email="natanielaguirre@gmail.com";
        return {nameSystem,version,desarrollador,email};
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
        console.log(id)
        const data = await this.model.getUsuarioID(id)
        res.status(200).send(data) 
    }

    async putUsuario(req, res) {
        const { id_usuario } = req.params;
        if (!id_usuario) {
        res.status(400).send('Necesario ID');
        }
        const { ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad } = req.body;
        if (!ci || !nombre || !primer_apellido || !segundo_apellido || !nacimiento || !edad) {
        res.status(400).send('Requeridos todos los items');
        }
        const usuario = await this.model.putUsuario(id_usuario, ci, nombre, primer_apellido, segundo_apellido, nacimiento, edad);
        res.status(200).send( usuario );
    }

    async deleteUsuario(req, res) {
        const id_usuario = req.params.id_usuario;
        await this.model.deleteUsuario(id_usuario);
        res.sendStatus(204);
    }

    async promedioUsuario(req, res) {
        const promedio = await this.model.promedioUsuario();
        res.status(208).send({ promedio });
        }

    async getVersionApi(req, res) {
        const data = await this.model.getVersionApi();
        res.send(data);
        }
}
// Instanciación

const model = new Model();
const controller = new Controller(model);

app.get("/usuarios/promedio-edad", controller.promedioUsuario.bind(controller));

app.get("/usuarios", controller.getUsuario.bind(controller))

app.get("/usuarios/:id", controller.getUsuarioID.bind(controller));

app.post("/usuarios", controller.addUsuario.bind(controller));

app.put("/usuarios/:id_usuario", controller.putUsuario.bind(controller));

app.delete("/usuarios/:id_usuario", controller.deleteUsuario.bind(controller));

app.get("/estado", controller.getVersionApi.bind(controller));

app.listen(port, () =>{
    console.log(`Servidor de MVC en javascript en http://localhost:${port}`);
    console.log(controller);
})