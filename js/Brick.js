//Brick
var brickArr = [],
    brickTimer = [], //Timer for turret brick
    brickCols = 0, //Stuff for reading array
    brickRows = 0,
    brickWidth = 0,
    brickHeight = 0,
    brickWidthScale = 0, //%
    brickHeightScale = 0, //%
    defaultBrickWidthScale = 90, //scale total brick width on screen size
    defaultBrickHeightScale = 30, //scale total brick height on screen size
    topOffset = 0,
    leftRightOffset = 0,
    topOffsetScale = 3, //offset brick top
    leftRightOffsetScale = 2, //offset brick left and right
    brickGap = 0,
    brickGapScale = 5, //brick gap
    totalBrickHealth = 0,
    totalBrickShoot = 0,
    brickShootTimer, //Timer stuff
    brickShootDelay = 7500;

class Brick {
    constructor(r, c, x, y, type) {
        this.r = r; //row
        this.c = c; //column
        this.x = x;
        this.y = y;
        this.type = type;
        this.delay = 1;
        if (this.type == 0){
            this.isBreak = true;
        } else {
            this.isBreak = false;
        }
    }

    setDelay(ms){
        this.delay = ms;
    }
}

//Create brick div
function newBrick(div, row, col, type) {
    var brick = jQuery('<div>', {
        id: 'brick-' + row + '-' + col,
        class: 'brick col g-0',
        width: brickWidthScale + '%'
    }).appendTo(div);

    //Set color
    brick.setType = function(type) {
        switch(type){
            case 0:
                this.css('visibility', 'hidden');
                break;
            case 1:
                this.css('background-color', '#adadad');
                this.css('background-image', 'url(images/brick.png)');
                break;
            case 2:
                this.css('background-color', '#424242');
                this.css('background-image', 'url(images/brick.png)');
                break;
            case 3:
                this.css('background-color', '#151515');
                this.css('background-image', 'url(images/brick.png)');
                break;
            case 4:
                this.css('background-color', '#62d9c5');
                this.css('background-image', 'url(images/brick-4.png)');
                break;
            case 5:
                this.css('background-color', '#000000');
                this.css('background-image', 'url(images/brick-5.png)');
                break;
            case 6:
                this.css('background-color', '#9848ee');
                this.css('background-image', 'url(images/brick-6.png)');
                break;
            case 7:
                this.css('background-color', '#ee4b19');
                this.css('background-image', 'url(images/brick-7.png)');
                break;
            case 8:
                this.css('background-color', '#eeff00');
                this.css('background-image', 'url(images/brick-8.png)');
                break;
        }
    }

    brick.setType(type);
}

//Remove brick timer
function removeBrickTimers(){
    brickTimer.forEach(function(timer){
        if (timer.complete()) {
            let index = brickTimer.indexOf(timer);
            if (index > -1) {
                brickTimer.splice(index, 1);
            }
        }
    });
}

//Animation
function brickHitAnimation(brick){ //animation when hit
    brick.css('borderSpacing', 1).animate({borderSpacing: 1},
        {
            step: function (now, fx) {
                $(this).css('transform', 'scale(1.2) rotateX(25deg)');
            },
            duration: 50,
            easing: 'linear',
            done: function() {
                brick.animate({opacity: '0.15'}, 50);
                brick.animate({opacity: '1'}, 50, 'linear', function(){
                    brick.css('borderSpacing', 1).animate({
                            borderSpacing: 1},
                        {
                            step: function (now, fx) {
                                $(this).css('transform', 'scale(1) rotateX(0deg)');
                            },
                            duration: 50,
                            easing: 'linear'
                        });
                });
            }
        });
}

