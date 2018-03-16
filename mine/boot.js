var Hrabrov = {};

Hrabrov.Boot = function() {};

Hrabrov.Boot.prototype = {
	
	init: function() {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		
	},
	
	preload: function() {
		
		game.stage.backgroundColor = "#808080";
	
		this.load.image('sky', 'assets/sky.png');
    	this.load.image('ground', 'assets/platform.png');
    	this.load.image('star', 'assets/star.png');
    	this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    	this.load.spritesheet('sakramar', 'assets/sakramar.png', 64, 105);
    	this.load.spritesheet('sakramar_gun', 'assets/sakramar_gun.png', 25, 16);
    	this.load.spritesheet('shit', 'assets/shit.png', 25, 16);
    	this.load.spritesheet('fem', 'assets/fem.png', 32, 48);
    
	},
	
	create: function() {
		this.state.start('Hrabrov.MainMenu');
	}
	
	
};
