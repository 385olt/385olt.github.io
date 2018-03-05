var Donate = {};

Donate.Boot = function() {};

Donate.Boot.prototype = {
	
	init: function() {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		
	},
	
	preload: function() {
		
		game.stage.backgroundColor = "#808080";
	
		this.load.image('sky', 'assets/sky.png');
    	this.load.image('ground', 'assets/platform.png');
    	this.load.image('star', 'assets/star.png');
    	this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    	this.load.spritesheet('fem', 'assets/fem.png', 32, 48);
    
	},
	
	create: function() {
		this.state.start('Donate.MainMenu');
	}
	
	
};
