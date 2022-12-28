var bossWidthScale = 70,
    bossHeightScale = 40,
    bossWidth = bossWidthScale * (gameWidth / 100),
    bossHeight = bossHeightScale * (gameHeight / 100),
    bossIsSpawn = false,
    boss = null,
    bossDiv = $('.boss'),
    bossMaxHealth = 0,
    bossSpeedScale = 0.1,
    currentPhase = 1, //boss phase
    bossSpawnTimer, bossPhaseTimer, shieldTime, bossTime, //timer
    bossAssistDelay = 12000;

class Boss {
    constructor(leftOffset, topOffset, health, type){
        this.type = type;
        this.health = health;
        this.l = leftOffset;
        this.t = topOffset;
        this.x = leftOffset * (gameWidth / 100);
        this.y = topOffset * (gameHeight / 100);
        this.isShield = false; //immunities frames
        this.isFade= false; //invisible frames
        this.isRemove = false; //check remove

        //Div
        newBoss(main, this.x, this.y, type);
        bossDiv = $('.boss');
        boss = this;
        bossMaxHealth = health;
    }
}

function newBoss(div, x, y, type) {
    if (typeof $('.boss').css('left') === 'undefined'){
        var boss = jQuery('<div>', {
            class: 'boss',
        }).appendTo(div);

        //Position
        boss.css('left', x);
        boss.css('top', y);

        boss.setType = function(type) { //load image + shield color
            switch(type){
                case 1:
                    // this.css('background-color', '#cf3bd3');
                    this.css('box-shadow', '0px -20px 10px 5px rgba(207, 59, 211, 0.75)');
                    this.css('background-image', 'url(images/boss-1.png)');
                    break;
                case 2:
                    // this.css('background-color', '#0095DD');
                    this.css('box-shadow', '0px -20px 10px 5px rgba(0, 149, 221, 0.75)');
                    this.css('background-image', 'url(images/boss-2.png)');
                    break;
                case 3:
                    // this.css('background-color', '#b6e360');
                    // this.css('background-size', '100% 100%');
                    this.css('box-shadow', '0px 0px 10px 5px rgba(255, 0, 0, 0.5)');
                    this.css('background-image', 'url(images/boss-3.png)');
                    break;
                case 4:
                    // this.css('background-color', '#d33b75');
                    this.css('border-bottom', '3px solid rgba(255,212,17,0.5)');
                    this.css('box-shadow', '0px 20px 10px 5px rgba(211, 59, 117, 0.75)');
                    this.css('background-image', 'url(images/boss-4.png)');
                    break;
                case 5:
                    // this.css('background-color', '#dd005c');
                    this.css('box-shadow', '0px -20px 10px 5px rgba(0, 149, 221, 0.75)');
                    this.css('background-image', 'url(images/boss-5.png)');
                    break;
                case 6:
                    // this.css('background-color', '#6062e3');
                    this.css('border-bottom', '3px solid rgba(255,212,17,0.5)');
                    this.css('box-shadow', '0px 20px 10px 5px rgba(255, 0, 0, 0.5)');
                    this.css('background-image', 'url(images/boss-6.png)');
                    break;
            }

        }

        boss.setType(type);
    } else {
        //Position
        bossDiv.css('left', x);
        bossDiv.css('top', y);
    }
    updateGameBoss();
}

function removeBoss(){ //remove boss from arr and screen
    if (boss != null && boss.isRemove){
        boss = null;
        $('.boss').remove();
    }
}

//Animation
function bossHitAnimation(){ //flint animation when hitted
    bossDiv.animate({opacity: '0'}, 100);
    bossDiv.animate({opacity: '1'}, 100);
}

