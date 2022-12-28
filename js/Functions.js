//Controls
let starDebug = false,
    isPause = false,
    isMenu = true,
    leftPressed = false,
    rightPressed = false,
    shiftPressed = false,
    assistTime,
    debugPressed = false,
    isGodmode = false;

//Mouse
$(document).on('mousemove', function (e) {
    let mouseX =  e.pageX - main.offset().left,
        mouseY = e.pageY - main.offset().top;
    //Move ship to mouse
    if (ship != null){
        ship.x = mouseX - shipWidth / 2;
    }

    //Debug >> move first star to mouse
    if (starDebug){
        let star = starArr[0];
        star.dx = 0;
        star.dy = 0;
        star.x = mouseX - starSize / 2;
        star.y = mouseY - starSize / 2;
    }
});

//Keyboard
$(document).on('keydown', function (e) {
    var key = e.keyCode;
    if (key === 37 || key ===65 ) {
        leftPressed = true; //move left
    } else if (key === 39 || key === 68) {
        rightPressed = true; //move right
    } else if (key === 32){
        starLaunch(); //shoot star
    } else if (key === 16) {
        shiftPressed = true; //boost speed
    } else if (key === 17){
        starDebug = true; //debug star
    } else if (key === 81){
        debugPressed = true; //debug key
    }

    if (debugPressed){
        if (key === 79){ //Invisible
            isGodmode = !isGodmode;
            if (!isGodmode){
                life = 5;
            }
        } else if (key === 80){ //skip bricks section || boss
            if (bossIsSpawn && boss != null){
                boss.health = 0;
                checkBossIsDead();
            } else {
                totalBrickHealth = 0;
                checkSpawnBoss();
            }
        } else if (key === 82){ //reset unlocked level
            localStorage.removeItem('saved');
            location.reload();
        } else if (key === 89){ //unlock all levels
            unlockedLevels = 6;
            stopGame();
        } else if (key === 76){ //spawn 10 stars
            for (let i = 0; i < 10; i++){
                new Star(-50, -50, 0, 0, false);
            }
        }
    }
});

$(document).on('keyup', function (e) {
    var key = e.keyCode;
    if (key === 37 || key === 65) {
        leftPressed = false;
    } else if (key === 39 || key === 68) {
        rightPressed = false;
    } else if (key === 16) {
        shiftPressed = false;
    } else if (key === 17) {
        starDebug = false;
        let star = starArr[0];
        star.dx = starMaxSpeed;
        star.dy = starMaxSpeed;
    } else if (key === 81){
        debugPressed = false;
    }
});

//Assist player
function assistTimer(){
    assistTime = new Timer(function(){
        if (bossIsSpawn && boss != null){ //if fight boss >> drop fixed item
            if (boss.type == 2){
                new Item(gameWidth / 2 - itemSize /2, 1, 2);
            } else if (boss.type == 3){
                new Item(gameWidth / 2 - itemSize /2, 1, 4);
            } else if (boss.type == 4){
                new Item(gameWidth / 2 - itemSize /2, 1, 1);
            } else if (boss.type == 5){
                new Item(gameWidth / 2 - itemSize /2, 1, 3);
            } else if (boss.type == 6){
                switch (currentPhase){
                    case 1: //top
                        new Item(gameWidth / 2 - itemSize /2, 1, 2);
                        break;
                    case 2:
                        new Item(gameWidth / 2 - itemSize /2, 1, 3);
                        break;
                    case 3:
                        new Item(gameWidth / 2 - itemSize /2, 1, 3);
                        break;
                }
            }
        } else {
            if (currentLevel == 6){
                new Item(gameWidth / 2 - itemSize /2, 1, Math.floor(Math.random() * 4) + 1);
            } else {
                if (totalBrickHealth <= 10){ //drop random items when almost clear level
                    new Item(gameWidth / 2 - itemSize /2, 1, Math.floor(Math.random() * 3) + 1);
                }
            }
        }

        assistTimer(); //recursion
    }, 11000);
}

//Clear assist when done
function clearAssist(){
    if (assistTime != null){
        assistTime.pause();
        assistTime.clear();
    }
}

//Collision star with 3 edge of screen
function wallCollision(star){
    if (star.x + starSize > gameWidth) {
        star.x = gameWidth - starSize;
        return 1;
    } else if (star.x < 0){
        star.x = 0;
        return 2;
    } else if (star.y < 0) {
        star.y = 0;
        return 3;
    }
}

