//Ship aka paddle
var shipDiv = $('.ship'), //Div
    ship = null,
    shipWidthScale = 16.5, //Width % screen width
    shipWideWidthScale = 1.3, //Wide Scale
    shipHeightScale = 6.5, //Height % screen height
    shipWidth = shipWidthScale * (gameWidth / 100),
    shipHeight = shipHeightScale * (gameHeight / 100),
    shipSpeedScale = 1.25, //Speed scale
    shipMaxSpeed = gameWidth / 100 * shipSpeedScale,
    hitOffset = 0,
    wideTime, powerTime, shootLoop, sideTime, shootLoopUpgrade; //Timer & upgrade

class Ship {
    constructor(leftOffset, botOffset){
        this.l = leftOffset;
        this.b = botOffset;
        this.x = leftOffset * (gameWidth / 100);
        this.y = (100 - botOffset) * (gameHeight / 100) - shipHeight;
        this.dx = 0;
        this.shipPower = false;
        this.sidePower = false;
        this.shipShoot = false;
        this.shipWide = false;
        this.sideUpgrade = false;

        //Percent
        this.xp = this.x / (gameWidth / 100);
        this.yp = this.y / (gameHeight / 100);
        //Div
        newShip(main, this.x, this.y);
        shipDiv = $('.ship');
        ship = this;
    }
}

//Create div
function newShip(div, x, y) {
    if (typeof $('.ship').css('left') === 'undefined') {
        var ship = jQuery('<div>', {
            class: 'ship',
        }).appendTo(div);

        //Position
        ship.css('left', x);
        ship.css('top', y);
        updateGameShip();

        //Add 2 gunner image
        ship.prepend('<img id="turret" src="images/ship-sprite-2.png" />');
        ship.prepend('<img id="turret" src="images/ship-sprite-2.png" />');
    } else {
        //Position
        shipDiv.css('left', x);
        shipDiv.css('top', y);

        //Add 2 gunner image
        shipDiv.prepend('<img id="turret" src="images/ship-sprite-2.png" />');
        shipDiv.prepend('<img id="turret" src="images/ship-sprite-2.png" />');
    }
}

//Clear all powers
function clearPowers(){
    if (shootLoop != null) {
        shootLoop.pause();
        shootLoop.clear();
        ship.shipShoot = false;
        shootCount = 0;
    }
    // if (shootLoopUpgrade != null) {
    //     shootLoopUpgrade.pause();
    //     shootLoopUpgrade.clear();
    // }
    if (wideTime != null) {
        wideTime.pause();
        wideTime.clear();
        widenShip(false);
        ship.shipWide = false;
    }
    if (powerTime != null) {
        powerTime.pause();
        powerTime.clear();
        ship.shipPower = false;
    }
    if (ship.sidePower && sideTime != null){
        sideTime.pause();
        sideTime.clear();
        shipDiv.removeClass('down');
        ship.sidePower = false;
    }

    if (unlockedLevels >= 3){
        shipWidthScale = 18.2;
    } else {
        shipWidthScale = 16.5;
    }
}

//Collision with star
function shipCollision(star){
    if (ship != null){
        let shipOffset = shipWidth / 6,
            starTop = star.y,
            starBot = starTop + starSize,
            starLeft = star.x,
            starRight = star.x + starSize,
            shipTop = ship.y,
            shipBot = shipTop + shipHeight,
            shipLeft = ship.x,
            shipRight = ship.x + shipWidth;
        if ( //Intersect
            starBot >= shipTop
            && starRight >= shipLeft
            && starLeft <= shipRight
        ) { if ((star.dx >= 0 && star.dy > 0 &&
                    starBot - shipTop < starRight - shipLeft) ||
                (star.dx <= 0 && star.dy > 0 &&
                    starBot - shipTop < shipRight - starLeft)) {
                //Top
                hitOffset = starLeft - shipLeft; //For calculate offset
                if (hitOffset > 0 && hitOffset <= shipOffset) { //Return for animation type
                    return 1;
                } else if (hitOffset > shipOffset && hitOffset <= shipOffset * 2) {
                    return 2;
                } else if (hitOffset > shipOffset * 2 && hitOffset <= shipOffset * 3) {
                    return 3;
                } else if (hitOffset > shipOffset * 3 && hitOffset <= shipOffset * 4){
                    return 4;
                } else if (hitOffset > shipOffset * 4 && hitOffset <= shipOffset * 5){
                    return 5;
                } else if (hitOffset > shipOffset * 5 && hitOffset <= shipOffset * 6){
                    return 6;
                }
            } else { //2 Side of ship
                if ((star.dy <= 0 &&
                        shipBot - starTop > starRight - shipLeft) ||
                    (star.dy >= 0 &&
                        starBot - shipTop > starRight - shipLeft)) {
                    return 7;
                } else if ((star.dy <= 0 &&
                        shipBot - starTop > shipRight - starLeft) ||
                    (star.dy >= 0 &&
                        starBot - shipTop > shipRight - starLeft)) {
                    return 8;
                }
            }
        }
    }
}

