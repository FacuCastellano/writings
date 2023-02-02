console.log('ejecuta el script de la conexion')

const mysql = require('mysql2')

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'blogadmin',
    password : 'pass1234',
    database : 'blog_db'
})



//creo la funcion para crear un nuevo usuario en la base de datos.

//asi son los datos que obteno del formulario post pasarlos por la funcion ToJSON . 
// const data = {
//     user_name: 'Facuntano',
//     real_name: 'Facundo',
//     real_surname: 'Caastellno',
//     email: 'castellanofacundo@gmail.com',
//     pass1: 'facu1234',
//     pass2: 'facu1234'
//   }

// funcion para crear un nuevo usuario.

function createNewUser(data){
    
    const {user_name:username, real_name:name, real_surname: lastname, pass1 : pass, email} = data
    const query = `select * from users where username='${username}';`
    return  new Promise((resolve,reject) => {
        // connection.conect() lo hago desde el script que creo el servidor. cuando llamo esta funcion la coneccion ya debe estar hecha.
        connection.query(query,(_,res)=>{
            resolve(res) //una vez resuleta la promesa con exito envio lo que esta dendtro del resolve.. es como un tipo return pero para promesas.
        })
    })
    .then(res => {
        if(res.length){
            console.log('usuario existente') //aca deberia buscarle una mejor solucion pero bueno.
            return 'failure'
        }else {
            return new Promise((resolve,reject)=>{
                    const query = `INSERT INTO users VALUES ('${username}','${lastname}','${name}','${email}','${pass}') `
                    connection.query(query,(_,res)=>{
                        resolve() //aunque no haga no devuelva nada tengo que poner el resolve(), pq sino la promesa nunca se termina de completar. es decir esta esperando el resolve() para terminarse.
                    })
                })
                .then(()=>{
                console.log('usuario creado con exito')
                return 'success'
            })
            .catch(err => console.log(err))
        }
    })
    .catch(err => console.log(err))
}


// funcion de validacion del usuario. 

function loginUserValidation2(data){
    const {username, pass} = data
    query = `select * from users where username='${username}';`
    //esta funcion retorna una promesa, a esta la concateno a otras promesas.. y en definitiva termina retornando el ultimo return concatenado a esta cadena de promesas.. 
    //igualmente despues para usarla tengo que usar then() catch() para capturar la promesa una vez resuelta.
    return new Promise((resolve,reject) => {
        connection.query(query,(_,res)=>{
            resolve(res) //una vez resuleta la promesa con exito envio lo que esta dendtro del resolve.. es como un tipo return pero para promesas.
        })
    })
    .then((res)=>{
            if(res.length === 0){
                // si entra aca es pq el usuario no existe.
                return(false) //este valor se pasa como param al otro then.().. 
            }else {
                //si entra aca es pq el usuario si existe.
                return([true, JSON.parse(JSON.stringify(res))[0]])  // la respuesta es un tipo raro de objeto ' RowDataPacket {con la info aca}', para hacerlo un objeto de JS tengo que hacerlo primerpo un string con stringify y despues lo parseo a objeto... y en segunda instancia tengo que sacarlo como el primer elmento de un array de un elemento.
            }  
    }).then(param => {
            //console.log(param)
            if(param === false){
                //el usuario no existe.
                return 404
            }else {
                const userData = param[1]
                if(userData.pass === pass){
                    //usuario y contraseña verificados.
                    return [200, userData]
                }else{
                    //el usuario exisite pero la contraseña es incorrecta.
                    return 401
                }
            }
        })
}

// funcion de validacion del usuario. 

function loginUserValidation(data){
    const {user_name:username, pass} = data
    query = `select * from users where username='${username}';`
    //esta funcion retorna una promesa, a esta la concateno a otras promesas.. y en definitiva termina retornando el ultimo return concatenado a esta cadena de promesas.. 
    //igualmente despues para usarla tengo que usar then() catch() para capturar la promesa una vez resuelta.
    return new Promise((resolve,reject) => {
        connection.query(query,(_,res)=>{
            resolve(res) //una vez resuleta la promesa con exito envio lo que esta dendtro del resolve.. es como un tipo return pero para promesas.
        })
    })
    .then((res)=>{
            if(res.length === 0){
                // si entra aca es pq el usuario no existe.
                return(false) //este valor se pasa como param al otro then.().. 
            }else {
                //si entra aca es pq el usuario si existe.
                return([true, JSON.parse(JSON.stringify(res))[0]])  // la respuesta es un tipo raro de objeto ' RowDataPacket {con la info aca}', para hacerlo un objeto de JS tengo que hacerlo primerpo un string con stringify y despues lo parseo a objeto... y en segunda instancia tengo que sacarlo como el primer elmento de un array de un elemento.
            }  
    }).then(param => {
            //console.log(param)
            if(param === false){
                //el usuario no existe.
                return 404
            }else {
                const userData = param[1]
                if(userData.pass === pass){
                    //usuario y contraseña verificados.
                    return [200, userData]
                }else{
                    //el usuario exisite pero la contraseña es incorrecta.
                    return 401
                }
            }
        })
}



//funcion para crear un nuevo escrito.
function createWriting(data){
    const id =  3
    const text_number = 1
    const title = 'el titulo de mi escrito'
    const texto = 'bla bla bla bla'
    const author = 'facu'
    const public_state = 0
    const stage_name = 'facuntano'
    const query =  `INSERT INTO writings VALUES ('${id}','${text_number}','${title}','${texto}','${author }',${public_state},'${stage_name}',now());`
    
    return new Promise((resolve,reject) => {
        connection.query(query,(_,res)=>{
            resolve(res) //una vez resuleta la promesa con exito envio lo que esta dendtro del resolve.. es como un tipo return pero para promesas.
        })
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
}
//createWriting()
// INSERT INTO writings VALUES ('3','1','mi primer escrito','bla bla bla bla','florpicco',1,'facuntano',now());



module.exports = {
     connection,
     createNewUser,
     loginUserValidation,
     loginUserValidation2,
     createWriting
 }
