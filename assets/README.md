# Keystroke

## Intro
Keystroke is a 2D, single player game inspired by Manygolf that follows the same rules as golf. The objective is for the user to get their ball in the hole on the opposite side of the terrain. The user starts on the left and must adjust their angle and power to direct the ball towards the hole. The round is over when the ball gets into the hole. Each turn, or stroke, is counted and more points are awarded for winning the round in the fewest strokes.

## Functionality & MVP
Users will be able to:
- Adjust the angle of their stroke using the left and right arrow keys
- Adjust the power/velocity of their stroke by holding down the space bar
- Wait until their ball comes to a stop before taking another stroke
- Enter their name for posterity

In addition, this project will include:
- The ability for the user to enter in their name
- A leaderboard
- A timer that counts how long it took to get the ball in the hole
- A counter that keeps track of the number of strokes

## Wireframes

The app will be a single screen with a game board, game controls, and nav links to the Github, my LinkedIn and my personal site. The only controls are the space bar, left and right arrow keys. A modal will record the player's name before the game renders.

![Wireframe for Keystroke](./assets/wireframe.png)


## Architecture and Technologies
The project will be implemented with the following technologies:
- JavaScript for game logic
- Canvas for game rendering
- Webpack for bundling js files

There will be several scripts involved for this project:

ball.js: this script will handle the logic for the ball rendering

collision.js: this script will handle the logic for collisions between the ball and the terrain

terrain.js: this script will determine the shape of the terrain

hole.js: this script will determine whether the ball is present and determine when to end the game

stroke.js: this script will take in angles and power and determine the path of the ball through the air

rebound.js: this script will be responsible for determining the path of a ball after a collision

## Implementation Timeline

### Day 1
Take this day to familiarize myself with Canvas. Decide whether Pixi is a suitable engine or decide whether another library would suit this project better. By the end of day 1, be able to render a ball on the screen and have it bounce against the edge of screen.

### Day 2
Take the concepts learned from day 1 and be able to render the terrain graphics on screen. Have the ball fall out of the air and bounce off the terrain. Calculate collision physics and vector mathematics.

### Day 3
Figure out how to get the ball to sit on the terrain. Begin to implement user controls. Render the hole on the terrain. Allow the user to manipulate the ball on the screen.

### Day 4
Fine tune controls. Decide starting position and distance to hole. Draw terrain map. Implement the game rules and logic. Bonus: draw several terrains.

### Day 5
Tie everything together and make the game playable. Roll introduction modal to take the user's name as input and display the leaderboards. Create Leaderboards table.

## BONUS Features
- Modals
- Multiple terrains
- enhanced colors and UI
- Websockets for multiplayer
