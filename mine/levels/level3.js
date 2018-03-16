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
	    
	    this.sakramar = new Sakramar(this, 64, this.world.height - 120);
	    this.sakramar.spawnChance = 0;
	    
	    let platforms = [{x: -120, y: this.world.height - 16},
	                     {x: 280, y: this.world.height - 16},
	                     {x: 680, y: this.world.height - 16},
	                     {x: this.world.width/2 - 200, y: 100}];
        
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
        this.sakramar.update();                
        
        this.levelBuilder.updateCollisions();
        this.levelBuilder.updateControls();
        
        this.AI.update();
    },
    
    render: function() {
        this.AI.render();
        
        this.levelBuilder.updateTime();
    },
    
    shoot: function(directions) {  
        this.levelBuilder.shoot(directions);
    }
    
};
