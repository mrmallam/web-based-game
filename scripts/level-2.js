
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const enemies = document.querySelectorAll(".enemy");
const gameArea = document.querySelector('.game_screen');
const initial_player1_vertical = gameArea.clientHeight - player1.offsetHeight;
const initial_player1_horizontal = gameArea.clientWidth - player1.offsetWidth;
const initial_player2_vertical = gameArea.clientHeight - player2.offsetHeight;
const initial_player2_horizontal = player2.offsetWidth;
const valuePack = document.querySelectorAll('.valuePack');
const hearts = document.querySelectorAll('.heart');
const player_speed = 50; // 50px per keypress
let player1_vertical = player1.getBoundingClientRect().top;
let player1_horizontal = player1.getBoundingClientRect().left;
let player2_vertical = player2.getBoundingClientRect().top;
let player2_horizontal = player2.getBoundingClientRect().left;
let player1_lifeCount = 7;
let player2_lifeCount = 7;
let enemiesContainer = document.querySelector('.enemies_container');
let enemies_style = document.querySelectorAll('.enemy');
let totalTime = 120; // 2 minutes in seconds
let player1ScoreCount = parseInt(getQueryParam('player1Score'), 10) || 0;
let player2ScoreCount = parseInt(getQueryParam('player2Score'), 10) || 0;

startCountdown();
resetPlayerPositions(1);
resetPlayerPositions(2);
positionValuePackRandomly();
positionHeartsRandomly();
initializeScores();
updateLifeCount(player1_lifeCount);
startGameLoop();

function getQueryParam(param) { // Get query parameter from URL
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// -----------------------------PLAYERS MOVE LOGIC-----------------------------
function resetPlayerPositions(whichPlayer) {
    // Reset player 1 position
    if (whichPlayer === 1) {
        player1.style.top = '';
        player1.style.left = '';

        player1.style.bottom = '0px';
        player1.style.right = '0px';

        player1_vertical = initial_player1_vertical;
        player1_horizontal = initial_player1_horizontal;
    }
    // Reset player 2 position
    else if (whichPlayer === 2) {
        player2.style.top = '';
        player2.style.left = '';

        player2.style.bottom = '0px';
        player2.style.right = '0px';

        player2_vertical = initial_player2_vertical;
        player2_horizontal = initial_player2_horizontal;
    }
}

// For the player movement
document.addEventListener('keydown', function(event) {

    let new_player1_vertical = player1_vertical;
    let new_player1_horizontal = player1_horizontal;
    let new_player_2_vertical = player2_vertical;
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
            new_player_2_vertical -= player_speed;
            break;
        case 's':
            new_player_2_vertical += player_speed;
            break;
        case 'a':
            new_player2_horizontal -= player_speed;
            break;
        case 'd':
            new_player2_horizontal += player_speed;
            break;
    }

    // Check boundaries for Player 1
    if (new_player1_vertical > 0 && (new_player1_vertical + player1.offsetHeight) < gameArea.offsetHeight) {
        player1_vertical = new_player1_vertical;
    }
    if (new_player1_horizontal > 0 && (new_player1_horizontal + player1.offsetWidth) < gameArea.offsetWidth) {
        player1_horizontal = new_player1_horizontal;
    }

    // Check boundaries for Player 2
    if (new_player_2_vertical > 0 && (new_player_2_vertical + player2.offsetHeight) < gameArea.offsetHeight) {
        player2_vertical = new_player_2_vertical;
    }
    if (new_player2_horizontal > 0 && (new_player2_horizontal + player2.offsetWidth) < gameArea.offsetWidth) {
        player2_horizontal = new_player2_horizontal;
    }
    
    player1.style.top = `${player1_vertical}px`;
    player1.style.left = `${player1_horizontal}px`;

    player2.style.top = `${player2_vertical}px`;
    player2.style.left = `${player2_horizontal}px`;
});





// -----------------------------enemies + Collision Detection-----------------------------
// Set styles for .enemies_container
if (enemiesContainer) {
    enemiesContainer.style.display = 'flex';
    enemiesContainer.style.flexDirection = 'column';
    enemiesContainer.style.padding = '5rem 0 1rem 0';
}

