//Vector for calculate bounce
class Vector {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    normalize(){ //Convert 0,1 ratio
        var length = Math.sqrt(this.x*this.x+this.y*this.y);
        this.x = this.x/length;
        this.y= this.y/length;
    }
}

//Default normal vector
var LEFT = new Vector (-1, 0),
    RIGHT = new Vector (1, 0),
    UP = new Vector (0, -1),
    DOWN = new Vector (0, 1);

//Calculate d.n
function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

//Randomly rotate the vector (less repetitive vector)
function distort(vector, value) {
    let distored = new Vector(vector.x + Math.random() * value - value / 2,
        vector.y +Math.random() * value - value / 2);
    return distored;
}

//Reflection vector
function calculateReflection(velocity, normal){
    let velocityDotProduct = dotProduct(normal, velocity);
    let reflectionVelocity = new Vector(velocity.x - 2 * velocityDotProduct * normal.x,
        velocity.y - 2 * velocityDotProduct * normal.y);
    return reflectionVelocity;
}

//Calculate angle between 2 vector
function calculateAngle(v1, v2){
    return (Math.atan2(v2.y, v2.x)) - (Math.atan2(v1.y, v1.x)); //radian
}

//Rotate the vector
function rotateVector(vector, angle){
    return new Vector(Math.round(10000*(vector.x * Math.cos(angle) - vector.y * Math.sin(angle)))/10000,
        Math.round(10000*(vector.x * Math.sin(angle) + vector.y * Math.cos(angle)))/10000);
};

//Bounce star to the calculated reflection vector
function bounceStar(star, normal){
    let velocity = new Vector(star.dx / starMaxSpeed, star.dy / starMaxSpeed),
        refl = calculateReflection(velocity, normal), //Reflect the vector
        dis = distort(refl, 0.1); //Slightly distort vector
    star.dx = dis.x * starMaxSpeed;
    star.dy = dis.y * starMaxSpeed;
    $('#star-' + star.num).toggleClass('pulse'); //Play animation
}

//Bounce down only
function bounceStarDown(star){ //Rotate normal to reflect vector straight down
    let velocity = new Vector(star.dx / starMaxSpeed, star.dy / starMaxSpeed),
        newNormal = rotateVector(UP, -calculateAngle(velocity, UP) / 2),
        refl = calculateReflection(velocity, newNormal);
    star.dx = refl.x * starMaxSpeed;
    star.dy = refl.y * starMaxSpeed;
    $('#star-' + star.num).toggleClass('pulse');
}

//Bounce depend on star angle & hit offset
function shipBounceStar(star, offSet){
    //Convert offset to -1 -> 1 ratio
    let angleRange = 0,
        newOffset = 0,
        middle = shipWidth / 2;
    if (offSet <= middle){
        newOffset = -(middle - offSet);
    } else {
        newOffset = offSet - middle;
    }
    angleRange = newOffset / middle;

    //Rotate between -60 to 60deg depended on the offset
    bounceStar(star, rotateVector(UP, (angleRange * 60 * (Math.PI/180))));
    star.dy = -starMaxSpeed; //Keep the vertical speed (less boring & faster pace gameplay)
}
