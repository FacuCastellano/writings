const backBtn =document.getElementById('back-button')
const userName = sessionStorage.getItem('username')
if(userName !== null){   //no entiendo pq hay q setearlo como null en lugar de undefined.
    document.getElementById('varUserName').textContent = userName
}else {
    document.getElementById('varUserName').textContent = "Not Register"
}

backBtn = addEventListener('click',()=>{
    location.href = './index.html'
})
