let cvs         //  canvas
let ctx         //  context'2d'
let theme1      //  original theme
let theme2      //  original them v2
let bg          //  background
let bird        //  bird yellow
let bird1       //  bird ?color?
let bird2       //  bird blue
let pipeGap     //  gap between pipe
let pipes       //  top and bottom pipes
let ground      //  ground
let getReady    //  get ready screen
let gameOver    //  game over screen
let score       //  score counter
let gameState   //  state of game

cvs = document.getElementById('game')
ctx = cvs.getContext('2d')
theme1 = new Image()
theme1.src = 'png3/theme.png'
theme2 = new Image()
theme2.src = 'png3/theme-2.png'
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
    x: 150,
    y: 0,
    w: 55,
    h: 250,
    gap: 85,
    dx: 2,
    render: function() {
        ctx.drawImage(theme2, this.top.imgX,this.top.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
        ctx.drawImage(theme2, this.bot.imgX,this.bot.imgY,this.width,this.height, this.x,(this.y+this.gap+this.h),this.w,this.h)
    },
    position: function() {
        if (gameState.current == gameState.getReady) {
            this.x = cvs.width
        }
        if (gameState.current == gameState.play) {
            this.x = this.x - this.dx
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
bird = {
    imgX: 276,
    imgY: 112,
    width: 34,
    height: 26,
    x: 50,
    y: 160,
    w: 34,
    h: 26,
    render: function() {
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
    },
    fly: 5.5,
    flap: function() {
       // console.log('🐦')
        this.velocity = - this.fly
    },
    gravity: .32,
    velocity: 0,
    position: function() {
        if (gameState.current == gameState.getReady) {
            this.y = 160
        } else {
            this.velocity += this.gravity
            this.y += this.velocity
            if (this.y+this.h >= cvs.height-ground.h) {
              //  console.log('collision')
                this.y = cvs.height-ground.h - this.h
              //  gameState.current = gameState.gameOver
            }
            if (this.y <= 0) {
              //  console.log('oops!')
                this.y = 2
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
    render: function() {
        ctx.drawImage(theme2, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
    },
    fly: 5.8,
    flap: function() {
      //  console.log('🐦🐦')
        this.velocity = - this.fly
    },
    gravity: .35,
    velocity: 0,
    position: function() {
        if (gameState.current == gameState.getReady) {
            this.y = 160
        } else {
            this.velocity += this.gravity
            this.y += this.velocity
            if (this.y+this.h >= cvs.height-ground.h) {
              //  console.log('collision')
                this.y = cvs.height-ground.h - this.h
            }
            if (this.y <= 0) {
             //   console.log('oops!')
                this.y = 2
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
  //  console.log(cvs.width, cvs.height)
    ctx.fillRect(0,0, cvs.width,cvs.height)
    bg.render()
    pipes.render()
    ground.render()
    bird.render()
    getReady.render()
    gameOver.render()
    bird.position()
    bg.position()
    pipes.position()
    ground.position()
}
let loop = () => {
    draw()
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
            gameState.current = gameState.getReady
        }
    }
})
let sprite = function(x,y, width,height, color1,color2, num1,num2,num3,num4) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.gravity = 1
    this.acceleration = .3
    let linear = ctx.createLinearGradient(num1,num2, num3,num4)
    linear.addColorStop(0, color1)
    linear.addColorStop(1, color2)
    this.render = function() {
        ctx.fillStyle = linear
        ctx.fillRect(this.x,this.y, this.width,this.height)
    }
    this.newPosition = function () {
        this.gravity += this.acceleration
        this.y += this.gravity
    }
}
