
document.addEventListener('DOMContentLoaded', function() {
    const howToPlayContainer = document.querySelector('.howToPlayModal_container');
    const howToPlayButton = document.querySelector('#howToPlay_button');
    const startGameButton = document.querySelector('#new_game_button');

    // When anywhere on the screen is clicked, hide the howToPlayContainer
    document.addEventListener('click', function(event) {
        // Hide howToPlayContainer if it's visible
        if(howToPlayContainer.style.display === 'flex') {
            howToPlayContainer.style.display = 'none';
        }
    });

    // When "How to play?" is clicked, show the howToPlayContainer
    howToPlayButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Stop event from propagating to the document
        howToPlayContainer.style.display = 'flex';
    });

    // When start game is clicked, also ensure howToPlayContainer is hidden
    startGameButton.addEventListener('click', function() {
        howToPlayContainer.style.display = 'none';
    });
});

document.getElementById('new_game_button').addEventListener('click', function() {
    var video = document.getElementById('intro_video');
    video.style.display = 'block'; // Show the video
    video.play();

    video.onended = function() {
        window.location.href = '1-level.html'; // Redirect after video ends
    };
});

var video = document.getElementById('intro_video');
video.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default click behavior
});
