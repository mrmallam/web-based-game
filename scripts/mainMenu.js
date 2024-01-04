document.addEventListener('DOMContentLoaded', function() {
    const howToPlayContainer = document.querySelector('.howToPlayModal_container');
    const howToPlayButton = document.querySelector('#howToPlay_button');
    const startGameButton = document.querySelector('#new_game_button');
    const menu = document.querySelector('.menu');

    // When anywhere on the screen is clicked, hide the howToPlayContainer
    document.addEventListener('click', function(event) {
        if(howToPlayContainer.style.display === 'flex') {
            howToPlayContainer.style.display = 'none';
        }
    });

    // When "How to play?" is clicked, show the howToPlayContainer
    howToPlayButton.addEventListener('click', function(event) {
        event.stopPropagation(); 
        howToPlayContainer.style.display = 'flex';
    });

    // When start game is clicked, also ensure howToPlayContainer is hidden
    startGameButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Stop event from propagating to the document
        howToPlayContainer.style.display = 'none';
        menu.style.display = 'none';
        
        var video = document.getElementById('intro_video');
        video.style.display = 'block'; // Show the video
        video.play();

        video.onended = function() {
            window.location.href = '1-level.html'; // Redirect after video ends
        };
    });
});



    // Handle the escape key during video playback
    document.addEventListener('keydown', function(event) {
        var video = document.getElementById('intro_video');
        if (event.key === "q" && video.style.display === 'block') {
            video.style.display = 'none'; // Hide the video
            video.pause(); // Pause the video
            window.location.href = '1-level.html'; // Redirect after pressing Esc
        }
    });