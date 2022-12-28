//Star || Ball
var starArr = [], //Array stuff
    starSize = 0,
    starScale = 4,
    starMaxSpeed = 0,
    oldMaxSpeed = 0,
    starSpeedScale = 0.65,
    starNum = 0;

class Star {
    constructor(x, y, dx, dy, isMove){
        this.num = starNum;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.isCharge = false; //Charge power (upgrade level 5)
        this.isMove = isMove;
        this.isRemove = false;

        //Percent >> for resizing purpose
        this.xp = x / (gameWidth / 100);
        this.yp = y / (gameHeight / 100);
        //Div
        starArr.push(this);
        newStar(main, starNum, x, y);
    }
}

//Create star div
function newStar(div, num, x, y) {
    if (typeof $('#star-' + num).css('left') === 'undefined'){
        var star = jQuery('<div>', {
            class: 'star',
            id: 'star-' + num,
        }).appendTo(div);

        //Position
        star.css('left', x);
        star.css('top', y);

        starNum++;
        updateGameStars();
    } else {
        $('#star-' + num).css('left', x);
        $('#star-' + num).css('top', y);
        starNum++;
    }

}

//Launch star
function starLaunch(){
    starArr.forEach(function(star){
        if (star.isMove == false){
            star.dx = (Math.round(Math.random()) * 2 - 1) * (Math.random() * (starMaxSpeed / 2) + 0);
            star.dy = -starMaxSpeed;
            star.isMove = true;
        }
    })
}

//Vanish stars animation
function fadeStars(){
    $('.star').css('borderSpacing', 1).animate({
            opacity: 0,
            borderSpacing: 0},
        {
            step: function (now, fx) {
                $(this).css('transform', 'scale(' + now + ')');
            },
            duration: 1000,
            easing: 'swing'
    });
}

//Power star (pick up item)
function powerStar(power){
    if (power){
        starArr.forEach(function(star){//Slow down star & change color
            star.dx /= 1.75;
            star.dy /= 1.75;
            if (star.isCharge){ //If charge >> different color
                $('#star-' + star.num).css('background-color', '#c8ff00');
            } else {
                $('#star-' + star.num).css('background-color', '#c800ff');
            }
        });
    } else {
        starArr.forEach(function(star){ //If already active, speed it up & reverse color
            star.dx *= 1.75;
            star.dy *= 1.75;
            $('#star-' + star.num).css('background-color', '#f0a80d');
        });
    }
}

//Charge star (Upgrade level 5)
function chargeStar(star){
    if (ship.sidePower == false) {
        ship.sidePower = true; //The upgrade
        star.isCharge = true;
        if (ship.shipPower){ //Change star color
            $('#star-' + star.num).css('background-color', '#c8ff00');
        } else {
            $('#star-' + star.num).css('background-color', '#00ff51');
        }
        shipDiv.toggleClass('down'); //Active shield color (dim red) in scss

        sideTime = new Timer(function () {
            ship.sidePower = false;
            shipDiv.toggleClass('down'); //Reverse shield color
        }, 10000);
    }
}

//Remove stars with tag removed
function removeStars(){
    starArr.forEach(function(star){
        let starDiv = $('#star-' + star.num);
        if (star.isRemove == true) {
            let index = starArr.indexOf(star);
            if (index > -1) {
                starArr.splice(index, 1);
            }
            starDiv.remove();
        }
    });
}

//Remove all stars
function clearStars(){
    starArr.forEach(function(star){
        star.isRemove = true;
    });
    updateStars();
}

//Limit star speed (vector speed scale)
function limitSpeed(star){
    if (star.dx >= starMaxSpeed * 2) star.dx = starMaxSpeed * 2;
    if (star.dx <= -starMaxSpeed * 2) star.dx = -starMaxSpeed * 2;
    if (star.dy > 0){
        if (star.dy >= starMaxSpeed * 2) star.dy = starMaxSpeed * 2;
        if (star.dy <= starMaxSpeed / 2) star.dy = starMaxSpeed / 2;
    } else if (star.dy < 0){
        if (star.dy <= -starMaxSpeed * 2) star.dy = -starMaxSpeed * 2;
        if (star.dy >= -starMaxSpeed / 2) star.dy = -starMaxSpeed / 2;
    }
}

