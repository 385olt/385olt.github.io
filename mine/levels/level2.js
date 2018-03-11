Hrabrov.Level2 = function() {};

Hrabrov.Level2.prototype = {
    
    create: function() {
        
        this.add.sprite(0, 0, 'sky');
	    
	    this.levelBuilder = new LevelBuilder(this);
	    this.AI = new AI(this);
	    
	    this.bullets = this.add.group();
	    this.bullets.enableBody = true;
	    
	    this.levelBuilder.setPlayer(this.world.width/2 - 16, 100);
	    
	    this.setSakramar(0, 0);
	    
	    let platforms = [{x: -120, y: this.world.height - 16},
	                     {x: 280, y: this.world.height - 16},
	                     {x: 680, y: this.world.height - 16},
	                     {x: -120, y: 116},
	                     {x: 280, y: 116},
	                     {x: 680, y: 116},
	                     {x: 0, y: 416},
	                     {x: 560, y: 416},
	                     {x: 280, y: 316},
	                     {x: -200, y: 216},
	                     {x: 760, y: 216}];
        
        this.levelBuilder.createPlatform(platforms);
        
        for (let i = 0; i < 5; i++) {
            this.AI.makeEnemy(false, 120 + this.rnd.frac() * (this.world.height - 200));
        }
        
        this.shotLeft = false;
        this.shotRight = false;
        this.shotUp = false;
        this.shotDown = false;
    },
    
    update: function() {
        this.updateSakramar();
        
        if (this.rnd.frac() < 0.005) this.spawnEnemy();
        
        this.physics.arcade.collide(this.enemies, this.bullets, this.collideEnemyBullet);
        
        this.shootControls();
        
        // ----- std updates
        this.levelBuilder.updateCollisions();
        this.levelBuilder.updateControls();
        
        this.AI.update();
    },
    
    updateSakramar: function() {
        var sakramar = this.sakramar;
        this.physics.arcade.collide(sakramar, this.platforms);
        
        if (sakramar.x < 32) {
            sakramar.myDirection = 'right';
        } else if (sakramar.x + sakramar.width > this.world.width - 32) {
            sakramar.myDirection = 'left';
        }
        
        var myDr = (sakramar.myDirection == 'right' ? 1 : -1);
        sakramar.body.velocity.x = myDr * 300;
        sakramar.animations.play(myDr == 1 ? 'right' : 'left');
    },
    
    collideEnemyBullet: function(enemy, bullet) {
        bullet.kill();
    },
    
    collidePlayerEnemy: function(player, enemy) {
        this.state.start('Hrabrov.GameOver', 0)
    },
    
    setSakramar: function(x, y) {        
        var sakramar = this.add.sprite(x, y, 'sakramar');

		this.physics.arcade.enable(sakramar);

		sakramar.body.gravity.y = 300;
		sakramar.body.collideWorldBounds = true;

		sakramar.animations.add('left', [0, 1, 2, 3], 10, true);
		sakramar.animations.add('right', [5, 6, 7, 8], 10, true);
		
		sakramar.myDirection = 'left';
				
		this.sakramar = sakramar;    
    },
    
    spawnEnemy: function() {
        if (this.enemies.length > 20) return false;
        
        x = this.sakramar.x;
        y = this.sakramar.y + this.sakramar.height + 32;
        this.AI.makeEnemy(x, y);
    },
    
    shoot: function(direction) {
        switch (direction) {
            case 'left':  offsets = {x: -32, y: 0}; break;
            case 'right': offsets = {x: 32, y: 0};  break;
            case 'up':    offsets = {x: 0, y: -32}; break;
            case 'down':  offsets = {x: 0, y: 32};  break
        }
        
        console.log(direction);
        
        let bullet = this.bullets.create(this.player.x + this.player.width/2 + offsets.x, 
		                                 this.player.y + this.player.height/2 + offsets.y, 
		                                 'star');
		bullet.scale.setTo(.5, .5);
	
		bullet.body.velocity.x = 10 * offsets.x;
		bullet.body.velocity.y = 10 * offsets.y;
    },
    
    shootControls: function() {
        if (this.input.keyboard.isDown(Phaser.Keyboard.W)) {
            if (!this.shotUp) {
		        this.shoot('up');
		        this.shotUp = true;
		    }
		} else this.shotUp = false;
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.A)) {
            if (!this.shotLeft) {
		        this.shoot('left');
		        this.shotLeft = true;
		    }
		} else this.shotLeft = false;
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.S)) {
            if (!this.shotDown) {
		        this.shoot('down');
		        this.shotDown = true;
		    }
		} else this.shotDown = false;
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.D)) {
            if (!this.shotRight) {
		        this.shoot('right');
		        this.shotRight = true;
		    }
		} else this.shotRight = false;
    }
    
};
