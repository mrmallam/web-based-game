
const player = document.getElementById('player');
const enemies = document.querySelectorAll(".enemy");
const gameArea = document.querySelector('.game_screen_level1, .game_screen_level2, .game_screen_level3');
const valuePack = document.querySelectorAll('.valuePack');
const hearts = document.querySelectorAll('.heart');
const initial_player_vertical = gameArea.clientHeight - player.offsetHeight;
const initial_player_horizontal = gameArea.clientWidth - player.offsetWidth;
const valuePack_container = document.querySelector('.valuepacks_container');
const player_speed = 5; // 50px per keypress
let player_vertical = player.getBoundingClientRect().top;
let player_horizontal = player.getBoundingClientRect().left;
let Time = 120; // 2 minutes in seconds
let playerScoreCount = 0;
let playerCharacterState = "normal";
let keyPickedUp = false;
let player_lifeCount = 3;
var player_lifeCountElement = document.querySelector('.player_lives');
player_lifeCountElement.textContent = player_lifeCount;
let gameState = true;
let soundPlayed = false;

var level1Music = new Audio('./assets/audio/Level_1.wav');
level1Music.play();

var hammer = new Audio('./assets/audio/hammer.wav');
var sheild = new Audio('./assets/audio/sheild.wav');
var key = new Audio('./assets/audio/key.wav');
var heart = new Audio('./assets/audio/heart.wav');
var obstacleHit = new Audio('./assets/audio/obsticleHit.wav');
var timerSound = new Audio('./assets/audio/timerSound.wav');

while (gameState === true && soundPlayed === true){
    level1Music.play();
}

function playSound(effect) {
    if (!gameState){
        return;
    }
    switch(effect) {
        case 'hammer':
            hammer.play();
            break;
        case 'sheild':
            sheild.play();
            break;
        case 'key':
            key.play();
            break;
        case 'heart':
            heart.play();
            break;
        case 'obstacleHit':
            obstacleHit.play();
            break;
        case 'timerSound':
            timerSound.play();
            break;
    }
}


Start_Game_Loop();
Start_Count_Down();
Reset_Player_Position();
Randomize_ValuePack_Position();
Randomize_Hearts_Position();
Randomize_ReduceSpeed_Position();
Randomize_hammer_Position();
Randomize_sheild_Position();

// -----------------------------PLAYER MOVEMENT LOGIC-----------------------------
function Reset_Player_Position() {
    player.style.top = '100px';
    player.style.left = '';
    player.style.right = '0px';

    player_vertical = 400;
    player_horizontal = window.innerWidth - player.offsetWidth;

}

// Player movement

function updatePlayerView(direction) {
    const playerView = document.getElementById('player');

    if (playerCharacterState === "normal"){
        switch(direction) {
            case 'up':
                playerView.style.backgroundImage = "url('./assets/mainChar_front.png')";
                break;
            case 'down':
                playerView.style.backgroundImage = "url('./assets/mainChar_front.png')";
                break;
            case 'left':
                playerView.style.backgroundImage = "url('./assets/mainChar_left.png')";
                break;
            case 'right':
                playerView.style.backgroundImage = "url('./assets/mainChar_right.png')";
                break;
        }
    }
    else if (playerCharacterState === "hammer"){
        switch(direction) {
            case 'up':
                playerView.style.backgroundImage = "url('./assets/mainChar_front_hammer.png')";
                break;
            case 'down':
                playerView.style.backgroundImage = "url('./assets/mainChar_front_hammer.png')";
                break;
            case 'left':
                playerView.style.backgroundImage = "url('./assets/mainChar_left_hammer.png')";
                break;
            case 'right':
                playerView.style.backgroundImage = "url('./assets/mainChar_right_hammer.png')";
                break;
        }
    }
    else if (playerCharacterState === "sheild"){
        switch(direction) {
            case 'up':
                playerView.style.backgroundImage = "url('./assets/mainChar_front_sheild.png')";
                break;
            case 'down':
                playerView.style.backgroundImage = "url('./assets/mainChar_front_sheild.png')";
                break;
            case 'left':
                playerView.style.backgroundImage = "url('./assets/mainChar_left_sheild.png')";
                break;
            case 'right':
                playerView.style.backgroundImage = "url('./assets/mainChar_right_sheild.png')";
                break;
        }
    }
}

