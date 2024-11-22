const cells = document.querySelectorAll('.pad');
const level = document.querySelector(".level");
let turn = "bot";
let gameactive = false;
let suite =[];
let speed = 1500;
let lvl = 1;
let actualplace = -1;
let compt =0;

const HighScore = document.querySelector(".HS");
localHS= Number(localStorage.Highscore);
HighScore.innerText = "HIGH SCORE : "+ localHS;
function checkHS() {
    if(lvl>localHS) {
        openpopup();
        localStorage.Highscore = lvl;
        HighScore.innerText = "HIGH SCORE : "+ lvl;
    }
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));

async function botClick(place,spd) {
    cells[place].classList.add("padclicked");
    await delay(spd);
    cells[place].classList.remove("padclicked");
    console.log(place);
}

async function botMove() {
    let place = Math.floor(Math.random()*9);
    suite.push(place);
    speed= speed <= 100 ? speed : speed-100;
    await botClick(place,speed);
}

async function botSequence() {
    await delay(1000)
    level.innerText = "Level "+lvl+" ~ Wait please..."
    for (let i = 0; i < suite.length; i++) {
        botClick(suite[i],speed);
        await delay(speed*2);
    }
    await botMove();
    turn="player";
    level.innerText = "Level "+lvl+" ~ Your turn !"
}

async function animation(){
    level.innerText = "Get Ready !"
    cells.forEach((cell)=> cell.classList.add("padclicked"));
    await delay(1000);
    cells.forEach((cell,i)=> {
        if(i%2) cell.classList.remove("padclicked");
    });
    await delay(500);
    cells.forEach((cell,i)=>{
         if(i%2) cell.classList.add("padclicked")
        else cell.classList.remove("padclicked");
    });
    await delay(500);
    cells.forEach((cell)=>cell.classList.add("padclicked"));
    await delay(500);
    cells.forEach((cell)=>cell.classList.remove("padclicked"));
    await delay(500);
}

async function begin(){
    if(!gameactive) {
        gameactive=true;
        await animation();
        botSequence();
        actualplace=0;
    }
} 
 
function checkClick(event) {
    if(!gameactive || !turn==="player") return;
    console.log("test")
    let cell = event.target;
    let i = parseInt(cell.getAttribute('data-index'));

    compt++;

    // console.log(i+" actualplace : "+ suite[actualplace]+" compt : "+compt+" suite : ");
    // console.log(suite);
    if(i===suite[actualplace] && compt<suite.length) {
        actualplace++;

    } else if(i===suite[actualplace] && compt===suite.length) {
        actualplace=0;
        compt=0; 
        lvl++;
        turn="bot";
        botSequence();
    } else {
        gameactive=false;
        level.innerText = "Level "+lvl+" ~ Game Over !";
        cell.classList.add("red");
        cells[suite[actualplace]].classList.add("green");
        checkHS();
    }
}

async function reset() {
    lvl = 1;
    level.innerText = "Reset...";
    gameactive=false;
    suite=[];
    compt=0;
    speed = 1500;
    cells.forEach((cell)=> {
        cell.classList.remove("red");
        cell.classList.remove("green");
    });
    cells.forEach((cell)=> cell.classList.add("padclicked"));
    await delay(500);
    cells.forEach((cell)=> cell.classList.remove("padclicked"));
    await delay(500);
    level.innerText = "Press Enter";
}

level.addEventListener("click",begin)
document.addEventListener("keydown",(event)=>{
    if(event.key==="Enter") begin();
});
document.addEventListener("keydown",(event)=>{
    if(event.key==="R"||event.key==="r") reset();
});
cells.forEach((cell) => cell.addEventListener("click",checkClick));


// popup
let popup = document.querySelector(".highscorebox");
let cross= document.getElementById("closep");
cross.addEventListener("click",()=> popup.style.display="none")
const openpopup = ()=> popup.style.display="flex";

 