//Collision with star
function bossCollision(star){
    let side = 0;
    if (boss != null){
        let starTop = star.y,
            starBot = starTop + starSize,
            starLeft = star.x,
            starRight = starLeft + starSize,
            bossTop = boss.y,
            bossBot = bossTop + bossHeight,
            bossLeft = boss.x,
            bossRight = bossLeft + bossWidth;
        if ( //intersect
            boss.isRemove == false &&
            starBot >= bossTop &&
            starTop <= bossBot &&
            starRight >= bossLeft &&
            starLeft <= bossRight
        ) {
            if ((star.dx >= 0 &&
                    star.dy < 0 &&
                    bossBot - starTop < starRight - bossLeft) ||
                (star.dx <= 0 &&
                    star.dy < 0 &&
                    bossBot - starTop < bossRight - starLeft)) {
                side = 1;
                if (boss.type != 4 && boss.type != 6){ //damage boss
                    if (!boss.isShield){
                        boss.health--;
                        shieldOrFadeBoss();
                        bossHitAnimation();
                        checkBossIsDead();
                    }
                } else {
                    side = 5;
                }
            } else if ((!boss.isFade &&
                    star.dx >= 0 &&
                    star.dy > 0 &&
                    starBot - bossTop < starRight - bossLeft) ||
                (!boss.isFade &&
                    star.dx <= 0 &&
                    star.dy > 0 &&
                    starBot - bossTop < bossRight - starLeft)) {
                if (boss.type == 4 && !boss.isFade){ //damage boss
                    boss.health--;
                    shieldOrFadeBoss(true, star);
                    bossHitAnimation();
                    checkBossIsDead();
                } else if (boss.type == 3 && !boss.isShield){ //damage boss
                    boss.health--;
                    shieldOrFadeBoss();
                    bossHitAnimation();
                    checkBossIsDead();
                } else if (boss.type == 6 && currentPhase == 1 && !boss.isShield){
                    boss.health--;
                    shieldOrFadeBoss();
                    bossHitAnimation();
                    checkBossIsDead();
                }
                side = 2;
            } else if ((star.dx > 0 &&
                    star.dy <= 0 &&
                    bossBot - starTop > starRight - bossLeft) ||
                (star.dx > 0 &&
                    star.dy >= 0 &&
                    starBot - bossTop > starRight - bossLeft)){
                if (boss.type == 3 && !boss.isShield){ //damage boss
                    boss.health--;
                    shieldOrFadeBoss();
                    bossHitAnimation();
                    checkBossIsDead();
                } else if (boss.type == 6 && currentPhase == 2 && !boss.isShield){
                    console.log('test');
                    boss.health--;
                    shieldOrFadeBoss();
                    bossHitAnimation();
                    checkBossIsDead();
                }
                side = 3;
            } else if ((star.dx < 0 &&
                    star.dy <= 0 &&
                    bossBot - starTop > bossRight - starLeft) ||
                (star.dx < 0 &&
                    star.dy >= 0 &&
                    starBot - bossTop > bossRight - starLeft)){
                if (boss.type == 3 && !boss.isShield){ //damage boss
                    boss.health--;
                    shieldOrFadeBoss();
                    bossHitAnimation();
                    checkBossIsDead();
                } else if (boss.type == 6 && currentPhase == 3 && !boss.isShield){
                    boss.health--;
                    shieldOrFadeBoss();
                    bossHitAnimation();
                    checkBossIsDead();
                }
                side = 4;
            }

            //Push out if move into same direction (still have bug)
            if (boss.type == 6){
                if ((star.dx <= 0 &&
                        star.dy <= 0 &&
                        bossSpeedScale < 0 &&
                        bossBot - starTop > starRight - bossLeft) ||
                    (star.dx <= 0 &&
                        star.dy >= 0 &&
                        bossSpeedScale < 0 &&
                        starBot - bossTop > starRight - bossLeft)) {
                    star.x = bossLeft - starSize;
                    side = 0;
                }
                if ((star.dx >= 0 &&
                        star.dy <= 0 &&
                        bossSpeedScale > 0 &&
                        bossBot - starTop > bossRight - starLeft) ||
                    (star.dx >= 0 &&
                        star.dy >= 0 &&
                        bossSpeedScale > 0 &&
                        starBot - bossTop > bossRight - starLeft)){
                    star.x = bossRight;
                    side = 0;
                }
            }
        }
    }

    return side;
}

//Collisoin with bullets
function bossCollisionBullets(bullet){
    let bulletTop = bullet.y,
        bulletLeft = bullet.x,
        bulletRight = bullet.x + bulletWidth;

    if (boss != null) {
        let bossBot = boss.y + bossHeight,
            bossLeft = boss.x,
            bossRight = bossLeft + bossWidth;
        if ( //intersect
            boss.isRemove == false &&
            boss.isFade == false &&
            bulletTop <= bossBot &&
            bulletRight >= bossLeft &&
            bulletLeft <= bossRight
        ) {
            bullet.isRemove = true;
            if (!boss.isFade && !boss.isShield && (boss.type == 5 || boss.type == 6)){ //damage boss
                boss.health--;
                shieldOrFadeBoss();
                bossHitAnimation();
                checkBossIsDead();
            }
        }
    }
}

//Immunities or Invisible frames active
function shieldOrFadeBoss(isFade, star){
    if (boss != null){
        if (!isFade){ //invisible or immunities
            if (boss.type != 6){
                boss.isShield = true;
                shieldTime = new Timer(function(){
                    if (boss != null){
                        boss.isShield = false;
                    }
                }, 500); //disable after 500ms
            } else {
                boss.isShield = true;
                shieldTime = new Timer(function(){
                    if (boss != null){
                        boss.isShield = false;
                    }
                }, 50); //disable after 500ms
            }
        } else {
            boss.isFade = true;
            shieldTime = new Timer(function(){
                if (boss != null && star == null || star.isRemove){
                    boss.isFade = false;
                }
                if (boss != null){
                    if (star.y > boss.y + bossHeight) {
                        boss.isFade = false; //remove fade effect when go through
                    } else {
                        shieldOrFadeBoss(true, star);
                    }
                }
            }, 100); //check if star goes far enough >> disable
        }
    }
}

