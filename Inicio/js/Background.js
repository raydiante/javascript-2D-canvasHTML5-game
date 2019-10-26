var Background = Entity.extend(function () {
	this.currState = undefined; // estado atual;


	this.states = {
		BG: 'backscroll'
	};

	this.constructor = function (spriteSheet, x, y) {
		this.super();
		this.x = x;
		this.y = y;
		this.spriteSheet = spriteSheet;
		this.currState = this.states.BG;
		this.currentFrame = 0;
		this.vx = 0;
		this.vy = 0;
		setup();
	};

	this.getSprite = function () {
		return this.frames[this.currentFrame];
	};

	var setup = function () {

		this.eStates['backscroll'] = this.spriteSheet.getStats('backscroll');
		this.frames = this.eStates[this.currState];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os

	}.bind(this);

	this.andar = function () {
		this.vx = 1;
	}

	this.parar = function () {
		this.vx = 0;
	}

	this.update = function () {
		this.x += this.vx;
	};

});