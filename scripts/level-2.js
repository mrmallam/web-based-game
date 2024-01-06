
const player = document.getElementById('player');
const gameArea = document.querySelector('.game_screen_level1, .game_screen_level2, .game_screen_level3');
const valuePack = document.querySelectorAll('.valuePack');
const hearts = document.querySelectorAll('.heart2');
const initial_player_vertical = gameArea.clientHeight - player.offsetHeight;
const initial_player_horizontal = gameArea.clientWidth - player.offsetWidth;
const valuePack_container = document.querySelector('.valuepacks_container');
const player_speed = 30; // 50px per keypress
let player_vertical = player.getBoundingClientRect().top;
let player_horizontal = player.getBoundingClientRect().left;
// let player_lifeCount = 10;
let Time = 120; // 2 minutes in seconds
let playerScoreCount = 0;
let playerCharacterState = "normal";
let keyPickedUp = false;
var player_lifeCountElement = document.querySelector('.player_lives');

let gameState = true;


var heartsfromlvl1 = localStorage.getItem("heartslvl1");
let player_lifeCount = parseInt(heartsfromlvl1, 10);

var sheild = new Audio('./assets/audio/sheild.wav');
var key = new Audio('./assets/audio/key.wav');
var heart = new Audio('./assets/audio/heart.wav');
var obstacleHit = new Audio('./assets/audio/obsticleHit.wav');

function playSound(effect) {
    if (!gameState){
        return;
    }
    switch(effect) {
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
    }
}

Start_Game_Loop();
Start_Count_Down();
Reset_Player_Position();

player_lifeCountElement.textContent = player_lifeCount;

// -----------------------------PLAYER MOVEMENT LOGIC-----------------------------
function Reset_Player_Position() {
    player.style.top = '400px';
    player.style.left = '1350px';

    player_vertical = 400;
    player_horizontal = 1350;
}

document.getElementById('muteButton').addEventListener('click', function() {
    var audio = document.getElementById('main_sound');
    var icon = document.getElementById('audioIcon');
    if (audio.paused) {
        audio.play();
        icon.src = 'https://img.icons8.com/ios-filled/50/high-volume--v1.png';
    } else {
        audio.muted = !audio.muted;
        icon.src = audio.muted ? 'https://img.icons8.com/ios-filled/50/no-audio--v1.png' : 'https://img.icons8.com/ios-filled/50/high-volume--v1.png';
    }
});

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


// -----------------------------WALL COLLISION LOGIC-----------------------------

const walls = document.querySelectorAll('.wall'); // Select all walls

// Function to check for collision with any wall
function isCollidingWithAnyWall(player, walls) {
    return Array.from(walls).some(wall => isColliding(player, wall));
}

// Function to check for collision with a specific wall
function isColliding(player, wall) {
    const playerRect = player.getBoundingClientRect();
    const wallRect = wall.getBoundingClientRect();

    return !(
        playerRect.top > wallRect.bottom ||
        playerRect.right < wallRect.left ||
        playerRect.bottom < wallRect.top ||
        playerRect.left > wallRect.right
    );
}

document.addEventListener('keydown', function(event) {
    let new_player_vertical = player_vertical;
    let new_player_horizontal = player_horizontal;


    if (!gameState) {
        return;
    }
    // Move player
    switch(event.key) {
        case 'ArrowUp':
            new_player_vertical -= player_speed;
            updatePlayerView('up');
            break;
        case 'ArrowDown':
            new_player_vertical += player_speed;
            updatePlayerView('down');
            break;
        case 'ArrowLeft':
            new_player_horizontal -= player_speed;
            updatePlayerView('left');
            break;
        case 'ArrowRight':
            new_player_horizontal += player_speed;
            updatePlayerView('right');
            break;
    }

    // Boundary checks
    if (event.key === 'ArrowUp' && new_player_vertical <= 0) {
        new_player_vertical = 0;
    } else if (event.key === 'ArrowDown' && (new_player_vertical + player.offsetHeight) >= gameArea.offsetHeight) {
        new_player_vertical = gameArea.offsetHeight - player.offsetHeight;
    }

    if (event.key === 'ArrowLeft' && new_player_horizontal <= 0) {
        new_player_horizontal = 0;
    } else if (event.key === 'ArrowRight' && (new_player_horizontal + player.offsetWidth) >= gameArea.offsetWidth) {
        new_player_horizontal = gameArea.offsetWidth - player.offsetWidth;
    }

    // Temporary move player to check for collision with any wall
    player.style.top = `${new_player_vertical}px`;
    player.style.left = `${new_player_horizontal}px`;

    // Check for collision with any wall
    if (isCollidingWithAnyWall(player, walls)) {
        // Undo move if collision is detected
        player.style.top = `${player_vertical}px`;
        player.style.left = `${player_horizontal}px`;
    } else {
        // Update player position if no collision with any wall and within boundaries
        player_vertical = new_player_vertical;
        player_horizontal = new_player_horizontal;
    }
});