//Collision with star
function bricksCollision(star){
    //Star check
    let starBot = star.y + starSize,
        starTop = star.y,
        starLeft = star.x,
        starRight = star.x + starSize,
        side = 0;

    //Brick check
    for(let i = 0; i < brickRows; i++) { //Check if star in rows first (optimize)
        let firstBrick = brickArr[i][0],
            rowTop = firstBrick.y - 2,
            rowBot = firstBrick.y + brickHeight + 2,
            rowLeft = firstBrick.x - 2,
            rowRight = firstBrick.x + (brickWidth + brickGap) * brickCols+ 2;
        if (//Intersect with row >> check brick
            //else >> continue
            starBot >= rowTop &&
            starTop <= rowBot &&
            starRight >= rowLeft &&
            starLeft <= rowRight
        ){
            for(let j = 0; j < brickCols; j++) {
                let brick = brickArr[i][j],
                    brickTop = brick.y,
                    brickBot = brick.y + brickHeight,
                    brickLeft = brick.x,
                    brickRight = brick.x + brickWidth,
                    brickType = brick.type;
                side = 0;
                if ( //Intersect brick
                    brick.isBreak === false &&
                    (starBot >= brickTop &&
                    starTop <= brickBot &&
                    starRight >= brickLeft &&
                    starLeft <= brickRight)
                ) {
                    if (ship.shipPower == true){ //Star with power >> Ignore collision except type 5 & 8
                        if (brickType == 5 || brickType == 8){
                            if ((star.dx >= 0 &&
                                    star.dy < 0 &&
                                    brickBot - starTop < starRight - brickLeft) ||
                                (star.dx <= 0 &&
                                    star.dy < 0 &&
                                    brickBot - starTop < brickRight - starLeft)){
                                star.y = brickBot;
                                if (brickType == 8){
                                    side = 5;
                                } else {
                                    side = 1;
                                }
                            } else if ((star.dx >= 0 &&
                                    star.dy > 0 &&
                                    starBot - brickTop < starRight - brickLeft) ||
                                (star.dx <= 0 &&
                                    star.dy > 0 &&
                                    starBot - brickTop < brickRight - starLeft)){
                                star.y = brickTop - starSize;
                                side = 2;
                            } else if ((star.dx > 0 &&
                                    star.dy <= 0 &&
                                    brickBot - starTop > starRight - brickLeft) ||
                                (star.dx > 0 &&
                                    star.dy >= 0 &&
                                    starBot - brickTop > starRight - brickLeft)){
                                star.x = brickLeft - starSize;
                                side = 3;
                            } else if ((star.dx < 0 &&
                                    star.dy <= 0 &&
                                    brickBot - starTop > brickRight - starLeft) ||
                                (star.dx < 0 &&
                                    star.dy >= 0 &&
                                    starBot - brickTop > brickRight - starLeft)){
                                star.x = brickRight;
                                side = 4;
                            }
                        }
                    } else {
                        if ((star.dx >= 0 &&
                                star.dy < 0 &&
                                brickBot - starTop < starRight - brickLeft) ||
                            (star.dx <= 0 &&
                                star.dy < 0 &&
                                brickBot - starTop < brickRight - starLeft)){
                            star.y = brickBot;
                            if (brickType == 8){
                                side = 5;
                            } else {
                                side = 1;
                            }
                        } else if ((star.dx >= 0 &&
                                star.dy > 0 &&
                                starBot - brickTop < starRight - brickLeft) ||
                            (star.dx <= 0 &&
                                star.dy > 0 &&
                                starBot - brickTop < brickRight - starLeft)){
                            star.y = brickTop - starSize;
                            side = 2;
                        } else if ((star.dx > 0 &&
                                star.dy <= 0 &&
                                brickBot - starTop > starRight - brickLeft) ||
                            (star.dx > 0 &&
                                star.dy >= 0 &&
                                starBot - brickTop > starRight - brickLeft)){
                            star.x = brickLeft - starSize;
                            side = 3;
                        } else if ((star.dx < 0 &&
                                star.dy <= 0 &&
                                brickBot - starTop > brickRight - starLeft) ||
                            (star.dx < 0 &&
                                star.dy >= 0 &&
                                starBot - brickTop > brickRight - starLeft)){
                            star.x = brickRight;
                            side = 4;
                        }
                    }

                    if (!star.isCharge){
                        updateHitBrick(brick); //Update intersected brick
                    } else { //If star charge (upgrade level 5) >> update that brick & 8 surround bricks
                        if (brick.type != 5 && brick.type != 8){
                            updateSurroundBrick(brick);
                        } else {
                            updateHitBrick(brick);
                        }
                        star.isCharge = false; //reset charge
                        $('#star-' + star.num).css('background-color', '#f0a80d'); //reset color
                    }
                    return side; //Return side for star's vector check
                }
            }
        }
    }
}

//Update 9 bricks
function updateSurroundBrick(brick){
    let row = brick.r,
        col = brick.c,
        top = brick.r - 1,
        bot = brick.r + 1,
        left = brick.c - 1,
        right = brick.c + 1;

    updateHitBrick(brick);
    if (left >= 0 && totalBrickHealth != 0) updateHitBrick(brickArr[row][left]);
    if (right < brickCols && totalBrickHealth != 0) updateHitBrick(brickArr[row][right]);
    if (top >= 0 && totalBrickHealth != 0){
        if (totalBrickHealth != 0) updateHitBrick(brickArr[top][col]);
        if (left >= 0 && totalBrickHealth != 0) updateHitBrick(brickArr[top][left]);
        if (right < brickCols && totalBrickHealth != 0) updateHitBrick(brickArr[top][right]);
    }
    if (bot < brickRows && totalBrickHealth != 0){
        if (totalBrickHealth != 0) updateHitBrick(brickArr[bot][col]);
        if (left >= 0 && totalBrickHealth != 0) updateHitBrick(brickArr[bot][left]);
        if (right < brickCols && totalBrickHealth != 0) updateHitBrick(brickArr[bot][right]);
    }
}

