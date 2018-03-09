LevelBuilder = function() {
    this.level = null;
    
    this.gravityConstant = 300;
    
    this.playerImage = 'dude';
    this.platformImage = 'ground';
    this.starImage = 'star';
    this.enemyImage = 'fem';
};

LevelBuilder.prototype = {

    setLevel: function(level) {
        this.level = level;
    },
    
    init: function() {        
        if (this.level === null) return false;
        
        this.level.platforms = this.level.add.group();
		this.level.platforms.enableBody = true;
		
		this.level.stars = this.level.add.group();
		this.level.stars.enableBody = true;
		
		this.level.enemies = this.level.add.group();
		this.level.enemies.enableBody = true;
    },
    
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
		
		this.level.player = player;
    },
	
	makeStar: function(x = false, y = false) {
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
	
	makeEnemy: function(x = false, y = false) {
		if (!x) { x = Math.random()*(this.level.world.width - 16); }		
		if (!y) { y = Math.random()*(this.level.world.height - 100); }
		
		var enemy = this.level.enemies.create(x, y, this.enemyImage);
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

var levelBuilder = new LevelBuilder();