// Set styles for .enemy
enemies_style.forEach(enemy => {
    enemy.style.left = '0';
    enemy.style.margin = '2.5rem 0 2.5rem 0';
});


function updateGame() {
    // Update enemy positions
    moveEnemies();

    // Check for collisions between enemies and players
    Check_Collisions();

    Check_Door();

    // Check if player has lost
    Check_if_Lost();

    // Loop this function
    requestAnimationFrame(updateGame);
}

function moveEnemies() {
    enemies.forEach((enemy) => {
        let direction = enemy.dataset.direction === "1" ? 1 : -1;
        let speed = parseFloat(enemy.dataset.speed);
        let currentPosition = parseFloat(enemy.style.left); // Changed from 'top' to 'left'

        currentPosition += speed * direction;

        // Change direction if enemy reaches the right or left edge of the container
        if (currentPosition > 100) {
            direction = -1;
        } else if (currentPosition < 0) { // Left edge
            direction = 1;
        }

        enemy.dataset.direction = direction.toString();
        enemy.style.left = `${currentPosition}vw`; // Use 'vw' for horizontal viewport width
    });
}

function Check_Collisions() {
    const player1Rect = player1.getBoundingClientRect();
    const player2Rect = player2.getBoundingClientRect();

    enemies.forEach((enemy) => {
        const enemyRect = enemy.getBoundingClientRect();
        // Check collision for player1
        if (rectsIntersect(enemyRect, player1Rect)) {
            // Handle collision with player1
            resetPlayerPositions(1);
            updateLifeCount(1, player1_lifeCount--); 
        }

        // Check collision for player2
        if (rectsIntersect(enemyRect, player2Rect)) {
            // Handle collision with player2
            resetPlayerPositions(2);
            updateLifeCount(2, player2_lifeCount--); 
        }
    });

    // for valuePacks
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

    // for hearts
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

// Function to check if rectangles intersect
function rectsIntersect(rectA, rectB) {
    return !(rectA.right < rectB.left || 
             rectA.left > rectB.right || 
             rectA.bottom < rectB.top || 
             rectA.top > rectB.bottom);
}

// Initialize enemy positions and directions
enemies.forEach((enemy) => {
    enemy.dataset.speed = (Math.random() * 2 + 1).toString();
    enemy.dataset.direction = "1"; // Direction 1 for right, -1 for left
    enemy.style.left = "-20vw"; // Start off-screen to the left
});

// -----------------------------RANDOM POSITIONING-----------------------------
function positionValuePackRandomly() {
    const container = document.querySelector('.hearts_container');
    const valuePack = document.querySelectorAll('.valuePack');

    const containerRect = container.getBoundingClientRect();

    valuePack.forEach((VP) => {
        VP.style.top = Math.random() * (containerRect.height - VP.clientHeight) + "px";
        VP.style.left = Math.random() * (containerRect.width - VP.clientWidth) + "px";
    });
}
function positionHeartsRandomly() {
    const container = document.querySelector('.hearts_container');
    const hearts = document.querySelectorAll('.heart');
    const containerRect = container.getBoundingClientRect();

    hearts.forEach((heart) => {
        heart.style.top = Math.random() * (containerRect.height - heart.clientHeight) + "px";
        heart.style.left = Math.random() * (containerRect.width - heart.clientWidth) + "px";
    });
}

function updateValuePacPositions() {
    const container = document.querySelector('.hearts_container');
    const valuePack = document.querySelectorAll('.valuePack');
    const containerRect = container.getBoundingClientRect();

    valuePack.forEach((VP) => {
        VP.style.top = Math.random() * (containerRect.height - VP.clientHeight) + "px";
        VP.style.left = Math.random() * (containerRect.width - VP.clientWidth) + "px";
    });
}

function updateHeartsPositions() {
    const container = document.querySelector('.hearts_container');
    const hearts = document.querySelectorAll('.heart');
    const containerRect = container.getBoundingClientRect();

    hearts.forEach((heart) => {
        heart.style.top = Math.random() * (containerRect.height - heart.clientHeight) + "px";
        heart.style.left = Math.random() * (containerRect.width - heart.clientWidth) + "px";
    });
}

// Calling these function every 3 seconds
setInterval(updateValuePacPositions, 5000); // 5000ms = 5s
setInterval(updateHeartsPositions, 3000); // 3000ms = 3s

// Call this function when you want to start the game loop
function startGameLoop() {
    requestAnimationFrame(updateGame);
}

// ----------------------------- Check loosing -----------------------------
function Check_if_Lost() {
    const youLost_menu = document.querySelector('.loose_menu_container');
    const whichPlayerLost = document.getElementById("whichPlayerLost");

    if (player1_lifeCount < 0) {
        youLost_menu.style.display = 'flex';
        whichPlayerLost.innerText = "Player-1 a LOSER!!!!"
    }
    if (player2_lifeCount < 0) {
        youLost_menu.style.display = 'flex';
        whichPlayerLost.innerText = "Player-2 is a LOSERRRR!!!!"
    }
    else if (totalTime < -1){
        whichPlayerLost.innerText = "Both of you lost!!!"
        youLost_menu.style.display = 'flex';
    }
}

// ----------------------------- DOOR / Win Window -----------------------------
function initializeScores(){
    const player1Score = document.querySelector(".player1_score_count");
    const player2Score = document.querySelector(".player2_score_count");
    player1Score.textContent = player1ScoreCount;
    player2Score.textContent = player2ScoreCount;
}

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

function Check_Door() {
    const player1_door_rect = document.getElementById('player1_door').getBoundingClientRect();
    const finalMenu_container = document.querySelector('.finalMenu_container');
    const player1Rect = player1.getBoundingClientRect();
    const player2_door = document.getElementById('player2_door');
    const player2_door_rect = player2_door.getBoundingClientRect();
    const player2Rect = player2.getBoundingClientRect();

    if(rectsIntersect(player1_door_rect, player1Rect)) {
        resetPlayerPositions(1);
        player1ScoreCount += 10;
        updateScoreCount(1);
        updateFinalMenuStatus(1);
        finalMenu_container.style.display = 'flex';
    }

    if(rectsIntersect(player2_door_rect, player2Rect)) {
        resetPlayerPositions(2);
        player2ScoreCount += 10;
        updateScoreCount(2);
        updateFinalMenuStatus(2);
        finalMenu_container.style.display = 'flex';
    }
}

// -----------------------------FINAL MENU-----------------------------
function updateFinalMenuStatus(whichPlayer) {
    const capturedTime = totalTime;
    const finalMenu_winner = document.getElementById('finalMenu_winner');

    if(whichPlayer === 1){
        finalMenu_winner.textContent = "Player 1";
    }
    if(whichPlayer === 2){
        finalMenu_winner.textContent = "Player 2";
    }

    const player1_finalMenu_score = document.getElementById('finalMenu_score_player1');
    const player1_finalMenu_time = document.getElementById('finalMenu_time_player1');
    const player1_finalMenu_lifes = document.getElementById('finalMenu_lifes_player1');

    const player2_finalMenu_score = document.getElementById('finalMenu_score_player2');
    const player2_finalMenu_time = document.getElementById('finalMenu_time_player2');
    const player2_finalMenu_lifes = document.getElementById('finalMenu_lifes_player2');

    player1_finalMenu_score.textContent = player1ScoreCount;
    player1_finalMenu_time.textContent = formatTime(capturedTime);
    player1_finalMenu_lifes.textContent = player1_lifeCount;

    player2_finalMenu_score.textContent = player2ScoreCount;
    player2_finalMenu_time.textContent = formatTime(capturedTime);
    player2_finalMenu_lifes.textContent = player2_lifeCount;
}


// -----------------------------STATUS MENU-----------------------------
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

// Format time to m:ss
function formatTime(timeInSeconds) {
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = timeInSeconds % 60;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
  
// Function to start the countdown from 2:00
function startCountdown() {
    var timeCountElement = document.getElementById('time_count');

    var countdownTimer = setInterval(function() {
        timeCountElement.textContent = formatTime(totalTime);

        if (totalTime === -2) {
            clearInterval(countdownTimer);
            Check_if_Lost();
        } else {
            totalTime--;
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
