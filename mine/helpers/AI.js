var AI = function(level) {    
    this.walkRandomness = 0.001;
    this.starSaveChance = 1;
    this.bulletDamage = 0.1;
    this.enemyImage = 'fem';
    
    this.enemySpawnRegion = {x1: 0, x2: level.world.width,
                             y1: 0, y2: level.world.height - 32};
    
    this.level = level;
};

AI.prototype = {
    
    update: function() {
        if (this.level === null) return false;
        
        this.level.enemies.forEach(function(item) {
            
            if (this.level.rnd.frac() < this.walkRandomness) {
                item.goodDirectionBlock = this.level.time.totalElapsedSeconds() + 3; 
            } else if (item.goodDirectionBlock < this.level.time.totalElapsedSeconds()) {
                item.goodDirection = false;
            }
            
            item.hitPlatform = false; 
        }, this);
		
	    this.level.physics.arcade.collide(this.level.enemies, this.level.platforms, 
		            this.collideEnemyPlatform, null, this);
		            
		this.level.physics.arcade.collide(this.level.enemies, this.level.stars, 
		            this.collideEnemyStar, null, this);
		
		this.level.physics.arcade.collide(this.level.player, this.level.enemies, 
		            this.collidePlayerEnemy, null, this);
		
		this.level.physics.arcade.collide(this.level.enemies, this.level.bullets, 
		            this.collideEnemyBullet, null, this);
		
		this.level.enemies.forEach(function(item) {
		
			if (!item.goodDirection) {
				if(item.body.onFloor()) {
					item.myDirection = item.myDirection == 'left' ? 'right' : 'left';
				} else {
					item.myDirection = 'stop';
				}
			}
			
			if (item.body.onWall()) {
				if (item.myDirection == 'left') {
				    item.myDirection = 'right';
				} else if (item.myDirection == 'right'){
				    item.myDirection = 'left';
				}
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
		
		// Jumping
		this.level.enemies.forEach(function(enemy) {
		    if (!enemy.hitPlatform) return;
		    
		    this.updateLinesToEnemy(enemy);
		    
		    this.level.platforms.forEach(function(platform) {
                if (platform.myAiLines === undefined) {
		            this.addLinesToPlatform(platform)
		        }
                
                var p = enemy.myAiLines.right.intersects(platform.myAiLines.left);
                if (p !== null && this.level.rnd.frac() < this.walkRandomness) {
                    enemy.body.velocity.y = -300;
                    enemy.body.velocity.x = 150;
                }
                
                p = enemy.myAiLines.left.intersects(platform.myAiLines.right);
                if (p !== null && this.level.rnd.frac() < this.walkRandomness) {
                    enemy.body.velocity.y = -300;
                    enemy.body.velocity.x = -150;
                }
            }, this);
		}, this);
		
    },
    
    render: function() {
        this.level.enemies.forEach(function(enemy) {
            if (enemy.health < 1 && enemy.data.healthBar == undefined) {
                let healthBar = this.level.add.graphics(enemy.x, enemy.y - 10);
		
		        let background = this.level.add.graphics(0, 0);		
                background.beginFill(0xffffff);
                background.fillAlpha = 0.5;
                background.drawRect(0, 0, 32, 3);
                background.endFill();
                healthBar.addChild(background);
                
                let foreground = this.level.add.graphics(0, 0);
                foreground.beginFill(0xff0000);
                foreground.fillAlpha = 0.5;
                foreground.drawRect(1, 1, 30 * enemy.health, 1);
                foreground.endFill();
                healthBar.addChild(foreground);
                
                enemy.data.healthBar = healthBar;                
            } else if (enemy.health < 1) {
                enemy.data.healthBar.x = enemy.x;
                enemy.data.healthBar.y = enemy.y - 10;
                
                if (enemy.data.healthBar.children[1] != undefined) {
                    enemy.data.healthBar.removeChildAt(1);
                
                }
                
                let foreground = this.level.add.graphics(0, 0);
                foreground.beginFill(0xff0000);
                foreground.fillAlpha = 0.5;
                foreground.drawRect(1, 1, 30 * enemy.health, 1);
                foreground.endFill();
                enemy.data.healthBar.addChild(foreground);
            }
        },this);
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
		if (this.level.rnd.frac() < 0.01) {
			star.kill();
			if (this.level.rnd.frac() < this.starSaveChance) {
			    enemy.starsKilled += 1;
			}
		}		
	},
	
	collidePlayerEnemy: function(player, enemy) {
		var playerBounceX = 400;
		var playerBounceY = 300;
		
		if (player.body.touching.down && enemy.body.touching.up) {
			
			player.body.velocity.y = -playerBounceY * this.level.rnd.frac();
			player.body.velocity.x = playerBounceX * (this.level.rnd.frac() - 0.5);
			
			this.throwStars(enemy, 5);
			
		} else {
			this.level.state.start('Hrabrov.GameOver', true, false, this.level.score);
		}
	},
	
	collideEnemyBullet: function(enemy, bullet) {
        bullet.kill();
        enemy.damage(this.bulletDamage * (0.5 + this.level.rnd.frac()));
        if (this.level.rnd.frac() < 0.2) {
            enemy.starsKilled += 1;
        }
    },
	
	makeEnemy: function(x = false, y = false) {
	    if (this.level === null) return false;
	    
		if (!x) { 
		    x = this.enemySpawnRegion.x1; 
		    x += this.level.rnd.frac() * (this.enemySpawnRegion.x2 - this.enemySpawnRegion.x1 - 16);  
		}		
		
		if (!y) { 
		    y = this.enemySpawnRegion.y1; 
		    y += this.level.rnd.frac() * (this.enemySpawnRegion.y2 - this.enemySpawnRegion.y1 - 16); 
		}
		
		var enemy = this.level.enemies.create(x, y, this.enemyImage);
		enemy.body.gravity.y = 300;
		enemy.body.collideWorldBounds = true;
		
		enemy.myDirection = Phaser.ArrayUtils.getRandomItem(['left', 'right']);
		enemy.goodDirection = true;
		enemy.goodDirectionBlock = 0;
		enemy.starsKilled = 0;
		enemy.data = {};
		enemy.events.onKilled.add(this.enemyKilled, this);
		
		this.addLinesToEnemy(enemy);	
		
		enemy.animations.add('left', [0, 1, 2, 3], 10, true);
		enemy.animations.add('right', [5, 6, 7, 8], 10, true);
	
		return enemy;
	},
    
    enemyKilled: function(enemy) {
        if (enemy.data.healthBar != undefined) {
            enemy.data.healthBar.destroy(true);
            
            this.throwStars(enemy);
        }
    },
    
    throwStars: function(enemy, amount = false) {
        if (!amount) amount = enemy.starsKilled;
        
        var starBounceX = 200;
		var starBounceY = 300;
        
        var starsNumber = Math.min(amount, enemy.starsKilled);
		for (var i = 0; i < starsNumber; i++) {
			var rndDirection = Phaser.ArrayUtils.getRandomItem([-1, 1]) * (enemy.width/2);
			
			var star = this.level.levelBuilder.makeStar(enemy.x + enemy.width/2 + rndDirection, 
			                                            enemy.y + enemy.height/2)
			star.body.velocity.y = -starBounceY * this.level.rnd.frac();
			
			if (rndDirection > 0) {
				star.body.velocity.x = starBounceX * this.level.rnd.frac();
			} else {
				star.body.velocity.x = -starBounceX * this.level.rnd.frac();
			}
		}
		
		enemy.starsKilled -= starsNumber;
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
	
	updateLinesToEnemy: function(enemy) {
	    enemy.myAiLines.right.setTo(enemy.x + enemy.width/2, 
                                    enemy.y + enemy.height/2,
                                    enemy.x + enemy.width/2 + 200,
                                    enemy.y + enemy.height/2 - 128);
        enemy.myAiLines.left.setTo(enemy.x + enemy.width/2, 
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
