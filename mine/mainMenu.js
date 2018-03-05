
Donate.MainMenu = function() {};

Donate.MainMenu.prototype = {
	
	create: function() {
		
		this.add.sprite(0, 0, 'sky');
		
		// ------- player
		
		this.player = this.add.sprite(32, this.world.height - 48, 'dude');
		
		this.physics.arcade.enable(this.player);

		this.player.body.gravity.y = 300;
		this.player.body.collideWorldBounds = true;

		this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);
		
		// ------- texts
		
		var titleString = 'ХРАБРОВ';
		this.add.text(this.world.width/2 - 20 * titleString.length, this.world.height/2 - 100, titleString, { font: '64pt Arial', fill: '#000' });
		
		var subtitleString = 'в поисках жены';
		this.add.text(this.world.width/2 - 10 * subtitleString.length, this.world.height/2 - 20, subtitleString, { font: '16pt Arial', fill: '#000' });
	
		var startString = "Кликните или нажмите пробел чтобы начать";
		this.add.text(this.world.width/2 - 7 * startString.length, this.world.height - 100, startString, { font: '20pt Arial', fill: '#000' });
	},
	
	update: function() {
		
		this.input.onDown.addOnce(this.start, this);
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.start();
		}
		
	},
	
	start: function() {
		this.state.start('Donate.Game');
	}
	
};
