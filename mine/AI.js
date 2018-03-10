var AI = function(level, difficulty = 'patrol') {
    let DIFFICULTIES = ['patrol', 'walk'];
    
    this.level = level;    
    this.difficulty = Math.max(DIFFICULTIES.indexOf(difficulty), 0);
};

AI.prototype = {
    
    update: function() {
        if (this.level === null) return false;
        
        this.level.enemies.forEach(function(item) { 
            item.goodDirection = false; 
            item.hitPlatform = false; 
        });
		
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
		        if (!enemy.hitPlatform) return;
		        
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
                    if (platform.myAiLines === undefined) {
		                this.addLinesToPlatform(platform)
		            }
                    
                    var p = enemy.myAiLines.right.intersects(platform.myAiLines.left);
                    if (p !== null && this.level.rnd.frac() < 0.1) {
                        enemy.body.velocity.y = -300;
                        enemy.body.velocity.x = 100;
                    }
                    
                    p = enemy.myAiLines.left.intersects(platform.myAiLines.right);
                    if (p !== null && this.level.rnd.frac() < 0.1) {
                        enemy.body.velocity.y = -300;
                        enemy.body.velocity.x = -100;
                    }
                }, this);
		    }, this);
        }
    },
	
	collideEnemyPlatform: function(enemy, platform) {
		if (enemy.body.touching.down && platform.body.touching.up) {
			enemy.hitPlatform = true;
			
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
	},
	
	addLinesToPlatform: function(platform) {
	    platform.myAiLines = {};
            
        platform.myAiLines.left = new Phaser.Line(platform.x, 
                                                  platform.y, 
                                                  platform.x + 64, 
                                                  platform.y);
                                                  
        platform.myAiLines.right = new Phaser.Line(platform.x + platform.width - 64, 
                                                   platform.y, 
                                                   platform.x + platform.width, 
                                                   platform.y);
	}
    
};
