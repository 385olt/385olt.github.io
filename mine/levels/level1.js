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
		
		this.createScore(0);
		
		// ------- timer		
		this.nextStar = 1;
		this.nextEnemy = 1;
		
		this.timeDelta = 1;
		
		this.timer = this.time.create(false);
		this.timer.loop(100, this.updateCounter, this);
		this.timer.start();
		this.timeLeft = 10;
		this.timeLeftText = this.add.text(this.world.width - 400, 16, 'Осталось: 0 секунд', { font: '16pt Arial', fill: '#000' });
		
	},
	
	update: function() {
		this.levelBuilder.updateCollisions();
		this.levelBuilder.updateControls();
		
		this.AI.update();
	},
	
	updateCounter: function() {
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

	overlapPlayerStar: function(player, star) {
		star.kill();		
		
		this.changeScore(10 * this.timeDelta);
		
		this.timeLeft += this.timeDelta;
		this.timeLeftText.text = 'Осталось: ' + precisionRound(this.timeLeft, 2) + ' секунд';
		
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
	},
	
	createScore: function(initScore) {
	    this.graphics = this.add.graphics(10, 10);
		
		let background = this.add.graphics(0, 0);		
        background.beginFill(0x000000);
        background.fillAlpha = 0.7;
        background.drawRect(0, 0, 354, 30);
        background.endFill();
        this.graphics.addChild(background);
        
        let foreground = this.add.graphics(0, 0);
        foreground.beginFill(0xff0000);
        foreground.fillAlpha = 0.5;
        foreground.drawRect(2, 2, 1, 26);
        foreground.endFill();
        this.graphics.addChild(foreground);
        
        this.add.text(10, 45, '0', { font: '10pt Arial', fill: '#fff' });
        this.add.text(350 - this.donationGoal.toString().length * 5, 45, this.donationGoal, 
                        { font: '10pt Arial', fill: '#fff' });
	    
	    this.score = initScore;
		this.scoreText = this.add.text(0, 16, initScore + ' рублей', { font: '12pt Arial', fill: '#fff' });
	    this.scoreText.x = 200 - this.scoreText.text.length * 5;
	},
	
	changeScore: function(deltaScore) {	    
	    this.score += deltaScore;
	    this.scoreText.text = precisionRound(this.score, 2) + ' рублей';
	    this.scoreText.x = 200 - this.scoreText.text.length * 5;
	    
	    let foreground = this.add.graphics(0, 0);
        foreground.beginFill(0xff0000);
        foreground.fillAlpha = 0.7;
        foreground.drawRect(2, 2, 350 * (this.score / this.donationGoal), 26);
        foreground.endFill();
        
        this.graphics.removeChildAt(1);
        this.graphics.addChild(foreground);
	}
	
};
