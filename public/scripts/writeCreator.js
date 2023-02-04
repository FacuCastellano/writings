//cada vez que se ejecute el index.html cuando haga click en enviar.. voy a guardar el usuario y la contraseña que el usuario intenta validar el en sessionStore.
//estos seran validados para cada pagina que el usuario quiera visitar. 

console.log('ejecutando el script prueba writeCreator.js')

// //const{ username, pass }  = sessionStorage   -_-> esta forma de desustructuracion no me anda. 
const username = sessionStorage.getItem("username")
const password = sessionStorage.getItem("password")

const varAuthorName = document.getElementById("authorName")

if(username !== null){
    varAuthorName.textContent = username
}else{
    varAuthorName.textContent = "not Register"
    alert("It's not user register!\nYou will be redirected to the login")
    location.href = "./index.html"
}

//voy a crear la funcion que envie la info al servidor. 

const submitButton = document.getElementById('submit-button')

submitButton.addEventListener("click",()=>{
    //primero extraigo la info que se va a subir. 

    const title = document.getElementById('title')
    const bodytext = document.getElementById('bodytext')
    const RBprivate = document.getElementById('btn-private')
    const RBpublic = document.getElementById('btn-public')
    let RBselected
    console.log("condcion: ",RBprivate.checked )
    //aca veo que valor del radio button esta seleccionado.
    if(RBprivate.checked){
        RBselected = "1" //1 significa privado
    }else{
        RBselected = "0" //0 significa publico.
    } 
    //segundo seteo el json para enviarlo.
    body = {
        "username":username,
        "password": password,
        "title" : title.value,
        "texto" : bodytext.value,
        "public_state": RBselected
    }
    
    const url = 'http://localhost:3000/writeCreator'
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res =>{
        console.log(res.status)
    })
    .catch(e => console.log(e))   
    

})







// const pass = sessionStorage.pass 
// const userLoginData = { username : username, pass: pass } 

// const url = 'http://localhost:3000/get-user-name'

// fetch(url,{
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//       },
//     body: JSON.stringify(userLoginData)
// })
// .then((response) => response.json())  //esta linea es muy importante pq  sino me devuelve la respuesta en formato response, que tiene mil cosas.. asi lo paso a solamente lo que esta dentro del "res.write()"
// .then((userData) => {
//     const authorName = document.getElementById('authorName')
//     authorName.textContent = userData.username
// })
// .catch(e => console.log(e))

// const submitButton = document.getElementById("submit-button")
 
// submitButton.addEventListener("click",()=>{
//     console.log("estoy vigente pa!")
// })