//Assist boss
function assistBoss(){
    bossTime = new Timer(function(){

        if (boss.type == 6){ //switch phase for final boss
            if (currentPhase == 3){
                currentPhase = 1;
            } else {
                currentPhase++;
            }
        }

        if (bossIsSpawn && boss != null){ //if fight boss >> drop meteor (increase on phase)
            if (currentPhase == 1){
                if (boss.type == 6){
                    bossDiv.css('box-shadow', '0px 20px 10px 5px rgba(255, 0, 0, 0.5)');
                    new Item(boss.x + bossWidth + (itemSize * 3), 1, 6);
                    itemTimer.push(new Timer(function(){
                        if (boss != null){
                            new Item(boss.x - (itemSize * 3), 1, 6);
                        }
                    }, 1500));
                } else {
                    new Item(boss.x + bossWidth + (itemSize * 3), 1, 6);
                }
            } else if (currentPhase == 2){
                if (boss.type == 6){
                    bossDiv.css('box-shadow', '20px 0px 10px 5px rgba(255, 0, 0, 0.5)');
                    new Bullet(boss.x - bulletWidth, boss.y, true);
                    bulletTimer.push(new Timer(function(){
                        if (boss != null){
                            new Bullet(boss.x - bulletWidth, boss.y, true);
                        }
                    }, 100));
                    bulletTimer.push(new Timer(function(){
                        if (boss != null){
                            new Bullet(boss.x - bulletWidth, boss.y, true);
                        }
                    }, 200));
                } else {
                    new Item(boss.x + bossWidth + (itemSize * 3), 1, 6);
                    itemTimer.push(new Timer(function(){
                        if (boss != null){
                            new Item(boss.x - (itemSize * 3), 1, 6);
                        }
                    }, 1500));
                }
            } else if (currentPhase == 3){
                if (boss.type == 6){
                    bossDiv.css('box-shadow', '-20px 0px 10px 5px rgba(255, 0, 0, 0.5)');
                    new Bullet(boss.x + bossWidth, boss.y, true);
                    bulletTimer.push(new Timer(function(){
                        if (boss != null){
                            new Bullet(boss.x + bossWidth, boss.y, true);
                        }
                    }, 100));
                    bulletTimer.push(new Timer(function(){
                        if (boss != null){
                            new Bullet(boss.x + bossWidth, boss.y, true);
                        }
                    }, 200));
                } else {
                    new Item(boss.x + bossWidth + (itemSize * 3), 1, 6);
                    itemTimer.push(new Timer(function(){
                        if (boss != null){
                            new Item(boss.x - (itemSize * 3), 1, 6);
                        }
                    }, 1500));
                    itemTimer.push(new Timer(function(){
                        if (boss != null){
                            new Item(boss.x + bossWidth + (itemSize * 3), 1, 6);
                        }
                    }, 3000));
                }
            }

            assistBoss(); //recursion
        } else {
            clearBossAssist();
        }
    }, bossAssistDelay);
}

//Clear assists when done
function clearBossAssist(){
    if (bossTime != null){
        bossTime.pause();
        bossTime.clear();
        removeItemTimer();
    }
}

//Restart boss assist
function restartBossAssist(){
    clearBossAssist();
    assistBoss();
}

//Update
function updateBoss(){
    //Remove
    removeBoss();
    if (boss != null){
        //Health & check remove
        if (boss.health == 0){
            boss.isRemove = true;
        }
        //Move
        let max = (100 - bossWidthScale);
        if (boss.type == 6){
            boss.l += bossSpeedScale;
            if (boss.l >= (max - starScale) || boss.l <= (0 + starScale)) bossSpeedScale *= -1;
        }
        //Move on resize
        boss.x = boss.l * (gameWidth / 100);
        boss.y = boss.t * (gameHeight / 100);
        bossDiv.css('left', boss.x);
        bossDiv.css('top', boss.y);
        bossDiv.css('width', bossWidth);
        bossDiv.css('height', bossHeight);
    }
}

//Update when resize
function updateGameBoss(){
    //Position
    if (boss != null){
        boss.x = boss.l * (gameWidth / 100);
        boss.y = boss.t * (gameHeight / 100);
    }
    //Size
    bossWidth = bossWidthScale * (gameWidth / 100);
    bossHeight = bossHeightScale * (gameHeight / 100);
    //Apply
    $('.boss').css('width', bossWidth);
    $('.boss').css('height', bossHeight);
}