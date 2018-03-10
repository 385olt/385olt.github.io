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
	}
    
};
