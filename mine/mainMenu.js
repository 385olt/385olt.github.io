
Hrabrov.MainMenu = function() {};

Hrabrov.MainMenu.prototype = {
	
	create: function() {
		
		this.add.sprite(0, 0, 'sky');
		
		// ------- player
		
		this.player = this.add.sprite(this.world.width/2 - 16, this.world.height - 48, 'dude');
		
		this.player.scale.setTo(3, 3);
		
		this.physics.arcade.enable(this.player);

		this.player.body.gravity.y = 300;
		this.player.body.collideWorldBounds = true;

		this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);
		
		this.player.myDirection = 1;
		
		// ------- texts
		
		var titleString = 'ХРАБРОВ';
		this.add.text(this.world.width/2 - 42 * titleString.length, this.world.height/2 - 200, titleString, { font: '92pt Arial', fill: '#000' });
		
		var subtitleString = 'в поисках жены';
		this.add.text(this.world.width/2 - 20 * subtitleString.length - 10, this.world.height/2 - 115, subtitleString, { font: '58pt Arial', fill: '#000' });
	
		var startString = "Кликните или нажмите пробел чтобы начать";
		this.add.text(this.world.width/2 - 7 * startString.length, this.world.height - 200, startString, { font: '20pt Arial', fill: '#000' });
	},
	
	update: function() {
		
		if (this.player.x < 256) { 
		
			this.player.myDirection = 1; 
			
		} else if (this.player.x > this.world.width - 256 - this.player.width) { 
		
			this.player.myDirection = -1; 
			
		} else if (Math.abs(this.player.x + this.player.width/2 - this.world.width/2) < 10 && 
					this.rnd.frac() < 0.2 && 
					this.player.myDirection != 0) {
					
			this.player.myDirection = 0;
			this.time.events.add(Phaser.Timer.SECOND * 2, 
				function() { this.player.myDirection = Phaser.ArrayUtils.getRandomItem([1, -1]); }, 
				this);
				
		}
		
		this.player.body.velocity.x = 0;
		
		if (this.player.myDirection == 0) {
		
			this.player.animations.stop();
		    this.player.frame = 4;
		    
		} else {
		
			this.player.body.velocity.x = 450 * this.player.myDirection;
		    this.player.animations.play(this.player.myDirection == 1 ? 'right' : 'left');
		    
		}
		
		// ----- controls
		
		this.input.onDown.addOnce(this.start, this);
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.start();
		}
		
	},
	
	start: function() {
		this.state.start('Hrabrov.Game');
	}
	
};
