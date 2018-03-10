Hrabrov.Level2 = function() {};

Hrabrov.Level2.prototype = {
    
    create: function() {
        
        this.add.sprite(0, 0, 'sky');
	    
	    this.levelBuilder = new LevelBuilder(this);
	    this.AI = new AI(this);
	    
	    this.levelBuilder.setPlayer(this.world.width/2 - 16, 100);
	    
	    let platforms = [{x: -120, y: this.world.height - 32},
	                     {x: 280, y: this.world.height - 32},
	                     {x: 680, y: this.world.height - 32},
	                     {x: -120, y: 100},
	                     {x: 280, y: 100},
	                     {x: 680, y: 100},
	                     {x: 0, y: 400},
	                     {x: 560, y: 400},
	                     {x: 280, y: 300},
	                     {x: -200, y: 200},
	                     {x: 760, y: 200}];
        
        this.levelBuilder.createPlatform(platforms);
            
    },
    
    update: function() {
        this.levelBuilder.updateCollisions();
        this.levelBuilder.updateControls();
        
        this.AI.update();
    }
    
};