//Update all stars
function updateStars(){
    //Check remove stars
    removeStars();
    //Loops
    starArr.forEach(function(star){
        let starDiv = $('#star-' + star.num);
        //Speed
        limitSpeed(star);
        star.x += star.dx;
        star.y += star.dy;
        //Collision & move star
        if (!star.isMove) { //If not shoot yet >> float on top of ship
            star.x = ship.x + shipWidth / 2 - starSize / 2;
            star.y = ship.y - (starSize * 1.5);
        } else {
            //Hit earth
            earthCollision(star);
            //Wall
            switch(wallCollision(star)){
                case 1:
                    bounceStar(star, LEFT);
                    break;
                case 2:
                    bounceStar(star, RIGHT);
                    break;
                case 3:
                    bounceStar(star, UP);
                    break;
            }
            //Brick
            switch(bricksCollision(star)){
                case 1:
                    bounceStar(star, UP);
                    break;
                case 2:
                    bounceStar(star, DOWN);
                    break;
                case 3:
                    bounceStar(star, LEFT);
                    break;
                case 4:
                    bounceStar(star, RIGHT);
                    break;
                case 5:
                    bounceStarDown(star);
                    break;
            }
            //Hit ship
            let hit = shipCollision(star);
            shipAnimation(hit);
            switch (hit){
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    star.y = ship.y - starSize;
                    shipBounceStar(star, hitOffset);
                    break;
                case 7: //Fixed speed
                    star.dy = -starMaxSpeed;
                    star.dx = -starMaxSpeed * 2;
                    star.x = ship.x - starSize;
                    if (ship.sideUpgrade){ //If upgrade level 5 >> charge
                        chargeStar(star);
                    }
                    $('#star-' + star.num).toggleClass('pulse'); //Star animation
                    break;
                case 8: //Same as 7 but reverse
                    star.dy = -starMaxSpeed;
                    star.dx = starMaxSpeed * 2;
                    star.x = ship.x + shipWidth;
                    if (ship.sideUpgrade){
                        chargeStar(star);
                    }
                    $('#star-' + star.num).toggleClass('pulse');
                    break;
            }
            //Boss
            switch(bossCollision(star)){
                case 1:
                    bounceStar(star, UP);
                    break;
                case 2:
                    bounceStar(star, DOWN);
                    break;
                case 3:
                    bounceStar(star, LEFT);
                    break;
                case 4:
                    bounceStar(star, RIGHT);
                    break;
                case 5:
                    bounceStarDown(star);
                    break;
            }
            //Saucer
            switch(saucerCollision(star)){
                case 1:
                    bounceStar(star, UP);
                    break;
                case 2:
                    bounceStar(star, DOWN);
                    break;
                case 3:
                    bounceStar(star, LEFT);
                    break;
                case 4:
                    bounceStar(star, RIGHT);
                    break;
                case 5:
                    bounceStarDown(star);
                    break;
            }
        }
        //Percent
        star.xp = star.x / (gameWidth / 100);
        star.yp = star.y / (gameHeight / 100);
        //Move
        if (!star.isRemove){
            $(starDiv).css('left', star.x);
            $(starDiv).css('top', star.y);
        }
    });
}

//Update Game Stars when resize
function updateGameStars(){
    //Size
    starSize = Math.sqrt((gameWidth / 100 * starScale) * (gameHeight / 100 * starScale));
    //Star speed
    oldMaxSpeed = starMaxSpeed;
    starMaxSpeed = Math.sqrt((gameWidth / 100 * starSpeedScale) * (gameHeight / 100 * starSpeedScale));
    //Apply
    starArr.forEach(function(star){
        //Position
        star.x = star.xp * (gameWidth / 100);
        star.y = star.yp * (gameHeight / 100);
        //Width
        let starDiv = $('#star-' + star.num);
        $(starDiv).css('width', starSize);
        $(starDiv).css('height', starSize);
        //Speed
        star.dx *= (starMaxSpeed / oldMaxSpeed);
        star.dy *= (starMaxSpeed / oldMaxSpeed);
    });
}
