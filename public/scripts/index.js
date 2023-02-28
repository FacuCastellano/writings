//cada vez que se ejecute el index.html cuando haga click en enviar.. voy a guardar el usuario y la contraseña que el usuario intenta validar el en sessionStore.

//estos seran validados para cada pagina que el usuario quiera visitar. 
const submitButton = document.getElementById('btn-submit')


submitButton.addEventListener('click',() => {
    console.log('almacenando datos en sessionStorage')
    //extraigo los datos que puso el usuario.
    const username = document.getElementById('userName').value 
    const password = document.getElementById('password').value
    
    //guardo los datos en sessionStorage para usarlos en proximas verificaciones
    sessionStorage.setItem('username',username)
    sessionStorage.setItem('password',password)

    //hago la peticion del usuario y contraseña-
    const loginData = {"username":username, "password":password}

    const url = 'http://localhost:3000/login'

    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then((res) => {
        const code = res.statusText
        if(code === "Not Found"){
            location.href = "./login404.html"
        } else if (code ==="Unauthorized") {
            location.href = "./login401.html"
        }else if (code ==="OK"){
            location.href = "./userMain.html"
        } 
    })
    .catch(error => {
        console.error('Error al recuperar el valor de CODE', error);
    })
    
}) 