document.getElementById('muteButton').addEventListener('click', function() {
    var icon = document.getElementById('audioIcon');
    if (level1Music.paused) {
        soundPlayed = true;
        level1Music.play();
        icon.src = 'https://img.icons8.com/ios-filled/50/high-volume--v1.png';
    } else {
        soundPlayed = false;
        level1Music.muted = !level1Music.muted;
        icon.src = level1Music.muted ? 'https://img.icons8.com/ios-filled/50/no-audio--v1.png' : 'https://img.icons8.com/ios-filled/50/high-volume--v1.png';
    }


});

// Define movement flags
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;

// Adjusted keydown event listener
document.addEventListener('keydown', function(event) {
    if (!gameState) {
        return;
    }
    switch(event.key) {
        case 'ArrowUp':
            moveUp = true;
            updatePlayerView('up');
            break;
        case 'ArrowDown':
            moveDown = true;
            updatePlayerView('down');
            break;
        case 'ArrowLeft':
            moveLeft = true;
            updatePlayerView('left');
            break;
        case 'ArrowRight':
            moveRight = true;
            updatePlayerView('right');
            break;
    }
});

// Keyup event listener to stop movement
document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'ArrowUp': moveUp = false; break;
        case 'ArrowDown': moveDown = false; break;
        case 'ArrowLeft': moveLeft = false; break;
        case 'ArrowRight': moveRight = false; break;
    }
});

// Smooth movement function
function smoothMovePlayer() {
    if (!gameState) {
        return;
    }

    if (moveUp) {
        player_vertical -= player_speed;
    }
    if (moveDown) {
        player_vertical += player_speed;
    }
    if (moveLeft) {
        player_horizontal -= player_speed;
    }
    if (moveRight) {
        player_horizontal += player_speed;
    }

    // Check boundaries
    if (player_vertical > 0 && (player_vertical + player.offsetHeight) < gameArea.offsetHeight) {
        player.style.top = `${player_vertical}px`;
    }
    if (player_horizontal > 0 && (player_horizontal + player.offsetWidth) < gameArea.offsetWidth) {
        player.style.left = `${player_horizontal}px`;
    }

    requestAnimationFrame(smoothMovePlayer);
}

// Start the smooth movement
smoothMovePlayer();


// ----------------------------- Game Loop/Bullets/Collision Detection -----------------------------`
// Game loop function
function updateGame() {
    if (!gameState) {
        return;
    }
    moveEnemies();

    checkCollisions();

    checkPortal();

    checkIfLost();

    requestAnimationFrame(updateGame);
}

// Move Enemies
function moveEnemies() {
    if (!gameState) {
        return;
    }

    enemies.forEach((enemy) => {
        let direction = enemy.dataset.direction === "1" ? 1 : -1;
        let speed = parseFloat(enemy.dataset.speed);
        let currentPosition = parseFloat(enemy.style.top);

        currentPosition += speed * direction; // Multiply by direction to determine movement direction

        // If enemy reaches the bottom, change direction to move upwards
        if (currentPosition > 100) {
            direction = -1;

            // replace enemy background image
            enemy.style.backgroundImage = "url('./assets/rockFire_up.png')";
        }
        // If enemy reaches the top, change direction to move downwards
        if (currentPosition < -5) {
            direction = 1;

            // replace enemy background image
            enemy.style.backgroundImage = "url('./assets/rockFire_down.png')";
        }

        enemy.dataset.direction = direction.toString();
        enemy.style.top = `${currentPosition}vh`;
    });
}

// Store original speeds of enemies
let originalSpeeds = new Map();

// Slow down enemies
function slowDownEnemies() {
    enemies.forEach((enemy) => {
        let speed = parseFloat(enemy.dataset.speed);

        // Store original speed if not already stored
        if (!originalSpeeds.has(enemy)) {
            originalSpeeds.set(enemy, speed);
        }

        let tempSpeed = speed/2;
        enemy.dataset.speed = tempSpeed.toString();
    });

    // Restore original speeds after 5 seconds
    setTimeout(restoreSpeeds, 5000);
}

// Restore the original speeds of the enemies
function restoreSpeeds() {
    enemies.forEach((enemy) => {
        if (originalSpeeds.has(enemy)) {
            enemy.dataset.speed = originalSpeeds.get(enemy).toString();
        }
    });

    // Clear the original speeds
    originalSpeeds.clear();
}


