//importo modulos de terceros.
const http = require('http')
const express = require('express')
const path = require('path')
const crypto = require('crypto')


//importo modulos propios
const { createNewUser, connection, loginUserValidation, createWriting, getTotalWritings,getWritings,getParticularWriting,deleteWriting,editWriting,getTotalPublicWritings,getPublicsWritings,verifyAuthor,verifyUserExistence} = require('./js/DBcontrollers/utilsDB')


//console.log(path.join(__dirname,'public/views'))

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
    res.redirect('views/index.html')
})


app.post('/verifyuserexistence',(req,res)=>{
    const {username} = req.body
    verifyUserExistence(username)
        .then(answer => {
            if(answer){
                res.status(401) //aca el usuario Si existe, por lo que NO podes crearlo.
                res.end()
            }else{
                res.status(200) //aca el usuario No existe, por lo que Si podes crearlo.
                res.end()
            }
        })
})



//rutas POST
// registro de nuevo usuario
app.post('/register', (req,res)=>{
    const {username, firstname, lastname, password, email} = req.body
    createNewUser({username, firstname, lastname, password, email})
        .then(answerCode  =>{
            if(answerCode === 'failure'){
                //nunca va a entrar aca salvo saquen modifiquen ("hackeen") script del front
                res.redirect('views/userExistent.html')
            } else if (answerCode === 'success'){
                res.sendStatus(200)
            }
        })
        .catch(e => {console.log(e)})
})

// logeo de usuario existente.
app.post('/login', (req,res)=>{ 
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

    const {username,password} = req.body

    loginUserValidation({username,password})
            .then(answerCode  =>{
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
                    //creo el nuevo writing y despues lo redirijo desde el front.
                    const {public_state} = req.body
                    let {title, texto} = req.body
                    title = title.replaceAll('"', "''") //reemplazo las comillas dobles por las simples (cada comilla doble la reemplazo por 2 comillas simples)para que no interfiera en la query que se le hace a la BD. y simulen ser dos comillas dobles.
                    texto = texto.replaceAll('"', "''") 
                    const id = crypto.randomUUID() //genera un id unico .. hay muchas librerias que hacen esto pero esta ya viene con JS.
                    data = {id,username,title,texto,public_state,id}
                    createWriting(data)
                        .then(()=> res.end())
                        .catch(e => console.log(e))
                }
    })   
})

//esta ruta me devuelve la cantidad de textos que tiene un usuario para poder darle la logica de los botones ... despues va a haber otra llamada que me permita obtener cada pagina.
app.post('/myWritings/count',(req,res)=>{
    const {username,password,word} = req.body
    loginUserValidation({username,password})
        .then(answerCode  =>{
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
                //devuelvo un objeto solo con el valor del parametro "count(*)" que representa la cantidad de escritos guardados por el usuario en la base de datos. 
                getTotalWritings(username,word)
                .then(resDB =>{
                    res.send(JSON.stringify(resDB))
                })
                .catch(e => {console.log(e)}) 
            }
    })
    .catch(e => {console.log(e)})   
})

//esta ruta me devuelve la cantidad de escritos que hay con caracteristica de publicos. 

app.post('/publicsWritings/count',(req,res)=>{
    const {username,password,word} = req.body
    loginUserValidation({username,password})
        .then(answerCode  =>{
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
                //devuelvo un objeto solo con el valor del parametro "count(*)" que representa la cantidad de escritos guardados por el usuario en la base de datos. 
                getTotalPublicWritings(word)
                .then(resDB =>{
                    res.send(JSON.stringify(resDB))
                })
                .catch(e => {console.log(e)}) 
            }
    })
    .catch(e => {console.log(e)})   
})