// ----------------------------- Game Loop/Bullets/Collision Detection -----------------------------`
// Game loop function
function updateGame() {
    if (!gameState) {
        return;
    }

    moveTaxis_vertical();
    moveTaxis_horizontal();

    checkCollisions();

    checkIfLost();
    requestAnimationFrame(updateGame);

}

// Move Enemies
// ------ horizontal ------
const taxis = document.querySelectorAll(".taxis");
function moveTaxis_horizontal() {
    taxis.forEach((taxi) => {
        let direction = taxi.dataset.direction === "1" ? 1 : -1;
        let speed = parseFloat(taxi.dataset.speed);
        let currentPosition = parseFloat(taxi.style.left);

        currentPosition += speed * direction; // Multiply by direction to determine movement direction

        if (taxi.id === "taxi4") {
            if (currentPosition > 200) {
                direction = -1;
                taxi.style.backgroundImage = "url('./assets/taxi.png')";
            }
            if (currentPosition < 10) {
                direction = 1;
    
                // replace taxi background image
                taxi.style.backgroundImage = "url('./assets/taxi.png')";
            }
        }

        // If taxi reaches the bottom, change direction to move upwards
        if (currentPosition > 100) {
            direction = -1;

            // replace taxi background image
            taxi.style.backgroundImage = "url('./assets/taxi.png')";
        }
        // If taxi reaches the top, change direction to move downwards
        if (currentPosition < 0) {
            direction = 1;

            // replace taxi background image
            taxi.style.backgroundImage = "url('./assets/taxi.png')";
        }

        taxi.dataset.direction = direction.toString();
        taxi.style.left = `${currentPosition}vw`;
    });
}

// ------ vertical ------
const vertical_taxi = document.querySelectorAll(".taxis_vertical");
function moveTaxis_vertical() {
    vertical_taxi.forEach((taxi) => {
        let direction = taxi.dataset.direction === "1" ? 1 : -1;
        let speed = parseFloat(taxi.dataset.speed);
        let currentPosition = parseFloat(taxi.style.top);

        currentPosition += speed * direction; // Multiply by direction to determine movement direction

        // If taxi reaches the bottom, change direction to move upwards
        if (currentPosition > 65) {
            direction = -1;

            // replace taxi background image
            taxi.style.backgroundImage = "url('./assets/taxi_upwards.png')";
        }
        if (currentPosition < 10) {
            direction = 1;

            // replace taxi background image
            taxi.style.backgroundImage = "url('./assets/taxi_downwards.png')";
        }

        taxi.dataset.direction = direction.toString();
        taxi.style.top = `${currentPosition}vh`;
    });
}


// Initialize enemy positions and directions

// Horizontal taxis
taxis.forEach((taxi) => {
    if (taxi.id === "taxi4") {
        taxi.dataset.speed = (Math.random() * 0.05 + 1).toString();
    }
    else {
        taxi.dataset.speed = (Math.random() * 1 + 1).toString();
    }

    taxi.dataset.direction = "1"; // Direction 1 for down, -1 for up
    taxi.style.left = "-20vw"; // Start above the view
});

