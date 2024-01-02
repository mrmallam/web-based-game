
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const enemies = document.querySelectorAll(".enemy");
const gameArea = document.querySelector('.game_screen');
const valuePack = document.querySelectorAll('.valuePack');
const hearts = document.querySelectorAll('.heart');
const initial_player1_vertical = gameArea.clientHeight - player1.offsetHeight;
const initial_player1_horizontal = gameArea.clientWidth - player1.offsetWidth;
const initial_player2_vertical = gameArea.clientHeight - player2.offsetHeight;
const initial_player2_horizontal = player2.offsetWidth;
const valuePack_container = document.querySelector('.hearts_container');
const player_speed = 50; // 50px per keypress
let player1_vertical = player1.getBoundingClientRect().top;
let player1_horizontal = player1.getBoundingClientRect().left;
let player2_vertical = player2.getBoundingClientRect().top;
let player2_horizontal = player2.getBoundingClientRect().left;
let player1_lifeCount = 6;
let player2_lifeCount = 6;
let Time = 120; // 2 minutes in seconds
let player1ScoreCount = 0;
let player2ScoreCount = 0;

Start_Game_Loop();
Start_Count_Down();
Reset_Player_Position(1);
Reset_Player_Position(2);
Randomize_ValuePack_Position();
Randomize_Hearts_Position();

// -----------------------------PLAYER MOVEMENT LOGIC-----------------------------
function Reset_Player_Position(whichPlayer) {
    if (whichPlayer === 1) {
        player1.style.top = '';
        player1.style.left = '';

        player1.style.bottom = '0px';
        player1.style.right = '0px';

        player1_vertical = initial_player1_vertical;
        player1_horizontal = initial_player1_horizontal;
    }
    else if (whichPlayer === 2) {
        player2.style.top = '';
        player2.style.left = '';

        player2.style.bottom = '0px';
        player2.style.right = '0px';

        player2_vertical = initial_player2_vertical;
        player2_horizontal = initial_player2_horizontal;
    }
}

// Player movement
document.addEventListener('keydown', function(event) {
    let new_player1_vertical = player1_vertical;
    let new_player1_horizontal = player1_horizontal;
    let new_player2_vertical = player2_vertical;
    let new_player2_horizontal = player2_horizontal;
    
    switch(event.key) {
        // Player 1
        case 'ArrowUp':
            new_player1_vertical -= player_speed;
            break;
        case 'ArrowDown':
            new_player1_vertical += player_speed;
            break;
        case 'ArrowLeft':
            new_player1_horizontal -= player_speed;
            break;
        case 'ArrowRight':
            new_player1_horizontal += player_speed;
            break;
        
        // Player 2
        case 'w':
            new_player2_vertical -= player_speed;
            break;
        case 's':
            new_player2_vertical += player_speed;
            break;
        case 'a':
            new_player2_horizontal -= player_speed;
            break;
        case 'd':
            new_player2_horizontal += player_speed;
            break;
    }

    // Check boundaries
    // Player 1
    if (new_player1_vertical > 0 && (new_player1_vertical + player1.offsetHeight) < gameArea.offsetHeight) {
        player1_vertical = new_player1_vertical;
    }
    if (new_player1_horizontal > 0 && (new_player1_horizontal + player1.offsetWidth) < gameArea.offsetWidth) {
        player1_horizontal = new_player1_horizontal;
    }
    // Player 2
    if (new_player2_vertical > 0 && (new_player2_vertical + player2.offsetHeight) < gameArea.offsetHeight) {
        player2_vertical = new_player2_vertical;
    }
    if (new_player2_horizontal > 0 && (new_player2_horizontal + player2.offsetWidth) < gameArea.offsetWidth) {
        player2_horizontal = new_player2_horizontal;
    }
    
    player1.style.top = `${player1_vertical}px`;
    player1.style.left = `${player1_horizontal}px`;
    player2.style.top = `${player2_vertical}px`;
    player2.style.left = `${player2_horizontal}px`;
});

// ----------------------------- Game Loop/Bullets/Collision Detection -----------------------------`
// Game loop function
function updateGame() {
    moveEnemies();

    checkCollisions();

    checkDoor();

    checkIfLost();

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
        if (currentPosition > 85) {
            direction = -1;
        }
        // If enemy reaches the top, change direction to move downwards
        else if (currentPosition < 0) {
            direction = 1;
        }

        enemy.dataset.direction = direction.toString();
        enemy.style.top = `${currentPosition}vh`;
    });
}

