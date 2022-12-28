//Bullet
var bulletArr = [], //Array
    bulletTimer = [], //Timer stuff
    bulletNum = 0,
    bulletWidthScale = 0.35,
    bulletHeightScale = 5,
    bulletWidth = gameWidth / 100 * bulletWidthScale,
    bulletHeight = (gameHeight / 100) * bulletHeightScale,
    bulletSpeedScale = 2,
    bulletSpeed = gameHeight / 100 * bulletSpeedScale;

class Bullet {
    constructor(x, y, isHarmful){
        this.num = bulletNum;
        this.x = x;
        this.y = y;
        this.isHarmful = isHarmful;
        this.isRemove = false;

        //Percent
        this.xp = x / (gameWidth / 100);
        this.yp = y / (gameHeight / 100);
        //Div
        bulletArr.push(this);
        newBullet(main, bulletNum, x, y, isHarmful);
    }
}

//Create div
function newBullet(div, num, x, y, isHarmful) {
    if (typeof $('#bullet-' + num).css('left') === 'undefined'){
        var bullet = jQuery('<div>', {
            class: 'bullet',
            id: 'bullet-' + num
        }).appendTo(div);

        //Position
        bullet.css('left', x);
        bullet.css('top', y);

        bullet.setType = function(isHarmful) { //Set color for enemies & us
            //Color
            if (isHarmful){
                this.css('background', '#ee1919');
            } else {
                this.css('background', '#ef9329');
            }
        }

        bullet.setType(isHarmful);
        bulletNum++;
        updateGameBullets();
    } else {
        $('#bullet-' + num).css('left', x);
        $('#bullet-' + num).css('top', y);
        bulletNum++;
    }
}

//Remove bullets with tag removed
function removeBullets(){
    bulletArr.forEach(function(bullet){
        let bulletDiv = $('#bullet-' + bullet.num);
        if (bullet.isRemove == true) {
            let index = bulletArr.indexOf(bullet);
            if (index > -1) {
                bulletArr.splice(index, 1);
            }
            bulletDiv.remove();
        }
    });

    if (bulletArr.length == 0){
        bulletNum = 0;
    }
}

//Remove bullet timer
function removeBulletTimers(){
    bulletTimer.forEach(function(timer){
        if (timer.complete()) {
            let index = bulletTimer.indexOf(timer);
            if (index > -1) {
                bulletTimer.splice(index, 1);
            }
        }
    });
}

//Remove all bullets
function clearBullets(){
    bulletArr.forEach(function(bullet){
        bullet.isRemove = true;
    });
    updateBullets();
}

//Update
function updateBullets(){
    //Check remove bullets
    removeBullets();
    removeBulletTimers();
    //Loop
    bulletArr.forEach(function(bullet) {
        //Speed
        if (bullet.isHarmful){
            bullet.y += bulletSpeed / 4;
        } else {
            bullet.y -= bulletSpeed;
        }
        //Collision
        let bulletDiv = $('#bullet-' + bullet.num),
            bulletTop = bullet.y,
            bulletBot = bulletTop + bulletHeight,
            bulletLeft = bullet.x,
            bulletRight = bulletLeft + bulletWidth,
            shipTop = ship.y,
            shipLeft = ship.x,
            shipRight = ship.x + shipWidth;
        //Delete when hit top || void
        if (bullet.isHarmful){ //Enemies >> -1/5 life
            if (bulletTop < 0) {
                bullet.isRemove = true;
            } else if (bulletBot > gameHeight){
                bullet.isRemove = true;
                life -= 0.2;
                hitEarthAnimation();
            }
        } else {
            if (bulletBot > gameHeight || bulletTop < 0) {
                bullet.isRemove = true;
            }
        }
        //Boudaries
        if (bulletLeft < 0) {
            bullet.x = 0;
        } else if (bulletRight > gameWidth){
            bullet.x = gameWidth - bulletWidth;
        }
        //Shield enemies bullet
        if (bullet.isHarmful == true
            && bulletBot >= shipTop
            && bulletRight >= shipLeft
            && bulletLeft <= shipRight) {
            bullet.isRemove = true;
        }
        //Collision brick && saucer && boss if not enemies
        if(!bullet.isHarmful){
            bricksCollisionBullet(bullet);
            saucerCollisionBullets(bullet);
            bossCollisionBullets(bullet);
        }
        //Percent
        bullet.xp = bullet.x / (gameWidth / 100);
        bullet.yp = bullet.y / (gameHeight / 100);
        //Move
        if (!bullet.isRemove){
            bulletDiv.css('left', bullet.x);
            bulletDiv.css('top', bullet.y);
        }
    });
}

//Update Game Bullets when resize
function updateGameBullets(){
    //Size
    bulletWidth = gameWidth / 100 * bulletWidthScale;
    bulletHeight = gameHeight / 100 * bulletHeightScale;
    //Speed
    bulletSpeed = gameHeight / 100 * bulletSpeedScale;
    //Apply
    $('.bullet').css('width', bulletWidth);
    $('.bullet').css('height', bulletHeight);
    bulletArr.forEach(function(bullet){
        //Position
        bullet.x = bullet.xp * (gameWidth / 100);
        bullet.y = bullet.yp * (gameHeight / 100);
    });
}