//var title = document.querySelector("h1");
//title.innerHTML = "This is the title from code.js";

var button = document.querySelector("button");

button.addEventListener("click", myfunction);

function myfunction() {
    alert("BOOOOOOMMMMMMMMM!!!");
}

var mynode = document.createElement("div");
//change basic attributes
mynode.id = "work1_intro"
mynode.innerHTML = "The work is an exhibition";
mynode.style.color = "blue";
//add event listener
mynode.addEventListener("click", welcomeToWork1);
document.querySelector("#my_work1").appendChild(mynode);
function welcomeToWork1() {
    mynode.innerHTML = "Welcome to my first work!";
}
