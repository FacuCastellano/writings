const userName = sessionStorage.getItem('username')
console.log(userName)
if(userName !== null){   //no entiendo pq hay q setearlo como null en lugar de undefined.
    document.getElementById('varUserName').textContent = userName
}else {
    document.getElementById('varUserName').textContent = "Not Register"
}




// fetch(url,{
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(loginData)
// })
// .then(response => response.text())
// .then(html => {
//     console.log("antes... ")
//     console.log(html)
//     console.log("despues... ")
//     const array = html.split("\n")
//     const arrayAdaptado = array.slice(2,array.length-1).join('\n')
//     document.getElementsByTagName("html")[0].innerHTML = arrayAdaptado 
//     console.log(arrayAdaptado)

// })
// .catch(error => {
//     console.error('Error al recuperar el contenido HTML', error);
// })