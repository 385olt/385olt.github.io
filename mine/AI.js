var AI = function(level, difficulty = 'patrol') {
    let DIFFICULTIES = ['patrol', 'walk'];
    
    this.level = level;    
    this.difficulty = Math.max(DIFFICULTIES.indexOf(difficulty), 0);
    
    if (this.difficulty == 1) {
        this.level.platforms.forEach(function(item) {
            item.myAiLines = {};
            
            item.myAiLines.left = new Phaser.Line(item.x, 
                                                  item.y, 
                                                  item.x + 64, 
                                                  item.y);
                                                      
            item.myAiLines.right = new Phaser.Line(item.x + item.width - 64, 
                                                   item.y, 
                                                   item.x + item.width, 
                                                   item.y);
        }, this);
        
        this.level.enemies.forEach(function(enemy) {
            this.addLinesToEnemy(enemy)        
        });
    }
};

AI.prototype = {
    
    update: function() {
        if (this.level === null) return false;
        
        this.level.enemies.forEach(function(item) { item.goodDirection = false; });
		
		this.level.physics.arcade.collide(this.level.enemies, this.level.platforms, 
		            this.collideEnemyPlatform);
		            
		this.level.physics.arcade.collide(this.level.enemies, this.level.stars, 
		            this.collideEnemyStar, null, this.level);
		
		this.level.enemies.forEach(function(item) {
		
			if (!item.goodDirection) {
				if(item.body.onFloor()) {
					item.myDirection = item.myDirection == 'left' ? 'right' : 'left';
				} else {
					item.myDirection = 'stop';
				}
			}
			
			if (item.body.onWall()) {
				item.myDirection = item.myDirection == 'left' ? 'right' : 'left';
			}
						
			if (item.myDirection == 'left') {
			
				item.body.velocity.x = -50;
		    	item.animations.play('left');
			
			} else if (item.myDirection == 'right') {
			
				item.body.velocity.x = 50;
		    	item.animations.play('right');
			
			} else {
				item.animations.stop();
		    	item.frame = 4;
			}
			
		});
		
		// dificulty 1
		if (this.difficulty == 1) {
		    this.level.enemies.forEach(function(enemy) {
		        if (enemy.myAiLines === undefined) {
		            this.addLinesToEnemy(enemy)
		        } else {		        
		            enemy.myAiLines.right.setTo(enemy.x + enemy.width/2, 
                                               enemy.y + enemy.height/2,
                                               enemy.x + enemy.width/2 + 200,
                                               enemy.y + enemy.height/2 - 128);
                    enemy.myAiLines.left.setTo(enemy.x + enemy.width/2, 
                                               enemy.y + enemy.height/2,
                                               enemy.x + enemy.width/2 - 200,
                                               enemy.y + enemy.height/2 - 128);
                }
                
                this.level.platforms.forEach(function(platform) {
                    var p = enemy.myAiLines.right.intersects(platform.myAiLines.left);
                    if (p !== null) {
                        enemy.body.velocity.y = -300;
                        enemy.body.velocity.x = 150;
                    }
                    
                    p = enemy.myAiLines.left.intersects(platform.myAiLines.right);
                    if (p !== null) {
                        enemy.body.velocity.y = -300;
                        enemy.body.velocity.x = -150;
                    }
                });
		    });
        }
    },
	
	collideEnemyPlatform: function(enemy, platform) {
		if (enemy.body.touching.down && platform.body.touching.up) {
			
			if (['left', 'right'].indexOf(enemy.myDirection) == -1) {
				enemy.myDirection = Phaser.ArrayUtils.getRandomItem(['left', 'right']);
			}
			
			if (enemy.myDirection == 'left') {
				if (platform.body.hitTest(enemy.x - 10, enemy.y + enemy.height + 10)) {
					enemy.goodDirection = true;
				}
			} else if (enemy.myDirection == 'right') {
				if (platform.body.hitTest(enemy.x + enemy.width + 10, enemy.y + enemy.height + 10)) {
					enemy.goodDirection = true;
				}
			}
			
		}
	},
	
	collideEnemyStar: function(enemy, star) {
		
		if (this.rnd.frac() < 0.01) {
			star.kill();
			enemy.starsKilled += 1;
		}
		
	},
	
	addLinesToEnemy: function(enemy) {
	    enemy.myAiLines = {};
        
        enemy.myAiLines.right = new Phaser.Line(enemy.x + enemy.width/2, 
                                                enemy.y + enemy.height/2,
                                                enemy.x + enemy.width/2 + 200,
                                                enemy.y + enemy.height/2 - 128);
        enemy.myAiLines.left = new Phaser.Line(enemy.x + enemy.width/2, 
                                               enemy.y + enemy.height/2,
                                               enemy.x + enemy.width/2 - 200,
                                               enemy.y + enemy.height/2 - 128); 
	}
    
};