// this function will add or remove hammer from the player by updating the player's image
function addRemove_hammer(action) {
    const playerView = document.getElementById('player');

    if (action === 'add') {
        playerView.style.backgroundImage = "url('./assets/mainChar_front_hammer.png')";

        // increment hammer count
        const hammerCount = document.querySelector('.hammers_count');
        hammerCount.textContent++;

    }
    else if (action === 'remove') {
        playerView.style.backgroundImage = "url('./assets/mainChar_front.png')";

        // decrement hammer count
        const hammerCount = document.querySelector('.hammers_count');
        hammerCount.textContent--;
    }
}

// this function will add or remove sheild from the player by updating the player's image
function addRemove_sheild(action) {
    const playerView = document.getElementById('player');

    if (action === 'add') {
        playerView.style.backgroundImage = "url('./assets/mainChar_front_sheild.png')";

        // add a 5 seconds timer for the sheild to be active, then remove it
        setTimeout(function(){
            playerView.style.backgroundImage = "url('./assets/mainChar_front.png')";
            playerCharacterState = "normal";
        }, 5000);

    }
    else if (action === 'remove') {
        playerView.style.backgroundImage = "url('./assets/mainChar_front.png')";

        // decrement sheild count
        // const sheildCount = document.querySelector('.sheilds_count');
        // sheildCount.textContent--;
    }
}


function checkCollisions() {
    const playerRect = player.getBoundingClientRect();
    
    // Check collision for each enemy
    enemies.forEach((enemy) => {
        const enemyRect = enemy.getBoundingClientRect();
        // Check collision for player
        if (rectsIntersect(enemyRect, playerRect)) {

            // if player has hammer, remove emenmy and hammer
            if (playerCharacterState === "hammer"){
                enemy.style.display = 'none';
                addRemove_hammer("remove");
                playerCharacterState = "normal";
            }
            else if (playerCharacterState === "sheild"){
                // enemy.style.display = 'none';
                // addRemove_sheild("remove");
                playerCharacterState = "sheild";
            }
            else{
                // else reset player position and decrement life count
                Reset_Player_Position();
                player_lifeCount = player_lifeCount - 1;
                updateLifeCount(player_lifeCount);
                playerCharacterState = "normal";
                playSound('obstacleHit');
            }
        }
    });

    // Check collision for each heart
    hearts.forEach((valuePac) => {
        const heartsRect = valuePac.getBoundingClientRect();
        if (rectsIntersect(heartsRect, playerRect)) {
            valuePac.style.display = 'none';
            player_lifeCount = player_lifeCount + 1;
            updateLifeCount(player_lifeCount);
            playSound('heart');
        }
    });

    // Check collision for each reduceSpeed
    const reduceSpeed = document.querySelectorAll('.reduceSpeed');
    reduceSpeed.forEach((valuePac) => {
        const reduceSpeedRect = valuePac.getBoundingClientRect();
        if (rectsIntersect(reduceSpeedRect, playerRect)) {
            playSound("timerSound");
            valuePac.style.display = 'none';
            slowDownEnemies();
        }
    });

    // Check collision for each hammers
    const hammers = document.querySelectorAll('.hammer');
    hammers.forEach((hammer) => {
        const hammerRect = hammer.getBoundingClientRect();
        if (rectsIntersect(hammerRect, playerRect)) {
            hammer.style.display = 'none';
            addRemove_hammer("add");
            playerCharacterState = "hammer";
            playSound("hammer");
        }
    });

    // Check collision for each sheilds
    const sheilds = document.querySelectorAll('.sheild');
    sheilds.forEach((sheild) => {
        const sheildRect = sheild.getBoundingClientRect();
        if (rectsIntersect(sheildRect, playerRect)) {
            playerCharacterState = "sheild";
            sheild.style.display = 'none';
            addRemove_sheild("add");
            playSound("sheild");
        }
    });

    // Check collision for key
    const key = document.getElementById('key');
    const keyRect = key.getBoundingClientRect();
    if (rectsIntersect(keyRect, playerRect)) {
        key.style.display = 'none';
        keyPickedUp = true;

        // display the portal
        const portal = document.getElementById('portal');
        portal.style.display = 'block';
        playSound("key");
        
    }

}

