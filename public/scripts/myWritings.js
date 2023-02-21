console.log("hola desde mywritings.")
const username = sessionStorage.getItem("username")
const password = sessionStorage.getItem("password")
const inputBuscador = document.getElementById("input-buscador")
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
let currentPage //

//hago la peticion de los titulos de los escirtos que quiero mostrar.
function getCount(){
    
    return    fetch("http://localhost:3000/myWritings/count",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"username":username,"password": password,"word":inputBuscador.value})
        })
        .then(res => res.json())
        .then((data) => data[0]["count(*)"]) 
        .then((totalWritings)=>{
            totalPages = Math.floor(totalWritings/12)
            console.log("las paginas son: ",totalPages)
            if((totalWritings%12) > 0){
                totalPages++
            }
        })
        .catch(e => console.log(e))
}




// fetch("http://localhost:3000/myWritings/count",{
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({"username":username,"password": password})
// })
// .then(res => res.json())
// .then((data) => data[0]["count(*)"]) 
// .then((totalWritings)=>{
//     totalPages = Math.floor(totalWritings/12)
//     console.log("las paginas son: ",totalPages)
//     if((totalWritings%12) > 0){
//         totalPages++
//     }
// })
// .catch(e => console.log(e))

//defino la funcion para solicitar los titulos.
function getPage(page){
    const url = 'http://localhost:3000/myWritings/tittles'
    
        return  fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"username":username,"password": password,"currentPage":page,"word":inputBuscador.value})
                })
                .then(res => res.json())
                .catch(e => console.log(e))
}

function renderTitles(page){
    //primero seteo alos div de la pagina
    writingsContainer.innerHTML = ""
    getCount()
    .then(
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
                    sessionStorage.setItem("myWritingsCurrentPage",currentPage)
                    location.href = "./writing.html"
                    })
            })
            toggleArrow()
            })
        .catch(e => console.log(e))
    )
    .catch(e =>console.log)
}

// automaticamente renderizo una pagina.
//si vengo del boton back de un writing renderizo la pagina que me llevo a ese escrito.. sino la primera... 
if(sessionStorage.getItem("myWritingsCurrentPage")){
    currentPage = parseInt(sessionStorage.getItem("myWritingsCurrentPage"))
    sessionStorage.setItem("myWritingsCurrentPage",1)
}else {
    currentPage = 1
}
renderTitles(currentPage)

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

function toggleArrow(){
    console.log("currentPage: ",currentPage)
    console.log("totalPages: ",totalPages)
    if(currentPage === 1){
        leftButton.classList.add("inactive")
    }else{
        leftButton.classList.remove("inactive")
    }
    if(currentPage === totalPages){
        rightButton.classList.add("inactive")
    }else{
        rightButton.classList.remove("inactive")
    }
}

leftButton.addEventListener('click',()=>{
    if(currentPage > 1){
        currentPage--
        renderTitles(currentPage)
    }
})

inputBuscador.addEventListener("input",()=> {
    // escuchar el evento input en lugar de keydown. El evento input se dispara cada vez que se modifica el valor de un elemento input y refleja el valor actualizado del elemento. De esta forma, si cambias     renderTitles(1)//para que siempre empiece renderizando la primera pagina del filtro. 
    renderTitles(1)//para que siempre empiece renderizando la primera pagina del filtro. 
    console.log(inputBuscador.value)
})


