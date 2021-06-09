//declaro los paquetes que voy a utilizar
const express = require('express');
const mysql = require('mysql');
const util = require('util');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const unless = require('express-unless');

//declaro la variable app para utilizar el express.
var app = express();

//declaro el puerto que voy a utilizar para la conexion
const port = 3000;

//uso de los datos atraves de URL
app.use(express.urlencoded({ extended: true }));
app.use(express.static("peliculas"));

//mapeo de petición a JSON 
app.use(express.json());

//AUTETICACIÓN
//1) REGISTRO
app.post('/registro', async(req, res) => {
    try {
        //Valido recibir todos los datos
        if (!req.body.user || req.body.user == '' || !req.body.pass || req.body.pass == '') {
            res.status(413).send({ mensaje: 'Verifique los datos ingresados' });
            return;
        }

        const user = req.body.user;

        //Verifico si existe el User
        const userExist = "SELECT * FROM registro WHERE usuario = ? ";
        const userQuery = await qy(userExist, [req.body.user]);

        if (userQuery.length > 0) {
            res.status(413).send('El usuario ya existe, por favor modifiquelo.');
            return;
        };


        const crypted = await bcrypt.hash(req.body.pass, 10);
        console.log(crypted);


        const query = "INSERT INTO registro(usuario, pass) VALUE ( ?, ? )";
        const answer = await qy(query, [user, crypted]);
        res.status(200).send(answer);


    } catch (e) {
        console.log('Error Inesperado');
    }
});



//2) LOGIN
app.post('/login', async(req, res) => {
    try {
        if (!req.body.user || req.body.user == '' || !req.body.pass || req.body.pass == '') {
            res.status(413).send('Los datos son obligatorios');
            return;
        }

        //busco el usuario en base de datos
        const userSearch = 'SELECT * FROM registro WHERE usuario = ?';
        const querySearch = await qy(userSearch, [req.body.user]);

        //verifico que no exista
        if (querySearch.length <= 0) {
            res.status(413).send('El usuario no existe.');
            return;
        }

        //comparar las claves
        const claveUser = req.body.pass;

        //extraigo clave desde la DB
        const passSearch = 'SELECT pass FROM registro WHERE usuario = ?';
        const claveSearch = await qy(passSearch, [req.body.user]);

        claveDB = claveSearch[0].pass;

        const volver = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">            <title>Formulario de registro</title></head><body>        <header><h1>Random Movies</h1><h3>Ingreso Exitoso.</h3></header><button><a href="index.html">Volver al registro</a></button></body><script src="app.js"></script></html>';

        //comparo las claves
        if (claveDB == claveUser) {
            console.log('Coincide?');
            res.status(413).send(volver);
        } else {
            console.log('La clave no coincide.');
        };

        /*
        if (!bcrypt.compareSync(req.body.pass, crypted)) {
            res.status(413).send('La contraseña no coincide.')
        }*/

        //iniciar sesion
        /*      const tokenInfo = {
            user: 'jorge',
            pass: 'clave'
        };

        const token = jwt.sign(tokenInfo, 'secret', {
            expiresIn: 60 * 60 * 24 //1dia
        });
        res.send(token)
*/







    } catch (e) {
        console.log('Error Inesperado');
    }






});
















//VERIFICACION






















//DESARROLLO DE LAS CONSULTAS

//busqueda de todas las peliculas: GET + localhost:3000/peliculas
app.get('/peliculas', async(req, res) => {
    try {

        const query = 'SELECT * FROM peliculas'; //declaro la consulta
        const answer = await qy(query); //capturo la consulta

        //valido que haya peliculas en base de datos.
        if (answer.length <= 0) {
            const volver = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">            <title>Formulario de registro</title></head><body>        <header><h1>Random Movies</h1><h3>No hay peliculas por mostrar</h3></header><button><a href="index.html">Volver al registro</a></button></body><script src="app.js"></script></html>';
            res.status(413).send(volver);
            return;
        }

        //resultado en el browser
        res.send({ 'Impresión por HTML: ': answer });
    } catch (e) {
        console.log(e.message);
        res.status(413).send('Error inesperado');
    }
});


