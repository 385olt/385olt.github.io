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
		
		this.maxAchievedTime = 10 * Phaser.Timer.SECOND;
		
		this.levelBuilder.setScore(0);
		
		this.levelBuilder.setTime(10 * Phaser.Timer.SECOND);
		
		this.nextStar = 1;
		this.nextEnemy = 1;
		
		this.timeDelta = 1;		
	},
	
	update: function() {
		this.levelBuilder.updateCollisions();
		this.levelBuilder.updateControls();
		
		this.AI.update();
	},
	
	render: function() {
	    this.levelBuilder.updateTime();
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

	overlapPlayerStar: function(player, star) {
		star.kill();
		
		this.levelBuilder.addTime(this.timeDelta);
	    		
		this.levelBuilder.addScore(10 * this.timeDelta);
		
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
