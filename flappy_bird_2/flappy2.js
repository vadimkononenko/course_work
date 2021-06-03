let cvs
let ctx

let theme1
let theme2
let bg
let bird
let bird1
let bird2
let pipeGap
let topPipe
let botPipe
let score

let sprite = function(x,y, width,height, color) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.gravity = 1
    this.acceleration = .3
    this.render = function() {
        ctx.fillStyle = color
        ctx.fillRect(this.x,this.y, this.width,this.height)
    }
    this.newPosition = function () {
        this.gravity += this.acceleration
        this.y += this.gravity
    }
}

let draw = () => {
    ctx.fillStyle = '#00bbc4'
    console.log(cvs.width, cvs.height)
    ctx.fillRect(0,0, cvs.width,cvs.height)
    bg.render()
    ground.render()
    bird.render()

}
let loop = () => {
    draw()
    requestAnimationFrame(loop)
}

cvs = document.getElementById('game')
ctx = cvs.getContext('2d')
theme1 = new Image()
theme1.src = 'png3/theme.png'
theme2 = new Image()
theme2.src = 'png3/theme-2.png'
bg = {
    imgX: 0,
    imgY: 0,
    width: 276,
    height: 228,
    x: 0,
    y: cvs.height - 228,
    w: 276,
    h: 228,
    render: function() {
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x + this.width,this.y,this.w,this.h)
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
    render: function() {
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
        ctx.drawImage(theme1, this.imgX,this.imgY,this.width,this.height, this.x + this.width,this.y,this.w,this.h)
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
    }
}
bird2 = {
    imgX: 87,
    imgY: 491,
    width: 17,
    height: 12,
    x: 0,
    y: 0,
    w: 34,
    h: 26,
    render: function() {
        ctx.drawImage(theme2, this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
    }
}
loop()
