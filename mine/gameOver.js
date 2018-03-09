
Hrabrov.GameOver = function() {};

Hrabrov.GameOver.prototype = {
	init: function(score) {
		this.score = score;
	},
	
	create: function() {
	
		this.add.sprite(0, 0, 'sky');
		
		var scoredString = 'Собрано';
		this.add.text(this.world.width/2 - 12 * scoredString.length, this.world.height/2 - 100, scoredString, { font: '32pt Arial', fill: '#000' });
		
		var scoreString = precisionRound(this.score, 2).toString();
		this.add.text(this.world.width/2 - 24 * scoreString.length, this.world.height/2 - 60, scoreString, { font: '72pt Arial', fill: '#000' });
		
		var rubString = 'рублей';
		this.add.text(this.world.width/2 - 11 * rubString.length, this.world.height/2 + 30, rubString, { font: '32pt Arial', fill: '#000' });
		
		var restartString = "Кликните или нажмите пробел чтобы начать заново";
		this.add.text(this.world.width/2 - 7 * restartString.length, this.world.height - 100, restartString, { font: '20pt Arial', fill: '#000' });
	},
	
	update: function() {
		
		this.input.onDown.addOnce(this.start, this);
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.start();
		}
		
	},
	
	start: function() {
		this.state.start('Hrabrov.Level1');
	}
};
