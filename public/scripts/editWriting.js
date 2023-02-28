const backBtn = document.getElementById('back-button')
const saveChangesBtn = document.getElementById('saveChanges-button')
const inputTitle = document.getElementById('title')
const inputBodyText = document.getElementById('bodytext')
const varAuthor = document.getElementById('authorName')


//rescato el todo los datos del texto igual que en writing.js. (todos los datos que necesito siguen en el sessionStorage)
const username = sessionStorage.getItem("username")
const password = sessionStorage.getItem("password")
const id = sessionStorage.getItem("currentTextID")
//const textTitle = document.getElementById('text-title')
//const textBody = document.getElementById('text-body')




//hago la peticion al servidor para cargar el titulo y texto actual.. 
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
    const textObject = data //a este objeto NO puedo ACCEDER desde la consola pq esta definido en este scope.
    inputTitle.value = textObject.title
    inputBodyText.value = textObject.texto
    varAuthor.textContent = textObject.author
    if(textObject.public_state ){
        //si el valor de public_state = 1 (true), pongo el chec en el boton publico, si es 0, lo pongo en el boton privado.
        
        document.getElementById('btn-public').checked = true
    }else{
    
        document.getElementById('btn-private').checked = true
    }
})
.catch(e => console.log(e))




//le doy funcionalidad al boton back
backBtn.addEventListener('click',()=>{
    location.href = "./writing.html"
})

//le doy funcionalidad al boton saveChanges
saveChangesBtn.addEventListener('click',()=>{
    //reemplazo las comillas dobles por dos comillas simples para que no hya interferencia.
    const newTitle = inputTitle.value.replaceAll('"', "''")
    const newBodyText = inputBodyText.value.replaceAll('"', "''")
    let newPublicState
    if(document.getElementById('btn-public').checked){
        newPublicState = 1
    }else if(document.getElementById('btn-private').checked){
        newPublicState = 0
    }

    fetch('http://localhost:3000/editWriting',{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username":username,"password": password, "id":id,"title":newTitle,"texto":newBodyText,"public_state":newPublicState})
    })
    .then((res) => {

        if(res.status === 200) {
            alert('Congratulations!\n\n Your writing was saved carrectly!\nFeel you free to edit all times you need!')
            location.href = "./writing.html"
        } else {
            alert('Error!\n\n You are not authorized to modify this writing.!\n ')
            location.href = "./writing.html"
        }
        
        
    })
    .catch(e => console.log(e))


})