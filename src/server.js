//importo modulos de terceros.
const http = require('http')
const express = require('express')
const path = require('path')
const crypto = require('crypto')


//importo modulos propios
const { createNewUser, connection, loginUserValidation, createWriting} = require('./js/DBcontrollers/utilsDB')
const { toJSObject} = require('./js/serverFunctions.js')

console.log(path.join(__dirname,'public/views'))

//conexion a la base de datos.
//aca creo la conexion si la creo en el servidor.. cuando se quiere intentar conectar 2 veces tira error
//lo mismo pasa si la creo en la funcion "createNewUser"
connection.connect(err => {
    if(err){
        console.log('error en la conexion desde el servidor')
        console.log(err)
    }else {
        console.log('conectado a la BD')
    }
})

//creo el servidor 
const app = express()

//voy a "servir" todos los archivos estaticos de la carpeta public.
//una vez servidos puedo acceder a estos. 
app.use(express.static('./public'))
app.use(express.json()) // ---> este middleware lo tengo que poner para poder leer los JSON que envia el cliente.. sino me va dar los json como undefined.
//app.use(bodyParser.json())


//settings
app.set('view engine','ejs') //primero seteo el motor de plantillas (view engine)
app.set('views',path.join(__dirname,'../public/views/ejsViews')) //segundo seteo la carpetas de las views. (los res.render() tienen q estar en esta carpeta.)

//RUTAS
//rutas GET

app.get('/', (req, res) => {
    console.log('redirigiendo a public/views/index.html')
    res.redirect('views/index.html')
})






//rutas POST
// registro de nuevo usuario
app.post('/register', (req,res)=>{
    console.log("entro")
    let body= ''
    req.on('data', chunk =>{body += chunk})
    req.on('end', ()=>{
        console.log("entro2")
        body = toJSObject(body) //esta es una funcion propia que esta en el modulo serverFunctions.js
        // esta funcion necesita que exista una conexion a la BD y devuelvuelve 'failure'(si el usuario ya existe) o 'success' (si el usuario es creado con existo)         
        createNewUser(body)
            .then(answerCode  =>{
                console.log('answerCode: ',answerCode)
                if(answerCode === 'failure'){
                    res.redirect('views/userExistent.html')
                } else if (answerCode === 'success'){
                    res.redirect('./views/newUserCreated.html')
                }
            }) 
    })
})

// logeo de usuario existente.
app.post('/login', (req,res)=>{ 
    console.log(req.body)
    loginUserValidation(req.body)
            .then(answerCode  =>{
                //segun el caso retorno un msj distinto.. segun el msj el navegador hara una cosa u otra.
                if(answerCode === 404){
                    res.status(404)
                    res.end()
                } else if (answerCode === 401){
                    res.status(401)
                    res.end()
                } else if (Array.isArray(answerCode)){
                    res.status(200)
                    res.end()
                }
    }) 

})
// subiendo un nuevo writing.
app.post('/writeCreator', (req, res) => {

    console.log(req.body)
    const {username,password} = req.body
    console.log(username,password)
    loginUserValidation({username,password})
            .then(answerCode  =>{
                console.log(answerCode)
                //segun el caso retorno un msj distinto.. segun el msj el navegador hara una cosa u otra.
                if(answerCode === 404){
                    //desde el front lo tengo que redirigir.
                    res.status(404)
                    res.end()
                } else if (answerCode === 401){
                    //desde el front lo tengo que redirigir.
                    res.status(401)
                    res.send()
                } else if (Array.isArray(answerCode)){
                    console.log("entre al else if")
                    //creo el nuevo writing y despues lo redirijo desde el front.
                    const {title,texto,public_state} = req.body
                    const id = crypto.randomUUID() //genera un id unico .. hay muchas librerias que hacen esto pero esta ya viene con JS.
                    data = {id,username,title,texto,public_state,id}
                    createWriting(data)
                        .then(resultado =>console.log(resultado))
                        .then(()=> res.end())
                        .catch(e => console.log(e))
                }
    })   
})



//este post, va a validar la session del usuario y va a devolver la data del mismo para usarla en los distintos script de la parte del cliente. 


//similar al anterior pero solo devuelvo el nombre del usuario, no devuelvo todos los datos.



app.listen(3000)
