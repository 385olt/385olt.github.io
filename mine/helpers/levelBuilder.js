var LevelBuilder = function(level) {
    this.level = level;
    
    this.gravityConstant = 300;
    
    this.starSpawnRegion = {x1: 0, x2: level.world.width, 
                            y1: 0, y2: level.world.height - 64};
    
    this.playerImage = 'dude';
    this.platformImage = 'ground';
    this.starImage = 'star';
    
    level.platforms = level.add.group();
	level.platforms.enableBody = true;
		
	level.stars = level.add.group();
	level.stars.enableBody = true;
		
	level.enemies = level.add.group();
	level.enemies.enableBody = true;
	
	level.bullets = level.add.group();
    level.bullets.enableBody = true;
};

LevelBuilder.prototype = {
    
    // props: {x: NUMBER, y: NUMBER} or [{x: NUMBER, y: NUMBER}, ...]
    createPlatform: function(props) {
        if (this.level === null) return false;
        
        if (props instanceof Array) {
            this.temp = [];
            
            props.forEach(function(item) {
                var platform = this.level.platforms.create(item.x, item.y, this.platformImage);
		        platform.body.immovable = true;
		        
		        this.temp.push(platform);
            }, this); 
            
            var res = this.temp;
            this.temp = null;
        } else {
            var res = this.level.platforms.create(props.x, props.y, this.platformImage);
		    res.body.immovable = true;
		}
		
		return res;        
    },
    
    setPlayer: function(x, y) {
        if (this.level === null) return false;
        
        var player = this.level.add.sprite(x, y, this.playerImage);

		this.level.physics.arcade.enable(player);

		player.body.gravity.y = this.gravityConstant;
		player.body.collideWorldBounds = true;

		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		
		player.hitPlatform = false;
		
		this.level.player = player;
    },
    
    setUI: function() {
        this.setScore(this.level.initScore);
        this.setTime(this.level.initTime);
    },
	
	makeStar: function(x = false, y = false) {
	    if (this.level === null) return false;
	    
		if (!x) {
		    x = this.starSpawnRegion.x1;  
			if (this.level.stars.length < 10) {
				x += this.level.player.x + (this.level.rnd.frac() - 0.5) * 400;
				if (x < this.starSpawnRegion.x1) x = this.starSpawnRegion.x1;
				if (x > this.starSpawnRegion.x2 - 16) x = this.starSpawnRegion.x2 - 16;
			} else {
				x += this.level.rnd.frac()*(this.starSpawnRegion.x2 - this.starSpawnRegion.x1 - 16);
			}
		}		
		
		if (!y) {
		    y = this.starSpawnRegion.y1;
			if (this.level.stars.length < 10) {
				y += this.level.player.y + (this.level.rnd.frac() - 0.5) * 300;
				if (y < this.starSpawnRegion.y1) y = this.starSpawnRegion.y1;
				if (y > this.starSpawnRegion.y2 - 16) y = this.starSpawnRegion.y2 - 16;
			} else {
				y += this.level.rnd.frac()*(this.starSpawnRegion.y2 - this.starSpawnRegion.y1 - 16); 
			}
		}
		
		var star = this.level.stars.create(x, y, this.starImage);
		star.body.gravity.y = 100;
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
		star.body.collideWorldBounds = true;
		star.body.drag.x = 10;
		
		return star;
	},
	
	updateCollisions: function() {
	    if (this.level === null) return false;
	    
	    this.level.player.hitPlatform = this.level.physics.arcade.collide(
	                this.level.player, this.level.platforms);
	                
		this.level.physics.arcade.collide(this.level.stars, this.level.platforms);
		
		this.level.physics.arcade.overlap(this.level.player, this.level.stars, 
		            this.overlapPlayerStar, null, this);
        
        this.level.physics.arcade.collide(this.level.bullets, this.level.platforms, 
                    this.collideBulletPlatform, null, this);
		
	},
	
	updateControls: function() {		
		var cursors = this.level.input.keyboard.createCursorKeys();
		var player = this.level.player;
		
		player.body.velocity.x = 0;

		if (cursors.left.isDown) {		
		    player.body.velocity.x = -150;
		    player.animations.play('left');		    
		} else if (cursors.right.isDown) {		
		    player.body.velocity.x = 150;
		    player.animations.play('right');		    
		} else {		
		    player.animations.stop();
		    player.frame = 4;		    
		}

		if (cursors.up.isDown && player.body.touching.down && player.hitPlatform) {
		    player.body.velocity.y = -300;
		}
		
		if (this.level.shoot != undefined) {
		    this.updateShootControls();
		}
	},
	
	updateShootControls: function() {
	    var directions = [];
	    
	    if (this.level.input.keyboard.isDown(Phaser.Keyboard.W)) {
	        directions.push('up');
	    }
	    	    
	    if (this.level.input.keyboard.isDown(Phaser.Keyboard.A)) {
	        directions.push('left');
	    }
	    	    
	    if (this.level.input.keyboard.isDown(Phaser.Keyboard.S)) {
	        directions.push('down');
	    }
	    	    
	    if (this.level.input.keyboard.isDown(Phaser.Keyboard.D)) {
	        directions.push('right');
	    }
	    
	    if (directions.indexOf('left') >= 0 && directions.indexOf('right') >= 0) {
	        directions = directions.splice(directions.indexOf('left'), 1);
	        directions = directions.splice(directions.indexOf('right'), 1);
	    }
	    
	    if (directions.indexOf('up') >= 0 && directions.indexOf('down') >= 0) {
	        directions = directions.splice(directions.indexOf('up'), 1);
	        directions = directions.splice(directions.indexOf('down'), 1);
	    }
	    
	    if (directions.length > 0) {
	        this.level.shoot(directions);	    
	    }
	},
	
	setScore: function(initScore) {	    
	    this.level.scoreGraphics = this.level.add.graphics(10, 10);
		
		let background = this.level.add.graphics(0, 0);		
        background.beginFill(0x000000);
        background.fillAlpha = 0.7;
        background.drawRect(0, 0, 354, 30);
        background.endFill();
        this.level.scoreGraphics.addChild(background);
        
        let foreground = this.level.add.graphics(0, 0);
        foreground.beginFill(0xff0000);
        foreground.fillAlpha = 0.7;
        foreground.drawRect(2, 2, 350 * (initScore / this.level.donationGoal), 26);
        foreground.endFill();
        this.level.scoreGraphics.addChild(foreground);
        
        this.level.add.text(10, 40, '0', { font: '10pt Arial', fill: '#fff' });
        this.level.add.text(350 - this.level.donationGoal.toString().length * 4, 40, this.level.donationGoal, 
                        { font: '10pt Arial', fill: '#fff' });
	    
	    this.level.score = initScore;
		this.level.scoreText = this.level.add.text(0, 16, initScore + ' рублей', { font: '12pt Arial', fill: '#fff' });
	    this.level.scoreText.x = 200 - this.level.scoreText.text.length * 5;
	},
	
	addScore: function(deltaScore) {	    
	    this.level.score += deltaScore;
	    this.level.scoreText.text = this.level.score.toFixed(2) + ' рублей';
	    this.level.scoreText.x = 200 - this.level.scoreText.text.length * 5;
	    
	    let foreground = this.level.add.graphics(0, 0);
        foreground.beginFill(0xff0000);
        foreground.fillAlpha = 0.7;
        foreground.drawRect(2, 2, 350 * (this.level.score / this.level.donationGoal), 26);
        foreground.endFill();
        
        this.level.scoreGraphics.removeChildAt(1);
        this.level.scoreGraphics.addChild(foreground);
	},
	
	setTime: function(initTime) {
	    this.level.timeGraphics = this.level.add.graphics(this.level.world.width - 364, 10);
		
		let background = this.level.add.graphics(0, 0);		
        background.beginFill(0x000000);
        background.fillAlpha = 0.7;
        background.drawRect(0, 0, 354, 30);
        background.endFill();
        this.level.timeGraphics.addChild(background);
        
        let foreground = this.level.add.graphics(0, 0);
        foreground.beginFill(0x0000ff);
        foreground.fillAlpha = 0.7;
        foreground.drawRect(2, 2, 350, 26);
        foreground.endFill();
        this.level.timeGraphics.addChild(foreground);
        
        this.level.maxAchievedTime = initTime;
        
        this.level.add.text(this.level.world.width - 364, 40, '0', { font: '10pt Arial', fill: '#fff' });
        
        let maxTimeX = this.level.world.width - 10 - this.level.maxAchievedTime.toString().length * 6;
        let maxTimeSeconds = (this.level.maxAchievedTime / Phaser.Timer.SECOND).toFixed(2);
        this.level.maxTimeGraphics = this.level.add.text(maxTimeX, 40, maxTimeSeconds, 
                                                        { font: '10pt Arial', fill: '#fff' });
        
        let timeText = (initTime / Phaser.Timer.SECOND).toFixed(2) + ' секунд';
        this.level.timeText = this.level.add.text(0, 16, timeText, { font: '12pt Arial', fill: '#fff' });
	    this.level.timeText.x = this.level.world.width - 170 - this.level.timeText.text.length * 5;
	    
	    if (this.level.countDown == undefined) {
	        this.level.countDown = this.level.time.create(true);
	    } else {
	        this.level.countDown.destroy();
	        this.level.countDown = this.level.time.create(true);
	    }
	    
        this.level.countDown.add(initTime, this.endCountDown, this);
        this.level.countDown.start();
	},
	
	addTime: function(deltaTime) {
	    var duration = this.level.countDown.duration;
        this.level.countDown.removeAll();
        this.level.countDown.add(duration + (Phaser.Timer.SECOND * deltaTime), 
                                this.endCountDown, this);
        
        if (this.level.countDown.duration > this.level.maxAchievedTime) {
            this.level.maxAchievedTime = this.level.countDown.duration;
            this.level.maxTimeGraphics.text = (this.level.maxAchievedTime / Phaser.Timer.SECOND).toFixed(2);
        }
        
        this.updateTime();	
	},
	
	endCountDown: function() {
        this.level.state.start('Hrabrov.GameOver', true, false, this.level.score);
    },
    
    updateTime: function() {
        let foreground = this.level.add.graphics(0, 0);
        foreground.beginFill(0x0000ff);
        foreground.fillAlpha = 0.7;
        foreground.drawRect(2, 2, 350 * (this.level.countDown.duration / this.level.maxAchievedTime), 26);
        foreground.endFill();
        
        this.level.timeGraphics.removeChildAt(1);
        this.level.timeGraphics.addChild(foreground);
        
        this.level.timeText.text = (this.level.countDown.duration / Phaser.Timer.SECOND).toFixed(2) + ' секунд';
	    this.level.timeText.x = this.level.world.width - 170 - this.level.timeText.text.length * 5;
    },

	overlapPlayerStar: function(player, star) {
		star.kill();
		
		this.addTime(this.level.timeDelta * this.level.ratio);
	    		
		this.addScore(10 * this.level.scoreDelta * this.level.ratio);
		
		this.makeStar();
		
		if (this.level.score > this.level.nextEnemy * 500) {
			this.level.nextEnemy += 1;
			this.level.AI.makeEnemy();
		}
		
		if (this.level.score > this.level.nextStar * 50 * (1 - this.level.ratio)) {
			this.level.ratio -= this.level.ratioDelta;	
			this.level.nextStar += 1;
			this.makeStar();
		}
	},
    
    collideBulletPlatform: function(bullet, platform) {
        bullet.kill();
    },
    
    shoot: function(directions) {  
        if (this.level.score <= 0) return;
        if (this.level.time.now - this.level.lastShot < this.level.shootInterval) return;
        
        this.addScore(-1);
        this.level.lastShot = this.level.time.now;
        
        let offsets = {
                'up': {x: 0, y: -16},
                'left': {x: -16, y: 0},
                'down': {x: 0, y: 16},
                'right': {x: 16, y: 0}
            };
        
        let offset = {x: 0, y: 0};
        for (let i = 0; i < directions.length; i++) {
            offset.x += offsets[directions[i]].x;
            offset.y += offsets[directions[i]].y;
        }
        
        let bullet = this.level.bullets.create(this.level.player.x + this.level.player.width/2 + offset.x, 
		                                       this.level.player.y + this.level.player.height/2 + offset.y, 
		                                       'star');
		bullet.scale.setTo(.5, .5);
		bullet.lifespan = 6000;
	
		bullet.body.velocity.x = 60 * offset.x;
		bullet.body.velocity.y = 60 * offset.y;
    }
    
};
