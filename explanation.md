## Player Movement and Boundaries

This game allows players to control their characters using keyboard inputs (arrow keys for player 1, 'WASD' keys for player 2). The game listens for these key presses and changes the players' positions based on a set speed. The game also checks to make sure players don't leave the game area. If a player tries to move outside the game boundaries, the game stops them from doing so.

## Collision Detection

The game uses a function called `checkCollisions` to determine when players or other elements (like enemies or bonuses) run into each other. It calculates the positions and sizes of these elements and uses another function, `rectsIntersect`, to see if they overlap. If they do, it's a collision, and the game might change player positions, update scores, or adjust life counts. Accurate collision detection is essential for a realistic and responsive gaming experience.

## Enemy Movement

Enemies in the game move vertically or horizontally, with each enemy having its own speed and direction. The `moveEnemies` function controls this. When enemies reach the edge of the game area, they change direction, making the game more challenging. Enemies' speed and direction are stored using HTML `data-` attributes, making it easier to manage and change their behavior as needed.
