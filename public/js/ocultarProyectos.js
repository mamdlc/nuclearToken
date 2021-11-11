function myFunction (){
    var panel = document.getElementById("PanelDeProyectos");
    if (panel.style.display === "none"){
        panel.style.display = "block";
    } 
    else {
        panel.style.display = "none";
    }
    window.dispatchEvent(new Event('resize'));

}

myFunction();

