Hrabrov.Level2 = function() {
    this.bulletDamage = 0.1;
    this.donationGoal = 5000;
    this.maxAchievedTime = 60 * Phaser.Timer.SECOND;
    this.lastShot = 0;
    this.shootInterval = 50;
    this.timeDelta = 1;
	this.scoreDelta = 2;
	this.ratioDelta = 0.005;
};

Hrabrov.Level2.prototype = {
    
    create: function() {
        
        this.add.sprite(0, 0, 'sky');
	    
	    this.levelBuilder = new LevelBuilder(this);
	    this.AI = new AI(this, 0.01);
	    
	    this.levelBuilder.setPlayer(this.world.width/2 - 16, 150);
	    
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
        
        this.levelBuilder.starSpawnRegion.y1 = 150;        
        for (var i = 0; i < 3; i++) {
            this.levelBuilder.makeStar(false, 120 + this.rnd.frac() * (this.world.height - 200));
        }
        
        this.levelBuilder.setScore(1000);
		
		this.levelBuilder.setTime(this.maxAchievedTime);
        
        this.nextStar = 1;
		this.nextEnemy = 1;
		
		this.ratio = 1;
    },
    
    update: function() {
        this.updateSakramar();
        
        this.physics.arcade.collide(this.enemies, this.bullets, this.collideEnemyBullet, null, this);
        this.physics.arcade.collide(this.bullets, this.platforms, this.collideBulletPlatform, null, this);
                
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
        
        if (this.rnd.frac() < 0.005 && this.enemies.countLiving() < 20) {
            this.AI.makeEnemy(this.sakramar.x, this.sakramar.y + this.sakramar.height + 32);
        }
    },
    
    render: function() {
        this.AI.render();
        
        this.levelBuilder.updateTime();
    },
    
    collideEnemyBullet: function(enemy, bullet) {
        bullet.kill();
        enemy.damage(this.bulletDamage * (0.5 + this.rnd.frac()));
        if (this.rnd.frac() < 0.2) {
            enemy.starsKilled += 1;
        }
    },
    
    collidePlayerEnemy: function(player, enemy) {
        this.state.start('Hrabrov.GameOver', 0)
    },
    
    collideBulletPlatform: function(bullet, platform) {
        bullet.kill();
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
    
    shoot: function(directions) {  
        if (this.score <= 0) return;
        if (this.time.now - this.lastShot < this.shootInterval) return;
        
        this.levelBuilder.addScore(-1);
        this.lastShot = this.time.now;
        
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
        
        let bullet = this.bullets.create(this.player.x + this.player.width/2 + offset.x, 
		                                 this.player.y + this.player.height/2 + offset.y, 
		                                 'star');
		bullet.scale.setTo(.5, .5);
		bullet.lifespan = 6000;
	
		bullet.body.velocity.x = 60 * offset.x;
		bullet.body.velocity.y = 60 * offset.y;
    }
    
};
