LevelBuilder = function() {
    this.level = null;
    
    this.gravityConstant = 300;
    
    this.playerImage = 'dude';
    this.platformImage = 'ground';
};

LevelBuilder.prototype = {
    
    setLevel: function(level) {
        this.level = level;
    },
    
    init: function() {   
        if (this.level === null) return false;
        
        this.level.platforms = game.add.group();
		this.level.platforms.enableBody = true;
		
		
    },
    
    setPlayer: function(x, y) {
        if (this.level === null) return false;
        
        var player = this.level.add.sprite.call(this.level, x, y, this.playerImage);

		this.level.physics.arcade.enable(player);

		player.body.gravity.y = this.gravityConstant;
		player.body.collideWorldBounds = true;

		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		
		this.level.player = player;
    },
    
    // props: {x: NUMBER, y: NUMBER} or [{x: NUMBER, y: NUMBER}, ...]
    createPlatform: function(props) {
        if (this.level === null) return false;
        
        if (props instanceof Array) {
            this.temp = [];
            
            props.forEach(function(item) {
                var platform = this.call.apply(this.level, [this.level.platforms.create, [item.x, item.y, this.platformImage]]);
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
    
    call: function(func, args) {
        return func.apply(this, args);
    }
    
};

var levelBuilder = new LevelBuilder();
