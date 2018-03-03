
Donate.GameOver = function() {};

Donate.GameOver.prototype = {
	init: function(score) {
		this.score = score;
	},
	
	create: function() {
	
		this.add.sprite(0, 0, 'sky');
		
		this.add.text(this.world.width/2 - 100, this.world.height/2 - 64, 'Your score is', { fontSize: '32px', fill: '#000' });
		this.add.text(this.world.width/2 - 50, this.world.height/2, this.score.toString(), { fontSize: '64px', fill: '#000' });
		
	},
	
	update: function() {
		
		this.input.onDown.addOnce(this.start, this);
		
	},
	
	start: function() {
		this.state.start('Donate.Game');
	}
};