// Vertical taxis
vertical_taxi.forEach((taxi) => {
    // Assign a random speed to each taxi, between 1 and 3
    taxi.dataset.speed = (Math.random() * 0.009 + 1).toString();
    taxi.dataset.direction = "1"; // Direction 1 for down, -1 for up
    taxi.style.top = "85vh"; 
});


// Store original speeds of enemies
let originalSpeeds = new Map();

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
    
    // Check collision for each taxi
    taxis.forEach((taxi) => {
        const taxiRect = taxi.getBoundingClientRect();
        // Check collision for player
        if (rectsIntersect(taxiRect, playerRect)) {
            playSound('obstacleHit');
            if(playerCharacterState != "sheild"){
                Reset_Player_Position();
                player_lifeCount = player_lifeCount - 1;
                updateLifeCount(player_lifeCount);
                checkIfLost();
            }
        }
    });

    // check collision for the vertical taxi
    const vertical_taxis = document.querySelector(".taxis_vertical");
    const vertical_taxiRect = vertical_taxis.getBoundingClientRect();
    if (rectsIntersect(vertical_taxiRect, playerRect)) {
        playSound('obstacleHit');
        if(playerCharacterState != "sheild"){
            Reset_Player_Position();
            player_lifeCount = player_lifeCount - 1;
            updateLifeCount(player_lifeCount);
            checkIfLost();
        }
    }


    // Check collision for each heart
    hearts.forEach((valuePac) => {
        const heartsRect = valuePac.getBoundingClientRect();
        if (rectsIntersect(heartsRect, playerRect)) {
            playSound('heart');
            valuePac.style.display = 'none';
            player_lifeCount = player_lifeCount + 1;
            updateLifeCount(player_lifeCount);
        }
    });

    // Check collision for each sheilds
    const sheilds = document.querySelectorAll('.sheild2');
    sheilds.forEach((sheild) => {

        const sheildRect = sheild.getBoundingClientRect();
        if (rectsIntersect(sheildRect, playerRect)) {
            playSound('sheild');
            playerCharacterState = "sheild";
            sheild.style.display = 'none';
            addRemove_sheild("add");
        }
    });

    // Check collision for key1
    const key1 = document.getElementById('key1');
    const key2 = document.getElementById('key2');
    const portal_lvl2 = document.getElementById('portal_lvl2');

    const key1Rect = key1.getBoundingClientRect();
    const key2Rect = key2.getBoundingClientRect();

    if (rectsIntersect(key1Rect, playerRect)) {
        playSound('key');
        key1.style.display = 'none';
        key2.style.display = 'block';

    }
    if (rectsIntersect(key2Rect, playerRect)) {
        playSound('key');
        key2.style.display = 'none';

        // display portal
        portal_lvl2.style.display = 'block';
    }

    // Check collision for portal
    const portalRect = portal_lvl2.getBoundingClientRect();
    if (rectsIntersect(portalRect, playerRect)) {
        
        // call function to display final video
        displayFinalVideo();
    }
}

function displayFinalVideo() {
    gameState = false;
    const finalVideo = document.getElementById('final_video');
    const main_sound = document.getElementById('main_sound');
    const gameStatus = document.querySelector('.gameStatus');
    const game_screen_level2 = document.querySelector('.game_screen_level2')

    finalVideo.style.display = 'flex';
    main_sound.pause();
    gameStatus.style.display = 'none';
    game_screen_level2.display = 'none';

    // play final video 
    finalVideo.play();

    finalVideo.onended = function() {
        window.location.href = 'index.html'; // redirect to home page
    };
}




// Collision detection function
function rectsIntersect(rectA, rectB) {
    return !(rectA.right < rectB.left || 
             rectA.left > rectB.right || 
             rectA.bottom < rectB.top || 
             rectA.top > rectB.bottom);
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
        const game_screen_level2 = document.querySelector('.game_screen_level2')
        game_screen_level2.style.filter = 'blur(10px)';
        gameState = false;
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
    player_lifeCountElement.textContent = newLifeCount;
    
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



