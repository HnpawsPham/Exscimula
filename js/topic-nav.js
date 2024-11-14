let url = [
    "../topics/chemistry/menu.html",
    "../topics/physics/menu.html",
    "../topics/biology/menu.html",
]

const cards = document.querySelectorAll(".container");

function navPage(i){
    location.href = url[i];
}

for(let i = 0; i < cards.length; i++)
    cards[i].addEventListener("click", function(){navPage(i)})
