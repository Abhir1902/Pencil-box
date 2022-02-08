
/*let sign = class{
    constructor(a,b){
        this.a=a;
        this.b=b;
        server.push(this);
    }
}
var a;
function check(){
    var count = 0;
    let username = document.getElementById("use").value;
    let password = document.getElementById("pass").value;
    if(username=="Admin" && password=="user"){
        console.log("Hii");
        alert("Hii "+username);
        count = 0;
        window.location.href="leaf.html";
    }
    else{
        if(count<3){
            alert("Login failed!!!");
            count++;
        }
        else{
            alert("Login limit exceeded. Signup into the user account");
            count++;
            window.location.href="signup.html";
        }
    }
}*/
/*const auth = firebase.auth();
function check(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('pass').value;
    const promise = auth.signInWithEmailAndPassword(email,password);
    promise.catch(e=>alert(e.msg));
    window.location.href = 'D:\web developement\leaf.html'
}
var datab = firebase.database.ref('loginpage');
function signup(){
    var eemail = document.getElementById('Eemail').value;
    var password = document.getElementById('password').value;
    firebase.auth().createUserWithEmailAndPassword(eemail,password).then(function(){
        
    }).catch(function(error){
        var errorcode = error.code;
        var errormsg = error.message;
    })
    window.location.href = 'loginpage';
}*/