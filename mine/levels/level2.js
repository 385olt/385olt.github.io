Hrabrov.Level2 = function() {};

Hrabrov.Level2.prototype = {
    
    create: function() {
        
        this.add.sprite(0, 0, 'sky');
	    
	    this.levelBuilder = new LevelBuilder(this);
	    this.AI = new AI(this);
	    
	    this.levelBuilder.setPlayer(this.world.width/2 - 16, 100);
	    
	    let platforms = [{x: -120, y: this.world.height - 32},
	                     {x: 280, y: this.world.height - 32},
	                     {x: 680, y: this.world.height - 32}];
        
        this.levelBuilder.createPlatform(platforms);
            
    },
    
    update: function() {
        this.levelBuilder.updateCollisions();
        this.levelBuilder.updateControls();
        
        this.AI.update();
    }
    
};
