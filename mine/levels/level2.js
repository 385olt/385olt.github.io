Hrabrov.Level2 = function() {};

Hrabrov.Level2.prototype = {
    
    create: function() {
        
        this.add.sprite(0, 0, 'sky');
	    
	    this.levelBuilder = new LevelBuilder(this);
	    this.AI = new AI(this);
	    
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
        
        for (let i = 0; i < 5; i++) this.levelBuilder.makeEnemy();
        
        this.lines = [];
        this.platforms.forEach(function(item) {
            var line = new Phaser.Line(item.x, item.y, 
                                       item.x + 64, item.y);
            line.platformSide = 'left';
            this.lines.push(line);
            
            line = new Phaser.Line(item.x + item.width - 64, item.y, 
                                       item.x + item.width, item.y);
            line.platformSide = 'right';
            this.lines.push(line);
        }, this);
        
        this.player.rightLine = new Phaser.Line(this.player.x + this.player.width/2, 
                                            this.player.y + this.player.height/2,
                                            this.player.x + this.player.width/2 + 200,
                                            this.player.y + this.player.height/2 - 128);
        this.player.leftLine = new Phaser.Line(this.player.x + this.player.width/2, 
                                            this.player.y + this.player.height/2,
                                            this.player.x + this.player.width/2 - 200,
                                            this.player.y + this.player.height/2 - 128);
    },
    
    update: function() {
        this.updateSakramar();
        
        this.player.rightLine.setTo(this.player.x + this.player.width/2, 
                                    this.player.y + this.player.height/2,
                                    this.player.x + this.player.width/2 + 200,
                                    this.player.y + this.player.height/2 - 128);
        this.player.leftLine.setTo(this.player.x + this.player.width/2, 
                                    this.player.y + this.player.height/2,
                                    this.player.x + this.player.width/2 - 200,
                                    this.player.y + this.player.height/2 - 128);
        
        if (this.rnd.frac() < 0.005) this.spawnEnemy();
        
        for (let i = 0; i < this.lines.length; i++) {
            let p = this.player.rightLine.intersects(this.lines[i]);
            if (p !== null && this.lines[i].platformSide == 'left') {
                console.log('RIGHT: ' + p.x + ' ' + p.y);
            }
            
            p = this.player.leftLine.intersects(this.lines[i]);
            if (p !== null && this.lines[i].platformSide == 'right') {
                console.log('LEFT: ' + p.x + ' ' + p.y);
            }
        }
        
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
        this.levelBuilder.makeEnemy(x, y);
    }
    
};
