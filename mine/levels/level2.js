Hrabrov.Level2 = function() {
    this.donationGoal = 5000;
    this.initScore = 1000;
    this.initTime = 30 * Phaser.Timer.SECOND;
    
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
	    this.levelBuilder.starSpawnRegion.y1 = 150;
	    
	    this.AI = new AI(this);
	    this.AI.walkRandomness = 0.01;
	    this.AI.enemySpawnRegion.y1 = 150;
	    this.AI.starSaveChance = 0.5;
	    
	    this.levelBuilder.setPlayer(this.world.width/2 - 16, 150);
	    
	    this.sakramar = new Sakramar(this, 0, 0);
	    this.sakramar.shootChance = 0;
	    
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
                
        for (var i = 0; i < 3; i++) {
            this.levelBuilder.makeStar();
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
