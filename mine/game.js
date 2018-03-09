Hrabrov.Game = levelBuilder.newLevel(game);

Hrabrov.Game.prototype = {
	
	create: function() {
	    levelBuilder.setLevel(this);
	    
	    levelBuilder.setPlayer(this.world.width/2 - 16, this.world.heigh - 64);
		
		this.add.sprite(0, 0, 'sky');

		var platforms = [{x: 0, y: this.world.height - 32}, 
		                {x: 400, y: this.world.height - 32},
		                {x: 800, y: this.world.height - 32}, 
		                {x: 350, y: 650},
		                {x: -150, y: 400},
		                {x: this.world.width - 150, y: 400},
		                {x: 300, y: 280},
		                {x: -50, y: 150},
		                {x: this.world.width - 200, y: 150}];
		
		levelBuilder.createPlatform(platforms);
		
		// ------ stars
		
		this.stars = this.add.group();
		this.stars.enableBody = true;
		
		for (var i = 0; i < 3; i++) {
			this.makeStar();
		}
		
		// ------- enemies
		
		this.enemies = this.add.group();
		this.enemies.enableBody = true;
		
		for (var i = 0; i < 3; i++) {
			this.makeEnemy();
		}
		// ------- score
		
		this.score = 0;
		this.scoreText = this.add.text(16, 16, 'Собрано: 0 рублей', { font: '16pt Arial', fill: '#000' });
		
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
		var hitPlatform = this.physics.arcade.collide(this.player, this.platforms);
		this.physics.arcade.collide(this.stars, this.platforms);
		this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
		this.physics.arcade.collide(this.player, this.enemies, this.collideEnemy, null, this);
		this.physics.arcade.collide(this.enemies, this.stars, this.collideEnemyStar, null, this);
		
		this.enemies.forEach(function(item) { item.goodDirection = false; });
		
		this.physics.arcade.collide(this.enemies, this.platforms, this.collideEnemyPlatform);
		
		this.enemies.forEach(function(item) {
		
			if (!item.goodDirection) {
				if(item.body.onFloor()) {
					item.myDirection = item.myDirection == 'left' ? 'right' : 'left';
				} else {
					item.myDirection = 'stop';
				}
			}
			
			if (item.body.onWall()) {
				item.myDirection = item.myDirection == 'left' ? 'right' : 'left';
			}
						
			if (item.myDirection == 'left') {
			
				item.body.velocity.x = -50;
		    	item.animations.play('left');
			
			} else if (item.myDirection == 'right') {
			
				item.body.velocity.x = 50;
		    	item.animations.play('right');
			
			} else {
				item.animations.stop();
		    	item.frame = 4;
			}
			
		});
		
		// ----- player controls
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
	
	collideEnemyStar: function(enemy, star) {
		
		if (this.rnd.frac() < 0.01) {
			star.kill();
			enemy.starsKilled += 1;
		}
		
	},
	
	collideEnemyPlatform: function(enemy, platform) {
		if (enemy.body.touching.down && platform.body.touching.up) {
			
			if (['left', 'right'].indexOf(enemy.myDirection) == -1) {
				enemy.myDirection = Phaser.ArrayUtils.getRandomItem(['left', 'right']);
			}
			
			if (enemy.myDirection == 'left') {
				if (platform.body.hitTest(enemy.x - 10, enemy.y + enemy.height + 10)) {
					enemy.goodDirection = true;
				}
			} else if (enemy.myDirection == 'right') {
				if (platform.body.hitTest(enemy.x + enemy.width + 10, enemy.y + enemy.height + 10)) {
					enemy.goodDirection = true;
				}
			}
			
		}
	},
	
	collideEnemy: function(player, enemy) {
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
				var star = this.makeStar(enemy.x + enemy.width/2 + rndDirection, enemy.y + enemy.height/2)
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

	collectStar: function(player, star) {
		star.kill();
		
		this.score += 10 * this.timeDelta;
		this.scoreText.text = 'Собрано: ' + precisionRound(this.score, 2) + ' рублей';
		
		this.timeLeft += this.timeDelta;
		this.timeLeftText.text = 'Осталось: ' + precisionRound(this.timeLeft, 2) + ' секунд';
		
		this.makeStar();
		
		if (this.score > this.nextEnemy * 500) {
			this.nextEnemy += 1;
			this.makeEnemy();
		}
		
		if (this.score > this.nextStar * 50 * (1 - this.timeDelta)) {
			this.timeDelta += -0.01;	
			this.nextStar += 1;
			this.makeStar();
		}
	},
	
	makeStar: function(x = false, y = false) {
		if (!x) { 
			if (this.stars.length < 10) {
				x = this.player.x + (this.rnd.frac() - 0.5) * 400;
				if (x < 0) x = 0;
				if (x > this.world.width - 16) x = this.world.width - 16;
			} else {
				x = this.rnd.frac()*(this.world.width - 16);
			}
		}		
		
		if (!y) {
			if (this.stars.length < 10) {
				y = this.player.y + (this.rnd.frac() - 0.5) * 300;
				if (y < 0) y = 0;
				if (y > this.world.height - 100) y = this.world.height - 100;
			} else {
				y = this.rnd.frac()*(this.world.height - 100); 
			}
		}
		
		var star = this.stars.create(x, y, 'star');
		star.body.gravity.y = 100;
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
		star.body.collideWorldBounds = true;
		star.body.drag.x = 10;
		
		return star;
	},
	
	makeEnemy: function(x = false, y = false) {
		if (!x) { x = Math.random()*(this.world.width - 16); }		
		if (!y) { y = Math.random()*(this.world.height - 100); }
		
		var enemy = this.enemies.create(x, y, 'fem');
		enemy.body.gravity.y = 300;
		enemy.body.collideWorldBounds = true;
		
		enemy.myDirection = Phaser.ArrayUtils.getRandomItem(['left', 'right']);
		enemy.goodDirection = true;
		enemy.starsKilled = 0;
		
		enemy.animations.add('left', [0, 1, 2, 3], 10, true);
		enemy.animations.add('right', [5, 6, 7, 8], 10, true);
	
		return enemy;
	}
	
};
