/* toggle style switcher */
const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
styleSwitcherToggle.addEventListener("click", () => {
    document.querySelector(".style-switcher").classList.toggle("open");
})
// hide style switcher on scroll 
window.addEventListener("scroll", () =>{
    if(document.querySelector(".style-switcher").classList.contains("open"))
    {
        document.querySelector(".style-switcher").classList.remove("open");
    }
})
/* Theme colors */
const alternativeStyle = document.querySelectorAll(".alternate-style");
function setActiveStyle(color)
{
    alternativeStyle.forEach((style) => {
        if(color === style.getAttribute("title"))
        {
            style.removeAttribute("disabled");
        }
        else{
            style.setAttribute("disabled","true")
        }
    })
    
}
/* Theme Light and Dark color — désactivé, thème noir permanent */