//ingreso de peliculas: POST + localhost:3000/peliculas + json {id, titulo, genero}
app.post('/peliculas', async(req, res) => {
    try {

        const volver = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">            <title>Formulario de registro</title></head><body>        <header><h1>Random Movies</h1><h3>Faltan cargar datos</h3></header><button><a href="index.html">Volver al registro</a></button></body><script src="app.js"></script></html>';

        //valido recibir los datos para crear un registro.
        if (req.body.titulo == '' || req.body.genero == '') {
            res.status(413).send(volver);
            return;
        }

        const titulo = req.body.titulo;
        const genero = req.body.genero;

        //Ingreso la pelicula
        const query = 'INSERT INTO peliculas ( titulo, genero) VALUE ( ?, ?)';

        const answer = await qy(query, [titulo, genero]);

        const exito = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">            <title>Formulario de registro</title></head><body>        <header><h1>Random Movies</h1><h3>La sugerencia se realizo con exito. Pelicula: ' + titulo + '</h3></header><button><a href="index.html">Volver al registro</a></button></body><script src="app.js"></script></html>';
        // usarlo mas tarde para imprimir confirmación de carga.

        res.send(exito);

    } catch (e) {
        console.log(e.message);
        res.status(413).send('Error inesperado');
    }
});

//eliminado de un registro mediante el titulo. DELETE + localhost:3000/pelicula/titulo 

app.delete('/peliculas/:id', async(req, res) => {
    try {

        //valido recibir los datos para crear un registro.
        if (req.body.id == '') {
            res.status(413).send(volver);
            return;
        }

        //valido si existe la pelicula
        const queryExiste = 'SELECT * FROM peliculas WHERE id = ?';
        const respuestExiste = await qy(queryExiste, [req.params.id]);

        if (respuestExiste.length <= 0) {
            res.status(413).send({
                mensaje: 'No existe ese libro'
            });
            return;
        }

        const query = 'DELETE  FROM peliculas WHERE id = ?';
        const answer = await qy(query, req.params.id);

        console.log(answer);
        res.status(413).send('Se ha borrado la pelicula.');

    } catch (e) {
        console.log(e.message);
        res.status(413).send('Error inesperado');
    }

});

//Modificar el genero segun el ID : put + localhost:3000/peliculas/id => json {"genero" : "generoNew"}
app.put('/peliculas/:id', async(req, res) => {

    try {

        //valido si existe la pelicula
        const queryExiste = 'SELECT * FROM peliculas WHERE id = ?';
        const respuestExiste = await qy(queryExiste, [req.params.id]);

        if (respuestExiste.length <= 0) {
            res.status(413).send({
                mensaje: 'No existe esa pelicula'
            });
            return;
        }

        const id = req.params.id;
        const generoNew = req.body.genero;

        let query = 'UPDATE peliculas SET genero = ? WHERE id = ?';

        const answer = await qy(query, [generoNew, id]);

        console.log(answer);
        res.status(413).send('Se ha actualizado el ID: ' + id);

    } catch (e) {
        console.log(e.message);
        res.status(413).send('Error inesperado');
    }
});



//creo la conexion a la base de datos.
const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'randommovies',
});
//manejo el posible error en la conexcion.
conn.connect((error) => {
    if (error) throw error;
    console.log('La Conexión a la base de datos se realizó con exito.');
});


//permitir el uso se async await para uso ordenado al generar las query
//transforma las query en promise para usar async await y manejar el asincronismo

const qy = util.promisify(conn.query).bind(conn);




// mostrar el puerto de conexion y escucha de la app.
app.listen(process.env.PORT || port, () => {
    console.log("Servidor iniciado en puerto: " + port);
});

module.exports = router;