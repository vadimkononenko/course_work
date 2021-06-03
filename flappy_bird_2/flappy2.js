let cvs
let ctx
let bird
let topPipe
let botPipe
let ground
let score

let sprite = function(x,y, width,height, color1,color2, num1,num2,num3,num4) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    let linear = ctx.createLinearGradient(num1,num2, num3,num4)
    linear.addColorStop(0, color1)
    linear.addColorStop(1, color2)
    this.render = function() {
        ctx.fillStyle = linear
        ctx.fillRect(this.x,this.y, this.width,this.height)
    }
}
cvs = document.getElementById('game')
ctx = cvs.getContext('2d')
bird = new sprite(30,200, 50,50, 'yellow','orange', 30,0,70,0)
topPipe = new sprite(200,0, 70,200, 'green','lightgreen', 0,100, 0,200)
botPipe = new sprite(200,576, 70,-200, 'green','lightgreen', 0,0, 0,-80)
ground = new sprite(0,576, 324,-70, '#d2ce89','brown', 0,0, 0,30)
let draw = () => {
    bird.render()
    topPipe.render()
    botPipe.render()
    ground.render()
}
draw()