//Animation
function shipAnimation(type) {
    switch(type){
        case 7:
            shipDiv.css('borderSpacing', 1).animate({borderSpacing: 1},
                {
                    step: function (now, fx) {
                        $(this).css('transform', 'rotateY(-45deg) rotate(15deg)');
                    },
                    duration: 50,
                    easing: 'linear',
                    done: function() {
                        shipDiv.animate({top: '+='  + shipHeight / 20, left: '+=' + shipHeight / 20}, 50);
                        shipDiv.animate({top: '-='  + shipHeight / 20, left: '-=' + shipHeight / 20}, 50, 'linear', function(){
                            shipDiv.css('borderSpacing', 1).animate({
                                    borderSpacing: 1},
                                {
                                    step: function (now, fx) {
                                        $(this).css('transform', 'rotateY(0deg) rotate(0deg)');
                                    },
                                    duration: 50,
                                    easing: 'linear'
                                });
                        });
                    }
            });
            break;
        case 1:
        case 2:
            shipDiv.css('borderSpacing', 1).animate({borderSpacing: 1},
                {
                    step: function (now, fx) {
                        $(this).css('transform', 'skewY(-10deg) rotate(-10deg)');
                    },
                    duration: 50,
                    easing: 'linear',
                    done: function() {
                        shipDiv.animate({top: '+='  + shipHeight / 20, left: '+=' + shipHeight / 20}, 50);
                        shipDiv.animate({top: '-='  + shipHeight / 20, left: '-=' + shipHeight / 20}, 50, 'linear', function(){
                            shipDiv.css('borderSpacing', 1).animate({
                                    borderSpacing: 1},
                                {
                                    step: function (now, fx) {
                                        $(this).css('transform', 'skewY(0deg) rotate(0deg)');
                                    },
                                    duration: 50,
                                    easing: 'linear'
                                });
                        });
                    }
            });
            break;
        case 3:
        case 4:
            shipDiv.animate({top: '+='  + shipHeight / 10}, 50);
            shipDiv.animate({top: '-='  + shipHeight / 10}, 50);
            break;
        case 5:
        case 6:
            shipDiv.css('borderSpacing', 1).animate({borderSpacing: 1},
                {
                    step: function (now, fx) {
                        $(this).css('transform', 'skewY(10deg) rotate(10deg)');
                    },
                    duration: 50,
                    easing: 'linear',
                    done: function() {
                        shipDiv.animate({top: '+='  + shipHeight / 20, left: '+=' + shipHeight / 20}, 50);
                        shipDiv.animate({top: '-='  + shipHeight / 20, left: '-=' + shipHeight / 20}, 50, 'linear', function(){
                            shipDiv.css('borderSpacing', 1).animate({
                                    borderSpacing: 1},
                                {
                                    step: function (now, fx) {
                                        $(this).css('transform', 'skewY(0deg) rotate(0deg)');
                                    },
                                    duration: 50,
                                    easing: 'linear'
                                });
                        });
                    }
            });
            break;
        case 8:
            shipDiv.css('borderSpacing', 1).animate({borderSpacing: 1},
                {
                    step: function (now, fx) {
                        $(this).css('transform', 'rotateY(45deg) rotate(-15deg)');
                    },
                    duration: 50,
                    easing: 'linear',
                    done: function() {
                        shipDiv.animate({top: '+='  + shipHeight / 20, left: '+=' + shipHeight / 20}, 50);
                        shipDiv.animate({top: '-='  + shipHeight / 20, left: '-=' + shipHeight / 20}, 50, 'linear', function(){
                            shipDiv.css('borderSpacing', 1).animate({
                                    borderSpacing: 1},
                                {
                                    step: function (now, fx) {
                                        $(this).css('transform', 'rotateY(0deg) rotate(0deg)');
                                    },
                                    duration: 50,
                                    easing: 'linear'
                                });
                        });
                    }
            });
            break;
    }
}

