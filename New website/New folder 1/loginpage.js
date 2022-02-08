let server = [];
let signup = class{
    constructor(a,b){
        this.a=a;
        this.b=b;
        server.push(this);
    }
}
var a;
function check(){
    let username = document.getElementById("use").value;
    let password = document.getElementById("pass").value;
    if(username == "Admin" && password == "user"){
        alert("login successful!!");
        window.location.href = "leaf.html"; 
    }
    else{
        alert("login failed!!!");
        window.location.href = "login.html";
    }
}