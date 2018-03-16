var Sakramar = function(level, x, y) {
    this.level = level;    
    
    var sprite = this.level.add.sprite(x, y, 'sakramar');
    
	this.level.physics.arcade.enable(sprite);
    
	sprite.body.gravity.y = 300;
	sprite.body.collideWorldBounds = true;
    
	sprite.animations.add('left', [0, 1, 2, 3], 10, true);
	sprite.animations.add('right', [5, 6, 7, 8], 10, true);
	
	let gun = this.level.add.sprite(64, sprite.height/2, 'sakramar_gun');
	gun.kill();
	
	sprite.addChild(gun);
	
	this.direction = 'left';
	this.sprite = sprite; 
};

Sakramar.prototype = {
    
    update: function() {
        this.level.physics.arcade.collide(this.sprite, this.level.platforms);
        
        if (this.sprite.x < 32) {
            this.direction = 'right';
        } else if (this.sprite.x + this.sprite.width > this.level.world.width - 32) {
            this.direction = 'left';
        }
        
        let dir2int = {'left': -1, 'right': 1, 'stop': 0};
        
        let myDr = dir2int[sakramar.myDirection];
        
        sakramar.body.velocity.x = myDr * 300;
        
        if (myDr == 0) {
            sakramar.animations.stop();
		    sakramar.frame = 4;
        } else {
            sakramar.animations.play(sakramar.myDirection);
        }
        
        if (this.rnd.frac() < 0.005 && this.enemies.countLiving() < 20) {
            this.AI.makeEnemy(this.sakramar.x, this.sakramar.y + this.sakramar.height + 32);
        }
    },
    
    stop: function() {
        this.direction = 'stop';
        this.sprite.children[0].revive();
    },
    
    run: function() {
        this.direction = Phaser.ArrayUtils.getRandomItem(['left', 'right']);
        this.sprite.children[0].kill();
    }
    
};
