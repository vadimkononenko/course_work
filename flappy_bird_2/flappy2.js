(function(){
    class Sounds{
        constructor(audio_pathes = {}){
            this.score     = new Audio()     //  sound for scoring
            this.flap      = new Audio()     //  sound for flying bird
            this.collision = new Audio()     //  sound for collision
            this.fall      = new Audio()     //  sound for falling to the ground
            this.swoosh    = new Audio()     //  sound for changing game state

            this.set(audio_pathes)
        }

        set(audio_pathes = {}){
            this.pathes = Object.assign({
                score: 'audio/sfx_point.wav',
                flap: 'audio/sfx_wing.wav',
                collision: 'audio/sfx_hit.wav',
                fall: 'audio/sfx_die.wav',
                swoosh: 'audio/sfx_swooshing.wav'
            }, audio_pathes);

            this.score.src     = this.pathes.score;
            this.flap.src      = this.pathes.flap;
            this.collision.src = this.pathes.collision;
            this.fall.src      = this.pathes.fall;
            this.swoosh.src    = this.pathes.swoosh;
        }
    }

    // Abstract class
    class GamePart{
        constructor(game){
            if (new.target === GamePart) {
                throw new TypeError("Cannot construct Abstract instances directly");
            }
            this.game = game;
        }

        render(){}
        position(){}
    }

    class GameState{
        static GetReady = 0;
        static Play = 1;
        static GameOver = 2;

        constructor(){
            this.state = 0;
        }

        is(state){
            return this.state == state;
        }

        set(state){
            this.state = state;
        }
    }

    class Themes{
        constructor(list = {}){
            this.list = list;

            Object.keys(this.list).forEach(e => {
                let src = this.list[e];
                this.list[e] = new Image();
                this.list[e].src = src;
            });
        }

        get(id){
            if(Object.keys(this.list).map(e=>parseInt(e)).includes(id))
                return this.list[id];
            console.error("Theme not found!")
        }
    }

    class Background extends GamePart{
        constructor(game){
            super(game);

            this.imgX = 0;
            this.imgY = 0;
            this.width = 276;
            this.height = 228;
            this.x = 0;
            this.y = this.game.canvas.cvs.height - 228;
            this.w = 276;
            this.h = 228;
            this.dx = .2;
        }

        render() {
            this.game.canvas.ctx.drawImage(this.game.themes.get(1), this.imgX,this.imgY,this.width,this.height, this.x,                this.y, this.w, this.h)
            this.game.canvas.ctx.drawImage(this.game.themes.get(1), this.imgX,this.imgY,this.width,this.height, this.x + this.width,   this.y, this.w, this.h)
            this.game.canvas.ctx.drawImage(this.game.themes.get(1), this.imgX,this.imgY,this.width,this.height, this.x + this.width*2, this.y, this.w, this.h)
        }

        position() {
            if(this.game.state.is(GameState.GetReady)){
                this.x = 0
            }else if(this.game.state.is(GameState.Play)){
                this.x = (this.x-this.dx) % (this.w)
            }
        }
    }

    class Pipes extends GamePart{
        constructor(game){
            super(game);

            this.top = {
                imgX: 56,
                imgY: 323
            };

            this.bot = {
                imgX: 84,
                imgY: 323
            };

            this.width = 26;
            this.height = 160;
            this.w = 55;
            this.h = 300;
            this.gap = 85;
            this.dx = 2;
            this.minY = -260;
            this.maxY = -40;

            this.pipeGenerator = [];
        }

        reset() {
            this.pipeGenerator = []
        }

        render() {
            for (let i = 0; i < this.pipeGenerator.length; i++) {
                let pipe = this.pipeGenerator[i]
                let topPipe = pipe.y
                let bottomPipe = pipe.y + this.gap + this.h

                this.game.canvas.ctx.drawImage(this.game.themes.get(2), this.top.imgX,this.top.imgY,this.width,this.height, pipe.x,topPipe,this.w,this.h)
                this.game.canvas.ctx.drawImage(this.game.themes.get(2), this.bot.imgX,this.bot.imgY,this.width,this.height, pipe.x,bottomPipe,this.w,this.h)
            }
        }

        position(){
            if (!this.game.state.is(GameState.Play)) return;

            if (this.game.state.is(GameState.Play)) {

                if (this.game.frame % 100 == 0) {
                    this.pipeGenerator.push({
                        x: this.game.canvas.cvs.width,
                        y: Math.floor((Math.random() * (this.maxY-this.minY+1)) + this.minY)
                    })
                }
                for (let i = 0; i < this.pipeGenerator.length; i++) {

                    let pg = this.pipeGenerator[i]
                    let b = {
                        left:   this.game.rendering.bird.x - this.game.rendering.bird.r,
                        right:  this.game.rendering.bird.x + this.game.rendering.bird.r,
                        top:    this.game.rendering.bird.y - this.game.rendering.bird.r,
                        bottom: this.game.rendering.bird.y + this.game.rendering.bird.r,
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
                        this.game.rendering.score.current++
                        this.game.sounds.score.play()
                    }else if (b.left < p.right &&
                        b.right > p.left &&
                        b.top < p.top.bottom &&
                        b.bottom > p.top.top) {
                        //
                        this.game.state.set(GameState.GameOver);
                        this.game.sounds.collision.play()
                    }else if (b.left < p.right &&
                        b.right > p.left &&
                        b.top < p.bot.bottom &&
                        b.bottom > p.bot.top
                    ){
                        //
                        this.game.state.set(GameState.GameOver);
                        this.game.sounds.collision.play()
                    }
                }
            }
        }
    }

    class Ground extends GamePart{
        constructor(game){
            super(game);
            this.imgX = 276;
            this.imgY = 0;
            this.width = 224;
            this.height = 112;
            this.x = 0;
            this.y = this.game.canvas.cvs.height - 112;
            this.w =224;
            this.h =112;
            this.dx = 2;
        }

        render() {
            this.game.canvas.ctx.drawImage(this.game.themes.get(1), this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)
            this.game.canvas.ctx.drawImage(this.game.themes.get(1), this.imgX,this.imgY,this.width,this.height, this.x + this.width,this.y,this.w,this.h)
        }

        position() {
            if(this.game.state.is(GameState.GetReady)){
                this.x = 0
            }else if (this.game.state.is(GameState.Play)) {
                this.x = (this.x-this.dx) % (this.w/2)
            }
        }
    }

    class GameMap{
        static get(){
            return [{
                imgX: 496,
                imgY: 60,
                width: 12,
                height: 18
            },{
                imgX: 135,
                imgY: 455,
                width: 10,
                height: 18
            },{
                imgX: 292,
                imgY: 160,
                width: 12,
                height: 18
            },{
                imgX: 306,
                imgY: 160,
                width: 12,
                height: 18
            },{
                imgX: 320,
                imgY: 160,
                width: 12,
                height: 18
            },{
                imgX: 334,
                imgY: 160,
                width: 12,
                height: 18
            },{
                imgX: 292,
                imgY: 184,
                width: 12,
                height: 18
            },{
                imgX: 306,
                imgY: 184,
                width: 12,
                height: 18
            },{
                imgX: 320,
                imgY: 184,
                width: 12,
                height: 18
            },{
                imgX: 334,
                imgY: 184,
                width: 12,
                height: 18
            }];
        }
    }

    class Score extends GamePart{
        constructor(game){
            super(game);
            this.current = 0;
            this.best    = 0;
            this.x       = this.game.canvas.cvs.width/2;
            this.y       = 40;
            this.w       = 15;
            this.h       = 25;
        }

        reset() {
            this.current = 0
        }

        render(){
            if (this.game.state.is(GameState.Play) ||
                this.game.state.is(GameState.GameOver)) {
                //
                let string = this.current.toString();
                let ones = string.charAt(string.length-1)
                let tens = string.charAt(string.length-2)
                let hundreds = string.charAt(string.length-3)

                if (this.current >= 1000) {
                    this.game.state.set(GameState.GameOver)

                } else if (this.current >= 100) {
                    this.game.canvas.ctx.drawImage(this.game.themes.get(2), GameMap.get()[ones].imgX,GameMap.get()[ones].imgY,GameMap.get()[ones].width,GameMap.get()[ones].height, ( (this.x-this.w/2) + (this.w) + 3 ),this.y,this.w,this.h)
                    this.game.canvas.ctx.drawImage(this.game.themes.get(2), GameMap.get()[tens].imgX,GameMap.get()[tens].imgY,GameMap.get()[tens].width,GameMap.get()[tens].height, ( (this.x-this.w/2) ),this.y,this.w,this.h)
                    this.game.canvas.ctx.drawImage(this.game.themes.get(2), GameMap.get()[hundreds].imgX,GameMap.get()[hundreds].imgY,GameMap.get()[hundreds].width,GameMap.get()[hundreds].height, (   (this.x-this.w/2) - (this.w) - 3 ),this.y,this.w,this.h)
                } else if (this.current >= 10) {
                    this.game.canvas.ctx.drawImage(this.game.themes.get(2), GameMap.get()[ones].imgX,GameMap.get()[ones].imgY,GameMap.get()[ones].width,GameMap.get()[ones].height, ( (this.x-this.w/2) + (this.w/2) + 3 ),this.y,this.w,this.h)
                    this.game.canvas.ctx.drawImage(this.game.themes.get(2), GameMap.get()[tens].imgX,GameMap.get()[tens].imgY,GameMap.get()[tens].width,GameMap.get()[tens].height, ( (this.x-this.w/2) - (this.w/2) - 3 ),this.y,this.w,this.h)
                } else {
                    this.game.canvas.ctx.drawImage(this.game.themes.get(2), GameMap.get()[ones].imgX,GameMap.get()[ones].imgY,GameMap.get()[ones].width,GameMap.get()[ones].height, ( this.x-this.w/2 ),this.y,this.w,this.h)
                }
            }
        }
    }

    class Bird extends GamePart{
        constructor(game, config = {}){
            super(game);
            console.log(config);
            this.animation = config.animation;
            this.width    = config.width;
            this.height   = config.height;

            this.fr       = 0;
            this.x        = 50;
            this.y        = 160;
            this.w        = 34;
            this.h        = 24;
            this.r        = 12;
            this.fly      = 5.25;
            this.gravity  = .32;
            this.velocity = 0;
        }

        render() {
            let bird = this.animation[this.fr]
            this.game.canvas.ctx.save()
            this.game.canvas.ctx.translate(this.x, this.y)
            this.game.canvas.ctx.rotate(this.rotation)
            this.game.canvas.ctx.drawImage(this.game.themes.get(1), bird.imgX,bird.imgY,this.width,this.height, -this.w/2,-this.h/2,this.w,this.h)
            this.game.canvas.ctx.restore()
        }

        flap() {
            this.velocity = -this.fly;
        }

        position() {
            if (this.game.state.is(GameState.GetReady)) {
                this.y = 160
                this.rotation = 0 * this.game.options.bird_degree;
                if (this.game.frame % 20 == 0) {
                    this.fr += 1
                }
                if (this.fr > this.animation.length - 1) {
                    this.fr = 0
                }

            } else {
                if (this.game.frame % 4 == 0) {
                    this.fr += 1;
                }
                if (this.fr > this.animation.length - 1) {
                    this.fr = 0;
                }

                this.velocity += this.gravity
                this.y += this.velocity

                if (this.velocity <= this.fly) {
                    this.rotation = -15 * this.game.options.bird_degree;
                } else if (this.velocity >= this.fly+2) {
                    this.rotation = 70 * this.game.options.bird_degree;
                    this.fr = 1;
                } else {
                    this.rotation = 0;
                }

                if (this.y+this.h/2 >= this.game.canvas.cvs.height-this.game.rendering.ground.h) {
                    this.y = this.game.canvas.cvs.height-this.game.rendering.ground.h - this.h/2
                    if (this.game.frame % 1 == 0) {
                        this.fr = 2;
                        this.rotation = 70 * this.game.options.bird_degree;
                    }
                    if (this.game.state.is(GameState.Play)) {
                        this.game.state.set(GameState.GameOver);
                        this.game.sounds.fall.play();
                    }
                }

                if (this.y-this.h/2 <= 0) {
                    this.y = this.r
                }

            }
        }
    }

    class GameCanvas{
        constructor(game, canvas){
            this.game = game;
            this.cvs = document.querySelector(canvas);
            this.ctx = this.cvs.getContext('2d');
        }
    }

    class GameVisualState extends GamePart{
        constructor(game){
            super(game);

            this.imgX = null;
            this.imgY = null;
            this.width = null;
            this.height = null;
            this.x = null;
            this.y = null;
            this.w = null;
            this.h = null;
        }

        refresh(){
            if(this.game.state.is(GameState.GameOver)){
                this.imgX = 174;
                this.imgY = 228;
                this.width = 226;
                this.height = 158;
                this.x = this.game.canvas.cvs.width/2 - 226/2;
                this.y = this.game.canvas.cvs.height/2 - 160;
                this.w = 226;
                this.h = 160;
            }else if(this.game.state.is(GameState.GetReady)){
                this.imgX = 0;
                this.imgY = 228;
                this.width = 174;
                this.height = 160;
                this.x = this.game.canvas.cvs.width / 2 - 174/2;
                this.y = this.game.canvas.cvs.height / 2 - 160;
                this.w = 174;
                this.h = 160;
            }
        }

        render(){
            if(this.game.state.is(GameState.Play)) return;
            this.refresh();
            this.game.canvas.ctx.drawImage(this.game.themes.get(1), this.imgX,this.imgY,this.width,this.height, this.x,this.y,this.w,this.h)

            if(this.game.state.is(GameState.GameOver)){
                this.game.options.description.style.visibility = "visible";
            }
        }
    }

    class Game{
        constructor(canvas, options = {}){
            let self = this;
            this.frame = 0;
            this.options = Object.assign({
                fps: 60,
                audio_pathes: {},
                themes: {
                    1: 'png3/theme.png',
                    2: 'png3/theme-2.png',
                },
                bird_degree: Math.PI / 180,
                description: document.getElementById('description')
            }, options);

            this.canvas = new GameCanvas(self, canvas);
            this.sounds = new Sounds(self.options.audio_pathes);
            this.themes = new Themes(this.options.themes);
            this.state  = new GameState();

            this.rendering = {
                bg:     new Background(self),
                pipes:  new Pipes(self),
                ground: new Ground(self),
                map:    new GameMap(self),
                score:  new Score(self),
                bird:   new Bird(self, this.options.bird),
                state:  new GameVisualState(self)
            }

            this._bind_events();
        }


        _bind_events(){
            let self = this;

            const action_event = () => {
                if (this.state.is(GameState.GetReady)) {
                    this.state.set(GameState.Play)
                }
                if (this.state.is(GameState.Play)) {
                    this.rendering.bird.flap();
                    this.sounds.flap.play()
                    this.options.description.style.visibility = "hidden"
                }
                if (this.state.is(GameState.GameOver)) {
                    this.rendering.pipes.reset()
                    this.rendering.score.reset()
                    this.state.set(GameState.GetReady)
                    this.sounds.swoosh.play()
                }
            }

            this.canvas.cvs.addEventListener('click', action_event);

            document.body.addEventListener('keydown', (e) => {
                if (e.keyCode == 32) action_event();
            })
        }

        draw(){
            this.canvas.ctx.fillStyle = '#00bbc4';
            this.canvas.ctx.fillRect(0,0, this.canvas.cvs.width,this.canvas.cvs.height);

            // render
            this.rendering.bg.render();
            this.rendering.pipes.render();
            this.rendering.ground.render();
            this.rendering.score.render();
            this.rendering.bird.render();
            this.rendering.state.render();
        }

        update(){
            this.rendering.bird.position();
            this.rendering.bg.position();
            this.rendering.pipes.position();
            this.rendering.ground.position();
        }

        loop(){
            this.draw();
            this.update();
            this.frame++;
        }
    }

    class Birds{
        static configs(){
            return [{
                animation: [
                    {imgX: 276, imgY: 114},
                    {imgX: 276, imgY: 140},
                    {imgX: 276, imgY: 166},
                    {imgX: 276, imgY: 140}
                ],
                width: 34,
                height: 24,
            },{
                animation: [
                    {imgX: 115, imgY: 381},
                    {imgX: 115, imgY: 407},
                    {imgX: 115, imgY: 433},
                    {imgX: 115, imgY: 407}
                ],
                width: 18,
                height: 12,
            },{
                animation: [
                    {imgX: 87, imgY: 491},
                    {imgX: 115, imgY: 329},
                    {imgX: 115, imgY: 355},
                    {imgX: 115, imgY: 329}
                ],
                width: 18,
                height: 12,
            }];
        }

        static get(id){
            return Birds.configs()[id];
        }
    }

    class GameContainer{
        constructor(game){
            this.game = game;
            this.interval = null;
            this.ticks = 1000 / this.game.options.fps;
        }

        start(){
            let self = this;
            this.interval = setInterval(function(){
                self.game.loop();
            }, this.ticks);
        }

        stop(){
            clearInterval(this.interval);
        }
    }

    window.Game = Game;
    window.GameContainer = GameContainer;
    window.Birds = Birds;
})();

// init new game
let app = new GameContainer(new Game('#game', {
    bird: Birds.get(0),
    fps: 60
}));


// and start it
app.start();