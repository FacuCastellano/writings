console.log("hola desde mywritings.")
const username = sessionStorage.getItem("username")
const password = sessionStorage.getItem("password")
const writingsContainer = document.getElementById("writings-container")
//creo la funcionalidad del boton de back.

const backButton = document.getElementById('back-button')
backButton.addEventListener("click",()=>{
    location.href = "./userMain.html"
})
//
//sessionStorage.setItem("totalPagesWritings",0)
//

let myWritings = []
let totalWritings //
let totalPages  = 1
//parseInt(sessionStorage.getItem("totalPagesWritings"))
let currentPage = 1 //siempre muestro primero la pagina 0 

//hago la peticion de los titulos de los escirtos que quiero mostrar.
const url0 = "http://localhost:3000/myWritings/count"

fetch(url0,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"username":username,"password": password})
})
.then(res => res.json())
.then((data) => data[0]["count(*)"]) 
.then((totalWritings)=>{
    totalPages = Math.floor(totalWritings/12)
    console.log("las paginas son: ",totalPages)
    if((totalWritings%12) > 0){
        totalPages++
    }

    //sessionStorage.setItem("totalPagesWritings",totalPages)
})
.catch(e => console.log(e))

//defino la funcion para solicitar los titulos.
function getPage(page){
    const url = 'http://localhost:3000/myWritings/tittles'
    
        return  fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"username":username,"password": password,"currentPage":page})
                })
                .then(res => res.json())
                .catch(e => console.log(e))
}

function renderTitles(page){
    //primero seteo alos div de la pagina
    writingsContainer.innerHTML = ""
    getPage(page)
    .then(res =>{console.log(res)
        myWritings = []
        for (let p in res) {
            myWritings.push([res[p].title,res[p].id])
            }
        //pinto los titulos.
        myWritings.forEach(writing => {
            const title = writing[0]
            const id = writing[1]
            const div = document.createElement('div')
            div.className="writing"
            div.textContent = title
            div.id = id
            writingsContainer.appendChild(div)
            div.addEventListener('click',()=>{
                sessionStorage.setItem("currentTextID", id) //guardo el id del texto, en el sessionStorage para poder rescatarlo desde el "writing.html"
                location.href = "./writing.html"
                })
            })
        })
    .catch(e => console.log(e))
}

// automaticamente renderizo la pagina 1.. que va a  mostrar los ultimos 12 escritos del usuario.
renderTitles(1)

//
const leftButton = document.getElementById("leftButton")
const rightButton = document.getElementById("rightButton")

rightButton.addEventListener('click',()=>{
    if(currentPage >= totalPages){
        console.log("ultima pagina no deshabilitar el boton y nada mas")
    }else{
        currentPage++
        renderTitles(currentPage)
    }
})

leftButton.addEventListener('click',()=>{
    if(currentPage <= 1){
        console.log("ultima pagina no deshabilitar el boton y nada mas")
    }else{
        currentPage--
        renderTitles(currentPage)
    }
})




