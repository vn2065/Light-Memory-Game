/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */
// global constants
var clueHoldTime = 1000;
var lives = 3;

const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
//Global Variables
const ARRAY_LENGTH = 8;
var pattern = [];
let timer = null
var count = 20
var reset = false

function generateArray(){
  while(pattern.length > 0){
    pattern.pop();
  }
  for(let i = 0; i<ARRAY_LENGTH; i++){
    pattern.push(parseInt(Math.random() * (7 - 1) + 1));
  }
}

let gameButtonArea = document.getElementById("gameButtonArea");
let gameButtons = gameButtonArea.querySelectorAll('.game-btn');
let livesCounter = document.getElementById("lives-left");
let incorrectText = document.getElementById("incorrect-text");


var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

function startGame(){
  //initialize game variables
  generateArray();
  progress = 0;
  gamePlaying = true;
  lives = 3;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  livesCounter.textContent = lives;
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  reset = true;
}


console.log("Hello, world!");


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 535.6,
  6: 603.6
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  
  if(clueHoldTime>500){
    //clueHoldTime -= 100;
  }
  
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue,delay,pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  
  //clueHoldTime -= 100;
  count = 20;
  reset = false;
  
  clearInterval(timer);
  timer = setInterval(timerFunc, 1000);
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over, You won!")
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  // add game logic here
  if (pattern[guessCounter] == btn){
    if (guessCounter == progress){
      if (progress == pattern.length - 1){
        winGame();
      }
      else{
        progress += 1;
        
        playClueSequence();
      }
    }
    else{
      
      guessCounter += 1;
    }
  }
  else{
    lives -= 1;
    if(lives >= 0) {
      livesCounter.textContent = lives;
    }
    incorrectText.style.display = 'block';
    
    setTimeout(() => {
      incorrectText.style.display = 'none';
    }, 1000);
    
    if(lives < 0){
      loseGame();
    }
  }
}

function timerFunc(){
  document.getElementById("clock").innerHTML = "Timer: " + count + " s";
  count -= 1;
  if (count < 0 || reset){
    if(!reset){
      stopGame();
      alert("Time is up. You Lost");
    }
    resetTimer();
    clearInterval(timer);
  }
}

function resetTimer(){
  count = 20;
  document.getElementById("clock").innerHTML = "Timer: 0 s";
}


// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)