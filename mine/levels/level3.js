Hrabrov.Level3 = function() {
    this.donationGoal = 5000;
    this.initScore = 5000;
    this.initTime = 300 * Phaser.Timer.SECOND;
    
    this.lastShot = 0;
    this.shootInterval = 50;
    this.timeDelta = 0;
	this.scoreDelta = 0;
	this.ratioDelta = 0;
};

Hrabrov.Level3.prototype = {
    
    create: function() {
        
        this.add.sprite(0, 0, 'sky');
	    
	    this.levelBuilder = new LevelBuilder(this);
	    
	    this.AI = new AI(this);
	    this.AI.walkRandomness = 0.01;
	    this.AI.enemySpawnRegion.y1 = 0;
	    this.AI.starSaveChance = 0;
	    this.AI.bulletSaveChance = 0;
	    
	    this.levelBuilder.setPlayer(this.world.width/2 - 16, 32);
	    
	    this.setSakramar(64, this.world.height - 120);
	    
	    let platforms = [{x: -120, y: this.world.height - 16},
	                     {x: 280, y: this.world.height - 16},
	                     {x: 680, y: this.world.height - 16}];
        
        this.levelBuilder.createPlatform(platforms);
        
        for (let i = 0; i < 5; i++) {
            this.AI.makeEnemy();
        }
        
        this.levelBuilder.setUI();
        
        this.nextStar = 1;
		this.nextEnemy = 1;
		
		this.ratio = 1;
    },
    
    update: function() {
        this.updateSakramar();                
        
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
    
    render: function() {
        this.AI.render();
        
        this.levelBuilder.updateTime();
    },
    
    setSakramar: function(x, y) {        
        var sakramar = this.add.sprite(x, y, 'sakramar');

		this.physics.arcade.enable(sakramar);

		sakramar.body.gravity.y = 300;
		sakramar.body.collideWorldBounds = true;

		sakramar.animations.add('left', [0, 1, 2, 3], 10, true);
		sakramar.animations.add('right', [5, 6, 7, 8], 10, true);
		
		sakramar.myDirection = 'left';
		
		let gun = this.add.sprite(64, sakramar.height/2, 'sakramar_gun');
		gun.kill();
		
		sakramar.addChild(gun);
		
		this.sakramar = sakramar;    
    },
    
    shoot: function(directions) {  
        this.levelBuilder.shoot(directions);
        
        this.stopSakramar();
    },
    
    stopSakramar: function() {
        this.sakramar.myDirection = 'stop';
        this.sakramar.children[0].revive();
    }
    
};
