var LevelBuilder = function(level) {
    this.level = level;
    
    this.gravityConstant = 300;
    
    this.playerImage = 'dude';
    this.platformImage = 'ground';
    this.starImage = 'star';
    
    level.platforms = level.add.group();
	level.platforms.enableBody = true;
		
	level.stars = level.add.group();
	level.stars.enableBody = true;
		
	level.enemies = level.add.group();
	level.enemies.enableBody = true;
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
	
	makeStar: function(x = false, y = false) {
	    if (this.level === null) return false;
	
		if (!x) { 
			if (this.level.stars.length < 10) {
				x = this.level.player.x + (this.level.rnd.frac() - 0.5) * 400;
				if (x < 0) x = 0;
				if (x > this.level.world.width - 16) x = this.level.world.width - 16;
			} else {
				x = this.level.rnd.frac()*(this.level.world.width - 16);
			}
		}		
		
		if (!y) {
			if (this.level.stars.length < 10) {
				y = this.level.player.y + (this.level.rnd.frac() - 0.5) * 300;
				if (y < 0) y = 0;
				if (y > this.level.world.height - 100) y = this.level.world.height - 100;
			} else {
				y = this.level.rnd.frac()*(this.level.world.height - 100); 
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
		            this.level.overlapPlayerStar, null, this.level);
		            
		this.level.physics.arcade.collide(this.level.player, this.level.enemies, 
		            this.level.collidePlayerEnemy, null, this.level);
		
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
        
        this.level.add.text(this.level.world.width - 364, 40, '0', { font: '10pt Arial', fill: '#fff' });
        
        let maxTimeX = this.level.world.width - 10 - this.level.maxAchievedTime.toString().length * 6;
        let maxTimeSeconds = (this.level.maxAchievedTime / Phaser.Timer.SECOND).toFixed(2);
        this.level.maxTimeGraphics = this.level.add.text(maxTimeX, 40, maxTimeSeconds, 
                                                        { font: '10pt Arial', fill: '#fff' });
	    
	    if (this.level.countDown == undefined) {
	        this.level.countDown = this.level.time.create(false);
	    } else {
	        this.level.countDown.removeAll();
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
        console.log(this.level.countDown.duration);
        let foreground = this.level.add.graphics(0, 0);
        foreground.beginFill(0x0000ff);
        foreground.fillAlpha = 0.7;
        foreground.drawRect(2, 2, 350 * (this.level.countDown.duration / this.level.maxAchievedTime), 26);
        foreground.endFill();
        
        this.level.timeGraphics.removeChildAt(1);
        this.level.timeGraphics.addChild(foreground);
    }
    
};