//esta ruta me va a devolver los titulos con su id.
app.post('/myWritings/tittles',(req,res)=>{
    const {username,password,currentPage,word} = req.body
    loginUserValidation({username,password})
        .then(answerCode  =>{
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
                //devuelvo un objeto solo con el valor del parametro "count(*)" que representa la cantidad de escritos guardados por el usuario en la base de datos. 
                getWritings(username,currentPage,word)
                .then(resDB =>{
                    res.send(JSON.stringify(resDB))
                })
                .catch(e => {console.log(e)}) 
            }
    })
    .catch(e => {console.log(e)})   
})

//esta ruta me va a devolver los titulos publicos con su id.
app.post('/publicsWritings/titles',(req,res)=>{
    const {username,password,currentPage,word} = req.body
    loginUserValidation({username,password})
        .then(answerCode  =>{
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
                //devuelvo un objeto solo con el valor del parametro "count(*)" que representa la cantidad de escritos guardados por el usuario en la base de datos. 
                getPublicsWritings(currentPage,word)
                .then(resDB =>{
                    res.send(JSON.stringify(resDB))
                })
                .catch(e => {console.log(e)}) 
            }
    })
    .catch(e => {console.log(e)})   
})



//este post me devuelve todos los registros del texto.. despues en el front muestro lo q me interesa.
app.post('/writing',(req,res)=>{
    
    const {username,password,id} = req.body
    loginUserValidation({username,password})
        .then(answerCode  =>{
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
                //const id = sessionStorage.getItem("currentTextID") 
                getParticularWriting(id)
                .then(resDB =>{
                    res.send(JSON.stringify(resDB))
                })
                .catch(e => {console.log(e)}) 
            }
    })
    .catch(e => {console.log(e)})   
})

//este post me verifica si el username es el author. 

app.post('/authorValidation',(req,res)=>{
    const {username,id} = req.body
    verifyAuthor(id,username)
        .then(bool => {
            if(bool === false){
                res.sendStatus(401)
            } else if (bool === true){
                res.sendStatus(200)
            }
        })
        .catch(e => {console.log(e)}) 
})



//este put actualiza el texto.

app.put('/editWriting',(req,res)=>{
    
    // const dataprueba = {
    //     username : "facu"
    //     id : "4217587b-07c8-4e89-aaa5-6c4bd0d8628d",
    //     title : "titulo desde utilsDB",
    //     texto: "texto desde utilsDB",
    //     public_state: 1
    // }
    const {username,password,id,title,texto,public_state} = req.body
    loginUserValidation({username,password})
        .then(answerCode  =>{
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
                //const id = sessionStorage.getItem("currentTextID") 
                //aca voy a poner la verificacion que el usuario logueado sea el autor del escrito. si es asi lo puede modificar si no no.
                verifyAuthor(id,username)
                    .then(bool => {
                        if(bool === false){
                            res.sendStatus(401)
                        } else if (bool === true){
                            editWriting({id,username,title,texto,public_state})
                            .then(()=>{
                            //no estoy considerando la opcion que el ID no exista pq el id lo saco automaticamente, no es que lo ponga el usuario.
                            res.sendStatus(200)
                            })
                            .catch(e => {console.log(e)}) 
                        }
                    })
                    .catch(e => {console.log(e)}) 
            }
    })
    .catch(e => {console.log(e)})   
})


//este post elimina un escrito..
app.delete('/deleteWriting',(req,res)=>{
 
    const {username,password,id} = req.body
    loginUserValidation({username,password})
        .then(answerCode  =>{
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
                verifyAuthor(id,username)
                    .then(bool => {
                        if(bool === false){
                            res.sendStatus(401)
                        } else if (bool === true){
                            deleteWriting(id)
                            .then(()=>{
                            //no estoy considerando la opcion que el ID no exista pq el id lo saco automaticamente, no es que lo ponga el usurio.
                            res.sendStatus(200)
                            })
                            .catch(e => {console.log(e)})  
                        }
                    })
                    .catch(e => {console.log(e)}) 
                //const id = sessionStorage.getItem("currentTextID") 
                
            }
    })
    .catch(e => {console.log(e)})   
})
//deleteWriting()






app.listen(3000)