// Collision detection function
function rectsIntersect(rectA, rectB) {
    return !(rectA.right < rectB.left || 
             rectA.left > rectB.right || 
             rectA.bottom < rectB.top || 
             rectA.top > rectB.bottom);
}

// Initialize enemy positions and directions
enemies.forEach((enemy) => {
    // Assign a random speed to each enemy, between 1 and 3
    enemy.dataset.speed = (Math.random() * 1 + 1).toString();
    enemy.dataset.direction = "1"; // Direction 1 for down, -1 for up
    enemy.style.top = "-20vh"; // Start above the view
});

// -----------------------------Randomize Positions for ValuePack/Starts/Hearts-----------------------------
function Randomize_ValuePack_Position() {
    const containerRect = valuePack_container.getBoundingClientRect();

    valuePack.forEach((VP) => {
        VP.style.top = Math.random() * (containerRect.height - VP.clientHeight) + "px";
        VP.style.left = Math.random() * (containerRect.width - VP.clientWidth) + "px";
    });
}
function Randomize_Hearts_Position() {
    const hearts = document.querySelectorAll('.heart');
    const containerRect = valuePack_container.getBoundingClientRect();

    hearts.forEach((heart) => {
        heart.style.top = Math.random() * (containerRect.height - heart.clientHeight) + "px";
        heart.style.left = Math.random() * (containerRect.width - heart.clientWidth) + "px";
    });
}
function Randomize_ReduceSpeed_Position() {
    const reduceSpeed = document.querySelectorAll('.reduceSpeed');
    const containerRect = valuePack_container.getBoundingClientRect();

    reduceSpeed.forEach((heart) => {
        heart.style.top = Math.random() * (containerRect.height - heart.clientHeight) + "px";
        heart.style.left = Math.random() * (containerRect.width - heart.clientWidth) + "px";
    });
}

function Randomize_hammer_Position() {
    const hammers = document.querySelectorAll('.hammer');
    const containerRect = valuePack_container.getBoundingClientRect();

    hammers.forEach((hammer) => {
        hammer.style.top = Math.random() * (containerRect.height - hammer.clientHeight) + "px";
        hammer.style.left = Math.random() * (containerRect.width - hammer.clientWidth) + "px";
    });
}

function Randomize_sheild_Position() {
    const sheilds = document.querySelectorAll('.sheild');
    const containerRect = valuePack_container.getBoundingClientRect();

    sheilds.forEach((sheild) => {
        sheild.style.top = Math.random() * (containerRect.height - sheild.clientHeight) + "px";
        sheild.style.left = Math.random() * (containerRect.width - sheild.clientWidth) + "px";
    });
}

function updateValuePacPositions() {

    const containerRect = valuePack_container.getBoundingClientRect();

    valuePack.forEach((VP) => {
        VP.style.top = Math.random() * (containerRect.height - VP.clientHeight) + "px";
        VP.style.left = Math.random() * (containerRect.width - VP.clientWidth) + "px";
    });
}

function updateHeartsPositions() {

    const hearts = document.querySelectorAll('.heart');
    const containerRect = valuePack_container.getBoundingClientRect();

    hearts.forEach((heart) => {
        heart.style.top = Math.random() * (containerRect.height - heart.clientHeight) + "px";
        heart.style.left = Math.random() * (containerRect.width - heart.clientWidth) + "px";
    });
}

function updateReduceSpeedPositions() {

    const reduceSpeed = document.querySelectorAll('.reduceSpeed');
    const containerRect = valuePack_container.getBoundingClientRect();

    reduceSpeed.forEach((heart) => {
        heart.style.top = Math.random() * (containerRect.height - heart.clientHeight) + "px";
        heart.style.left = Math.random() * (containerRect.width - heart.clientWidth) + "px";
    });
}

function updateHammerPositions() {
    const hammers = document.querySelectorAll('.hammer');
    const containerRect = valuePack_container.getBoundingClientRect();

    hammers.forEach((hammer) => {
        hammer.style.top = Math.random() * (containerRect.height - hammer.clientHeight) + "px";
        hammer.style.left = Math.random() * (containerRect.width - hammer.clientWidth) + "px";
    });
}

