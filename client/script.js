import bot from './assets/baby.svg';
import user from './assets/user.svg';

const form =document.querySelector('form');
const chatContainer= document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  element.textContent = '';

  loadInterval = setInterval(()=>{
    element.textContent += '.';

    if(element.textContent === '...'){
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(()=>{
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
    
  }, 20)
  
}

function generateUniqueID(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueID){
  return(
    `
    <div class="wrapper ${isAi && 'ai'}">
    <div class="chat">
    <div class="profile">
    <img 
      src="${isAi ? bot : user}"
      alt="${isAi ? 'bot' : 'user'}"
    />
    </div>
    <div class="message" id=${uniqueID}>${value}</div>
    </div>
    </div>
    `
  )
}


const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  
  // User's chatstripe from form
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot's chatstripe from chatbot
  const uniqueID = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueID);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueID);

  loader(messageDiv);

  const response = await fetch('https://chat-server.app.niteshsonali.co.in',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  } )

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();
    
    typeText(messageDiv, parsedData);
  }else{
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
    
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e)=>{
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})