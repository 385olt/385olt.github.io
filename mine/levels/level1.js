Hrabrov.Level1 = function() {
this.donationGoal = 1000;
};

Hrabrov.Level1.prototype = {
	
	create: function() {
	    this.add.sprite(0, 0, 'sky');
	    
	    this.levelBuilder = new LevelBuilder(this);
	    
	    this.AI = new AI(this);
	    
	    this.levelBuilder.setPlayer(this.world.width/2 - 16, 100);

		var platforms = [{x: -120, y: this.world.height - 32}, 
		                {x: 280, y: this.world.height - 32},
		                {x: 680, y: this.world.height - 32}, 
		                {x: 350, y: 650},
		                {x: -150, y: 400},
		                {x: this.world.width - 150, y: 400},
		                {x: 300, y: 280},
		                {x: -50, y: 150},
		                {x: this.world.width - 200, y: 150}];
		
		this.levelBuilder.createPlatform(platforms);
				
		for (var i = 0; i < 3; i++) this.levelBuilder.makeStar();
		
		for (var i = 0; i < 3; i++) this.AI.makeEnemy();
		
		this.levelBuilder.createScore(0);
		
		this.countDown = this.time.create(false);
        this.countDown.add(Phaser.Timer.SECOND * 10, this.endCountDown, this);
        this.countDown.start();
		
	},
	
	update: function() {
		this.levelBuilder.updateCollisions();
		this.levelBuilder.updateControls();
		
		this.AI.update();
	},
	
	updateCounter: function() {
	    console.log('END');
	    
		if (this.timeLeft > 0) {
			this.timeLeft += -0.1;
			
			if (this.timeLeft < 0) {
				this.timeLeft = 0;
			}
			
			this.timeLeftText.text = 'Осталось: ' + precisionRound(this.timeLeft, 2) + ' секунд';
		} else {
			this.state.start('Hrabrov.GameOver', true, false, this.score);
		}
	},
	
	collidePlayerEnemy: function(player, enemy) {
		var playerBounceX = 400;
		var playerBounceY = 300;
		var starBounceX = 200;
		var starBounceY = 300;
		
		if (player.body.touching.down && enemy.body.touching.up) {
			
			player.body.velocity.y = -playerBounceY * this.rnd.frac();
			player.body.velocity.x = playerBounceX * (this.rnd.frac() - 0.5);
			
			var starsNumber = Math.min(5, enemy.starsKilled);
			for (var i = 0; i < starsNumber; i++) {
				var rndDirection = Phaser.ArrayUtils.getRandomItem([-1, 1]) * (enemy.width/2);
				
				var star = this.levelBuilder.makeStar(enemy.x + enemy.width/2 + rndDirection, enemy.y + enemy.height/2)
				star.body.velocity.y = -starBounceY * this.rnd.frac();
				
				if (rndDirection > 0) {
					star.body.velocity.x = starBounceX * this.rnd.frac();
				} else {
					star.body.velocity.x = -starBounceX * this.rnd.frac();
				}
			}
			
			enemy.starsKilled -= starsNumber;
		} else {
			this.state.start('Hrabrov.GameOver', true, false, this.score);
		}
	},
	
	endCountDown: function() {
        console.log('Done!');
    },

	overlapPlayerStar: function(player, star) {
		star.kill();
		
		var duration = this.countDown.duration;
        this.countDown.removeAll();
        this.countDown.add(duration + (Phaser.Timer.SECOND * 5), this.endCountDown, this);
        console.log('Added 5 seconds.');
	    		
		this.levelBuilder.changeScore(10 * this.timeDelta);
		
		this.timeLeft += this.timeDelta;
		this.timeLeftText.text = 'Осталось: ' + this.timeLeft.toFixed(2) + ' секунд';
		
		this.levelBuilder.makeStar();
		
		if (this.score > this.nextEnemy * 500) {
			this.nextEnemy += 1;
			this.AI.makeEnemy();
		}
		
		if (this.score > this.nextStar * 50 * (1 - this.timeDelta)) {
			this.timeDelta += -0.01;	
			this.nextStar += 1;
			this.levelBuilder.makeStar();
		}
	}
	
};
