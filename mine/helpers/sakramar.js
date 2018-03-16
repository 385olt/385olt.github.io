var Sakramar = function(level, x, y) {
    this.level = level;
    
    this.gunDistance = 32;
    this.bulletSpeed = 100;
    
    var sprite = this.level.add.sprite(x, y, 'sakramar');
    
	this.level.physics.arcade.enable(sprite);
    
	sprite.body.gravity.y = 300;
	sprite.body.collideWorldBounds = true;
    
	sprite.animations.add('left', [0, 1, 2, 3], 10, true);
	sprite.animations.add('right', [5, 6, 7, 8], 10, true);
	
	let gun = this.level.add.sprite(this.gunDistance, sprite.height/2, 'sakramar_gun');
	gun.kill();
	
	sprite.addChild(gun);
	
	this.direction = 'left';
	this.sprite = sprite;
	this.aimLine = new Phaser.Line(0, 0, 0, 0);
};

Sakramar.prototype = {
    
    update: function() {
        this.level.physics.arcade.collide(this.sprite, this.level.platforms);
        this.level.physics.arcade.collide(this.sprite, this.level.player, 
                                          this.collideSakramarPlayer, null, this);
        
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
        
        if (this.level.rnd.frac() < 0.01 && this.direction != 'stop') {
            this.stop();
        }
    },
    
    updateGun: function() {
        var gun = this.sprite.children[0];
        
        target_x = this.level.player.x + this.level.player.width/2;
        target_y = this.level.player.y + this.level.player.height/2;
        
        this.aimLine.start.set(this.sprite.x + this.sprite.width/2, 
                               this.sprite.y + this.sprite.height/2);
        this.aimLine.end.set(target_x, target_y);
        
        gun.x = this.sprite.width/2 + (Math.cos(this.aimLine.angle) * this.gunDistance);
        gun.y = this.sprite.height/2 + (Math.sin(this.aimLine.angle) * this.gunDistance);
        gun.rotation = this.aimLine.angle;
        
        if (Math.abs(gun.rotation) > Math.PI/2) {
            gun.scale.y = -1;
        } else {
            gun.scale.y = 1;
        }
        
        if (this.level.rnd.frac() < 0.01) {
            this.shoot();
            this.run();
        }
    },
    
    stop: function() {
        this.direction = 'stop';
        this.sprite.children[0].revive();
    },
    
    run: function() {
        this.direction = Phaser.ArrayUtils.getRandomItem(['left', 'right']);
        this.sprite.children[0].kill();
    },
    
    shoot: function() {
        let bullet_x = this.sprite.x + this.sprite.width/2 + 
                                (Math.cos(this.aimLine.angle) * (this.gunDistance + 32));
        let bullet_y = this.sprite.y + this.sprite.height/2 + 
                                (Math.sin(this.aimLine.angle) * (this.gunDistance + 32));
        let bullet = this.level.add.sprite(bullet_x, bullet_y, 'star');
        
        this.level.physics.arcade.enable(bullet);
        
        bullet.body.velocity.x = Math.cos(this.aimLine.angle) * this.bulletSpeed;
        bullet.body.velocity.y = Math.sin(this.aimLine.angle) * this.bulletSpeed;
        bullet.rotation = this.aimLine.angle;
        bullet.lifespan = 6000;
    },
    
    collideSakramarPlayer: function(sakramar, player) {
        this.level.state.start('Hrabrov.GameOver', true, false, this.level.score);
    }
    
};












