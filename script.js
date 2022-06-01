const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
let count = document.getElementById('count');
let total = document.getElementById('total');
let seatArea = document.getElementById('seatarea');
const sectionSelect = document.getElementById('section');
const bookSeats = document.getElementById('bookseats');
const formContainer = document.querySelector('.form-container');
const form = document.getElementById('form');
const fullName = document.getElementById('fullname');
const email = document.getElementById('email');
const cardNumber = document.getElementById('cardnumber');
const postCode = document.getElementById('postcode');
const finalisePurchase = document.getElementById('finalisepurchase');
const purchaseDetails = document.querySelector('.purchase-details');
const video = document.getElementById('video');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
const progress = document.getElementById('progress');
const timestamp = document.getElementById('timestamp');
const volumebar = document.getElementById('volumebar');



populateUI();

let ticketPrice = Number(sectionSelect.value);

function toggleVideoStatus(){
  if(video.paused) {
    video.play()
  } else {
    video.pause()
  }
}

function updatePlayIcon(){
  if (video.paused){
    play.innerHTML = `<span class="fa-play">PLAY</span>`
  } else {
      play.innerHTML = `<span class="fa-pause">PAUSE</span>`
  }
}

function updateProgress(){
  
  // console.log(video.currentTime);
  // console.log(video.duration);
  progress.value = (video.currentTime / video.duration) * 100;

  //get minutes
  let mins = Math.floor(video.currentTime / 60);
  if(mins < 10){
    mins = '0'+ String(mins)
  }

  let secs = Math.floor(video.currentTime % 60);
  if (secs < 10){
    secs = '0' + String(secs)
  }

  timestamp.innerHTML = `${mins}:${secs}`
}

function setVideoProgress(){
  //giving me increments
  video.currentTime = Number(progress.value * video.duration) / 100;
}

function stopVideo(){
  // return true;
  video.currentTime = 0;
  video.pause();
}

function volumeChange(){
  video.volume = volumebar.value;
  // console.log(video.volume);

}

//Event listeners for video
video.addEventListener('click', toggleVideoStatus)
play.addEventListener('click', toggleVideoStatus);
video.addEventListener('pause', updatePlayIcon);
video.addEventListener('play', updatePlayIcon);
video.addEventListener('timeupdate', updateProgress)
progress.addEventListener('change', setVideoProgress);
stop.addEventListener('click', stopVideo);
volumebar.addEventListener('change', volumeChange)


//Save seat index and price
function setSeatData(seatIndex, seatPrice){
  localStorage.setItem('seatIndex', seatIndex);
  localStorage.setItem('seatPrice', seatPrice);
}

//updateSelectedCount
function updateSelectedCount(){
  //when you click a seat, it takes that seat and changes the text content of the text at the bottom
  
  //Put all selected seats into nodelist/array
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  // console.log(selectedSeats);
  
  // console.log(sectionName[0]);
  
  const seatsInStorage = [...selectedSeats].map(function(seat){
    return [...seats].indexOf(seat)
  })
  
  localStorage.setItem('seatsInStorage', JSON.stringify(seatsInStorage));

  const selectedSeatsCount = selectedSeats.length;
  count.textContent = selectedSeatsCount;
  total.textContent = selectedSeatsCount * ticketPrice;
  let sectionName = sectionSelect.options[sectionSelect.selectedIndex].text.split(' ');
  seatArea.textContent = sectionName[0];
}

//get data from lcoal storage and populate UI
function populateUI(){
  
  const selectedSeats = JSON.parse(localStorage.getItem('seatsInStorage'));

  if(selectedSeats !== null && selectedSeats.length > 0){
    seats.forEach(function(seat, index){
      if (selectedSeats.indexOf(index) > -1){
        seat.classList.add('selected')
      }
    })      
  }
  
  const selectedSeatIndex = 
  localStorage.getItem('seatIndex');

  if (selectedSeatIndex !== null) {
    sectionSelect.selectedIndex = selectedSeatIndex;
  }
  // console.log(selectedSeats);
  // updateSelectedCount();
};

//Movie select event
sectionSelect.addEventListener('change', function(e){
  // console.log('seat changed');
  // console.log(e.target.selectedIndex, e.target.value);

  ticketPrice = Number(e.target.value);
  setSeatData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
})

