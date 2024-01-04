
const player = document.getElementById('player');
const enemies = document.querySelectorAll(".enemy");
const gameArea = document.querySelector('.game_screen_level1, .game_screen_level2, .game_screen_level3');
const valuePack = document.querySelectorAll('.valuePack');
const hearts = document.querySelectorAll('.heart');
const initial_player_vertical = gameArea.clientHeight - player.offsetHeight;
const initial_player_horizontal = gameArea.clientWidth - player.offsetWidth;
const valuePack_container = document.querySelector('.hearts_container');
const player_speed = 50; // 50px per keypress
let player_vertical = player.getBoundingClientRect().top;
let player_horizontal = player.getBoundingClientRect().left;
let player_lifeCount = 6;
let Time = 120; // 2 minutes in seconds
let playerScoreCount = 0;

Start_Game_Loop();
Start_Count_Down();
Reset_Player_Position(1);
Reset_Player_Position(2);
Randomize_ValuePack_Position();
Randomize_Hearts_Position();
Randomize_ReduceSpeed_Position();

// -----------------------------PLAYER MOVEMENT LOGIC-----------------------------
function Reset_Player_Position(whichPlayer) {
    if (whichPlayer === 1) {
        player.style.top = '';
        player.style.left = '';

        player.style.bottom = '0px';
        player.style.right = '0px';

        player_vertical = initial_player_vertical;
        player_horizontal = initial_player_horizontal;
    }
}

// Player movement

function updatePlayerView(direction) {
    const playerView = document.getElementById('player');

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

document.addEventListener('keydown', function(event) {
    let new_player_vertical = player_vertical;
    let new_player_horizontal = player_horizontal;
    
    switch(event.key) {
        // Player 1
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

    // Check boundaries
    // Player
    if (new_player_vertical > 0 && (new_player_vertical + player.offsetHeight) < gameArea.offsetHeight) {
        player_vertical = new_player_vertical;
    }
    if (new_player_horizontal > 0 && (new_player_horizontal + player.offsetWidth) < gameArea.offsetWidth) {
        player_horizontal = new_player_horizontal;
    }
    
    player.style.top = `${player_vertical}px`;
    player.style.left = `${player_horizontal}px`;
});

// ----------------------------- Game Loop/Bullets/Collision Detection -----------------------------`
// Game loop function
function updateGame() {
    moveEnemies();

    checkCollisions();

    checkDoor();

    // checkIfLost();

    requestAnimationFrame(updateGame);
}

// Move Enemies
function moveEnemies() {
    enemies.forEach((enemy) => {
        let direction = enemy.dataset.direction === "1" ? 1 : -1;
        let speed = parseFloat(enemy.dataset.speed);
        let currentPosition = parseFloat(enemy.style.top);

        currentPosition += speed * direction; // Multiply by direction to determine movement direction

        // If enemy reaches the bottom, change direction to move upwards
        if (currentPosition > 100) {
            direction = -1;
        }
        // If enemy reaches the top, change direction to move downwards
        if (currentPosition < -5) {
            direction = 1;
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

        let tempSpeed = speed - 2;
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



function checkCollisions() {
    const playerRect = player.getBoundingClientRect();
    
    // Check collision for each enemy
    enemies.forEach((enemy) => {
        const enemyRect = enemy.getBoundingClientRect();
        // Check collision for player
        if (rectsIntersect(enemyRect, playerRect)) {
            // Handle collision with player
            Reset_Player_Position(1);
            updateLifeCount(1, player_lifeCount--); 
        }
    });

    // Check collision for each valuePack/Star
    valuePack.forEach((valuePac) => {
        const valuePackRect = valuePac.getBoundingClientRect();
        if (rectsIntersect(valuePackRect, playerRect)) {
            valuePac.style.display = 'none';
            updateScoreCount(1);
        }
    });

    // Check collision for each heart
    hearts.forEach((valuePac) => {
        const heartsRect = valuePac.getBoundingClientRect();
        if (rectsIntersect(heartsRect, playerRect)) {
            valuePac.style.display = 'none';
            updateLifeCount(1, player_lifeCount++);
        }
    });

    // Check collision for each reduceSpeed
    const reduceSpeed = document.querySelectorAll('.reduceSpeed');
    reduceSpeed.forEach((valuePac) => {
        const reduceSpeedRect = valuePac.getBoundingClientRect();
        if (rectsIntersect(reduceSpeedRect, playerRect)) {
            valuePac.style.display = 'none';
            slowDownEnemies();
        }
    });
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

setInterval(updateValuePacPositions, 5000); // 5 seconds
setInterval(updateHeartsPositions, 3000); // 3 seconds
setInterval(updateReduceSpeedPositions, 7000); // 7 seconds

// Start the game loop
function Start_Game_Loop() {
    requestAnimationFrame(updateGame);
}

// ----------------------------- Check loosing condition -----------------------------
function checkIfLost() {
    const youLost_menu = document.querySelector('.loose_menu_container');
    const whichPlayerLost = document.getElementById("whichPlayerLost");

    if (player_lifeCount < 0) {
        youLost_menu.style.display = 'flex';
        whichPlayerLost.innerText = "You LOST!!!!"
    }
    else if (Time < -1){
        youLost_menu.style.display = 'flex';
        whichPlayerLost.innerText = "Losers. Both of you."
    }
}

// ----------------------------- Score and Life Count -----------------------------
function updateScoreCount(whichPlayer){
    const playerScore = document.querySelector(".player_score_count");
    // const player2Score = document.querySelector(".player2_score_count");
    if(whichPlayer === 1){
        playerScoreCount += 10;
        playerScore.textContent = playerScoreCount;
    }
}

function updateLifeCount(whichPlayer, newLifeCount) {

    var player_lifeCountElement = document.querySelector('.player_lives');
    player_lifeCountElement.textContent = newLifeCount;
    
}

// ----------------------------- Door & Winning -----------------------------
function checkDoor() {
    const player_door = document.getElementById('player_door');
    const player_door_rect = player_door.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

}

// -----------------------------TIME LOGIC-----------------------------
// Format time to M:SS
function formatTime(minutes, seconds) {
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function Start_Count_Down() {
    var timeCountElement = document.getElementById('time_count');
    var countdownTimer = setInterval(function() {
        var minutes = Math.floor(Time / 60);
        var seconds = Time % 60;
        timeCountElement.textContent = formatTime(minutes, seconds);

        if (Time === -2) {
            clearInterval(countdownTimer);
            // checkIfLost();
        } else {
            Time--;
        }
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
