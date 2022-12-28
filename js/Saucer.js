var saucerArr = [],
    saucerNum = 0,
    saucerWidthScale = 22,
    saucerHeightScale = 7,
    saucerWidth = gameWidth / 100 * saucerWidthScale,
    saucerHeight = gameHeight / 100 * saucerHeightScale,
    saucerSpeedScale = 0.4,
    saucerSpeed = saucerSpeedScale * (gameWidth / 100),
    saucerShootTimer, //Timer stuff
    saucerShootDelay = 5000;


class Saucer {
    constructor(x, y, isRight, type){
        this.num = saucerNum;
        this.x = x;
        this.y = y;
        this.type = type;
        this.isRemove = false;
        this.delay = 1;

        //Speed
        if (isRight){
            this.dx = saucerSpeed;
        } else {
            this.dx = -saucerSpeed;
        }
        //Percent for resize purpose
        this.xp = x / (gameWidth / 100);
        this.yp = y / (gameHeight / 100);
        //Div
        saucerArr.push(this);
        newSaucer(main, saucerNum, x, y, type);
        //Shoot
        if (saucerNum == 1){
            saucerShoot();
        }
    }

    setDelay(ms){
        this.delay = ms;
    }
}

//New div
function newSaucer(div, num, x, y, type) {
    if (typeof $('#saucer-' + num).css('left') === 'undefined'){
        var saucer = jQuery('<div>', {
            class: 'saucer',
            id: 'saucer-' + num,
        }).appendTo(div);

        //Position
        saucer.css('left', x);
        saucer.css('top', y);

        saucer.setType = function(type) {
            switch(type){
                case 1:
                    // this.css('background', 'rgba(71,171,44,0.75)');
                    this.css('box-shadow', '0px 0px 10px 5px rgba(71,171,44,0.75)');
                    this.css('background-image', 'url(images/saucer-1.png)');
                    break;
                case 2:
                    // this.css('background', 'rgba(238,25,25,0.75)');
                    this.css('box-shadow', '0px 0px 10px 5px rgba(238,25,25,0.75)');
                    this.css('background-image', 'url(images/saucer-2.png)');
                    break;
                case 3:
                    // this.css('background', 'rgba(239,252,69,0.75)');
                    this.css('box-shadow', '0px 0px 10px 5px rgba(239,252,69,0.75)');
                    this.css('background-image', 'url(images/saucer-2.png)');
                    break;
            }

        }
        saucer.setType(type);
        saucerNum++;
        updateGameSaucers();
    } else {
        $('#saucer-' + num).css('left', x);
        $('#saucer-' + num).css('top', y);
        saucerNum++;
    }

}

//Active shooting
function saucerShoot(){
    saucerShootTimer = new Timer(function(){
        saucerArr.forEach(function(saucer){
            if (saucer.type == 2){
                bulletTimer.push(new Timer(function(){
                    new Bullet (saucer.x + saucerWidth / 2 - bulletWidth / 2, saucer.y + saucerHeight, true);
                }, saucer.delay));
            }
        });
        saucerShoot();
    }, saucerShootDelay);
}

//Remove shoot timer
function clearSaucerShootTimer(){
    if (saucerShootTimer != null){
        saucerShootTimer.pause();
        saucerShootTimer.clear();
    }
}

