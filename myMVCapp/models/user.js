const fs = require("fs");
const userInfo = JSON.parse(fs.readFileSync('./login.json'));

exports.getUsers = () => {
    return userInfo;
}
//Checks if credentials passed to it match what is in the .json file
exports.verifyCredentials = (username, password) => {

    var check = false;

    for(var i = 0; i < userInfo.length; i++){
        if(userInfo[i].username == username && userInfo[i].password == password){
            console.log("username and password correct, going to dashboard");
            check = true;
            break;
        }
    }
    return check;
}