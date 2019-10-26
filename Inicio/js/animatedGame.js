/* AnimatedGame feito por
	Elder Costa - 180100528 - 180100528@esg.ipsantarem.pt
	Taua Gomes - 180100527 - 180100527@esg.ipsantarem.pt
	Rayssa Rosa - 180100523 - 180100523@esg.ipsantarem.pt
	
	Data de Entrega: 21/06/2019
	Versão: Uma depois da centésima
*/

(function () {

	var canvas; // representação genérica dos canvas
	var gameWorld = undefined;
	var camera = undefined;
	var nivel = 1;
	var pontuacaoHeroi = 0;

	var help = undefined;
	var regrasJogo = undefined;

	var entities = [];
	var teclas = new Array(255);
	var loadInfo = undefined;
	var animationHandler = undefined;
	var assetsLoadInfo = undefined;
	var assetsLoaded = 0;
	var assets = [];
	var umHero = undefined;
	var oBackground = undefined;

	// Estados do jogo
	var GameStates = {
		RUNNING: 1,
		PAUSED: 2,
		STOPED: 3,
		LOADING: 4,
		LOADED: 5
	}

	var gameState = undefined;

	// Tipos de Sons de jogo
	var GameSounds = {
		HERO:{},
		AMBIENTE: {}
	};

	// Controle Array Map
	var ROWS = groundDayMap.length;
	var COLUMNS = groundDayMap[0].length;
	var SIZE = 64;

	// Array de Ground
	var grEntities = [];
	var groundItens = {
		TERRA_MIDDLE: 1,
		TERRA_TOP: 2,
		VETICAL_TR: 3,
		TERRA_RIGHT: 4,
		ONDULADO_LEFT: 5,
		TERRA_MIDDLE_R: 6,
		AGUA: 7,
		ONDA: 8,
		TERRA_LEFT: 9,
		VETICAL_TL: 10,
		PLAT_R: 11,
		PLAT_L: 12,
		ONDULADO_RIGHT: 13,
		TERRA_MIDDLE_L: 14,
		PLAT_MIDDLE: 15,
		FLOAT_TERRA_L: 16,
		FLOAT_TERRA_R: 17,
		BOTTOM_TERRA: 18
	};

	// Array de Traps
	var trapEntities = [];
	var trapItens = {
		SPIKE: 1,
		SAW: 2,
		GREEN_BARREL: 3,
		RED_BARREL: 4,
		LEFT_SPIKE: 5,
		RIGHT_SPIKE: 6,
		FIXED_SPIKE: 7,
		HIGHER_SAW: 8,
		SLOWER_SPIKE: 9,
		FIXED_SPIKE_B: 10,
		FASTER_SAW: 11
	};

	//Array de Objetos
	var objectEntities = [];
	var objectType = {
		SINAL_1: 1,
		SINAL_2: 2,
		COGUMELO: 3,
		BOX: 4,
		ARBUSTO: 5
	}

	window.addEventListener("load", init,false);

	//Função para capturar o canvas e chamar load
	function init() {
		canvas = document.querySelector("#canvasBack");
		drawingSurface = canvas.getContext("2d");

		load();
	}

	// Função para carregar as sprites, audios e loads do jogo
	function load() {
		loadInfo = document.querySelector("#loadInfo");
		assetsLoadInfo = document.querySelector("#assetLoaded");
		help = document.querySelector("#help");
		regrasJogo = document.querySelector("#regrasJogo");

		// Colocar na tela regras do jogo
		regrasJogo.innerHTML = "REGRAS DO JOGO:";
		help.innerHTML = "<p> 1: Cogumelos dão pontos</p>" + 
						"<p>2: Tudo que não seja cogumelo te mata</p>" + 
						"<p>3: João não sabe nadar</p>";

		gameState = GameStates.LOADING;

		var spHero = new SpriteSheet();
		spHero.load("assets/characters//hero.png", "assets/characters//hero.json", loaded);
		assets.push(spHero);
		
		// Sprites do Nivel 1
		var spDayBackGround = new SpriteSheet();
		spDayBackGround.load("assets/background//back_scroll1.png", "assets/background//back_scroll1.json", loaded);
		assets.push(spDayBackGround);

		var spDayPlataform = new SpriteSheet();
		spDayPlataform.load("assets/platforms//platforms.png", "assets/platforms//platforms.json", loaded);
		assets.push(spDayPlataform);

		var spDayObjects = new SpriteSheet();
		spDayObjects.load("assets/objetos//objetos.png", "assets/objetos//objetos.json", loaded);
		assets.push(spDayObjects);	

		var spTrap = new SpriteSheet();
		spTrap.load("assets/traps//traps.png", "assets/traps//traps.json", loaded);
		assets.push(spTrap);

		// Sprites do Nivel 2
		var spBackground2 = new SpriteSheet();
		spBackground2.load("assets/background//back_scroll2.png", "assets/background//back_scroll2.json", loaded);
		assets.push(spBackground2);

		var spNightPlataform = new SpriteSheet();
		spNightPlataform.load("assets/platforms//platform2.png", "assets/platforms//platform2.json", loaded);
		assets.push(spNightPlataform);

		// Carregar arquivos de Audio
		gSoundManager.loadAsync("sounds/loading.mp3", function (so) {
			GameSounds.AMBIENTE.ESPERA = so;
			loaded("sounds/ambiente.mp3");
		});
		assets.push(GameSounds.AMBIENTE.ESPERA);
		
		gSoundManager.loadAsync("sounds/ambiente.wav", function (so) {
			GameSounds.AMBIENTE.JOGANDO = so;
			loaded("sounds/ambiente.wav");
		});
		assets.push(GameSounds.AMBIENTE.JOGANDO);

		gSoundManager.loadAsync("sounds/takeMushroom.mp3", function (so) {
			GameSounds.AMBIENTE.TAKEMUSHROOM = so;
			loaded("sounds/takeMushroom.mp3");
		});
		assets.push(GameSounds.AMBIENTE.TAKEMUSHROOM);

		gSoundManager.loadAsync("sounds/death.wav", function (so) {
			GameSounds.HERO.DEATH = so;
			loaded("sounds/death.wav");
		});
		assets.push(GameSounds.HERO.DEATH);

		gSoundManager.loadAsync("sounds/drown.wav", function (so) {
			GameSounds.HERO.DROWN = so;
			loaded("sounds/drown.wav");
		});
		assets.push(GameSounds.HERO.DROWN);

		gSoundManager.loadAsync("sounds/explosion.wav", function (so) {
			GameSounds.HERO.EXPLODED = so;
			loaded("sounds/explosion.wav");
		});
		assets.push(GameSounds.HERO.EXPLODED);

		gSoundManager.loadAsync("sounds/atmosphere.mp3", function (so) {
			GameSounds.AMBIENTE.NIGHT = so;
			loaded("sounds/atmosphere.mp3");
		});
		assets.push(GameSounds.AMBIENTE.NIGHT);

		gSoundManager.loadAsync("sounds/winGame.mp3", function (so) {
			GameSounds.HERO.WIN = so;
			loaded("sounds/winGame.mp3");
		});
		assets.push(GameSounds.HERO.WIN);
	}

	// Função que trata o load dos assets do game, quando estiverem carregados e 
	// player apertar uma tecla chamar setupGame 
	function loaded(assetName) {
		assetsLoaded++;
		assetsLoadInfo.innerHTML = "Loading: " + assetName;
		if (assetsLoaded < assets.length) return; // Só dar continuidade ao jogo se todos assests estiverem carregados

		assets.splice(0); // apagar o array auxiliar usado para o load

		GameSounds.AMBIENTE.ESPERA.play(true, 0.5);

		assetsLoadInfo.innerHTML = "Jogo Carregado. Pressione uma Tecla";

		gameState = GameStates.LOADED;

		window.addEventListener("keypress", setupGame, false); // espera por uma tecla pressionada para começar
	}

	// Função para configurar o game
	function setupGame() {
		window.removeEventListener("keypress", setupGame, false);
		
		//Alterar de Acordo com piso que o player se encontra
		if(nivel === 1){
			loadInfo.classList.toggle("hidden"); // Esconder a informaçao de loading

			oBackground = new Background(gSpriteSheets['assets/background//back_scroll1.png'], 0, 0);
			entities.push(oBackground);
		}
		if(nivel === 2){
			oBackground = new Background(gSpriteSheets['assets/background//back_scroll2.png'], 0, 0);
			entities.push(oBackground);
		}

		umHero = new Hero(gSpriteSheets['assets/characters//hero.png'], 0, 480);
		umHero.scale(0.2);
		entities.push(umHero);

		canvas.width = window.innerWidth;
		canvas.height = oBackground.height;

		// Para fazer o Scrolling, implementar o gameWolrd e Camera
		gameWorld = new GameWorld(0,0,oBackground.width,oBackground.height);

		camera = new Camera(0,0, canvas.width, canvas.height); 
		camera.center(gameWorld);

		generateTrap();

		generateObject();

		generateGround();

		window.addEventListener("keydown", keyDownHandler, false);
		window.addEventListener("keyup", keyUpHandler, false);
		
		playGame();
	}

	// Função que dá inicio ao jogo chamando update()
	function playGame(){
		gameState = GameStates.RUNNING;

		gSoundManager.stopAll();
		
		if(nivel === 1){
			GameSounds.AMBIENTE.JOGANDO.play(true, 1.2);
		}
		if(nivel === 2){
			GameSounds.AMBIENTE.NIGHT.play(true, 1.2);
		}
		update();
	}

	// Função que para o jogo.
	function stopGame() {
		gameState = GameStates.STOPED;

		cancelAnimationFrame(animationHandler);

		gSoundManager.stopAll();
		
		GameSounds.AMBIENTE.ESPERA.play(true, 0.1);

		window.removeEventListener("keydown", keyDownHandler, false);
	}

	// Teste para mapa com array
	function generateGround() {
		let map;

		if(nivel === 1){
			map = groundDayMap;		
			for (let row = 0; row < ROWS; row++) {
				for (let column = 0; column < COLUMNS; column++) {

					switch (map[row][column]) {
						case groundItens.TERRA_MIDDLE:
							let umChao = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 1);
							umChao.scale(0.5);
							entities.push(umChao);
							grEntities.push(umChao);
							break;
						case groundItens.TERRA_TOP:
							let topChao = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 2);
							topChao.scale(0.5);
							entities.push(topChao);
							grEntities.push(topChao);
							break;
						case groundItens.VETICAL_TR:
							let verticalTopR = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 3);
							verticalTopR.scale(0.5);
							entities.push(verticalTopR);
							grEntities.push(verticalTopR);
							break;
						case groundItens.TERRA_RIGHT:
							let rightChao = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 4);
							rightChao.scale(0.5);
							entities.push(rightChao);
							grEntities.push(rightChao);
							break;
						case groundItens.ONDULADO_LEFT:
							let leftOndulado = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 5);
							leftOndulado.scale(0.5);
							entities.push(leftOndulado);
							grEntities.push(leftOndulado);
							break;
						case groundItens.TERRA_MIDDLE_R:
							let umChaoR = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 6);
							umChaoR.scale(0.5);
							entities.push(umChaoR);
							grEntities.push(umChaoR);
							break;
						case groundItens.AGUA:
							let umaAgua = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 7);
							umaAgua.scale(0.5);
							entities.push(umaAgua);
							grEntities.push(umaAgua);
							break;
						case groundItens.ONDA:
							let umaOnda = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 8);
							entities.push(umaOnda);
							grEntities.push(umaOnda);
							break;
						case groundItens.TERRA_LEFT:
							let leftChao = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 9);
							leftChao.scale(0.5);
							entities.push(leftChao);
							grEntities.push(leftChao);
							break;
						case groundItens.VETICAL_TL:
							let verticalTopL = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 10);
							verticalTopL.scale(0.5);
							entities.push(verticalTopL);
							grEntities.push(verticalTopL);
							break;
						case groundItens.PLAT_R:
							let platr = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 11);
							platr.scale(0.5);
							entities.push(platr);
							grEntities.push(platr);
							break;
						case groundItens.PLAT_L:
							let platl = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 12);
							platl.scale(0.5);
							entities.push(platl);
							grEntities.push(platl);
							break;
						case groundItens.ONDULADO_RIGHT:
							let rightOndulado = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 13);
							rightOndulado.scale(0.5);
							entities.push(rightOndulado);
							grEntities.push(rightOndulado);
							break;
						case groundItens.TERRA_MIDDLE_L:
							let umChaoL = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 14);
							umChaoL.scale(0.5);
							entities.push(umChaoL);
							grEntities.push(umChaoL);
							break;
						case groundItens.PLAT_MIDDLE:
							let platm = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 15);
							platm.scale(0.5);
							entities.push(platm);
							grEntities.push(platm);
							break;
						case groundItens.FLOAT_TERRA_L:
							let fterral = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 16);
							fterral.scale(0.5);
							entities.push(fterral);
							grEntities.push(fterral);
							break;
						case groundItens.FLOAT_TERRA_R:
							let fterrar = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 17);
							fterrar.scale(0.5);
							entities.push(fterrar);
							grEntities.push(fterrar);
							break;
						case groundItens.BOTTOM_TERRA:
							let bterra = new Ground(gSpriteSheets['assets/platforms//platforms.png'], column * SIZE, row * SIZE, 18);
							bterra.scale(0.5);
							entities.push(bterra);
							grEntities.push(bterra);
							break;
					}
				}
			}
		}

		if(nivel === 2){
			map = groundNightMap;
			for (let row = 0; row < ROWS; row++) {
				for (let column = 0; column < COLUMNS; column++) {

					switch (map[row][column]) {
						case groundItens.TERRA_MIDDLE:
							let umChao = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 1);
							umChao.scale(0.5);
							entities.push(umChao);
							grEntities.push(umChao);
							break;
						case groundItens.TERRA_TOP:
							let topChao = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 2);
							topChao.scale(0.5);
							entities.push(topChao);
							grEntities.push(topChao);
							break;
						case groundItens.VETICAL_TR:
							let verticalTopR = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 3);
							verticalTopR.scale(0.5);
							entities.push(verticalTopR);
							grEntities.push(verticalTopR);
							break;
						case groundItens.TERRA_RIGHT:
							let rightChao = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 4);
							rightChao.scale(0.5);
							entities.push(rightChao);
							grEntities.push(rightChao);
							break;
						case groundItens.ONDULADO_LEFT:
							let leftOndulado = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 5);
							leftOndulado.scale(0.5);
							entities.push(leftOndulado);
							grEntities.push(leftOndulado);
							break;
						case groundItens.TERRA_MIDDLE_R:
							let umChaoR = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 6);
							umChaoR.scale(0.5);
							entities.push(umChaoR);
							grEntities.push(umChaoR);
							break;
						case groundItens.AGUA:
							let umaAgua = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 7);
							umaAgua.scale(0.5);
							entities.push(umaAgua);
							grEntities.push(umaAgua);
							break;
						case groundItens.ONDA:
							let umaOnda = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 8);
							entities.push(umaOnda);
							grEntities.push(umaOnda);
							break;
						case groundItens.TERRA_LEFT:
							let leftChao = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 9);
							leftChao.scale(0.5);
							entities.push(leftChao);
							grEntities.push(leftChao);
							break;
						case groundItens.VETICAL_TL:
							let verticalTopL = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 10);
							verticalTopL.scale(0.5);
							entities.push(verticalTopL);
							grEntities.push(verticalTopL);
							break;
						case groundItens.PLAT_R:
							let platr = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 11);
							platr.scale(0.5);
							entities.push(platr);
							grEntities.push(platr);
							break;
						case groundItens.PLAT_L:
							let platl = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 12);
							platl.scale(0.5);
							entities.push(platl);
							grEntities.push(platl);
							break;
						case groundItens.ONDULADO_RIGHT:
							let rightOndulado = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 13);
							rightOndulado.scale(0.5);
							entities.push(rightOndulado);
							grEntities.push(rightOndulado);
							break;
						case groundItens.TERRA_MIDDLE_L:
							let umChaoL = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 14);
							umChaoL.scale(0.5);
							entities.push(umChaoL);
							grEntities.push(umChaoL);
							break;
						case groundItens.PLAT_MIDDLE:
							let platm = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 15);
							platm.scale(0.5);
							entities.push(platm);
							grEntities.push(platm);
							break;
						case groundItens.FLOAT_TERRA_L:
							let fterral = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 16);
							fterral.scale(0.5);
							entities.push(fterral);
							grEntities.push(fterral);
							break;
						case groundItens.FLOAT_TERRA_R:
							let fterrar = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 17);
							fterrar.scale(0.5);
							entities.push(fterrar);
							grEntities.push(fterrar);
							break;
						case groundItens.BOTTOM_TERRA:
							let bterra = new Ground(gSpriteSheets['assets/platforms//platform2.png'], column * SIZE, row * SIZE, 18);
							bterra.scale(0.5);
							entities.push(bterra);
							grEntities.push(bterra);
							break;
					}
				}
			}
		}
	}

	// Função para gerar armadilhas
	function generateTrap() {
		let map;

		if(nivel === 1) map = trapDayMap;
		if(nivel === 2) map = trapNightMap;

		for (let row = 0; row < ROWS; row++) {
			for (let column = 0; column < COLUMNS; column++) {

				switch (map[row][column]) {
					case trapItens.SPIKE:
						let umSpike = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 1);
						umSpike.vx = 5;
						umSpike.inicialX = umSpike.x;
						umSpike.inicialY = umSpike.y;
						umSpike.distancia = 20 * umSpike.vx;
						entities.push(umSpike);
						trapEntities.push(umSpike);
						break;
					case trapItens.SAW:
						let umSaw = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 2);
						umSaw.vy = 3;
						umSaw.inicialX = umSaw.x;
						umSaw.inicialY = umSaw.y;
						umSaw.distancia = 30 * umSaw.vy;
						entities.push(umSaw);
						trapEntities.push(umSaw);
						break;
					case trapItens.GREEN_BARREL:
						let umBarrilG = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 3);
						entities.push(umBarrilG);
						trapEntities.push(umBarrilG);
						break;
					case trapItens.RED_BARREL:
						let umBarrilR = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 4);
						entities.push(umBarrilR);
						trapEntities.push(umBarrilR);
						break;
					case trapItens.LEFT_SPIKE:
						let leftSpike = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 5);
						leftSpike.rotation = 270;
						entities.push(leftSpike);
						trapEntities.push(leftSpike);
						break;
					case trapItens.RIGHT_SPIKE:
						let rightSpike = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 6);
						rightSpike.rotation = 90;
						entities.push(rightSpike);
						trapEntities.push(rightSpike);
						break;
					case trapItens.FIXED_SPIKE:
						let fixedSpike = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 7);
						entities.push(fixedSpike);
						trapEntities.push(fixedSpike);
						break;
					case trapItens.HIGHER_SAW:
						let higherSaw = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 2);
						higherSaw.vy = 4;
						higherSaw.inicialX = higherSaw.x;
						higherSaw.inicialY = higherSaw.y;
						higherSaw.distancia = 120 * higherSaw.vy;
						entities.push(higherSaw);
						trapEntities.push(higherSaw);
						break;
					case trapItens.SLOWER_SPIKE:
						let slowerSpike = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 1);
						slowerSpike.vx = 2;
						slowerSpike.inicialX = slowerSpike.x;
						slowerSpike.inicialY = slowerSpike.y;
						slowerSpike.distancia = 30 * slowerSpike.vx;
						entities.push(slowerSpike);
						trapEntities.push(slowerSpike);
						break;
					case trapItens.FIXED_SPIKE_B:
						let fixedSpikeB = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 10);
						fixedSpikeB.rotation = 180;
						entities.push(fixedSpikeB);
						trapEntities.push(fixedSpikeB);
						break;
					case trapItens.FASTER_SAW:
						let fasterSaw = new Trap(gSpriteSheets['assets/traps//traps.png'], column * SIZE, row * SIZE, 2);
						fasterSaw.vy = 9;
						fasterSaw.inicialX = fasterSaw.x;
						fasterSaw.inicialY = fasterSaw.y;
						fasterSaw.distancia = 60 * fasterSaw.vy;
						entities.push(fasterSaw);
						trapEntities.push(fasterSaw);
						break;
				}
			}
		}
	}

	// Função para gerar objetos do Mapa
	function generateObject() {
		let map;

		if(nivel === 1){
			map = objectDayMap;
			for (let row = 0; row < ROWS; row++) {
				for (let column = 0; column < COLUMNS; column++) {

					switch (map[row][column]) {
						case objectType.SINAL_1:
							let umSinal = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 1);
							entities.push(umSinal);
							objectEntities.push(umSinal);
							break;
						case objectType.SINAL_2:
							let outroSinal = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 2);
							entities.push(outroSinal);
							objectEntities.push(outroSinal);
							break;
						case objectType.COGUMELO:
							let umCogumelo = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 3);
							umCogumelo.scale(0.5);
							umCogumelo.y += 32;
							entities.push(umCogumelo);
							objectEntities.push(umCogumelo);
							break;
						case objectType.BOX:
							let umaCaixa = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 4);
							entities.push(umaCaixa);
							objectEntities.push(umaCaixa);
							break;
						case objectType.ARBUSTO:
							let umArbusto = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 5);
							entities.push(umArbusto);
							objectEntities.push(umArbusto);
							break;
					}
				}
			}
		}

		if(nivel === 2){
			map = objectNightMap;
			for (let row = 0; row < ROWS; row++) {
				for (let column = 0; column < COLUMNS; column++) {
					switch (map[row][column]) {
						case objectType.SINAL_1:
							let umSinal = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 1);
							entities.push(umSinal);
							objectEntities.push(umSinal);
							break;
						case objectType.SINAL_2:
							let outroSinal = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 2);
							entities.push(outroSinal);
							objectEntities.push(outroSinal);
							break;
						case objectType.COGUMELO:
							let umCogumelo = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 3);
							umCogumelo.scale(0.5);
							umCogumelo.y += 32;
							entities.push(umCogumelo);
							objectEntities.push(umCogumelo);
							break;
						case objectType.BOX:
							let umaCaixa = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 4);
							entities.push(umaCaixa);
							objectEntities.push(umaCaixa);
							break;
						case objectType.ARBUSTO:
							let umArbusto = new Objetos(gSpriteSheets['assets/objetos//objetos.png'], column * SIZE, row * SIZE, 5);
							entities.push(umArbusto);
							objectEntities.push(umArbusto);
							break;
					}
				}
			}
		}
	}

	// Função que trata inputs do teclado
	function keyDownHandler(e) {
		var codTecla=e.keyCode;
		teclas[codTecla]=true; 
	}
	// Função que trata quando tecla é liberada
	function keyUpHandler(e) {
		var codTecla=e.keyCode;
		teclas[codTecla]=false;
		if(teclas[keyboard.SPACE] == teclas[codTecla]){
			umHero.numJumps++;
		}
	}

	//Movimentos e fisicas do herói
	function moveHero() {
		if(teclas[keyboard.LEFT]){
			umHero.andar();
			umHero.vx =-5;
			if (umHero.direction != umHero.DIRECTIONS.LEFT) {
				umHero.flipHorizontal(); // Virar heroi de acordo com sua direção
				umHero.direction = umHero.DIRECTIONS.LEFT;
			}
		} 	

		if(teclas[keyboard.RIGHT]){
			umHero.andar();
			umHero.vx =5;
			if (umHero.direction != umHero.DIRECTIONS.RIGHT) {
				umHero.flipHorizontal();
				umHero.direction = umHero.DIRECTIONS.RIGHT;
			}
		} 
		
		if(teclas[keyboard.SPACE] && umHero.isOnGround){
			umHero.vy = umHero.jumpForce;
			umHero.isJumping = true;
			umHero.isOnGround = false;
			umHero.pular();
			// Colocar musica de jump
		} 
		
		if( !umHero.isOnGround && umHero.numJumps==1 && umHero.isJumping && teclas[keyboard.SPACE]){ //SEGUNDO PULO
			umHero.vy = umHero.jumpForce;
			umHero.isJumping = false;
			umHero.pular();
			// Colocar musica de jump
			umHero.numJumps=0;
		}
		
		if(!teclas[keyboard.LEFT] && !teclas[keyboard.RIGHT] && !teclas[keyboard.SPACE]){
			umHero.accelerationX = 0;
			umHero.gravity = 0.9;
			umHero.vx = 0;
			umHero.parar();
		}

		//ACELERAÇÃO 
		umHero.vx += umHero.accelerationX;
		umHero.vy += umHero.accelerationY;

		//GRAVIDADE
		umHero.vy += umHero.gravity;

		//LIMITE DE VELOCIDADE
		if (umHero.vx > umHero.speedLimit) {
			umHero.vx = umHero.speedLimit;
		}
		if (umHero.vx < -umHero.speedLimit) {
			umHero.vx = -umHero.speedLimit;
		}

		if (umHero.vy > umHero.speedLimit * 4) {
			umHero.vy = umHero.speedLimit * 4;
		}
	}

	// Função que recebe armadilha e a movimenta
	function moveTrap(trap){
		for(var i=0; i<grEntities.length;i++){
			if(trap.kind == 1){
				if(trap.hitTestRectangle(grEntities[i]) || 
					trap.x == trap.inicialX + trap.distancia) trap.direcao = 2;
			}
			if (trap.kind == 2){
				if(trap.hitTestRectangle(grEntities[i]) ||
					trap.y == trap.inicialY - trap.distancia) trap.direcao = 4;
			}	
		}

		for(var i=0; i<objectEntities.length;i++){
			if(trap.kind == 1){
				if(trap.hitTestRectangle(objectEntities[i]) || 
					trap.x == trap.inicialX + trap.distancia) trap.direcao = 2;
			}
			if (trap.kind == 2){
				if(trap.hitTestRectangle(objectEntities[i]) ||
					trap.y == trap.inicialY - trap.distancia) trap.direcao = 4;
			}	
		}

		if(trap.x == trap.inicialX) {
			if(trap.kind == 1) trap.direcao = 1;	
		}

		if(trap.y == trap.inicialY) {
			if(trap.kind == 2) trap.direcao = 3;
		}

		switch(trap.direcao){
			case 1 : trap.x += trap.vx;break; 
			case 2 : trap.x -= trap.vx;break;
			case 3 : trap.y -= trap.vy;break;
			case 4 : trap.y += trap.vy;break;
		}
	}

	// Função que trata quando herói pega um Objeto
	function takeObject(objeto){

		if(objeto.active){
			GameSounds.AMBIENTE.TAKEMUSHROOM.play(false, 0.7);

			// Desativar entidade para não ser renderizada
			objeto.active=false;

			pontuacaoHeroi += 10;
		}
	}

	// Função que verifica colisões
	function checkColisions() {
		// Verificar colisões com as Armadilhas
		for (var i = 0; i < trapEntities.length; i++) {
			if (umHero.hitTestCircle(trapEntities[i]) && !trapEntities[i].isColliding) {
				umHero.isColliding = true;
				trapEntities[i].isColliding = true;
				GameSounds.HERO.DEATH.play(false,0.2);
				umHero.morrer();
				endGame('lose');
			} else {
				umHero.isColliding = false;
				trapEntities[i].isColliding = false;
			}
		}

		// Verificar se herói caiu na agua e chamar endGame
		for (var i = 0; i < grEntities.length; i++) {
			if(grEntities[i].kind === groundItens.ONDA){
				if(umHero.hitTestCircle(grEntities[i])){
					umHero.isOnGround = false;
					GameSounds.HERO.DROWN.play(false,0.4);
					endGame('lose');
				}
			}
		}

		// Verificar colisões com objetos e bloquear heroi sobre a caixa
		for (var i = 0; i < objectEntities.length; i++) {
			if(objectEntities[i].kind == objectType.COGUMELO){
				if(umHero.hitTestCircle(objectEntities[i])){
					takeObject(objectEntities[i]);
				}
			}
		
			if(objectEntities[i].kind == objectType.BOX){
				var collisionSide = umHero.blockRectangle(objectEntities[i]);
		
				if(collisionSide === "bottom" && umHero.vy >= 0){
					//Se estiver na plataforma, herói está no chão
					umHero.isOnGround = true;
					//Neutralizar gravidade
					umHero.vy = -umHero.gravity;
					//Variaveis do pulo
					umHero.isJumping = false;
					umHero.numJumps=0;
				}
				else if(collisionSide === "top" && umHero.vy <= 0) umHero.vy = 0;
				else if(collisionSide === "right" && umHero.vx >= 0) umHero.vx = 0;
				else if(collisionSide === "left" && umHero.vx <= 0) umHero.vx = 0;
				if(collisionSide !== "bottom" && umHero.vy > 0) umHero.isOnGround = false;
			}

			if(objectEntities[i].kind == objectType.SINAL_2){
				if(umHero.hitTestCircle(objectEntities[i])){
					changeLevel();
				}
			}

			if(objectEntities[i].kind == objectType.SINAL_1){
				if(umHero.hitTestCircle(objectEntities[i])){
					endGame('win');
				}
			}
			
		}

		// Bloquear e manter o herói sobre as plataformas
		for (var i = 0; i < grEntities.length; i++) {
			if(grEntities[i].kind != groundItens.ONDA && grEntities[i].kind != groundItens.AGUA ){
				var collisionSide = umHero.blockRectangle(grEntities[i]);
		
				if(collisionSide === "bottom" && umHero.vy >= 0){
					//Se estiver na plataforma, herói está no chão
					umHero.isOnGround = true;
					//Neutralizar gravidade
					umHero.vy = -umHero.gravity;
					//Variaveis do pulo
					umHero.isJumping = false;
					umHero.numJumps=0;
				}
				else if(collisionSide === "top" && umHero.vy <= 0) umHero.vy = 0;
				else if(collisionSide === "right" && umHero.vx >= 0) umHero.vx = 0;
				else if(collisionSide === "left" && umHero.vx <= 0) umHero.vx = 0;
				if(collisionSide !== "bottom" && umHero.vy > 0) umHero.isOnGround = false;
			}
		}
	}

	// Ciclo de jogo. É chamada de acordo com RequestAnimationHandler
	function update() {
		if(gameState === GameStates.RUNNING){
			// Mover armadilhas
			for(var i = 0; i<trapEntities.length; i++){
				moveTrap(trapEntities[i]);
			}

			// Alterar posição do herói
			moveHero();

			// Movimentar herói e mantê-lo dentro do mundo
			umHero.x = Math.max(0, Math.min(umHero.x + umHero.vx,
										gameWorld.width - umHero.width));
			umHero.y = Math.max(0, Math.min(umHero.y + umHero.vy,
										gameWorld.height - umHero.height));
			
			// Mover a camera de acordo com posição de Heroi
			if(umHero.x < camera.leftInnerBoundary())
			camera.x = Math.floor(umHero.x - (camera.width * 0.25));
			if(umHero.y < camera.topInnerBoundary())
				camera.y = Math.floor(umHero.y - (camera.height * 0.25));
			if(umHero.x + umHero.width > camera.rightInnerBoundary())
				camera.x = Math.floor(umHero.x + umHero.width - (camera.width * 0.75));
			if(umHero.y + umHero.height > camera.bottomInnerBoundary())
				camera.y = Math.floor(umHero.y + umHero.height - (camera.height * 0.75));
			
			// Manter a camara dentro dos limites do mundo
			if(camera.x < gameWorld.x)  camera.x = gameWorld.x;
			if(camera.y < gameWorld.y)  camera.y = gameWorld.y;
			if(camera.x + camera.width > gameWorld.x + gameWorld.width) 
				camera.x = gameWorld.x + gameWorld.width - camera.width;
			if(camera.y + camera.height > gameWorld.height) 
				camera.y = gameWorld.height - camera.height;

			for (var i = 0; i < entities.length; i++) {
				entities[i].update();
			}
			
			checkColisions();

			render();

			animationHandler = requestAnimationFrame(update, canvas);
		}
	}

	// Função para Renderizar as entidades
	function render() {
		drawingSurface.clearRect(0, 0, canvas.width, canvas.height); //Limpeza do canvas
		drawingSurface.save(); //Salvar o Contexto

		drawingSurface.translate(-camera.x,-camera.y);

		for (var i = 0; i < entities.length; i++) {
			var entity = entities[i];
			if(entity.active === true){
				entities[i].render(drawingSurface);
				entities[i].drawColisionBoundaries(drawingSurface, false, false, "red", "blue");
			}
		}
		//camera.drawFrame(drawingSurface, true); // Desenhar limites da Camera
		drawingSurface.restore(); // Restaurar o Contexto
	}

	// Função que altera o piso do jogo
	function changeLevel(){
		stopGame();
		// A nivel de teste, colocar o valor de SINAL_2 (2) proximo ao Herói no groundDayMap
		nivel = 2;

		//Esvaziar as entidades para não serem renderizadas novamente
		entities = [];
		grEntities = [];
		trapEntities = [];
		objectEntities = [];
		
		// Configurar novamente o jogo
		setupGame();
	}

	// Função para terminar o jogo recebe win ou lose conforme açoes do herói
	function endGame(tipo){
        stopGame();

		// - Variaveis para capturar valores do modal
        let endModal = document.getElementById("endModal");
        let endModalContent = document.getElementById("inEndModal");
        let buttonEnd = document.getElementById("buttonEnd");
		
		let endMessage;

		if(tipo === 'lose') {
			GameSounds.HERO.DEATH.play(false,0.4);
			endMessage = "<p>YOU LOSE! </p>" + "<br>" + "<p>SUA PONTUAÇÃO:" + pontuacaoHeroi + "</p>" + "<br>";
		}else if(tipo === 'win'){
			GameSounds.HERO.WIN.play(false,0.4);
			endMessage = "<p>YOU WIN! </p>" + "<br>" + "<p>SUA PONTUAÇÃO:" + pontuacaoHeroi + "</p>" + "<br>";
		} 
			
        
        // modal
        endModal.style.display = "block";
        endModalContent.innerHTML = endMessage;

		// Refreshar a página caso queira jogar novamente
		buttonEnd.addEventListener("click",function(){
            endModal.style.display = "none";
            document.location.reload(false);
		},false);
    }
})();