//Seat click selection
container.addEventListener('click', function(e){
  // console.log(e.target);
  if(e.target.classList.contains('seat') && !e.target.classList.contains('occupied')){
    e.target.classList.toggle('selected');

    updateSelectedCount();
  }
})

function showSuccess(input){
  const formControl = input.parentElement;
  formControl.className = 'form-control success'
}

function showError(input, errorMsg) {
  const formControl = input.parentElement;
  formControl.className = 'form-control error';
  const small = formControl.querySelector('small');
  small.textContent = errorMsg;
}



bookSeats.addEventListener('click', function(e){
  e.preventDefault();
  
  //need to make sure there is actually a seat!
  //if statement to make sure there is actually a seat clicked otherwise it won't let you go through
  
  const selectedSeats = JSON.parse(localStorage.getItem('seatsInStorage'));

  // console.log(selectedSeats);

  if(selectedSeats.length === 0){
    console.log('You must book a seat!');
  } else {
  formContainer.style.visibility = 'visible';
  }


  //function to check cardNumber
  function checkCardNumber(input){
    let regExp = /^\d+$/;
    let hasNumbers = regExp.test(input);
    return hasNumbers;
    ///////////
  }

  //function to check Email
  function checkEmail(email){
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  

  //Submit event for adding user details and submitting
  form.addEventListener('submit', function(e){
    e.preventDefault();
  
  
    //validation
       //Fullname
       const nameArr = fullName.value.split(' ');
     
       if (fullName.value !== ''){
         //add success class to 
         showSuccess(fullName);
       } 
       if (nameArr.length > 1){
         showSuccess(fullName);
       }
       else if (fullName.value === ''){
         showError(fullName, 'Enter a name');
       }
       else if (nameArr.length === 1 || nameArr.length < 1) {
         showError(fullName, 'Must enter full name')
       }
       
       // Email
       if (email.value !== '' && checkEmail(email.value)){
         //add success class to 
         showSuccess(email)
       } 
       else if (email.value === ''){
         showError(email, 'Enter email address');
       } 
       else if (checkEmail(email.value) === false){
         showError(email, 'Must be a valid email address')
       }
   
       // Cardnumber
       const cardNumVal = cardNumber.value;
       
       if (cardNumber.value !== '' && cardNumber.value.length === 16 && checkCardNumber(cardNumVal)){
         //add success class to 
         showSuccess(cardNumber)
       } 
       else if (cardNumber.value.length !== 16){
         showError(cardNumber, 'Card number must be 16 digits')
       }
       
       else if (cardNumber.value === ''){
         showError(cardNumber, 'Enter card number');
       }
   
       else if (checkCardNumber(cardNumVal) === false) {
         showError(cardNumber, 'Must only contain numbers')
       }
   
       //Postcode
   
       if (postCode.value !== '' && postCode.value.length <= 6){
         showSuccess(postCode)
       } 
       else if (postCode.value === ''){
         showError(postCode, 'Enter postcode');
       }
       else if (postCode.value.length > 6){
         showError(postCode, 'Postcode must be 6 or less characters')
       }
   //validation

  
  //convert nodelist to array with ...spread
   const formInputs = [...document.querySelectorAll('.forminputs')];

   //declare variable for .every method expression
   const trueOrNot = formInputs.every(allInputsTrue);
   
   //declare the condition for the every method
   function allInputsTrue(input){
     return input.parentElement.classList.contains('success');
   }

   if (trueOrNot){

      purchaseDetails.style.visibility = 'visible';
      formContainer.style.display = 'none';
           
   
      function randomNum(){
        let num = (Math.random() * 90000) + 10000;
        return Math.floor(num)
        }
   
      const selectedSeats = document.querySelectorAll('.row .seat.selected');
      let sectionName = sectionSelect.options[sectionSelect.selectedIndex].text.split(' ');
   
      const selectedSeatsCount = selectedSeats.length;
      total = selectedSeatsCount * ticketPrice;
         
     
     purchaseDetails.innerHTML = `<p class="text">Order number: <span>${randomNum()}</span><br><br> 
      You have booked <span>${selectedSeats.length}</span> tickets in <span>${sectionName[0]}</span> section for a total of <span>£${total}</span>.<br><br> Tickets will be delivered to <span>${fullName.value}</span>.<br><br> Confirmation of this order has been sent to <span>${email.value}</span></p>.`
   } else {
     console.log('one or more false');
   }

    //end of booking event listener
  })

})

// Initial count and total on pageload
updateSelectedCount();