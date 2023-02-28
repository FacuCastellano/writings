
const username1 = document.getElementById("register-username-1")
const username2 = document.getElementById("register-username-2")
const firstName = document.getElementById("register-real-name")
const lasttName = document.getElementById("register-real-surname")
const email = document.getElementById("register-email")
const password1 = document.getElementById("password-1")
const password2 = document.getElementById("password-2")
const submitBtn = document.getElementById("btn-submit")
const colorNeutral = "default"
const colorGood = "green"
const colorWrong = "red"
const warning1 = document.getElementById("warning-1")
const warning2 = document.getElementById("warning-2")
const warning3 = document.getElementById("warning-3")
const warning4 = document.getElementById("warning-4")
const warning5 = document.getElementById("warning-5")
const warning6 = document.getElementById("warning-6")
let flag1
let flag2
let flag3
let flag4
let flag5
let flag6 

//creo las funciones que voy a usar.

//funcion para corroborar que 2 string son iguales
function stringEquality(str1,str2){
    if (str1 === str2){
        return true
    }else {
        return false
    }
}

//funcion para corroborar si el nombre de usuario esta disponible.
function userNameAvailable(username){
    //si esta funcion devuelve 200 es pq el usuario no exisite y lo podemos crear, si devuelve 401 es pq el usuario ya existe y por ende no lo podemos crear.
    return  fetch("http://localhost:3000/verifyuserexistence",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"username":username})
        })
        .then(res => {
            return res.status
        })
        .catch(e => console.log(e))
}


//funcion para verificar que solo se hayan escrito letras y espacios.
function verifyLetters(name){
    const regex = /^[A-Za-z ñÑ]+$/ // solo letras o espacio en blanco.
    
    if(regex.test(name)){
        return true
    } else{
        return false
    }
}

//funcion para verificar un mail.
function verifyEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // cualquier cosa menos espacios y arroba.. una arroba cualquier cosa menos espacios y arroba, un punto.. cualquier cosa menos espacios y arroba.
    
    if (regex.test(email)) {
      return true
    } else {
      return false
    }
}
//checkeo que se todos los datos sean correctos para ver si puedo enviar el form o no.
function checkInfo(){
    if((flag1 === true) && (flag2 === true) && (flag3 === true) && (flag4 === true) && (flag5 === true) && (flag6 === true)){
        submitBtn.classList.remove("disabled")
    } else {
        submitBtn.classList.add("disabled")
    }
}

// limpio todos los campos.
username1.value = ""
username2.value = ""
firstName.value = ""
lasttName.value = ""
email.value = ""
password1.value = ""
password2.value = ""


// ahora voy a hacer las verificaciones. 
//verifico que el usuario este disponible. 
username1.addEventListener('input',()=>{
    username1.value = username1.value.trim()
    username2.value = ""
    username2.style = `color: ${colorNeutral}`
    const name = username1.value.toLowerCase()
    if(name !== ""){
        userNameAvailable(name)
        .then(res =>{
            if(res === 200){
                username1.style =  `color: ${colorGood}` 
                warning1.hidden = true
                flag1 = true
                
            } else if(res === 401){
                username1.style =  `color: ${colorWrong}`
                warning1.hidden = false
                flag1 = false
            }
        })
        
    }else{
        username1.style = `color: ${colorNeutral}`
        warning1.hidden = true
    }
    
})
//verifico que los 2 campos de username se hayan completado con el mismo sting
username2.addEventListener('input',()=>{
    username2.value =username2.value.trim()
    const name1 = username1.value.toLowerCase()
    const name2 = username2.value.toLowerCase()

    if(name2 !== ""){
        if(stringEquality(name1,name2)){
            username2.style =  `color: ${colorGood}` 
            warning2.hidden = true
            flag2 = true
        }else{
            username2.style =  `color: ${colorWrong}`
            warning2.hidden = false
            flag2 = false
        }

    }else{
        username2.style = `color: ${colorNeutral}`
        warning2.hidden = true
    }
    checkInfo()
})


firstName.addEventListener('input',()=>
    setTimeout(()=>{
        let name = firstName.value
        const lastIndex = name.length -1
        if (name[lastIndex] === " " || name[0] === " "){
            name = firstName.value.trim()
            firstName.value = name
        }

        firstName.value = name
        if(name !== ""){
            if(verifyLetters(name)){
                firstName.style =  `color: ${colorGood}`
                warning3.hidden = true
                flag3 = true
            }else{
                firstName.style =  `color: ${colorWrong}`
                warning3.hidden = false
                flag3 = false
            }
        }else{
            firstName.style = `color: ${colorNeutral}`
            warning3.hidden = true
        }
        checkInfo()
    },1500)
)


//verifico que lastname sea un nombre valido.
lasttName.addEventListener('input',()=>{
    setTimeout(()=>{
        let lastname2 = lasttName.value
        const lastIndex = lastname2.length -1
        if (lastname2[lastIndex] === " "  || lastname2[0] === " " ){
            lastname2 = lasttName.value.trim()
            lasttName.value = lastname2
        }

        if(lastname2 !== ""){
            if(verifyLetters(lastname2)){
                lasttName.style =  `color: ${colorGood}`
                warning4.hidden = true
                flag4 = true
            }else{
                lasttName.style =  `color: ${colorWrong}`
                warning4.hidden = false
                flag4 = false
            }
        }else{
            lasttName.style = `color: ${colorNeutral}`
            warning4.hidden = true
        }
        checkInfo()
    },1500)}
)


//verifico que el email sea valido
email.addEventListener('input',()=>{
    const mail2 = email.value.trim()
    email.value = mail2
    if(mail2 !== ""){
        if(verifyEmail(mail2)){
            email.style =  `color: ${colorGood}`
            warning5.hidden = true
            flag5 = true
        }else{
            email.style =  `color: ${colorWrong}`
            warning5.hidden = false
            flag5 = false
        }
    }else{
        email.style = `color: ${colorNeutral}`
        warning5.hidden = true
    }
    checkInfo()
})

//cuando modifico algo del password1 borro todo el password2
password1.addEventListener('input',()=>{
    password2.value = ""
    password2.style = `color: ${colorNeutral}`
})
//verifico que los dos campos password se hayan completado con el mismo string.
password2.addEventListener('input',()=>{
    const pass1 = password1.value
    const pass2 = password2.value
    if(pass2 !== ""){
        if(stringEquality(pass1,pass2)){
            password2.style =  `color: ${colorGood}`
            warning6.hidden = true
            flag6 = true
        }else{
            password2.style =  `color: ${colorWrong}`
            warning6.hidden = false
            flag6 = false
        }
    }else{
        password2.style = `color: ${colorNeutral}`
        warning6.hidden = true
    }
    checkInfo()
})



//envio el formulario solo si todas las flag son true.
submitBtn.addEventListener('click',()=> {
    if((flag1 === true) && (flag2 === true) && (flag3 === true) && (flag4 === true) && (flag5 === true) && (flag6 === true)){
        console.log("el formulario se envia")
        fetch('http://localhost:3000/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"username":username1.value,"firstname":firstName.value,"lastname":lasttName.value,"password":password1.value,"email": email.value})
            })
            .then(()=> {
                console.log("usuario creado")
                location.href = "./newUserCreated.html"
            })
            .catch(e => console.log(e))

    } else {
        alert("You must refill the form correctly, before to send your information!")
    }
})

