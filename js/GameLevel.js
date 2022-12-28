//Game
var enemies = $('#enemies'), //Html stuff
    menu = $('#main_menu'),
    main = $('#main'),
    pause = $('#pause'),
    event = $('#event');
var gameWidth = parseFloat(main.innerWidth()), //Game width & height
    gameHeight = parseFloat(main.innerHeight());
var currentLevel = 1, //Level
    unlockedLevels = 1;
var life = 5; //Life

//Levels
const level1 = [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [2, 2, 0, 0, 2, 2, 0, 0, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const level2 = [
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [2, 2, 4, 2, 2, 2, 2, 2, 2, 4, 2, 2],
    [2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2],
    [2, 2, 2, 2, 1, 3, 3, 1, 2, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0]
];

const level3 = [
    [0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 2, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 3, 2, 2, 3, 3, 4, 4, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 4, 3, 3, 4, 3, 1, 1, 3, 0, 0, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 2, 2, 1, 3, 4, 2, 4, 1, 2, 0, 0, 3, 4, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 2, 4, 2, 3, 1, 2, 2, 2, 3, 6, 6, 2, 3, 1, 1, 2, 0, 0, 0, 0, 0],
    [1, 2, 6, 3, 3, 1, 1, 1, 2, 6, 4, 4, 6, 1, 2, 2, 2, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0],
];

const level4 = [
    [0, 0, 5, 8, 8, 8, 8, 8, 5, 5, 8, 8, 8, 8, 8, 5, 5, 8, 8, 8, 8, 8, 5, 0, 0],
    [0, 8, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 8, 0],
    [5, 2, 1, 0, 2, 0, 2, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 2, 0, 2, 0, 2, 1, 5],
    [5, 1, 2, 0, 2, 1, 2, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 2, 1, 2, 0, 1, 2, 5],
    [5, 2, 1, 0, 3, 4, 3, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 3, 4, 3, 0, 2, 1, 5],
    [5, 1, 2, 0, 0, 4, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 4, 0, 0, 1, 2, 5],
    [5, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 5],
    [5, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 5],
    [5, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 5],
    [5, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 5],
    [5, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 5],
    [5, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 5],
    [5, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 2, 1, 5],
    [5, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 5],
    [5, 2, 1, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 2, 1, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 5],
    [5, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5],
    [5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 5],
    [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
];

const level5 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0 ,2 ,1, 1 ,2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2 ,1 ,2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 3, 0, 0, 0, 0, 3, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 3, 3, 2, 0, 0, 2, 3, 3, 2, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 3, 3, 2, 5, 5, 2, 3, 3, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 2, 0, 0, 0, 0, 1, 1, 2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 2],
    [2, 3, 0, 3, 2, 0, 0, 0, 0, 2, 1, 2, 2, 3, 2, 1, 1, 2, 3, 2, 2, 1, 2, 0, 0, 0, 0, 2, 3, 0, 3, 2],
    [5, 2, 3, 2, 5, 0, 0, 0, 0, 3, 0, 0, 2, 3, 2, 1, 1, 2, 3, 2, 0, 0, 3, 0, 0, 0, 0, 5, 2, 3, 2, 5],
    [2, 1, 3, 1, 2, 0, 0, 0, 0, 7, 0, 0, 2, 3, 2, 3, 3, 2, 3, 2, 0, 0, 7, 0, 0, 0, 0, 2, 1, 3, 1, 2],
    [0, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 4, 4, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 0],
    [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const level6 = [
    [0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0],
    [0, 5, 5, 8, 8, 8, 5, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 5, 8, 8, 8, 5, 5, 0],
    [5, 8, 8, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 8, 8, 5],
    [0, 0, 0, 0, 0, 0, 6, 4, 6, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 6, 4, 6, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 3, 3, 3, 3, 2, 2, 3, 3, 3, 2, 2, 3, 3, 3, 3, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 2, 3, 2, 2, 3, 1, 3, 2, 2, 3, 2, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 1, 1, 1, 6, 6, 6, 1, 1, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 6, 4, 6, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 6, 4, 6, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 6, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6],
    [2, 6, 4, 1, 4, 1, 6, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 6, 1, 4, 1, 4, 6, 2],
    [1, 2, 6, 6, 6, 6, 2, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 2, 6, 6, 6, 6, 2, 1],
    [6, 1, 2, 1, 2, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 2, 1, 2, 1, 6],
    [0, 6, 1, 2, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 2, 1, 6, 0],
    [0, 0, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0],
];

const level1BossState = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 0]
];

const level2BossState = [
    [0]
];

const level3BossState = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const level4BossState = [
    [0, 0, 0, 8, 8, 8, 8, 8, 8, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 6, 6, 6, 6, 6, 0, 0, 0],
    [0, 0, 0, 6, 6, 6, 6, 6, 6, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const level5BossState = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

//limit = 19 cols
const levelfun = [
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0 ,0 ,0 ,0 ,0],
    [0, 0, 0, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 0 ,0 ,0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 0, 1, 2, 2, 2, 2, 2, 2, 0, 1, 2, 2, 1],
    [1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 1],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
];

const levelfun2 = [
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6 ,6 ,6 ,6 ,6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6 ,6 ,6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 1, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6 ,6 ,6 ,6 ,6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6 ,6 ,6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
];

const leveltest = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
];

const leveltest2 = [
    [1],
    [8]
];

//Load level's data to array
function loadBrickData(level){
    if (brickArr.length == 1){ //If 1D array
        for (let i = 0; i < brickRows; i++) {
            let topOff = topOffset + brickGap,
                leftOff = ((gameWidth - ((brickWidth + brickGap) * brickCols)) / 2) + brickGap,
                x = (brickWidth + brickGap) * 0 + leftOff,
                y = (brickHeight + brickGap) * i + topOff,
                type = level[i][0];
            brickArr[i][0] = new Brick(i, 0, x, y, type);
        }
    } else { //2D array
        for (let i = 0; i < brickRows; i++){
            for (let j = 0; j < brickCols; j++) {
                let topOff = topOffset + brickGap,
                    leftOff = ((gameWidth - ((brickWidth + brickGap) * brickCols)) / 2) + brickGap,
                    x = (brickWidth + brickGap) * j + leftOff,
                    y = (brickHeight + brickGap) * i + topOff,
                    type = level[i][j];

                if (type != 7){
                    brickArr[i][j] = new Brick(i, j, x, y, type);
                } else {
                    let tempBrick = new Brick(i, j, x, y, type);
                    tempBrick.setDelay(Math.floor(Math.random() * 500) + 1);
                    brickArr[i][j] = tempBrick;
                }
            }
        }
    }
}

//Load level from a set of array
function loadLevel(level){
    //Clear level firsts
    clearLevel();
    //Set size for brickArr
    brickCols = level[0].length;
    brickRows = level.length;
    brickArr = [...Array(brickRows)].map(x => Array(brickCols).fill(0));
    //Update bricks size
    brickWidthScale = (defaultBrickWidthScale / brickCols);
    brickHeightScale = (defaultBrickHeightScale / brickRows);
    if (brickCols == 1){
        brickGap = 0;
    } else {
        brickGap = brickGapScale / (brickCols - 1) * (gameWidth / 100);
    }
    //Update bricks offset
    topOffset = topOffsetScale * (gameHeight / 100);
    leftRightOffset = leftRightOffsetScale * (gameWidth / 100);
    enemies.css('paddingTop', topOffset); //set offset
    enemies.css('paddingLeft', leftRightOffset);
    enemies.css('paddingRight', leftRightOffset);

    //Create row for bootstrap
    for (var i = 0; i < brickRows; i++){
        var divRow = jQuery('<div>', {
            class: 'row row-cols-auto g-0 d-flex justify-content-center',
        }).appendTo(enemies);

        for (var j = 0; j < brickCols; j++) { //Count total bricks for level's goal
            let type = level[i][j];
            if (type != -1){
                divRow.arrPiece = new Array;
                divRow.arrPiece[j] = newBrick(divRow, i, j, type);

                if (type != 5 && type != 6 && type != 0 && type != 8){
                    totalBrickHealth++;
                }

                if (type == 7){
                    totalBrickShoot++;
                }
            }
        }
    }

    updateGame();
    loadBrickData(level);
}

//Clear level
function clearLevel(){
    //Bricks div
    $('.brick').remove();
    $('.row').remove();
    //Timer
    for (let i = 0; i < brickTimer.length; i++){
        brickTimer[i].clear();
    }
    brickTimer = [];
    totalBrickHealth = 0;
    totalBrickShoot = 0;
    clearBrickShootTimer();
    clearSaucerShootTimer();
}

//Change level
function switchLevel(){
    //Menu if won
    if (currentLevel == 7){
        currentLevel = unlockedLevels = 6; //Reset to 6 >> menu
        stopGame();
    } else {
        //Reset stuff
        clearLevel();
        clearAssist();
        assistTimer();
        forceRestart()
        //Set default stuff
        bossWidthScale = 70;
        bossHeightScale = 40;
        bossAssistDelay = 12000;
        defaultBrickWidthScale = 90;
        defaultBrickHeightScale = 30;
        brickGapScale = 5;
        topOffsetScale = 3;
        leftRightOffsetScale = 2;
        saucerWidthScale = 22;
        saucerHeightScale = 7;
        saucerSpeedScale = 0.4;
        //Set unlocked level
        if (unlockedLevels < currentLevel){
            unlockedLevels = currentLevel;
        }
        //Switch
        switch(currentLevel){
            case 1:
                loadLevel(level1);
                if (unlockedLevels <= currentLevel){
                    $('#tips').html('[Arrow key] | [A/D] Move, [LShift] Speed boost, [Space] Launch star');
                }
                break;
            case 2:
                loadLevel(level2);
                new Saucer( 0, (brickHeight + brickGap) * (brickRows + 1) + topOffset + brickGap, false, 1);
                break;
            case 3:
                topOffsetScale = 15;
                leftRightOffsetScale = 0;
                defaultBrickHeightScale = 40;
                defaultBrickWidthScale = 92;
                brickGapScale = 2;
                loadLevel(level3);
                saucerWidthScale = 20;
                saucerSpeedScale = 0.25;
                new Saucer( 0, (brickHeight + brickGap) * brickRows + topOffset + brickGap, false, 1);
                $('#tips').html('Keep their stars on the field');
                break;
            case 4:
                defaultBrickWidthScale = 80;
                defaultBrickHeightScale = 50;
                topOffsetScale = 5;
                leftRightOffsetScale = 0;
                loadLevel(level4);
                saucerWidthScale = 28;
                saucerHeightScale = 3;
                saucerSpeedScale = 0.1;
                new Saucer( 0, (brickHeight + brickGap) * (brickRows - 5) + topOffset + brickGap, false, 3);
                break;
            case 5:
                defaultBrickHeightScale = 55;
                brickGapScale = 0;
                loadLevel(level5);
                saucerWidthScale = 10;
                saucerSpeedScale = 0.2;
                new Saucer( gameWidth / 2 - saucerWidth / 2,
                    (brickHeight + brickGap) * (brickRows - 5) + topOffset + brickGap, true, 2);
                $('#tips').html('Block their laser');
                break;
            case 6:
                defaultBrickWidthScale = 90;
                defaultBrickHeightScale = 50;
                brickGapScale = 0;
                topOffsetScale = 0;
                leftRightOffsetScale = 0;
                loadLevel(level6);
                saucerWidthScale = 16;
                saucerSpeedScale = 0.25;
                new Saucer( 0,
                    (brickHeight + brickGap) * (brickRows - 5) + topOffset + brickGap, true, 2);
                new Saucer( 0,
                    (brickHeight + brickGap) * (brickRows - 5) + topOffset + brickGap, true, 3);
                break;
        }

        //Set unlocked power/upgrade
        //Random item when start level
        if (unlockedLevels >= 2) new Item(gameWidth / 2 - itemSize /2, 1, Math.floor(Math.random() * 4) + 1);
        //Increase ship's shield size
        if (unlockedLevels >= 3) shipWidthScale = 18.2;
        //Ignore level 4 upgrade during boss fight, else spawn an extra star
        if (unlockedLevels >= 4 && !bossIsSpawn && starArr.length < 2) new Star(-50, -50, 0, 0, false);
        //Side charge upgrade
        if (unlockedLevels >= 5) {
            ship.sideUpgrade = true;
        } else {
            ship.sideUpgrade = false;
        }
        //Ship's gun upgrade
        if (unlockedLevels >= 6 && shootLoopUpgrade == null) shipShootUpgrade();

        bossIsSpawn == false; //No boss
        brickShoot(); //Call on switch level
        updateGame();
    }
}

//Spawn boss
function checkSpawnBoss(){
    if (bossIsSpawn == false){ //If clear level
        if (totalBrickHealth == 0){
            //Delete stars & clear level
            fadeStars();
            clearLevel();
            bossSpawnTimer = setTimeout(function(){
                forceRestart(); //Restart
                restartBossAssist();//Turn on boss assist
                // clearBossAssist();
                // assistBoss();
                //Spawn boss
                switch (currentLevel) {
                    case 1:
                        //Level
                        defaultBrickHeightScale = 50;
                        brickGapScale = 1;
                        loadLevel(level1BossState);
                        //Boss
                        bossWidthScale = 64;
                        bossHeightScale = 50;
                        new Boss(18, 3, 15, 1);
                        //Update
                        updateGame();
                        totalBrickHealth = Number('Infinity');
                        $('#tips').html('Attack the blind spot & catch the falling meteor');
                        break;
                    case 2:
                        //Level
                        loadLevel(level2BossState);
                        //Boss
                        bossWidthScale = 60;
                        bossHeightScale = 45;
                        new Boss(20, 3, 15, 2);
                        //Saucer
                        saucerWidthScale = 30;
                        saucerHeightScale = 5;
                        saucerSpeedScale = 0.2;
                        new Saucer(gameWidth / 2 - saucerWidth / 2, boss.y + bossHeight + brickGap, true, 1);
                        //Update
                        updateGame();
                        totalBrickHealth = Number('Infinity');
                        break;
                    case 3:
                        //Level
                        topOffsetScale = 3;
                        leftRightOffsetScale = 2;
                        defaultBrickWidthScale = 65;
                        defaultBrickHeightScale = 45;
                        loadLevel(level3BossState);
                        //Boss
                        bossHeightScale = 45;
                        bossWidthScale = 50;
                        new Boss(25, 3, 30, 3);
                        //Update
                        updateGame();
                        totalBrickHealth = Number('Infinity');
                        break;
                    case 4:
                        //Level
                        defaultBrickHeightScale = 50;
                        defaultBrickWidthScale = 100;
                        brickGapScale = 0;
                        topOffsetScale = 0;
                        loadLevel(level4BossState);
                        //Boss
                        bossHeightScale = 30;
                        bossWidthScale = 46;
                        new Boss(27, 30, 9, 4);
                        //Update
                        updateGame();
                        totalBrickHealth = Number('Infinity');
                        break;
                    case 5:
                        //Level
                        defaultbrickHeightScale = 100;
                        defaultBrickWidthScale = 100;
                        loadLevel(level5BossState);
                        restartBrickShoot();
                        //Saucer
                        new Saucer(gameWidth / 2 - saucerWidth / 2, gameHeight / 3, true, 2);
                        //Boss
                        bossHeightScale = 50;
                        bossWidthScale = 26;
                        new Boss(37, 5, 12, 5);
                        //Update
                        updateGame();
                        totalBrickHealth = Number('Infinity');
                        $('#tips').html('Shoot between the brick gap');
                        break;
                    case 6:
                        //Level
                        defaultbrickHeightScale = 50;
                        loadLevel(level2BossState);
                        //Saucer
                        saucerHeightScale = 5;
                        saucerSpeedScale = 0.1;
                        //Boss
                        bossHeightScale = 45;
                        bossWidthScale = 40;
                        bossAssistDelay = 8000;
                        new Boss(25, 15, 120, 6);
                        //Update
                        updateGame();
                        totalBrickHealth = Number('Infinity');
                        $('#tips').html('The final battle');
                        break;
                }

                bossIsSpawn = true;

                //Auto launch
                new Timer(function(){
                    starLaunch();
                }, 1000);
            }, 1000);
        }
    }
}

//Check if boss dead >> remove
function checkBossIsDead(){
    if (bossIsSpawn && boss != null && boss.type == 6){
        if (boss.health == Math.floor(bossMaxHealth / 4 * 3)) {
            bossPhaseTimer = new Timer(function(){
                bossAssistDelay = 7000;
                restartBossAssist();
                new Saucer(gameWidth / 2 - saucerWidth / 2, 0, true, 2);
            }, 500);

        } else if (boss.health == Math.floor(bossMaxHealth / 4 * 2)) {
            bossPhaseTimer = new Timer(function(){
                bossAssistDelay = 6000;
                restartBossAssist();
                saucerArr.forEach(function(saucer){
                    saucer.isRemove = true;
                });
                new Saucer(gameWidth / 2 - saucerWidth / 2, 0, true, 3);
                new Saucer(gameWidth / 2 - saucerWidth / 2, 0, true, 2);
            }, 500);
        } else if (boss.health == Math.floor(bossMaxHealth / 4 * 1)) {
            bossPhaseTimer = new Timer(function(){
                saucerArr.forEach(function(saucer){
                    saucer.isRemove = true;
                });
                saucerSpeedScale = 0.4;
                bossSpeedScale = 0.2;
                new Saucer(gameWidth / 2 - saucerWidth / 2, 0, true, 2);
                new Saucer(gameWidth / 2 - saucerWidth / 2, 0, false, 3);
            }, 500);
        }
    } else {
        //Boss phase
        if (boss.health == Math.floor(bossMaxHealth / 3 * 2)){ //Health < 2/3 >> phase 2
            currentPhase++;
            switch(boss.type){
                case 1:
                    bossPhaseTimer = new Timer(function(){
                        for (let j = 1; j < brickCols - 1; j++){
                            brickArr[brickRows - 1][j].type = 3;
                            updateBricks();
                        }
                    }, 500);
                    break;
                case 2:
                    bossPhaseTimer = new Timer(function(){
                        saucerWidthScale = 24;
                        saucerHeightScale = 6;
                        saucerSpeedScale = 0.25;
                        saucerArr.forEach(function(saucer){
                            saucer.isRemove = true;
                        });
                        new Saucer(gameWidth / 2 - saucerWidth / 2, boss.y + bossHeight + brickGap, true, 1);
                        new Saucer(gameWidth / 2 - saucerWidth / 2, boss.y + bossHeight + brickGap, false, 1);
                    }, 500);
                    break;
                case 3:
                    bossPhaseTimer = new Timer(function(){
                        for (let i = 0; i < brickRows - 1; i++){
                            brickArr[i][1].type = 5;
                            updateBricks();
                        }
                        saucerWidthScale = 17;
                        saucerHeightScale = 5;
                        saucerSpeedScale = 0.2;
                        new Saucer(boss.x, boss.y + bossHeight, false, 1);
                    }, 500);
                    break;
                case 4:
                    bossPhaseTimer = new Timer(function(){
                        brickArr[0][0].type = 8;
                        brickArr[0][1].type = 8;
                        brickArr[0][2].type = 8;
                        brickArr[0][brickCols - 3].type = 8;
                        brickArr[0][brickCols - 2].type = 8;
                        brickArr[0][brickCols - 1].type = 8;
                        updateBricks();
                        saucerWidthScale = 24;
                        saucerHeightScale = 3;
                        saucerSpeedScale = 0.35;
                        new Saucer(gameWidth / 2 - saucerWidth / 2, boss.y + bossHeight + brickGap, true, 3);
                    }, 1000);
                    break;
                case 5:
                    bossPhaseTimer = new Timer(function(){
                        brickArr[2][4].type = 1;
                        brickArr[2][5].type = 1;
                        brickArr[2][6].type = 1;
                        brickArr[3][4].type = 1;
                        brickArr[3][5].type = 7;
                        brickArr[3][6].type = 1;
                        brickArr[4][4].type = 1;
                        brickArr[4][5].type = 1;
                        brickArr[4][6].type = 1;

                        brickArr[2][brickCols - 5].type = 1;
                        brickArr[2][brickCols - 6].type = 1;
                        brickArr[2][brickCols - 7].type = 1;
                        brickArr[3][brickCols - 5].type = 1;
                        brickArr[3][brickCols - 6].type = 7;
                        brickArr[3][brickCols - 7].type = 1;
                        brickArr[4][brickCols - 5].type = 1;
                        brickArr[4][brickCols - 6].type = 1;
                        brickArr[4][brickCols - 7].type = 1;

                        updateBricks();
                        restartBrickShoot();
                    }, 500);
                    break;
            }
        } else if (boss.health == Math.floor(bossMaxHealth / 3)){ //Health < 1/3 >> phase 3
            currentPhase++;
            switch (boss.type) {
                case 1:
                    bossPhaseTimer = new Timer(function(){
                        for (let j = 1; j < brickCols - 1; j++){
                            brickArr[brickRows - 1][j].type = 6;
                            updateBricks();
                        }
                    }, 500);
                    break;
                case 2:
                    bossPhaseTimer = new Timer(function(){
                        saucerWidthScale = 17;
                        saucerHeightScale = 5;
                        saucerSpeedScale = 0.15;
                        saucerArr.forEach(function(saucer){
                            saucer.isRemove = true;
                        });
                        new Saucer(boss.x, boss.y + bossHeight + brickGap, false, 1);
                        new Saucer(boss.x + bossWidth - saucerWidth, boss.y + bossHeight + brickGap, true, 1);
                        new Saucer(gameWidth / 2 - saucerWidth / 2, boss.y + bossHeight + saucerHeight * 2 + brickGap * 3, true, 1);
                    }, 500);
                    break;
                case 3:
                    bossPhaseTimer = new Timer(function(){
                        for (let i = 0; i < brickRows - 1; i++){
                            brickArr[i][brickCols - 2].type = 5;
                            updateBricks();
                        }
                    }, 500);
                    break;
                case 4:
                    bossPhaseTimer = new Timer(function(){
                        for (let j = 2; j < brickCols - 2; j++){
                            brickArr[0][j].type = 0;
                        }
                        updateBricks();
                        new Saucer(gameWidth / 2 - saucerWidth / 2, brickArr[1][0].y, true, 3);
                    }, 1000);
                    break;
                case 5:
                    bossPhaseTimer = new Timer(function(){
                        brickArr[2][4].type = 5;
                        brickArr[2][5].type = 5;
                        brickArr[2][6].type = 5;
                        brickArr[3][4].type = 5;
                        brickArr[3][5].type = 7;
                        brickArr[3][6].type = 5;
                        brickArr[4][4].type = 5;
                        brickArr[4][5].type = 5;
                        brickArr[4][6].type = 5;

                        brickArr[0][brickCols - 5].type = 5;
                        brickArr[0][brickCols - 6].type = 5;
                        brickArr[0][brickCols - 7].type = 5;
                        brickArr[1][brickCols - 5].type = 5;
                        brickArr[1][brickCols - 6].type = 7;
                        brickArr[1][brickCols - 7].type = 5;
                        brickArr[2][brickCols - 5].type = 5;
                        brickArr[2][brickCols - 6].type = 5;
                        brickArr[2][brickCols - 7].type = 5;
                        brickArr[3][brickCols - 5].type = 0;
                        brickArr[3][brickCols - 6].type = 0;
                        brickArr[3][brickCols - 7].type = 0;
                        brickArr[4][brickCols - 5].type = 0;
                        brickArr[4][brickCols - 6].type = 0;
                        brickArr[4][brickCols - 7].type = 0;

                        updateBricks();
                        clearSaucers();
                        restartBrickShoot();
                    }, 500);
                    break;
            }
        }
    }

    if (boss.health <= 0 && bossIsSpawn == true){ //Dead >> remove >> next level
        //Reset
        currentPhase = 1;
        currentLevel++;
        //Clear
        fadeStars();
        clearLevel();
        clearItems();
        clearBullets();
        clearBossAssist();
        forceRestart();
        setTimeout(function(){
            bossIsSpawn = false;
            life++;
            clearItems();
            clearBossAssist();
            if (currentLevel != 7){
                showEvent(2);
            } else {
                showEvent(3);
            }
        }, 1000);
    }
}

//Update HUD
function updateHUD(){
    //HUD
    $('#life').html('Life: ' + Number((life).toFixed(1)) + '&nbsp;<i class="fa fa-heart" aria-hidden="true"></i>');
    if (bossIsSpawn && boss != null){
        $('#health').html('<i class="fa fa-battery-three-quarters" aria-hidden="true"></i>' + '&nbsp;Boss: ' + boss.health);
    } else {
        $('#health').html('');
    }
}

//Update game (for resize purpose)
function updateGame(){
    //Panel
    oldWidth = gameWidth;
    gameWidth = parseFloat(main.innerWidth());
    gameHeight = parseFloat(main.innerHeight());
    //Ship
    updateGameShip();
    //Bricks
    updateGameBricks();
    //Stars
    updateGameStars();
    //Item
    updateGameItems();
    //Bullet
    updateGameBullets();
    //Saucer
    updateGameSaucers();
    //Boss
    updateGameBoss();
    //HUD
    updateHUD();
    //Width
    console.log('w: ' + gameWidth + ' - h: ' + gameHeight);
}

//Custom timer (pauseable timeout)
function Timer(callback, delay) {
    var args = arguments,
        self = this,
        timer, start;

    this.clear = function () {
        clearTimeout(timer);
    };

    this.pause = function () {
        this.clear();
        delay -= new Date() - start;
    };

    this.resume = function () {
        if (delay <= 0){
            this.clear();
        } else {
            start = new Date();
            timer = setTimeout(function () {
                callback.apply(self, Array.prototype.slice.call(args, 2, args.length));
            }, delay);
        }
    };

    this.complete = function(){
        return (delay <= 0);
    }

    this.resume();
}