function checkCollisions() {
    const player1Rect = player1.getBoundingClientRect();
    const player2Rect = player2.getBoundingClientRect();
    
    // Check collision for each enemy
    enemies.forEach((enemy) => {
        const enemyRect = enemy.getBoundingClientRect();
        // Check collision for player1
        if (rectsIntersect(enemyRect, player1Rect)) {
            // Handle collision with player1
            Reset_Player_Position(1);
            updateLifeCount(1, player1_lifeCount--); 
        }
        // Check collision for player2
        if (rectsIntersect(enemyRect, player2Rect)) {
            // Handle collision with player2
            Reset_Player_Position(2);
            updateLifeCount(2, player2_lifeCount--); 
        }
    });

    // Check collision for each valuePack/Star
    valuePack.forEach((valuePac) => {
        const valuePackRect = valuePac.getBoundingClientRect();
        if (rectsIntersect(valuePackRect, player1Rect)) {
            valuePac.style.display = 'none';
            updateScoreCount(1);
        }
        if (rectsIntersect(valuePackRect, player2Rect)) {
            valuePac.style.display = 'none';
            updateScoreCount(2);
        }
    });

    // Check collision for each heart
    hearts.forEach((valuePac) => {
        const heartsRect = valuePac.getBoundingClientRect();
        if (rectsIntersect(heartsRect, player1Rect)) {
            valuePac.style.display = 'none';
            updateLifeCount(1, player1_lifeCount++);
        }
        if (rectsIntersect(heartsRect, player2Rect)) {
            valuePac.style.display = 'none';
            updateLifeCount(2, player2_lifeCount++);
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
    enemy.dataset.speed = (Math.random() * 2 + 1).toString();
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

setInterval(updateValuePacPositions, 5000); // 5 seconds
setInterval(updateHeartsPositions, 3000); // 3 seconds

// Start the game loop
function Start_Game_Loop() {
    requestAnimationFrame(updateGame);
}

// ----------------------------- Check loosing condition -----------------------------
function checkIfLost() {
    const youLost_menu = document.querySelector('.loose_menu_container');
    const whichPlayerLost = document.getElementById("whichPlayerLost");

    if (player1_lifeCount < 0) {
        youLost_menu.style.display = 'flex';
        whichPlayerLost.innerText = "Player-1 you LOST!!!!"
    }
    if (player2_lifeCount < 0) {
        youLost_menu.style.display = 'flex';
        whichPlayerLost.innerText = "Player-2 is a LOSER!!!!"
    }
    else if (Time < -1){
        youLost_menu.style.display = 'flex';
        whichPlayerLost.innerText = "Losers. Both of you."
    }
}

// ----------------------------- Score and Life Count -----------------------------
function updateScoreCount(whichPlayer){
    const player1Score = document.querySelector(".player1_score_count");
    const player2Score = document.querySelector(".player2_score_count");
    if(whichPlayer === 1){
        player1ScoreCount += 10;
        player1Score.textContent = player1ScoreCount;
    }
    if(whichPlayer === 2){
        player2ScoreCount += 10;
        player2Score.textContent = player2ScoreCount;
    }
}

function updateLifeCount(whichPlayer, newLifeCount) {
    if(whichPlayer === 1){
        var player1_lifeCountElement = document.querySelector('.player1_lives');
        player1_lifeCountElement.textContent = newLifeCount;
    }
    if(whichPlayer === 2){
        var player2_lifeCountElement = document.querySelector('.player2_lives');
        player2_lifeCountElement.textContent = newLifeCount;
    }
}

// ----------------------------- Door & Winning -----------------------------
function checkDoor() {
    const player1_door = document.getElementById('player1_door');
    const player1_door_rect = player1_door.getBoundingClientRect();
    const player1Rect = player1.getBoundingClientRect();

    const player2_door = document.getElementById('player2_door');
    const player2_door_rect = player2_door.getBoundingClientRect();
    const player2Rect = player2.getBoundingClientRect();

    if(rectsIntersect(player1_door_rect, player1Rect)) {
        updateScoreCount(1);
        window.location.href = `./2-level.html?player1Score=${player1ScoreCount}&player2Score=${player2ScoreCount}`;

    }
    if(rectsIntersect(player2_door_rect, player2Rect)) {
        updateScoreCount(2);
        window.location.href = `./2-level.html?player1Score=${player1ScoreCount}&player2Score=${player2ScoreCount}`;

    }
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
            checkIfLost();
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