function updateSheildPositions() {
    const sheilds = document.querySelectorAll('.sheild');
    const containerRect = valuePack_container.getBoundingClientRect();

    sheilds.forEach((sheild) => {
        sheild.style.top = Math.random() * (containerRect.height - sheild.clientHeight) + "px";
        sheild.style.left = Math.random() * (containerRect.width - sheild.clientWidth) + "px";
    });
}

if (gameState) {
    setInterval(updateValuePacPositions, 5000); // 5 seconds
    setInterval(updateHeartsPositions, 7000); // 3 seconds
    setInterval(updateReduceSpeedPositions, 7000); // 7 seconds
    setInterval(updateHammerPositions, 10000); // 10 seconds
    setInterval(updateSheildPositions, 15000); // 15 seconds
}


// Start the game loop
function Start_Game_Loop() {
    requestAnimationFrame(updateGame);
}

// ----------------------------- Check loosing condition -----------------------------
function checkIfLost() {
    const youLost_menu = document.querySelector('.loose_container');

    if (player_lifeCount <= 0) {
        youLost_menu.style.display = 'flex';
        gameState = false;

        const gameScreenLevel1 = document.querySelector('.game_screen_level1');
        const children = gameScreenLevel1.children;
    
        for (let i = 0; i < children.length; i++) {
            children[i].style.display = 'none';
        }

        const portal = document.querySelector('.portal');
        portal.style.display = 'none';
        
    }
}

// ----------------------------- Score and Life Count -----------------------------
function updateScoreCount(whichPlayer){
    const playerScore = document.querySelector(".player_score_count");
    if(whichPlayer === 1){
        playerScoreCount += 10;
        playerScore.textContent = playerScoreCount;
    }
}

function updateLifeCount(newLifeCount) {
    player_lifeCount = newLifeCount;
    player_lifeCountElement.textContent = player_lifeCount;
}

// ----------------------------- Door & Winning -----------------------------
function checkPortal() {
    const portal = document.getElementById('portal');
    const portal_rect = portal.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    const youLost_menu = document.querySelector('.loose_container');

    // if player collides with portal and has key, then go to level 2 "2-level.html"
    if (rectsIntersect(portal_rect, playerRect) && keyPickedUp) {


        gameState = false;
        var game_screen_level1 = document.querySelector('.game_screen_level1');
        var gameStatus = document.querySelector('.gameStatus');
        var otherscreen = document.getElementById('pause_menu_container');
        youLost_menu.style.display = 'none';

        game_screen_level1.style.display = 'none';
        gameStatus.style.display = 'none';
        otherscreen.style.display = 'none';

        level1Music.pause();
        
        var video = document.getElementById('lvl1Tolvl2_video');
        video.style.display = 'block'; // Show the video
        video.play();



        video.onended = function() {
            localStorage.setItem("heartslvl1", player_lifeCount);
            window.location.href = `./2-level.html`; // Redirect after video ends
        };
    }
}

// -----------------------------TIME LOGIC-----------------------------
// Format time to M:SS
function formatTime(minutes, seconds) {
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function Start_Count_Down() {
    var Time = 0; // Initialize Time to 0
    var timeCountElement = document.getElementById('time_count');
    var countdownTimer = setInterval(function() {
        Time++; // Increment Time by 1
        var minutes = Math.floor(Time / 60);
        var seconds = Time % 60;
        timeCountElement.textContent = formatTime(minutes, seconds);
    }, 1000);
}


// ---------------------------------------PAUSE BUTTON MENU LOGIC-----------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const pause_btn = document.getElementById('level_inGame_Menu_Btn');
    const pause_menu_container = document.getElementById('pause_menu_container')
    const resume_btn = document.getElementById('resume_button')
    const howToPlayButton = document.querySelector('#howToPlay_button');
    const howToPlayContainer = document.querySelector('.howToPlayModal_container');

    pause_btn.addEventListener('click', function(event) {
        event.stopPropagation(); // Stop event from propagating to the document
        pause_menu_container.style.display = 'flex';
    });

    resume_btn.addEventListener('click', function(event) {
        pause_menu_container.style.display = 'none';
    });

    howToPlayButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Stop event from propagating to the document
        howToPlayContainer.style.display = 'flex';
    });
    
    document.addEventListener('click', function(event) {
        // Hide howToPlayContainer if it's visible
        if(howToPlayContainer.style.display === 'flex') {
            howToPlayContainer.style.display = 'none';
        }
    });
});
