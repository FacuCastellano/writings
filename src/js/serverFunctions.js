

//const string =  'real_name=Facundo&real-surname=castellano&email=castellanofacundo%40gmail.com&user-name=castellanofacundo%40gmail.com&pass1=123456&pass2=123456'
function toJSObject(str){
    const JSObject = {}
    const strArray = str.split('&')
    for(const element of strArray){
        const variable = element.split('=')[0].replaceAll('-', '_')
        const value = element.split('=')[1]
        JSObject[variable] = value
    }
    return JSObject
}



module.exports = {
    toJSObject
}