//Power
function widenShip(widen){
    if (widen){ //Play animation then resize ship
        shipDiv.css('borderSpacing', 1).animate({
                borderSpacing: shipWideWidthScale},
            {
                step: function (now, fx) {
                    $(this).css('transform', 'scaleX(' + now + ')');
                },
                duration: 200,
                easing: 'linear',
                done: function() {
                    shipWidthScale *= shipWideWidthScale;
                    $(this).css('transform', 'scaleX(1)');
                    updateGameShip();
                }
            });
    } else { //Play animation then reverse size
        shipDiv.css('borderSpacing', 1).animate({
                borderSpacing: shipWideWidthScale - 1},
            {
                step: function (now, fx) {
                    $(this).css('transform', 'scaleX(' + now + ')');
                },
                duration: 200,
                easing: 'linear',
                done: function() {
                    shipWidthScale /= shipWideWidthScale;
                    $(this).css('transform', 'scaleX(1)');
                    updateGameShip();
                }
        });
    }
}

function shipShoot(){ //Shoot 3 times >> stop
    shootLoop = new Timer(function(){
        // console.log('shoot');
        if (ship.shipShoot == true) {
            new Bullet(ship.x + shipWidth * 1 / 5, ship.y - bulletHeight * 1.1, false);
            new Timer(function(){
                new Bullet(ship.x + shipWidth * 4 / 5, ship.y - bulletHeight * 1.1, false);
            }, 50);
            shootCount++;
            // console.log('bullet: ' + shootCount);

            if (shootCount >= 3) {
                shootCount = 0;
                ship.shipShoot = false;
                shootLoop.pause();
                shootLoop.clear();
            } else {
                shipShoot();
            }
        }
    }, 2000);
}

function shipShootUpgrade(){ //Shoot a single bullet every 15s (upgrade level 6)
    if (shootLoopUpgrade != null){
        shootLoopUpgrade.pause();
        shootLoopUpgrade.clear();
    }
    shootLoopUpgrade = new Timer(function(){
        new Bullet(ship.x + shipWidth / 2 - bulletWidth / 2, ship.y - bulletHeight * 1.1, false);
        bulletTimer.push(new Timer(function(){
            new Bullet(ship.x + shipWidth / 2 - bulletWidth / 2, ship.y - bulletHeight * 1.1, false);
        }, 50));
        bulletTimer.push(new Timer(function(){
            new Bullet(ship.x + shipWidth / 2 - bulletWidth / 2, ship.y - bulletHeight * 1.1, false);
        }, 100));
        shipShootUpgrade()
    }, 12000);
}

//Update
function updateShip(){
    if (ship != null){
        //Game over
        if (life <= 0){
            showEvent(1);
        }
        //Position
        if (shiftPressed){ //Pressed shift >> boost speed (keyboard control)
            if (ship.dx > shipMaxSpeed * 4){
                ship.dx = shipMaxSpeed * 4;
            } else {
                ship.dx += 0.4;
            }
        } else {
            ship.dx = shipMaxSpeed;
        }
        if (leftPressed){ //Move left
            ship.x -= ship.dx;
        }
        if (rightPressed){ //Move right
            ship.x += ship.dx;
        }
        //Boundaries >> stop when collide
        if (ship.x < 0){
            ship.x = 0; //Wall left
        }
        if (ship.x + shipWidth > gameWidth){
            ship.x = gameWidth - shipWidth; //Wall right
        }
        //Percent
        ship.xp = ship.x / (gameWidth / 100);
        ship.yp = ship.y / (gameHeight / 100);
        //Move
        shipDiv.css('left', ship.x);
    }
}

//Update for resize
function updateGameShip(){
    //Size
    shipWidth = shipWidthScale * (gameWidth / 100);
    shipHeight = shipHeightScale * (gameHeight / 100);
    shipMaxSpeed = gameWidth / 100 * shipSpeedScale;
    if (ship != null){
        //Pos
        ship.x = ship.l * (gameWidth / 100);
        ship.y = ship.t * (gameHeight / 100);
        //Percent
        ship.x = ship.xp * (gameWidth / 100);
        ship.y = ship.yp * (gameHeight / 100);
    }
    //Apply
    shipDiv.css('top', ship.y);
    shipDiv.css('width', shipWidth);
    shipDiv.css('height', shipHeight);
}

