
Donate.GameOver = function() {};

Donate.GameOver.prototype = {
	init: function(score) {
		this.score = score;
	},
	
	create: function() {
	
		this.add.sprite(0, 0, 'sky');
		
		this.add.text(this.world.width/2 - 125, this.world.height/2 - 80, 'Your score is', { font: '32pt Arial', fill: '#000' });
		
		var scoreString = precisionRound(this.score, 2).toString();
		this.add.text(this.world.width/2 - 20 * scoreString.length, this.world.height/2 - 30, scoreString, { font: '64pt Arial', fill: '#000' });
		
		var restartString = "Click to restart";
		this.add.text(this.world.width/2 - 5 * restartString.length, this.world.height - 100, restartString, { font: '20pt Arial', fill: '#000' });
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
