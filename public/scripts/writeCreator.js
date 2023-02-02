//cada vez que se ejecute el index.html cuando haga click en enviar.. voy a guardar el usuario y la contraseña que el usuario intenta validar el en sessionStore.
//estos seran validados para cada pagina que el usuario quiera visitar. 

console.log('ejecutando el script prueba writeCreator.js')

// //const{ username, pass }  = sessionStorage   -_-> esta forma de desustructuracion no me anda. 
const username = sessionStorage.username 
const pass = sessionStorage.pass 
const userLoginData = { username : username, pass: pass } 

const url = 'http://localhost:3000/get-user-name'

fetch(url,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(userLoginData)
})
.then((response) => response.json())  //esta linea es muy importante pq  sino me devuelve la respuesta en formato response, que tiene mil cosas.. asi lo paso a solamente lo que esta dentro del "res.write()"
.then((userData) => {
    const authorName = document.getElementById('authorName')
    authorName.textContent = userData.username
})
.catch(e => console.log(e))

const submitButton = document.getElementById("submit-button")
 
submitButton.addEventListener("click",()=>{
    console.log("estoy vigente pa!")
})





