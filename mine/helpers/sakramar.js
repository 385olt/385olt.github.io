var Sakramar = function(level, x, y) {
    this.level = level;
    
    this.gun_distance = 32;
    
    var sprite = this.level.add.sprite(x, y, 'sakramar');
    
	this.level.physics.arcade.enable(sprite);
    
	sprite.body.gravity.y = 300;
	sprite.body.collideWorldBounds = true;
    
	sprite.animations.add('left', [0, 1, 2, 3], 10, true);
	sprite.animations.add('right', [5, 6, 7, 8], 10, true);
	
	let gun = this.level.add.sprite(this.gun_distance, sprite.height/2, 'sakramar_gun');
	gun.kill();
	
	sprite.addChild(gun);
	
	this.direction = 'left';
	this.sprite = sprite;
	this.aimLine = new Phaser.Line(0, 0, 0, 0);
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
        
        let myDr = dir2int[this.direction];
        
        this.sprite.body.velocity.x = myDr * 300;
        
        if (myDr == 0) {
            this.updateGun();
            this.sprite.animations.stop();
		    this.sprite.frame = 4;
        } else {
            this.sprite.animations.play(this.direction);
        }
        
        if (this.level.rnd.frac() < 0.005 && this.level.enemies.countLiving() < 20) {
            this.level.AI.makeEnemy(this.sprite.x, this.sprite.y + this.sprite.height + 32);
        }
    },
    
    updateGun: function() {
        var gun = this.sprite.children[0];
        
        target_x = this.level.player.x + this.level.player.width/2;
        target_y = this.level.player.y + this.level.player.height/2;
        
        this.aimLine.start.set(this.sprite.x + this.sprite.width/2, 
                               this.sprite.y + this.sprite.height/2);
        this.aimLine.end.set(target_x, target_y);
        
        gun.x = this.sprite.width/2 + (Math.cos(this.aimLine.angle) * this.gun_distance);
        gun.y = this.sprite.height/2 + (Math.sin(this.aimLine.angle) * this.gun_distance);
        gun.rotation = this.aimLine.angle;
        
        if (Math.abs(gun.rotation) > Math.PI && gun.scale.y > 0) {
            gun.scale.y = -1;
        } else {
            gun.scale.y = 1;
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
