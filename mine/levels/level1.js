Hrabrov.Level1 = function() {
    this.donationGoal = 1000;
    this.initScore = 0;
    this.initTime = 10 * Phaser.Timer.SECOND;
    
    this.timeDelta = 1;
	this.scoreDelta = 1;
	this.ratioDelta = 0.01;
};

Hrabrov.Level1.prototype = {
	
	create: function() {
	    this.add.sprite(0, 0, 'sky');
	    
	    this.levelBuilder = new LevelBuilder(this);
	    
	    this.AI = new AI(this);
	    
	    this.levelBuilder.setPlayer(this.world.width/2 - 16, 100);

		var platforms = [{x: -120, y: this.world.height - 32}, 
		                {x: 280, y: this.world.height - 32},
		                {x: 680, y: this.world.height - 32}, 
		                {x: 350, y: 650},
		                {x: -150, y: 400},
		                {x: this.world.width - 150, y: 400},
		                {x: 300, y: 280},
		                {x: -50, y: 150},
		                {x: this.world.width - 200, y: 150}];
		
		this.levelBuilder.createPlatform(platforms);
		
		for (var i = 0; i < 3; i++) this.levelBuilder.makeStar();
		
		for (var i = 0; i < 3; i++) this.AI.makeEnemy();
		
		this.levelBuilder.setUI();
		
		this.nextStar = 1;
		this.nextEnemy = 1;
		this.ratio = 1;	
	},
	
	update: function() {
		this.levelBuilder.updateCollisions();
		this.levelBuilder.updateControls();
		
		this.AI.update();
	},
	
	render: function() {
	    this.levelBuilder.updateTime();
	}
	
};
