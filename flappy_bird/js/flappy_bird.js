let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();

bird.src = "png/flappy_bird_bird.png";
bg.src = "png/flappy_bird_bg.png";
fg.src = "png/flappy_bird_fg.png";
pipeNorth.src = "png/flappy_bird_pipeUp.png";
pipeSouth.src = "png/flappy_bird_pipeBottom.png";

let gap = 120;
let constant;

let bX = 20;
let bY = 200;

let gravity = 1.5;

let score = 0;

let fly = new Audio();
let scor = new Audio();

fly.src = "music/fly.mp3";
scor.src = "music/score.mp3";

document.addEventListener("click",moveUp);

function moveUp(){
    bY -= 25;
    fly.play();
}

let pipe = [];

pipe[0] = {
    x : cvs.width,
    y : 0
};

function draw(){

    ctx.drawImage(bg,0,0);


    for(let i = 0; i < pipe.length; i++){

        constant = pipeNorth.height+gap;
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);

        pipe[i].x--;

        if( pipe[i].x === 100 ){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
            });
        }

        if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  cvs.height - fg.height){
            location.reload();
        }

        if(pipe[i].x === 5){
            score++;
            scor.play();
        }


    }

    ctx.drawImage(fg,0,cvs.height - fg.height);

    ctx.drawImage(bird,bX,bY);

    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Рахунок : "+score,10,cvs.height-20);

    requestAnimationFrame(draw);

}

draw();