
    var a = 1;
function show_hide(){
    if(a==0){
        document.getElementById("no_body").style.display="inline";
        document.getElementById("can").style.display="none";
        document.getElementById("myinput").style.display="none";
        document.getElementById("U").style.display="none";
        document.getElementById("grey1").style.display="none";
        
        document.getElementById("B").style.display="none";
        document.getElementById("M").style.display="none";
        document.getElementById("RightBar").style.display = "inline";
        document.getElementsByTagName("h1")[0].style.display="inline";
        document.getElementsByTagName("h3")[0].style.display="inline";
        return a=1;
    }
    else{
        document.getElementById("no_body").style.display="none";
        document.getElementById("can").style.display="inline";
        document.getElementById("myinput").style.display='inline';
        document.getElementById("U").style.display='inline';
        document.getElementById("grey1").style.display='inline';
        
        document.getElementById("B").style.display="inline";
        document.getElementById("M").style.display='inline';
        document.getElementsByTagName("h1")[0].style.display="none";
        document.getElementsByTagName("h3")[0].style.display="none";
        document.getElementById("RightBar").style.display = "none";
        return a=0;
    }
}
var b = 1;
function changeColor(){
    if(b==1){
        document.getElementById("Sidebar").style.background = '#001d06';
        document.getElementById("Z").style.background="#ffffff";
        // document.getElementById("Z").style.color="#00d106";
        document.body.style.background='#001d06';
        var h1Elements = document.getElementsByTagName("h1");
        for(var i = 0; i < h1Elements.length; i++) {
             h1Elements[i].style.color = "#fff";
        }
        var h3Elements = document.getElementsByTagName("h3");
        for(var i = 0; i < h3Elements.length; i++) {
             h3Elements[i].style.color = "#fff";
        }
        document.getElementById("can").style.background = "#ffffff";
        return b = 0;
    }
    else{
        document.getElementById("Sidebar").style.background = '#ffffff';
        document.getElementById("Z").style.background="#001d06";
        document.body.style.background = '#ffffff';
        var h1Elements = document.getElementsByTagName("h1");
        for(var i = 0; i < h1Elements.length; i++) {
             h1Elements[i].style.color = "#000";
        }
        var h3Elements = document.getElementsByTagName("h3");
        for(var i = 0; i < h3Elements.length; i++) {
             h3Elements[i].style.color = "#000";
        }
        document.getElementById("can").style.background = "#ffffff";
        return b=1;
    }
}
// var b = 0;
// function showorHidecalc(){
//     if(b==1){
//         document.getElementById("calculator").style.display = "inline";
//         document.getElementById("can").style.display="none";
//     }
//     else{
//         document.getElementById("can").style.display="inline";
//         document.getElementById("calculator").style.display="none";
//     }
    
// }

const canvas = document.getElementById("can");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth - 150;
canvas.height = window.innerHeight;
window.addEventListener('resize', function(event) {
    canvas.width = window.innerWidth - 150;
canvas.height = window.innerHeight;
console.log(canvas.width,canvas.height);
}, true);
var draw_color="black";
let draw_width = "50";
let is_drawing = false;
// let is_writing = false;
var start_background_color;
canvas.addEventListener("touchstart",start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove",draw,false);
canvas.addEventListener("touchend",stop,false);
canvas.addEventListener("mouseup",stop,false);
canvas.addEventListener("mouseout",stop,false);
// canvas.addEventListener("mousemove",draw,false);
function start(event){
    is_drawing = true;
    is_writing = false;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}
function draw(event){
    if (is_drawing){
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
        
    }
    // else if(is_writing){
    //     context.font = draw_color;
    //     var t = prompt('Enter the text to be inputed');
    //     ctx.fillText(t,context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop));
    // }
    event.preventDefault();
}
let restore_array = [];
let index = -1;
function stop(event){
    if(is_drawing){
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    event.preventDefault();
    if(event.type!='mouseout'){
        restore_array.push(context.getImageData(0,0,canvas.width,canvas.height));
        index++;

    }
    // console.log(restore_array);
    
}
function change_color(element){
    console.log(element.style.background);
    draw_color=element.style.background;
}
document.getElementById("pink").addEventListener('click',function () {
   //console.log("pink");
    draw_color="#f172b2"; 
});
document.getElementById("purple").addEventListener('click',function () {
    // console.log("");
     draw_color="#9400D3"; 
 });
 document.getElementById("green").addEventListener('click',function () {
    // console.log("pink");
     draw_color="#5cf05c"; 
 });
 document.getElementById("cyan").addEventListener('click',function () {
    // console.log("pink");
     draw_color="#6495ED"; 
 });
 document.getElementById("line1").addEventListener('click',function () {
    // console.log("pink");
     draw_color="#ffffff"; 
 });
 document.getElementById("hemi1").addEventListener('click',function () {
    // console.log("pink");
     draw_color="#ffffff"; 
 });
 document.getElementById("hemi2").addEventListener('click',function () {
    // console.log("pink");
     draw_color="#ffffff"; 
 });
 document.getElementById("hemi3").addEventListener('click',function () {
    // console.log("pink");
     draw_color="#ffffff"; 
 });
 document.getElementById("hemi4").addEventListener('click',function () {
    // console.log("pink");
     draw_color="#ffffff"; 
 });
 
function clear_screen(){
        start_background_color = '#ffffff';
        context.fillStyle = start_background_color;
        context.clearRect(0,0,canvas.width,canvas.height);
        context.fillRect(0,0,canvas.width,canvas.height);
        restore_array = [];
        index = -1;
}
var m = 0;
var t = draw_color;
function erase(){
    if(draw_color=='#ffffff'){
        draw_color = t; 
    }
    else{
        draw_color = '#ffffff';
    }
}
function undo_screen(){
    if(index<=0){
        clear_screen();
    }
    else{
        index--;
        restore_array.pop();
        context.putImageData(restore_array[index],0,0);
    }
}