//Collision with bullet
function bricksCollisionBullet(bullet){
    let bulletTop = bullet.y,
        bulletLeft = bullet.x,
        bulletRight = bullet.x + bulletWidth;

    //Bricks check
    for(let i = 0; i < brickRows; i++) {
        let firstBrick = brickArr[i][0],
            rowBot = firstBrick.y + brickHeight + 2,
            rowLeft = firstBrick.x - 2,
            rowRight = firstBrick.x + (brickWidth + brickGap) * brickCols + 2;
        if (//Check row like collision brick
            bulletTop <= rowBot &&
            bulletRight >= rowLeft &&
            bulletLeft <= rowRight
        ) {
            for (let j = 0; j < brickCols; j++) {
                let brick = brickArr[i][j],
                    brickBot = brick.y + brickHeight,
                    brickLeft = brick.x,
                    brickRight = brick.x + brickWidth;
                if ( //intersect
                    brick.isBreak === false &&
                    bulletTop <= brickBot &&
                    bulletRight >= brickLeft &&
                    bulletLeft <= brickRight
                ) {
                    updateHitBrick(brick);
                    bullet.isRemove = true;
                }
            }
        }
    }
}

//Active type 7 brick >> shoot bullet
function brickShoot(){
    brickShootTimer = new Timer(function(){
        for (let i = 0; i < brickRows; i++){
            for (let j = 0; j < brickCols; j++){
                let brick = brickArr[i][j];
                if (brick.type == 7 && brick.isBreak == false){
                    bulletTimer.push(new Timer(function(){ //push in timer array
                        new Bullet (brick.x + brickWidth / 2 - bulletWidth / 2, brick.y + brickHeight, true);
                    }, brick.delay));
                }
            }
        }

        if (totalBrickShoot == 0 && totalBrickHealth == 0 && brickShootTimer != null){ //clear timer when done
            brickShootTimer.pause();
            brickShootTimer.clear();
        } else { //recursion
            brickShoot();
        }
    }, brickShootDelay);
}

//Remove timer above
function clearBrickShootTimer(){
    if (brickShootTimer != null){
        brickShootTimer.pause();
        brickShootTimer.clear();
    }
    removeBrickTimers();
}

//Restart timer
function restartBrickShoot(){
    clearBrickShootTimer();
    brickShoot();
}

//Update >> call when update multiple brick
function updateBricks() {
    for (let i = 0; i < brickRows; i++) {
        for (let j = 0; j < brickCols; j++) {
            let brick = brickArr[i][j],
                brickDiv = $('#brick-' + brick.r + '-' + brick.c); //Brick div
            switch (brick.type) {
                case 0: //hide div
                    brickDiv.css('visibility', 'hidden');
                    brick.isBreak = true;
                    break;
                case 1: //hide div
                    brickDiv.css('background-color', '#adadad');
                    brickDiv.css('background-image', 'url(images/brick.png)');
                    brickDiv.css('visibility', 'visible');
                    brick.isBreak = false;
                    break;
                case 2:
                    brickDiv.css('background-color', '#424242');
                    brickDiv.css('background-image', 'url(images/brick.png)');
                    brickDiv.css('visibility', 'visible');
                    brick.isBreak = false;
                    break;
                case 3:
                    brickDiv.css('background-color', '#151515');
                    brickDiv.css('background-image', 'url(images/brick.png)');
                    brickDiv.css('visibility', 'visible');
                    brick.isBreak = false;
                    break;
                case 4:
                    brickDiv.css('background-color', '#62d9c5');
                    brickDiv.css('background-image', 'url(images/brick-4.png)');
                    brickDiv.css('visibility', 'visible');
                    brick.isBreak = false;
                    break;
                case 5:
                    brickDiv.css('background-color', '#000000');
                    brickDiv.css('background-image', 'url(images/brick-5.png)');
                    brickDiv.css('visibility', 'visible');
                    brick.isBreak = false;
                    break;
                case 6:
                    brickDiv.css('background-color', '#9848ee');
                    brickDiv.css('background-image', 'url(images/brick-6.png)');
                    brickDiv.css('visibility', 'visible');
                    brick.isBreak = false;
                    break;
                case 7:
                    brickDiv.css('background-color', '#ee4b19');
                    brickDiv.css('background-image', 'url(images/brick-7.png)');
                    brickDiv.css('visibility', 'visible');
                    brick.isBreak = false;
                    break;
                case 8:
                    brickDiv.css('background-color', '#eeff00');
                    brickDiv.css('background-image', 'url(images/brick-8.png)');
                    brickDiv.css('visibility', 'visible');
                    brick.isBreak = false;
                    break;
            }
        }
    }
}

