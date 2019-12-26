function init() {
    var menu = document.getElementsByClassName("content-nav");
    Array.prototype.forEach.call(menu, element => element.addEventListener('click', () => changeContent(element.id)));
}

function changeContent(id) {
    var containers = document.getElementsByClassName("content-container");
    Array.prototype.forEach.call(containers, element => element.style.display = "none");

    switch(id) {
        case "algorithmNav":
            document.getElementById("algorithmContainer").style.display = "block";
            break;
        case "gameNav":
            document.getElementById("gameContainer").style.display = "block";
            break;
        default:
            document.getElementById("homePageContainer").style.display = "block";
            break;
    }
}