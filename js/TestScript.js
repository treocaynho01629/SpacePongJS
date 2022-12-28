$(function () {
    var anim_id; //Animation loop
    unlockedLevels = localStorage.getItem("saved"); //Local storage for progression save
    if (unlockedLevels != null) currentLevel = parseInt(unlockedLevels);
    console.log('current: ' + unlockedLevels); //Test

    //Update when resize
    $(window).on('resize', function(){
        if(!isMenu){
            updateGame();
            update();
        }
    });

    //Pause when tab out
    $(window).focus(function() {
        if (!isPause && !isMenu){
            updateGame();
            update();
            togglePause(true);
        }
    });

    //Update main game
    function update(){
        updateShip();
        updateSaucer();
        updateStars();
        updateItems();
        updateBullets();
        if (bossIsSpawn){
            updateBoss();
        }
        updateHUD();
    }

    //Start game
    function startGame(){
        //Ship
        new Ship(0, 2);
        //Default star
        new Star(-50, -50, 0, 0, false);
        //Assist
        assistTimer();
        //Level
        switchLevel();
        //Start loop
        anim_id = requestAnimationFrame(gameLoop);
        updateGame();
    }

    //Menu & bind stuff
    $('.level_btn').prop('disabled', true);
    for (let i = 1; i <= unlockedLevels; i++){
        $('#level' + i).prop('disabled', false);
        $('#level' + i).on('click', function(){
           currentLevel = i;
           main.show();
           menu.hide();
           isMenu = false;
           startGame();
        });
    }

    $(document).on('click', '#start_btn', function () {
        main.show();
        menu.hide();
        isMenu = false;
        startGame();
    });
    $(document).on('click', '#choose_btn', function () {
        $('.level').toggle();
    });
    $(document).on('click', '#help_btn', function () {
        $('#help_menu').toggle();
    });
    $(document).on('click', '#help_menu', function () {
        $('#help_menu').toggle();
    });
    $(document).on('click', '#resume_btn', function () {
        togglePause();
    });
    $(document).on('click', '#restart_btn', function () {
        togglePause();
        hardRestart();
    });
    $(document).on('click', '#quit_btn', function () {
        stopGame();
    });
    $(document).on('click', '#event', function () {
        hardRestart();
        event.html('');
        $('#tips').html('');
        console.log('reset');
    });

    $(document).on('keydown', function (e) {
        var key = e.keyCode;
        if (key === 27){
            togglePause();
        }
    });

    //Pause
    function togglePause(forcePause){
        if (!isMenu){
            if (forcePause){
                isPause = true;
                //Animation
                cancelAnimationFrame(anim_id);
                //Timer
                if (saucerShootTimer != null) saucerShootTimer.pause();
                if (brickShootTimer != null) brickShootTimer.pause();
                if (shootLoop != null) shootLoop.pause();
                if (shootLoopUpgrade != null) shootLoopUpgrade.pause();
                if (wideTime != null) wideTime.pause();
                if (powerTime != null) powerTime.pause();
                if (sideTime != null) sideTime.pause();
                if (bossPhaseTimer != null) bossPhaseTimer.pause();
                if (shieldTime != null) shieldTime.pause();
                if (assistTime != null) assistTime.pause();
                if (bossTime != null) bossTime.pause();
                if (brickTimer.length > 0){
                    for (let i = 0; i < brickTimer.length; i++){
                        brickTimer[i].pause();
                    }
                }
                if (bulletTimer.length > 0){
                    for (let i = 0; i < bulletTimer.length; i++){
                        bulletTimer[i].pause();
                    }
                }
                if (itemTimer.length > 0){
                    for (let i = 0; i < itemTimer.length; i++){
                        itemTimer[i].pause();
                    }
                }
                pause.show();
            } else {
                if (isPause){
                    isPause = !isPause;
                    anim_id = requestAnimationFrame(gameLoop);
                    //Animation
                    if (saucerShootTimer != null) saucerShootTimer.resume();
                    if (brickShootTimer != null) brickShootTimer.resume();
                    if (shootLoop != null) shootLoop.resume();
                    if (shootLoopUpgrade != null) shootLoopUpgrade.resume();
                    if (wideTime != null) wideTime.resume();
                    if (powerTime != null) powerTime.resume();
                    if (sideTime != null) sideTime.resume();
                    if (bossPhaseTimer != null) bossPhaseTimer.resume();
                    if (shieldTime != null) shieldTime.resume();
                    if (assistTime != null) assistTime.resume();
                    if (bossTime != null) bossTime.resume();
                    if (brickTimer.length > 0){
                        for (let i = 0; i < brickTimer.length; i++){
                            brickTimer[i].resume();
                        }
                    }
                    if (bulletTimer.length > 0){
                        for (let i = 0; i < bulletTimer.length; i++){
                            bulletTimer[i].resume();
                        }
                    }
                    if (itemTimer.length > 0){
                        for (let i = 0; i < itemTimer.length; i++){
                            itemTimer[i].resume();
                        }
                    }
                    pause.hide();
                } else {
                    isPause = !isPause;
                    cancelAnimationFrame(anim_id);
                    //Animation
                    if (saucerShootTimer != null) saucerShootTimer.pause();
                    if (brickShootTimer != null) brickShootTimer.pause();
                    if (shootLoop != null) shootLoop.pause();
                    if (shootLoopUpgrade != null) shootLoopUpgrade.pause();
                    if (wideTime != null) wideTime.pause();
                    if (powerTime != null) powerTime.pause();
                    if (sideTime != null) sideTime.pause();
                    if (bossPhaseTimer != null) bossPhaseTimer.pause();
                    if (shieldTime != null) shieldTime.pause();
                    if (assistTime != null) assistTime.pause();
                    if (bossTime != null) bossTime.pause();
                    if (brickTimer.length > 0){
                        for (let i = 0; i < brickTimer.length; i++){
                            brickTimer[i].pause();
                        }
                    }
                    if (bulletTimer.length > 0){
                        for (let i = 0; i < bulletTimer.length; i++){
                            bulletTimer[i].pause();
                        }
                    }
                    if (itemTimer.length > 0){
                        for (let i = 0; i < itemTimer.length; i++){
                            itemTimer[i].pause();
                        }
                    }
                    pause.show();
                }
            }
        }
    }

    //Gameloop
    let lastTime = 0;

    function gameLoop(timestamp) {

        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        update(deltaTime);
        anim_id = requestAnimationFrame(gameLoop);
    }
});