//Update all bricks when resize
function updateGameBricks(){
    //size
    let enemiesWidth = gameWidth - (leftRightOffset * 2);
    brickWidth = enemiesWidth / 100 * brickWidthScale;
    brickHeight = gameHeight / 100 * brickHeightScale;
    $('.brick').css('height', brickHeight);
    //gap
    if (brickCols == 1){
        brickGap = 0;
    } else {
        brickGap = brickGapScale / (brickCols - 1) * (gameWidth / 100);
    }
    $('.brick').css('marginTop', brickGap);
    $('.brick').css('marginLeft', brickGap);

    //Reload data
    for (let i = 0; i < brickRows; i++){
        for (let j = 0; j < brickCols; j++) {
            let topOff = topOffset + brickGap,
                leftOff = ((gameWidth - ((brickWidth + brickGap) * brickCols)) / 2) + brickGap,
                x = (brickWidth + brickGap) * j + leftOff,
                y = (brickHeight + brickGap) * i + topOff,
                brick = brickArr[i][j];
            brick.x = x;
            brick.y = y;
        }
    }
}

//Update intersected brick
function updateHitBrick(brick){
    if (brick != null && brick.isBreak == false){
        let type = brick.type,
            hitBrick = $('#brick-' + brick.r + '-' + brick.c); //Brick div
        switch(type){
            case 1: //hide div
                hitBrick.css('visibility', 'hidden');
                brick.type--;
                brick.isBreak = true;
                totalBrickHealth--;
                brickHitAnimation(hitBrick);
                checkSpawnBoss();
                if (Math.random() < 0.01){ //1% of dropping items :>
                    if (life <= 2){ //when low on health >> chance to drop health item
                        new Item(brick.x + (brickWidth / 2) - (itemSize / 2),
                            brick.y + (brickHeight / 2) - (itemSize / 2),
                            Math.floor(Math.random() * 5) + 1);
                    } else { //support item only
                        new Item(brick.x + (brickWidth / 2) - (itemSize / 2),
                            brick.y + (brickHeight / 2) - (itemSize / 2),
                            Math.floor(Math.random() * 4) + 1);
                    }
                }
                break;
            case 2: //downgrade
                hitBrick.css('background-color', '#adadad');
                brick.type--;
                brickHitAnimation(hitBrick);
                break;
            case 3: //downgrade
                hitBrick.css('background-color', '#424242');
                brick.type--;
                brickHitAnimation(hitBrick);
                break;
            case 4: //drop item
                hitBrick.css('visibility', 'hidden');
                brick.isBreak = true;
                totalBrickHealth--;
                brickHitAnimation(hitBrick);
                checkSpawnBoss();
                if (life <= 2){ //same as case 1
                    new Item(brick.x + (brickWidth / 2) - (itemSize / 2),
                        brick.y + (brickHeight / 2) - (itemSize / 2),
                        Math.floor(Math.random() * 5) + 1);
                } else {
                    new Item(brick.x + (brickWidth / 2) - (itemSize / 2),
                        brick.y + (brickHeight / 2) - (itemSize / 2),
                        Math.floor(Math.random() * 4) + 1);
                }
                break;
            case 5: //ignore 5 & 8
                break;
            case 8:
                brickHitAnimation(hitBrick);
                break;
            case 6: //regen brick
                hitBrick.css('visibility', 'hidden');
                brick.isBreak = true;
                brickHitAnimation(hitBrick);
                brickTimer.push(new Timer(function(){
                    hitBrick.css('visibility', 'visible');
                    brick.isBreak = false;
                }, 4000)); //reappear after 4s
                break;
            case 7:
                hitBrick.css('visibility', 'hidden');
                brick.isBreak = true;
                totalBrickHealth--;
                totalBrickShoot--;
                brickHitAnimation(hitBrick);
                checkSpawnBoss();
                new Item(brick.x + (brickWidth / 2) - (itemSize / 2),
                    brick.y + (brickHeight / 2) - (itemSize / 2), 3);
                break;
        }
    }
}