//Collision with star
function saucerCollision(star){
    let starTop = star.y,
        starBot = starTop + starSize,
        starLeft = star.x,
        starRight = starLeft + starSize,
        side = 0;
    for (let i = 0; i < saucerArr.length; i++) {
        let saucer = saucerArr[i],
            saucerTop = saucer.y,
            saucerBot = saucerTop + saucerHeight,
            saucerLeft = saucer.x,
            saucerRight = saucerLeft + saucerWidth;
        if (//Intersect
            saucer.isRemove == false
            && starTop <= saucerBot
            && starBot >= saucerTop
            && starRight >= saucerLeft
            && starLeft <= saucerRight
        ) {
            if ((star.dx >= 0 &&
                    star.dy < 0 &&
                    saucerBot - starTop < starRight - saucerLeft) ||
                (star.dx <= 0 &&
                    star.dy < 0 &&
                    saucerBot - starTop < saucerRight - starLeft)) {
                if (saucer.type == 3){
                    side = 5;
                } else {
                    side = 1;
                }
            } else if ((star.dx >= 0 &&
                    star.dy > 0 &&
                    starBot - saucerTop < starRight - saucerLeft) ||
                (star.dx <= 0 &&
                    star.dy > 0 &&
                    starBot - saucerTop < saucerRight - starLeft)) {
                side = 2;
            } else if ((star.dx > 0 &&
                    star.dy <= 0 &&
                    saucerBot - starTop > starRight - saucerLeft) ||
                (star.dx > 0 &&
                    star.dy >= 0 &&
                    starBot - saucerTop > starRight - saucerLeft)) {
                star.x = saucerLeft - starSize;
                side = 3;
            } else if ((star.dx < 0 &&
                    star.dy <= 0 &&
                    saucerBot - starTop > saucerRight - starLeft) ||
                (star.dx < 0 &&
                    star.dy >= 0 &&
                    starBot - saucerTop > saucerRight - starLeft)) {
                star.x = saucerRight;
                side = 4;
            }

            //Push out if move into same direction (still have bug)
            if ((star.dx <= 0 &&
                star.dy <= 0 &&
                    saucer.dx < 0 &&
                    saucerBot - starTop > starRight - saucerLeft) ||
                (star.dx <= 0 &&
                    star.dy >= 0 &&
                    saucer.dx < 0 &&
                    starBot - saucerTop > starRight - saucerLeft)) {
                star.x = saucerLeft - starSize;
                side = 0;
            }
            if ((star.dx >= 0 &&
                    star.dy <= 0 &&
                    saucer.dx > 0 &&
                    saucerBot - starTop > saucerRight - starLeft) ||
                (star.dx >= 0 &&
                    star.dy >= 0 &&
                    saucer.dx > 0 &&
                    starBot - saucerTop > saucerRight - starLeft)){
                star.x = saucerRight;
                side = 0;
            }
            return side;
        }
    }
}

//Collision with bullet >> remove it
function saucerCollisionBullets(bullet){
    let bulletTop = bullet.y,
        bulletLeft = bullet.x,
        bulletRight = bullet.x + bulletWidth;

    //Loop
    saucerArr.forEach(function(saucer){
        let saucerBot = saucer.y + saucerHeight,
            saucerLeft = saucer.x,
            saucerRight = saucerLeft + saucerWidth;
        if ( //intersect
            saucer.isRemove == false &&
            bulletTop <= saucerBot &&
            bulletRight >= saucerLeft &&
            bulletLeft <= saucerRight
        ) {
            bullet.isRemove = true;
        }
    });
}

//Remove saucer
function removeSaucers(){
    saucerArr.forEach(function(saucer){
        let saucerDiv = $('#saucer-' + saucer.num);
        if (saucer.isRemove == true) {
            let index = saucerArr.indexOf(saucer);
            if (index > -1) {
                saucerArr.splice(index, 1);
            }
            saucerDiv.remove();
        }
    });

    //If no more saucer >> remove the timer
    if (saucerArr.length == 0 && saucerShootTimer != null){
        saucerShootTimer.pause();
        saucerShootTimer.clear();
        saucerNum = 0;
    }
}

//Remove all saucers
function clearSaucers(){
    saucerArr.forEach(function(saucer){
        saucer.isRemove = true;
    });
    clearSaucerShootTimer();
    updateSaucer();
}

//Update
function updateSaucer(){
    //Remove
    removeSaucers();
    //Loops
    saucerArr.forEach(function(saucer){
        //Speed
        saucer.x += saucer.dx;
        let saucerDiv = $('#saucer-' + saucer.num),
            saucerLeft = saucer.x,
            saucerRight = saucer.x + saucerWidth;
        //Boundaries
        if (saucerLeft < 0) {
            saucer.x = 0;
            saucer.dx *= -1;
        } else if (saucerRight > gameWidth){
            saucer.x = gameWidth - saucerWidth - 0.1;
            saucer.dx *= -1;
        }
        //Percent
        saucer.xp = saucer.x / (gameWidth / 100);
        saucer.yp = saucer.y / (gameHeight / 100);
        //Move
        if (!saucer.isRemove){
            saucerDiv.css('left', saucer.x);
            saucerDiv.css('top', saucer.y);
        }
    });
}

//Update Game Saucers when resize
function updateGameSaucers(){
    //Size
    saucerWidth = gameWidth / 100 * saucerWidthScale;
    saucerHeight = gameHeight / 100 * saucerHeightScale;
    //Speed
    saucerSpeed = gameWidth / 100 * saucerSpeedScale;
    //Apply
    $('.saucer').css('width', saucerWidth);
    $('.saucer').css('height', saucerHeight);
    saucerArr.forEach(function(saucer){
        //Position
        saucer.x = saucer.xp * (gameWidth / 100);
        saucer.y = saucer.yp * (gameHeight / 100);
        //Speed
        if (saucer.dx > 0){
            saucer.dx = saucerSpeed;
        } else {
            saucer.dx = -saucerSpeed;
        }
    });
}
