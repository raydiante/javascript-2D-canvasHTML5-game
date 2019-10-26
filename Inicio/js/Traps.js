var Trap = Entity.extend(function () {

    var sprites = [];
    var callback = undefined;
    var tela = null;
    var ocw; // largura original calculada
    var och; // altura original calculada
    

    this.type = {
        SPIKE: ['SPIKE'],
        LEFT_SPIKE: ['SPIKE'],
        RIGHT_SPIKE: ['SPIKE'],
        FIXED_SPIKE: ['SPIKE'],
        FIXED_SPIKE_B: ['SPIKE'],
        SAW: ['SAW'],
        HIGHER_SAW: ['SAW'],
        BARRIL_VERDE: ['BARRIL_VERDE'],
        BARRIL_VERMELHO: ['BARRIL_VERMELHO'],
        SLOWER_SPIKE: ['SPIKE'],
        FASTER_SAW: ['SAW']
    };

    this.constructor = function (spriteSheet, x, y, kind) {
        this.super();
        this.x = x;
        this.y = y;
        this.spriteSheet = spriteSheet;
        tela = document.createElement("canvas");
        this.active = true;
        this.kind = kind;
        setup();
    };

    this.update = function () {
        this.width = ocw;
        this.height = och;
        this.updateSize();

    };

    var setup = function () {
        if (this.kind === 1) {
            sprites.push(this.spriteSheet.getStats(this.type.SPIKE[0])[0]);
        }
        if (this.kind === 2) {
            sprites.push(this.spriteSheet.getStats(this.type.SAW[0])[0]);
        }
        if (this.kind === 3) {
            sprites.push(this.spriteSheet.getStats(this.type.BARRIL_VERDE[0])[0]);
        }
        if (this.kind === 4) {
            sprites.push(this.spriteSheet.getStats(this.type.BARRIL_VERMELHO[0])[0]);
        }
        if (this.kind === 5) {
            sprites.push(this.spriteSheet.getStats(this.type.LEFT_SPIKE[0])[0]);
        }
        if (this.kind === 6) {
            sprites.push(this.spriteSheet.getStats(this.type.RIGHT_SPIKE[0])[0]);
        }
        if (this.kind === 7) {
            sprites.push(this.spriteSheet.getStats(this.type.FIXED_SPIKE[0])[0]);
        }
        if (this.kind === 8) {
            sprites.push(this.spriteSheet.getStats(this.type.HIGHER_SAW[0])[0]);
        }
        if (this.kind === 9) {
            sprites.push(this.spriteSheet.getStats(this.type.SLOWER_SPIKE[0])[0]);
        }
        if (this.kind === 10) {
            sprites.push(this.spriteSheet.getStats(this.type.FIXED_SPIKE_B[0])[0]);
        }
        if (this.kind === 11) {
            sprites.push(this.spriteSheet.getStats(this.type.FASTER_SAW[0])[0]);
        }

        this.width = sprites[0].width;
        this.height = sprites[0].height;
        ocw = this.width;
        och = this.height;
        tela.width = this.width;
        tela.height = this.height;

        localRender();


    }.bind(this);


    var localRender = function () {
        let lCtx = tela.getContext("2d");
        for (let sp of sprites) {
            lCtx.drawImage(this.spriteSheet.img,
                sp.x, sp.y, sp.width, sp.height,
                sp.width * sprites.indexOf(sp), 0, sp.width, sp.height);
        }

    }.bind(this);

    this.getSprite = function () {
        let spt = {
            "img": tela,
            "x": 0,
            "y": 0,
            "width": ocw,
            "height": och,
            "cx": ocw >> 1,
            "cy": och >> 1
        };
        return spt;
    }

    this.render = function (ctx) {
        if (!this.active || ctx === null || ctx === undefined || !this.visible)
            return;

        ctx.save();
        var sprite = this.getSprite();

        if (this.shadow.active) {
            ctx.shadowColor = this.shadow.shadowColor;
            ctx.shadowOffsetX = this.shadow.shadowOffsetX
            ctx.shadowOffsetY = this.shadow.shadowOffsetY
            ctx.shadowBlur = this.shadow.shadowBlur;
        }

        ctx.globalAlpha = this.alpha;

        if (this.rotation != 0) { // render com rota??o

            // transla??o para o eixo da entidade
            ctx.translate(this.x + (this.width >> 1), this.y + (this.height >> 1));
            ctx.rotate(this.rotation * Math.PI / 180);

            ctx.drawImage(
                sprite.img,
                sprite.x, sprite.y,
                sprite.width, sprite.height,
                Math.floor(-this.width >> 1), Math.floor(-this.height >> 1),
                Math.floor(this.width), Math.floor(this.height));
        } else { //render sem rota??o
            ctx.drawImage(
                sprite.img,
                sprite.x, sprite.y,
                sprite.width, sprite.height,
                Math.floor(this.x), Math.floor(this.y),
                Math.floor(this.width), Math.floor(this.height));

            // utiliza-se o Math.floor() para evitar o subpixel rendering pelo canvas, que suaviza a imagem
        }
        ctx.restore();
        this.drawColisionBoundaries(ctx,false,false,'red','red');
    }

});