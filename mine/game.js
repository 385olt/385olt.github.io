
function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

Donate.Game = function() {};

Donate.Game.prototype = {
	
	create: function() {
		
		this.add.sprite(0, 0, 'sky');

		this.platforms = this.add.group();
		this.platforms.enableBody = true;

		var ground = this.platforms.create(0, this.world.height - 32, 'ground');
		ground.body.immovable = true;
		ground = this.platforms.create(400, this.world.height - 32, 'ground');
		ground.body.immovable = true;
		ground = this.platforms.create(800, this.world.height - 32, 'ground');
		ground.body.immovable = true;
		
		var ledge = this.platforms.create(350, 650, 'ground');
		ledge.body.immovable = true;
		ledge = this.platforms.create(-150, 400, 'ground');
		ledge.body.immovable = true;    
		ledge = this.platforms.create(this.world.width - 150, 400, 'ground');
		ledge.body.immovable = true;   
		ledge = this.platforms.create(300, 280, 'ground');
		ledge.body.immovable = true;
		ledge = this.platforms.create(-50, 150, 'ground');
		ledge.body.immovable = true;
		ledge = this.platforms.create(this.world.width - 200, 150, 'ground');
		ledge.body.immovable = true;
		
		// ------ player
		
		this.player = this.add.sprite(32, this.world.height - 150, 'dude');

		this.physics.arcade.enable(this.player);

		this.player.body.gravity.y = 300;
		this.player.body.collideWorldBounds = true;

		this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);
		
		// ------ stars
		
		this.stars = this.add.group();
		this.stars.enableBody = true;

		for (var i = 0; i < 1; i++)
		{
		    var star = this.stars.create(Math.random()*this.world.width, Math.random()*(this.world.height - 80), 'star');
		    star.body.gravity.y = 100;
		    star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
		
		// ------- score
		
		this.score = 0;
		this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
		
		// ------- timer
		
		this.nextStar = 1;
		
		this.timeDelta = 1;
		
		this.timer = game.time.create(false);
		this.timer.loop(100, this.updateCounter, this);
		this.timer.start();
		this.timeLeft = 10;
		this.timeLeftText = this.add.text(this.world.width - 400, 16, 'Time left: 0 seconds', { fontSize: '32px', fill: '#000' });
		
	},
	
	update: function() {
		var hitPlatform = this.physics.arcade.collide(this.player, this.platforms);
		this.physics.arcade.collide(this.stars, this.platforms);
		this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
		
		var cursors = this.input.keyboard.createCursorKeys();
		
		this.player.body.velocity.x = 0;

		if (cursors.left.isDown) {
		
		    this.player.body.velocity.x = -150;

		    this.player.animations.play('left');
		    
		} else if (cursors.right.isDown) {
		
		    this.player.body.velocity.x = 150;

		    this.player.animations.play('right');
		    
		} else {
		
		    this.player.animations.stop();

		    this.player.frame = 4;
		    
		}

		if (cursors.up.isDown && this.player.body.touching.down && hitPlatform) {
		    this.player.body.velocity.y = -300;
		}
	},

	updateCounter: function() {
		if (this.timeLeft > 0) {
			this.timeLeft += -0.1;
			
			if (this.timeLeft < 0) {
				this.timeLeft = 0;
			}
			
			this.updateTextDisplay(this.timeLeftText);
		} else {
			this.player.kill();
		}
	},

	updateTextDisplay: function() {
		this.timeLeftText.text = 'Time left: ' + precisionRound(this.timeLeft, 2) + ' seconds';
	},

	collectStar: function(star) {
		star.kill();
		
		this.score += 10 * this.timeDelta;
		this.scoreText.text = 'Score: ' + precisionRound(this.score, 2);
		
		this.timeLeft += this.timeDelta;
		this.updateTextDisplay();
		
		this.timeDelta += -0.01 * this.timeDelta;
		
		var star = this.stars.create(Math.random()*this.world.width, Math.random()*(this.world.height - 100), 'star');
		star.body.gravity.y = 100;
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
		
		if (this.score > this.nextStar * 50 * (1 - this.timeDelta)) {
			this.nextStar += 1;
			var star = this.stars.create(Math.random()*this.world.width, Math.random()*(this.world.height - 100), 'star');
			star.body.gravity.y = 100;
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
	}
	
};
