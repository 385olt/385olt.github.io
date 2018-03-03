
Donate.GameOver = function() {};

Donate.GameOver.prototype = {
	init: function(score) {
		this.score = score;
	},
	
	create: function() {
	
		this.add.sprite(0, 0, 'sky');
		
		var scoreString = this.score.toString();
		
		this.add.text(this.world.width/2 - 130, this.world.height/2 - 64, 'Your score is', { font: '32pt Arial', fill: '#000' });
		this.add.text(this.world.width/2 - 20 * scoreString.length, this.world.height/2, scoreString, { font: '64pt Arial', fill: '#000' });
		
	},
	
	update: function() {
		
		this.input.onDown.addOnce(this.start, this);
		
	},
	
	start: function() {
		this.state.start('Donate.Game');
	}
};
