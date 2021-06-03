let cvs         //  canvas
let ctx         //  context'2d'
let theme1      //  original theme
let theme2      //  original them v2
let bg          //  background
let bird        //  bird: yellow
let bird1       //  bird: red
let bird2       //  bird: blue
let pipes       //  top and bottom pipes
let ground      //  ground floor
let getReady    //  get ready screen
let gameOver    //  game over screen
let map         //  map of number images
let score       //  score counter
let gameState   //  state of game
let frame

cvs = document.getElementById('game')
ctx = cvs.getContext('2d')
theme1 = new Image()
theme1.src = 'png3/theme.png'
theme2 = new Image()
theme2.src = 'png3/theme-2.png'
frame = 0;
gameState = {
    current: 0,
    getReady: 0,
    play: 1,
    gameOver: 2
}

bg = {
    imgX: 0,
    imgY: 0,
    width: 276,
    height: 228,
    x: 0,
    y: cvs.height - 228,
    w: 276,
    h: 228,
    dx: .2,
    render: function() {
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x + this.width,this.y,this.w,this.h)
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x + this.width*2,this.y,this.w,this.h)
    },
    position: function () {
        if (gameState.current == gameState.getReady) {
            this.x = 0
        }
        if (gameState.current == gameState.play) {
            this.x = (this.x-this.dx) % (this.w)
        }
    }
}
pipes = {
    top: {
        imgX: 56,
        imgY: 323,
    },
    bot: {
        imgX: 84,
        imgY:323,
    },
    width: 26,
    height: 160,
    w: 55,
    h: 300,
    gap: 85,
    dx: 2,
    minY: -260,
    maxY: -40,
    pipeGenerator: [],

    reset: function() {
        this.pipeGenerator = []
    },
    render: function() {
        for (let i = 0; i < this.pipeGenerator.length; i++) {
            let pipe = this.pipeGenerator[i]
            let topPipe = pipe.y
            let bottomPipe = pipe.y + this.gap + this.h

            ctx.drawImage(theme2, this.top.imgX, this.top.imgY, this.width, this.height, pipe.x, topPipe, this.w, this.h)
            ctx.drawImage(theme2, this.bot.imgX, this.bot.imgY, this.width, this.height, pipe.x, bottomPipe, this.w, this.h)
        }
    }
        ,
    position: function() {
        if (gameState.current !== gameState.play) {
            return
        }
        if (gameState.current == gameState.play) {
            if (frame%100 == 0) {
             //   console.log(frame)
                this.pipeGenerator.push(
                    {
                        x: cvs.width,
                        y: Math.floor((Math.random() * (this.maxY-this.minY+1)) + this.minY)
                    }
                )
            }

            for (let i = 0; i < this.pipeGenerator.length; i++) {
                let pg = this.pipeGenerator[i]
                let b = {
                    left: bird.x - bird.r,
                    right: bird.x + bird.r,
                    top: bird.y - bird.r,
                    bottom: bird.y + bird.r,
                }
                let p = {
                    top: {
                        top: pg.y,
                        bottom: pg.y + this.h
                    },
                    bot: {
                        top: pg.y + this.h + this.gap,
                        bottom: pg.y + this.h*2 + this.gap
                    },
                    left: pg.x,
                    right: pg.x + this.w
                }
                pg.x -= this.dx

                if(pg.x < -this.w) {
                    this.pipeGenerator.shift()
                    score.current++
                }
                if (b.left < p.right &&
                    b.right > p.left &&
                    b.top < p.top.bottom &&
                    b.bottom > p.top.top) {
                    gameState.current = gameState.gameOver
                }
                if (b.left < p.right &&
                    b.right > p.left &&
                    b.top < p.bot.bottom &&
                    b.bottom > p.bot.top) {
                    gameState.current = gameState.gameOver
                }
            }
        }
    }
}
ground = {
    imgX: 276,
    imgY: 0,
    width: 224,
    height: 112,
    x: 0,
    y:cvs.height - 112,
    w:224,
    h:112,
    dx: 2,
    render: function() {
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x + this.width,this.y,this.w,this.h)
    },
    position: function() {
        if (gameState.current == gameState.getReady) {
            this.x = 0
        }
        if (gameState.current == gameState.play) {
            //modulus keeps x value infinitely cycling back to zero
            this.x = (this.x-this.dx) % (this.w/2)
        }
    }
}
//map of number images
map = [
    num0 = {
        imgX: 496,
        imgY: 60,
        width: 12,
        height: 18
    },
    num1 = {
        imgX: 135,
        imgY: 455,
        width: 10,
        height: 18
    },
    num2 = {
        imgX: 292,
        imgY: 160,
        width: 12,
        height: 18
    },
    num3 = {
        imgX: 306,
        imgY: 160,
        width: 12,
        height: 18
    },
    num4 = {
        imgX: 320,
        imgY: 160,
        width: 12,
        height: 18
    },
    num5 = {
        imgX: 334,
        imgY: 160,
        width: 12,
        height: 18
    },
    num6 = {
        imgX: 292,
        imgY: 184,
        width: 12,
        height: 18
    },
    num7 = {
        imgX: 306,
        imgY: 184,
        width: 12,
        height: 18
    },
    num8 = {
        imgX: 320,
        imgY: 184,
        width: 12,
        height: 18
    },
    num9 = {
        imgX: 334,
        imgY: 184,
        width: 12,
        height: 18
    }
]
score = {
    current: 0,
    best: null, // DO THIS STRETCH GOAL
    //values for drawing mapped numbers on canvas
    x: cvs.width/2,
    y: 40,
    w: 15,
    h: 25,
    reset: function() {
        this.current = 0
    },
    //display the score
    render: function() {
        if (gameState.current == gameState.play ||
            gameState.current == gameState.gameOver) {
            let string = this.current.toString()
            let ones = string.charAt(string.length-1)
            let tens = string.charAt(string.length-2)
            let hundreds = string.charAt(string.length-3)

            if (this.current >= 1000) {
                gameState.current = gameState.gameOver

            } else if (this.current >= 100) {
                ctx.drawImage(theme2, map[ones].imgX,map[ones].imgY,map[ones].width,map[ones].height, ( (this.x-this.w/2) + (this.w) + 3 ),this.y,this.w,this.h)

                ctx.drawImage(theme2, map[tens].imgX,map[tens].imgY,map[tens].width,map[tens].height, ( (this.x-this.w/2) ),this.y,this.w,this.h)

                ctx.drawImage(theme2, map[hundreds].imgX,map[hundreds].imgY,map[hundreds].width,map[hundreds].height, (   (this.x-this.w/2) - (this.w) - 3 ),this.y,this.w,this.h)

            } else if (this.current >= 10) {
                ctx.drawImage(theme2, map[ones].imgX,map[ones].imgY,map[ones].width,map[ones].height, ( (this.x-this.w/2) + (this.w/2) + 3 ),this.y,this.w,this.h)

                ctx.drawImage(theme2, map[tens].imgX,map[tens].imgY,map[tens].width,map[tens].height, ( (this.x-this.w/2) - (this.w/2) - 3 ),this.y,this.w,this.h)

            } else {
                ctx.drawImage(theme2, map[ones].imgX,map[ones].imgY,map[ones].width,map[ones].height, ( this.x-this.w/2 ),this.y,this.w,this.h)
            }
        }
    }
}
bird = {
    imgX: 276,
    imgY: 112,
    width: 34,
    height: 26,
    x: 50,
    y: 160,
    w: 34,
    h: 26,
    r: 12,
    fly: 5.25,
    gravity: .32,
    velocity: 0,
    render: function() {
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x-this.w/2,this.y-this.h/2,this.w,this.h)
    },
    flap: function() {
        this.velocity = - this.fly
    },
    position: function() {
        if (gameState.current == gameState.getReady) {
            this.y = 160

        } else {

            this.velocity += this.gravity
            this.y += this.velocity

            if (this.y+this.h/2 >= cvs.height-ground.h) {
                this.y = cvs.height-ground.h - this.h/2
                gameState.current = gameState.gameOver
            }

            if (this.y-this.h/2 <= 0) {
                this.y = this.r
            }
        }
    }
}
bird1 = {
    imgX: 115,
    imgY: 381,
    width: 17,
    height: 12,
    x: 50,
    y: 160,
    w: 34,
    h: 26,
    r: 12,
    fly: 5.25,
    gravity: .32,
    velocity: 0,
    render: function() {
        ctx.drawImage(theme2, this.imgX,this.imgY,this.width,this.height, this.x-this.w/2,this.y-this.h/2,this.w,this.h)
    },
    flap: function() {
        this.velocity = - this.fly
    },
    position: function() {
        if (gameState.current == gameState.getReady) {
            this.y = 160
        } else {
            this.velocity += this.gravity
            this.y += this.velocity
            if (this.y+this.h/2 >= cvs.height-ground.h) {
                this.y = cvs.height-ground.h - this.h/2
                gameState.current = gameState.gameOver
            }
            if (this.y-this.h/2 <= 0) {
                this.y = this.r
            }
        }
    }
}
bird2 = {
    imgX: 87,
    imgY: 491,
    width: 17,
    height: 12,
    x: 50,
    y: 160,
    w: 34,
    h: 26,
    r: 12,
    fly: 5.25,
    gravity: .32,
    velocity: 0,
    render: function() {
        ctx.drawImage(theme2, this.imgX,this.imgY,this.width,this.height, this.x-this.w/2,this.y-this.h/2,this.w,this.h)
    },
    fly: 5.8,
    flap: function() {
        this.velocity = - this.fly
    },
    position: function() {
        if (gameState.current == gameState.getReady) {
            this.y = 160
        } else {
            this.velocity += this.gravity
            this.y += this.velocity
            if (this.y+this.h/2 >= cvs.height-ground.h) {
                this.y = cvs.height-ground.h - this.h/2
                gameState.current = gameState.gameOver
            }
            if (this.y-this.h/2 <= 0) {
                this.y = this.r
            }
        }
    }
}
getReady = {
    imgX: 0,
    imgY: 228,
    width: 174,
    height: 160,
    x: cvs.width/2 - 174/2,
    y: cvs.height/2 - 160,
    w: 174,
    h: 160,
    render: function() {
        if (gameState.current == gameState.getReady) {
            ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
        }
    }
}
gameOver = {
    imgX: 174,
    imgY: 228,
    width: 226,
    height: 158,
    x: cvs.width/2 - 226/2,
    y: cvs.height/2 - 160,
    w: 226,
    h:160,
    render: function() {
        if (gameState.current == gameState.gameOver) {
            ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
        }
    }
}
let draw = () => {
    ctx.fillStyle = '#00bbc4'
    ctx.fillRect(0,0, cvs.width,cvs.height)
    bg.render()
    pipes.render()
    ground.render()
    score.render()
    bird.render()
    getReady.render()
    gameOver.render()
}
let update = () => {
    bird.position()
    bg.position()
    pipes.position()
    ground.position()
}
let loop = () => {
    draw()
    update()
    frame++
   // requestAnimationFrame(loop)
}
loop()
setInterval(loop, 17)


cvs.addEventListener('click', () => {
    if (gameState.current == gameState.getReady) {
        gameState.current = gameState.play
    }
    if (gameState.current == gameState.play) {
        bird.flap()
    }
    if (gameState.current == gameState.gameOver) {
        gameState.current = gameState.getReady
    }
})
document.body.addEventListener('keydown', (e) => {
    if (e.keyCode == 32) {
        if (gameState.current == gameState.getReady) {
            gameState.current = gameState.play
        }
        if (gameState.current == gameState.play) {
            bird.flap()
        }
        if (gameState.current == gameState.gameOver) {
            pipes.reset()
            score.reset()
            gameState.current = gameState.getReady
        }
    }
})

