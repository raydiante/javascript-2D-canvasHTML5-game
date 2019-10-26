var Hero = Entity.extend(function () {
    this.currState = undefined; // estado atual;

    var vFrame = 0;
    var callback = undefined;
    this.sounds = {};

    this.getSprite = function () {
        return this.frames[this.currentFrame];
    };

    var setup = function () {

        this.eStates.IDLE = this.spriteSheet.getStats(this.states.IDLE);
        this.eStates['IDLE'] = this.spriteSheet.getStats('IDLE');
        this.eStates['JUMP'] = this.spriteSheet.getStats('JUMP');
        this.eStates['RUN'] = this.spriteSheet.getStats('RUN');
        this.eStates['DEAD'] = this.spriteSheet.getStats('DEAD');

        this.frames = this.eStates[this.currState];
        this.width = this.frames[0].width; //atualizar a altura
        this.height = this.frames[0].height; // atualizar os

        // atualizar o array de frames atual

    }.bind(this);

    this.DIRECTIONS = {
        LEFT: 1,
        RIGHT: 2
    }

    this.states = {
        IDLE: 'IDLE',
        JUMP: 'JUMP',
        DEAD: 'DEAD',
        RUN: 'RUN'
    };

    this.andar = function () {
        toogleState(this.states.RUN);
    };

    this.parar = function () {
        toogleState(this.states.IDLE);
    };

    this.morrer = function () {
        if (this.killed)
            return; //se j� foi atingido n�o � outra vez
        toogleState(this.states.DEAD);
        this.killed = true; // marca-se como morto
    };

    this.pular = function () {
        toogleState(this.states.JUMP);
    };

    var toogleState = function (theState) {
        if (this.killed)
            return; // se ja foi atingido n�o se pode mudar o estado
        if (this.currState !== theState) {
            this.currState = theState;
            this.frames = this.eStates[theState];
            this.currentFrame = 0;
            vFrame = 0;

        }
    }.bind(this);

    this.constructor = function (spriteSheet, x, y) {
        this.super();
        this.pontos = 0;
        this.x = x;
        this.y = y;
        this.spriteSheet = spriteSheet;
        this.currState = this.states.IDLE;
        this.currentFrame = 0;
        this.vx = 0,
            this.vy = 0,
            //Physics properties
            this.accelerationX = 0,
            this.accelerationY = 0,
            this.speedLimit = 5,
            this.gravity = 0.5,
            this.bounce = -0.3,
            //Platform game properties   
            this.isOnGround = true,
            this.jumpForce = -15,
            this.direction = this.DIRECTIONS.RIGHT,
            //segundo pulo        
            this.numJumps = 0,
            this.isJumping =  false

        setup();
    };



    this.update = function () {
        if (!this.active)
            return; //se n�o esta ativo n�o se faz nada

        if (this.currState == this.states.DEAD && this.currentFrame == this.frames.length - 1) {
            return;
        }

        // usa-se uma frame virtual para diminuir o frame rate
        vFrame = vFrame < this.frames.length - 1 ? vFrame + 0.3 : 0;

        this.currentFrame = Math.floor(vFrame);

        this.width = this.frames[this.currentFrame].width; //atualizar a altura
        this.height = this.frames[this.currentFrame].height; // atualizar os
        this.updateSize();
        
        // se terminou a anima��o de morrer desativa-se para ser removido da memoria
       
    };



});