import { usersJSON } from "./routes.js";

const buttonMobile = document.querySelector('#display-button');
const menuOpcions = document.querySelector('.navbar__complete-list');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');
const cardsQuestions = document.querySelectorAll('.preguntas-frecuentes__card');
const linkOpciones = document.querySelectorAll('.navbar__link');
const buttonContactNavbar = document.querySelector('.navbar__button');
const testimoniosContent = document.querySelector('div.testimonios__content');
const apiRandomUser = "https://randomuser.me/api/";

let stepCarrusel = 1;
let stop;
let start;

window.addEventListener('load', ()=>{
    generateTestimonios();
})
buttonMobile.addEventListener("click", showOpcions);
window.addEventListener("resize", restarOpcion);
window.addEventListener("scroll", scroolChangeColors)
cardsQuestions.forEach(question => {
    question.addEventListener("click", (e)=>{
        const isHideCard = question.classList.contains('preguntas-frecuentes__card--show-answer');
        const isIconTarget = e.target.classList.contains('preguntas-frecuentes__expand-icon');
        if(!isHideCard) hideAllQuestions();
        if(isIconTarget) question.classList.toggle('preguntas-frecuentes__card--show-answer');
    });
});
linkOpciones.forEach(link => {link.addEventListener('click', hideDisplayOpcions)})
buttonContactNavbar.addEventListener('click', hideDisplayOpcions);
testimoniosContent.addEventListener('mouseover',()=>{
    stop();
});
testimoniosContent.addEventListener('mouseout',()=>{
    start();
});

function showOpcions(){
    menuOpcions.classList.toggle('navbar__complete-list--show_list');
    if(menuOpcions.classList.contains('navbar__complete-list--show_list')){
        navbar.classList.add('navbar--dark-background');
    } 
    if(!(
        menuOpcions.classList.contains('navbar__complete-list--show_list')) 
        && document.documentElement.scrollTop < header.clientHeight){
        navbar.classList.remove('navbar--dark-background');
    }
}
function restarOpcion(){
    menuOpcions.classList.remove('navbar__complete-list--show_list');
}
function scroolChangeColors(){
    if(document.documentElement.scrollTop + 126 > header.clientHeight) {
        navbar.classList.add('navbar--dark-background');
    } else {
        navbar.classList.remove('navbar--dark-background');
    }
}
function hideAllQuestions(){
    cardsQuestions.forEach(question => {
        question.classList.remove('preguntas-frecuentes__card--show-answer');
    });
}
function hideDisplayOpcions(){
    menuOpcions.classList.remove('navbar__complete-list--show_list');
}
function carruselAutomatic(){
    let maxScrollLeft = testimoniosContent.scrollWidth - testimoniosContent.clientWidth;
    let interval = null;
    start = () =>{
        interval = setInterval(()=>{
            testimoniosContent.scrollLeft = testimoniosContent.scrollLeft + stepCarrusel;
            if(testimoniosContent.scrollLeft === maxScrollLeft) stepCarrusel = stepCarrusel * -1;
            if(testimoniosContent.scrollLeft === 0) stepCarrusel = stepCarrusel * -1;
            console.log(stepCarrusel, testimoniosContent.scrollLeft, maxScrollLeft);
        }, 15);
    }
    stop = () =>{
        clearInterval(interval);
    };
    start();
}
function builtTestimonio(srcImg, commentUser, nameUser, occupationUser){
    const testimonio = document.createElement('article');
    testimonio.className = 'testimonios__card';
    testimonio.innerHTML = `
        <img class="testimonios__person-photo" src="${srcImg}" alt="Foto ilustrativa de un beneficiario">
        <h6 class="testimonios__comment">"${commentUser}"</h6>
        <p class="testimonios__person">
            <span>${nameUser}</span>
            <span>${occupationUser}</span>
        </p>
    `
    return testimonio;
}
async function getDataRandomUser(cantidad) {
    const response = await fetch(`${apiRandomUser}?results=${cantidad}&nat=us`);
    const data = await response.json();
    return data.results;
}
async function generateTestimonios(){
    const amountTest = usersJSON.comentarios.length;
    const usersRandom = await getDataRandomUser(amountTest);
    const listTest = [];
    await usersRandom.forEach((user, index) => {
        const srcImg = user.picture.medium;
        const commentUser = usersJSON.comentarios[index];
        const nameUser = `${user.name.first} ${user.name.last}`;
        const occupationUser = usersJSON.oficios[index];
        const testimonio = builtTestimonio(srcImg, commentUser, nameUser, occupationUser);
        listTest.push(testimonio);
    })
    testimoniosContent.append(...listTest);
    await carruselAutomatic();
}