//Hit bottom
function earthCollision(star){
    if (star.y + starSize > gameHeight) {

        //Godmode
        if (isGodmode){
            life = Number('Infinity');
            bounceStar(star, DOWN);
            star.y = gameHeight - starSize;
        } else {
            if (currentLevel == 3 || currentLevel == 6){ //level 3 >> minimum star = 2
                if (starArr.length > 2){
                    //Tag removed
                    star.isRemove = true;
                    star.dx = 0;
                    star.dy = 0;

                } else {
                    hitEarthAnimation();
                    life -= 0.5;
                    star.isRemove = true;
                    star.dx = 0;
                    star.dy = 0;

                    if (bossIsSpawn && boss != null){
                        if (Math.random() < 0.5){
                            new Star(0 + starSize, boss.y, 0, starMaxSpeed / 2, true);
                        } else {
                            new Star(gameWidth - starSize * 2, boss.y, 0, starMaxSpeed / 2, true);
                        }
                    } else if (starArr.length == 2){
                        if (currentLevel == 3){
                            new Star(gameWidth - starSize * 2, 0, 0, starMaxSpeed / 2, true);
                        } else {
                            if (Math.random() < 0.5){
                                new Star(0 + starSize, 0, 0, starMaxSpeed / 2, true);
                            } else {
                                new Star(gameWidth - starSize * 2, 0, 0, starMaxSpeed / 2, true);
                            }
                        }
                    } else if (starArr.length == 1){
                        new Star(-100, -100, 0, 0, false);
                    }
                }
            } else {
                if (starArr.length > 1){ //remove if not the last star
                    //Tag removed
                    star.isRemove = true;
                    star.dx = 0;
                    star.dy = 0;

                } else { //last star >> restart & - life
                    restart();
                    hitEarthAnimation();
                    life--;
                }
            }
        }
    }
}

//Animation
function hitEarthAnimation(){
    main.animate({opacity: 0.75}, 100);
    main.animate({opacity: 1}, 50);
}

//Event window
function showEvent(type){
    switch (type){
        case 1: //game over
            event.html('<span>GAME OVER</span><br><br><span>Restart</span>').show();
            event.show();
            break;
        case 2: //level clear
            if (currentLevel == 2 && unlockedLevels < currentLevel){
                event.html('<span>LEVEL CLEAR</span><br><br>' +
                    '<p>Now every time you start a level, receive a random item</p>' +
                    '<br><img src="images/help-1.png"/>' +
                    '<br><span>Continue</span>').show();
            } else if (currentLevel == 3 && unlockedLevels < currentLevel){
                event.html('<span>LEVEL CLEAR</span><br><br>' +
                    '<p>Your shield is now wider</p>' +
                    '<br><img src="images/help-2.png"/>' +
                    '<br><span>Continue</span>').show();
            } else if (currentLevel == 4 && unlockedLevels < currentLevel){
                event.html('<span>LEVEL CLEAR</span><br><br>' +
                    '<p>Now spawn with an extra star</p>' +
                    '<br><span>Continue</span>').show();
            } else if (currentLevel == 5 && unlockedLevels < currentLevel){
                event.html('<span>LEVEL CLEAR</span><br><br>' +
                    '<p>Now charge star when hit edge of shield, giving it AOE (10 seconds cooldown)</p>' +
                    '<br><img src="images/help-3.png"/>' +
                    '<br><span>Continue</span>').show();
            } else if (currentLevel == 6 && unlockedLevels < currentLevel){
                event.html('<span>LEVEL CLEAR</span><br><br>' +
                    '<p>Now shoot 3 lasers every 12 seconds</p>' +
                    '<br><img src="images/help-4.png"/>' +
                    '<br><span>Continue</span>').show();
            } else {
                event.html('<span>LEVEL CLEAR</span><br><br><span>Continue</span>').show();
            }
            event.show();
            break;
        case 3: //won
            event.html('<span>YOU WON!</span><br><br><span>Quit</span>').show();
            event.show();
            break;
    }
}

//Game function, use for quit
function stopGame(){
    localStorage.setItem("saved", unlockedLevels); //saved unlocked levels
    location.reload(); //reload page
}

//Restart player
function restart(){
    //Ship reset
    shipDiv.css('left', gameWidth / 2 - shipWidth / 2);
    //Star reset
    starArr = [];
    $('.star').remove();
    starNum = 0;
    //Ignore level 4 upgrade during boss fight, else spawn an extra star
    if (unlockedLevels >= 4 && !bossIsSpawn && starArr.length < 2) {
        new Star(-100, -100, 0, 0, false);
    }
    //Default star
    new Star(-100, -100, 0, 0, false);
    //Spawn a star during level 3
    if (currentLevel == 3 || currentLevel == 6) new Star(-50, -50, 0, 0, false);
    //Auto launch
    if (bossIsSpawn && boss != null){
        new Timer(function(){
            starLaunch();
        }, 500);
    }
    //Clear stuff
    clearItems();
    clearBrickShootTimer();
    brickShoot();
    clearSaucerShootTimer();
    saucerShoot();
    restartBossAssist();
}

//Reset all + restart
function forceRestart(){
    clearStars();
    clearSaucers();
    clearItems();
    clearPowers();
    clearBullets();
    restart();
}

//Restart the whole level
function hardRestart(){
    //remove boss
    if (bossIsSpawn && boss != null){
        boss.isRemove = true;
        removeBoss();
        bossIsSpawn = false;
        currentPhase = 1;
        updateHUD();
    }

    //reset life
    if (life <= 0){
        life = 5;
    }

    switchLevel();
    event.hide();
}