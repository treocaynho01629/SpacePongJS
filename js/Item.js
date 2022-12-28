//Item
var itemArr = [], //Array
    itemTimer = [], //Timer
    itemNum = 0,
    itemScale = 4,
    itemSize = Math.sqrt((gameWidth / 100 * itemScale) * (gameHeight / 100 * itemScale)),
    itemSpeedScale = 0.4,
    itemSpeed = gameHeight / 100 * itemSpeedScale,
    shootCount = 0; //Count bullet from item shoot

class Item {
    constructor(x, y, type){
        this.num = itemNum;
        this.x = x;
        this.y = y;
        this.type = type;
        this.isRemove = false;

        //Percent
        this.xp = x / (gameWidth / 100);
        this.yp = y / (gameHeight / 100);
        //Div
        itemArr.push(this);
        newItem(main, itemNum, x, y, type);
    }
}

//Create div
function newItem(div, num, x, y, type) {
    if (typeof $('#item-' + num).css('left') === 'undefined'){
        var item = jQuery('<div>', {
            class: 'item',
            id: 'item-' + num
        }).appendTo(div);

        //Position
        item.css('left', x);
        item.css('top', y);

        item.setType = function(type) { //Set icon & color
            //Color
            switch(type){
                case 1:
                    this.css('background', '#40ef72');
                    jQuery('<i class="item-icon fa fa-bolt" aria-hidden="true"></i>').appendTo(item);
                    break;
                case 2:
                    this.css('background', '#b6e360');
                    jQuery('<i class="item-icon fa fa-dot-circle-o" aria-hidden="true"></i>').appendTo(item);
                    break;
                case 3:
                    this.css('background', '#1f5dff');
                    jQuery('<i class="item-icon fa fa-fire" aria-hidden="true"></i>').appendTo(item);
                    break;
                case 4:
                    this.css('background', '#4a3e4b');
                    jQuery('<i class="item-icon fa fa-expand" aria-hidden="true"></i>').appendTo(item);
                    break;
                case 5:
                    this.css('background', '#d25aef');
                    jQuery('<i class="item-icon fa fa-heart" aria-hidden="true"></i>').appendTo(item);
                    break;
                case 6: //Meteor
                    this.css('background', '#6b0909');
                    this.css('border-radius', '40%');
                    this.css('box-shadow', '0 0 10px 3px rgba(255, 255, 255, 0.5) inset');
                    break;
            }

        }

        item.setType(type);
        itemNum++;
        updateGameItems();
    } else {
        $('#item-' + num).css('left', x);
        $('#item-' + num).css('top', y);
        itemNum++;
    }

}

//Remove items with tag removed
function removeItems(){
    itemArr.forEach(function(item){
        let itemDiv = $('#item-' + item.num);
        if (item.isRemove == true) {
            let index = itemArr.indexOf(item);
            if (index > -1) {
                itemArr.splice(index, 1);
            }
            itemDiv.remove();
        }
    });

    if (itemArr.length == 0){
        itemNum = 0;
    }
}

//Remove all item
function clearItems(){
    itemArr.forEach(function(item){
        item.isRemove = true;
    });
    updateItems();
}

//Remove bullet timer
function removeItemTimer(){
    itemTimer.forEach(function(timer){
        if (timer.complete()) {
            let index = itemTimer.indexOf(timer);
            if (index > -1) {
                itemTimer.splice(index, 1);
            }
        }
    });
}

//Update
function updateItems(){
    //Check remove items
    removeItems();
    removeItemTimer();
    //Loops
    itemArr.forEach(function(item){
        //Speed
        if (item.type == 6){ //Meteor drop slower
            item.y += itemSpeed / 2;
        } else {
            item.y += itemSpeed;
        }
        //Collision
        let itemDiv = $('#item-' + item.num),
            itemBot = item.y + itemSize,
            itemLeft = item.x,
            itemRight = item.x + itemSize,
            shipTop = ship.y,
            shipLeft = ship.x,
            shipRight = ship.x + shipWidth;
        //Delete when void
        if (itemBot >= gameHeight || item.y <= 0){
            item.isRemove = true;
            item.x = -50;
            item.y = -50;
            removeItems();
            if (item.type == 6){ //If meteor >> - 0.5 life
                hitEarthAnimation();
                life -= 0.5;
            }
        }
        //Boundaries
        if (itemLeft <= 0) {
            item.x = 0;
        } else if (itemRight >= gameWidth){
            item.x = gameWidth - itemSize;
        }
        //Collect
        if (//Intersect
            itemBot >= shipTop
            && itemRight >= shipLeft
            && itemLeft <= shipRight) {
            switch (item.type) {
                case 1: //Power star
                    if (ship.shipPower == false) {
                        ship.shipPower = true;
                        powerStar(true);

                        powerTime = new Timer(function () {
                            ship.shipPower = false;
                            powerStar(false);
                        }, 1700);
                    } else {
                        powerTime.pause();
                        powerTime.clear();
                        powerTime = new Timer(function () {
                            ship.shipPower = false;
                            powerStar(false);
                        }, 1700);
                    }
                    item.isRemove = true;
                    break;
                case 2: //+1 star
                    if (starArr.length == 1) {
                        if (starArr[0].isMove == true){
                            new Star(starArr[0].x, starArr[0].y, -starArr[0].dx, starArr[0].dy, true);
                        } else {
                            new Star(0, 0, 0, 0, false);
                        }
                    } else if (starArr.length == 2) {
                        new Star(0, 0, 0, 0, false);
                    }
                    item.isRemove = true;
                    break;
                case 3: //Shoot 2 bullet
                    if (ship.shipShoot == false) {
                        ship.shipShoot = true;
                        shipShoot();
                    } else {
                        shootCount = 0;
                    }
                    item.isRemove = true;
                    break;
                case 4: //Widen ship's shield
                    if (ship.shipWide == false) {
                        ship.shipWide = true;
                        widenShip(true);
                        wideTime = new Timer(function () {
                            ship.shipWide = false;
                            widenShip(false);
                        }, 8000);
                    } else {
                        wideTime.clear();
                        wideTime = new Timer(function () {
                            ship.shipWide = false;
                            widenShip(false);
                        }, 8000);
                    }
                    item.isRemove = true;
                    break;
                case 5: //+ life
                    life++;
                    item.isRemove = true;
                    break;
                case 6: //Reuse code as meteor
                    item.isRemove = true;
                    break;
            }
        }
        //Percent
        item.xp = item.x / (gameWidth / 100);
        item.yp = item.y / (gameHeight / 100);
        //Move
        if (!item.isRemove){
            itemDiv.css('left', item.x);
            itemDiv.css('top', item.y);
        }
    });
}

//Update Game Items when resize
function updateGameItems(){
    //Size
    itemSize = Math.sqrt((gameWidth / 100 * itemScale) * (gameHeight / 100 * itemScale));
    //Speed
    itemSpeed = gameHeight / 100 * itemSpeedScale;
    //Apply
    $('.item').css('width', itemSize);
    $('.item').css('height', itemSize);
    //Percent
    itemArr.forEach(function(item){
        //Position
        item.x = item.xp * (gameWidth / 100);
        item.y = item.yp * (gameHeight / 100);
    });
}


