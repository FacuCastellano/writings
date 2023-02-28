
const username = sessionStorage.getItem("username")
const password = sessionStorage.getItem("password")
const id = sessionStorage.getItem("currentTextID")
const textTitle = document.getElementById('text-title')
const textBody = document.getElementById('text-body')
const backBtn = document.getElementById("back-button")
const deleteBtn = document.getElementById("delete-button")
const editBtn = document.getElementById("edit-button")
const author = document.getElementById("author-name")
textTitle.textContent = "Not Data"
textBody.innerText  = "Not Data"




//hago la peticion del texto que tengo que mostarar. y muestro su titulo y su contenido.
const url = "http://localhost:3000/writing"

fetch(url,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"username":username,"password": password, "id":id})
})
.then(res => res.json())
.then((data) =>  data[0])
.then((data)=>{
    const textObject = data
    textTitle.textContent = textObject.title
    textBody.innerText = textObject.texto
    author.innerText = `Author: ${textObject.author}` 
})
.catch(e => console.log(e))

//le doy funcionalidad al boton back

backBtn.addEventListener('click',()=>{
    location.href = sessionStorage.getItem('backLocation')
    
})


//le doy funcionalidad al boton edit
editBtn.addEventListener('click',()=>{
    //tener en cuenta que en sessinStorage ya esta guardado el ID en "currentTextID", con ese mismo ID y el username y el passoword voy a exxtraer los datos.. 
    location.href = "./editWriting.html"
})


//le doy funcionalidad al boton delete.
deleteBtn.addEventListener('click',()=>{
    fetch('http://localhost:3000/deleteWriting',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username":username,"password": password,"id":id})
    })
    .then(res => {
        if(res.status===200){
            alert("Writing deleted succesfully.")
            location.href = "./myWritings.html"
        } else if ((res.status===401)){
            alert('Error!\n\n You are not authorized to delete this writing.!\n ')
            location.href = "./writing.html"
        }
    })
    .catch(e => console.log(e))
})



// verifico si el usuario logueado es el autor del texto, si no es el autor bloqueo los botones de edit y delete.
//si bien estos se pueden activar desde el front, a la hora de enviar las modificaciones o eliminar, se corrobora desde el lado del servidor y salta el error.
fetch("http://localhost:3000/authorValidation",{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"username":username, "id":id})
})
.then(res => {
    if(res.status === 401){
        deleteBtn.disabled = true
        editBtn.disabled = true
    }
})
.catch(e => console.log(e))




