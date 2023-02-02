//importo modulos de terceros.
const http = require('http')
const express = require('express')
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')



//importo modulos propios
const { createNewUser, connection, loginUserValidation, loginUserValidation2} = require('./js/DBcontrollers/utilsDB')
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
app.use(bodyParser.urlencoded({ extended: true }))


//settings
app.set('view engine','ejs') //primero seteo el motor de plantillas (view engine)
app.set('views',path.join(__dirname,'../public/views/ejsViews')) //segundo seteo la carpetas de las views. (los res.render() tienen q estar en esta carpeta.)

//RUTAS
//rutas GET

app.get('/', (req, res) => {
    console.log('redirigiendo a public/views/index.html')
    res.redirect('views/index.html')
})


app.get('/writeCreator', (req, res) => {
    //aca tiene q ir el login del usuario usando el username y la pass guardada en el sessionStore.
    res.render('writeCreator.ejs')
   // res.send('<h2>entro pero no se que mandar</h2>')
  
})

app.post('/userData',(req,res)=> {
    console.log(req.body)
    const name = req.body.name
    const password = req.body.password
    res.cookie('userValidation',[name, password])
    res.sendStatus(200)
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
    let body = ''
    req.on('data', chunk =>{body += chunk})
    req.on('end', ()=>{
        body = toJSObject(body) //esta es una funcion propia que esta en el modulo serverFunctions.js
        // esta funcion necesita que exista una conexion a la BD y devuelvuelve 'failure'(si el usuario ya existe) o 'success' (si el usuario es creado con existo)         
        loginUserValidation(body)
            .then(answerCode  =>{
                console.log('answerCode: ',answerCode)
                if(answerCode === 404){
                    res.redirect('views/login404.html')
                } else if (answerCode === 401){
                    res.redirect('views/login401.html')
                } else if (Array.isArray(answerCode)){
                    const userData = answerCode[1]
                    res.render('userMain.ejs',{userData}) //por mas que userData sea un objeto, tengo que ponerlo entre corchetes pq sino EJS tira un error.
                }
            }) 
    })
})

//este post, va a validar la session del usuario y va a devolver la data del mismo para usarla en los distintos script de la parte del cliente. 
app.post('/get-use-all-info', (req, res) => {
    //para que esto funcione es clave el middleware --> app.use(express.json())
    const {username, pass} = req.body
    const userLoginData = {username, pass}

    loginUserValidation2(userLoginData).then(res => {
        return res
    })
    .then(userData => {
        if(userData === 404 ){
            res.write("User Not Found")
            res.status(404)

        } else if (userData === 401) {
            res.write("password Not Valid")
            res.status(401)

        } else {
            res.status(200)
            res.write((JSON.stringify(userData[1]))) //envioo un string del JSON {"username": "pepito"}
        }
    }).then(()=> res.end())
    .catch(e => console.log(e))  
});

//similar al anterior pero solo devuelvo el nombre del usuario, no devuelvo todos los datos.
app.post('/get-user-name', (req, res) => {
    //para que esto funcione es clave el middleware --> app.use(express.json())
    const {username, pass} = req.body
    const userLoginData = {username, pass}

    loginUserValidation2(userLoginData).then(res => {
        return res
    })
    .then(userData => {
        if(userData === 404 ){
            res.write("User Not Found")
            res.status(404)

        } else if (userData === 401) {
            res.write("password Not Valid")
            res.status(401)

        } else {
            const user = JSON.parse(JSON.stringify(userData[1])).username //recupero el nombre del usuario.
            console.log(user)
            res.write(JSON.stringify({username:user})) //envioo un string del JSON {"username": "pepito"}
        }
    }).then(()=> res.end())
    .catch(e => console.log(e))  
});

app.post('/send-writing', (req, res) => {
    console.log('entro a la ruta send-writing')
    
    console.log(res.body)
    
    
});


app.listen(3000)
