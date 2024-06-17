import { usersJSON, questionChatBox } from "./routes.js";

const buttonMobile = document.querySelector('#display-button');
const menuOpcions = document.querySelector('.navbar__complete-list');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');
const cardsQuestions = document.querySelectorAll('.preguntas-frecuentes__card');
const linkOpciones = document.querySelectorAll('.navbar__link');
const buttonContactNavbar = document.querySelector('.navbar__button');
const testimoniosContent = document.querySelector('div.testimonios__content');
const chatBox = document.querySelector('section.chat-box');
const chatBoxIcon = document.querySelector('img.chat-box__image');
const chatBoxContainer = document.querySelector('div.chat-box__container');
const chatBoxButton = document.querySelector('button.chat-box__button');
const chatBoxComunication = document.querySelector('div.chat-box__comunication');
const inputChatBox = document.querySelector('input#question');
const consultButtonChatBox = document.querySelector('div.chat-box__send-message i');
const apiRandomUser = "https://randomuser.me/api/";

let stepCarrusel = 1;
let stop;
let start;
let isActiveCarrusel = false;
let isOverTest = false;

window.addEventListener('scroll', ()=>{
    if(!isOverTest){
        let posTest = testimoniosContent.getBoundingClientRect();
        if (posTest.top >= 0 && posTest.bottom <= window.innerHeight) {
            if(!isActiveCarrusel) start();
        } else {
            stop();
        }
    }
});
window.addEventListener('load', ()=>{
    generateTestimonios();
    buildMostPopularQuestion();
});
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
    isOverTest = true;
    stop();
});
testimoniosContent.addEventListener('mouseout',()=>{
    isOverTest = false;
    start();
});
chatBoxIcon.addEventListener('click', showChatBoxContainer);
chatBoxButton.addEventListener('click', clearChatBox);
consultButtonChatBox.addEventListener('click',writeQuestionNotAvailable);
inputChatBox.addEventListener("keypress",e=>{
    if (e.key === "Enter") writeQuestionNotAvailable ();
})

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
        stepCarrusel =  1;
        isActiveCarrusel = true;
        interval = setInterval(()=>{
            testimoniosContent.scrollLeft = testimoniosContent.scrollLeft + stepCarrusel;
            if(testimoniosContent.scrollLeft === maxScrollLeft) stepCarrusel = stepCarrusel * -1;
            if(testimoniosContent.scrollLeft === 0) stepCarrusel = stepCarrusel * -1;
            // console.log(stepCarrusel, testimoniosContent.scrollLeft, maxScrollLeft);
            console.log(stepCarrusel)
        }, 15);
    }
    stop = () =>{
        stepCarrusel = 0;
        isActiveCarrusel = false;
        clearInterval(interval);
    };
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
function showChatBoxContainer(){
    chatBoxContainer.classList.toggle('chat-box__container--hidden');
}
function clearChatBox(){
    chatBoxComunication.innerHTML = '';
    buildMostPopularQuestion();
}
function buildQuestion(content, id){
    const div = document.createElement('div');
    div.className = 'chat-box__text-box chat-box__text-box--left';
    div.innerHTML = `
    <div class="chat-box__answer chat-box__answer--blue" data-id="${id}" data-available="1">${content}</div>
    `;
    div.addEventListener('click', ()=>{
        buildAnswerMoreQuestion(div, content);
        GoEndScrollVert();
    });
    return div;
}
function buildAnswer(content){
    const div = document.createElement('div');
    div.className = "chat-box__text-box chat-box__text-box--right";
    div.innerHTML = `
    <div class="chat-box__answer chat-box__answer--text-end">${content}</div>
    `;
    return div;
}
function buildMostPopularQuestion(){
    const listQuestions  =  [];
    questionChatBox.forEach(el =>{
        if(el.popular){
            const createdQuestion = buildQuestion(el.question, el.id);
            listQuestions.push(createdQuestion);
        }
    });
    chatBoxComunication.append(...listQuestions);
}
function buildAnswerMoreQuestion(div, content){
    const listItems = [];
    const insideContent = div.querySelector('div.chat-box__answer');

    const id = parseInt(insideContent.dataset.id, 10);
    const anotherIds = questionChatBox.filter(e => e.id === id)[0].id_related;

    const answer = buildAnswer(content);
    const responseAnswer = buildAnswer(questionChatBox.find(e => e.id === id).answer);

    listItems.push(answer);
    listItems.push(responseAnswer);

    questionChatBox.forEach(el => {
        if(anotherIds.includes(el.id)){
            const createdQuestion = buildQuestion(el.question, el.id);
            listItems.push(createdQuestion);
        }
    });

    chatBoxComunication.append(...listItems);
    //console.log(id, anotherIds);
}
function GoEndScrollVert(){
    chatBoxComunication.scrollTop = chatBoxComunication.scrollHeight;
}
function writeQuestionNotAvailable(){
    if(inputChatBox.value === '') return;
    const question = inputChatBox.value;
    chatBoxComunication.append(buildAnswer(question));
    let message = 'En breves momentos le pasaremos con un experto que pueda atender sus dudas.';
    chatBoxComunication.append(buildAnswer(message));
    GoEndScrollVert();
    inputChatBox.value = '';
}