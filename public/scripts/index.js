//cada vez que se ejecute el index.html cuando haga click en enviar.. voy a guardar el usuario y la contraseña que el usuario intenta validar el en sessionStore.
//estos seran validados para cada pagina que el usuario quiera visitar. 
console.log('ejecutando el script prueba dentro del index.html')
const submitButton = document.getElementById('btn-submit')
submitButton.addEventListener('click',() => {
    console.log('almacenando datos en sessionStorage')
    const user = document.getElementById('userName').value 
    const password = document.getElementById('password').value
    sessionStorage.setItem('username',user)
    sessionStorage.setItem('pass',password)
})