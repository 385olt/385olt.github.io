AbstrLevel = {
    
    init: function() {   
        this.gravityConstant = 300;
    
        this.playerImage = 'dude';
        this.platformImage = 'ground';
        
        this.platforms = game.add.group();
		this.platforms.enableBody = true;
    },
    
    setPlayer: function(x, y) {
        //if (this.level === null) return false;
        
        var player = this.add.sprite(x, y, this.playerImage);

		this.physics.arcade.enable(player);

		player.body.gravity.y = this.gravityConstant;
		player.body.collideWorldBounds = true;

		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		
		this.player = player;
    },
    
    // props: {x: NUMBER, y: NUMBER} or [{x: NUMBER, y: NUMBER}, ...]
    createPlatform: function(props) {
        //if (this.level === null) return false;
        
        if (props instanceof Array) {
            this.temp = [];
            
            props.forEach(function(item) {
                var platform = this.platforms.create(item.x, item.y, this.platformImage);
		        platform.body.immovable = true;
		        
		        this.temp.push(platform);
            }, this); 
            
            var res = this.temp;
            this.temp = null;
        } else {
            var res = this.level.platforms.create.call(this.level, props.x, props.y, this.platformImage);
		    res.body.immovable = true;
		}
		
		return res;        
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
