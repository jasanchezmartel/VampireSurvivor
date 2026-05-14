import { Game } from './core/Game';
import { GameRenderer } from './view/GameRenderer.ts';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const game = new Game();
const gameRenderer = new GameRenderer(game);

let mouseScreenX = window.innerWidth / 2;
let mouseScreenY = window.innerHeight / 2;

window.addEventListener('mousemove', (e) => {
    mouseScreenX = e.clientX;
    mouseScreenY = e.clientY;
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') game.inputs.up = true;
    if (e.key === 's' || e.key === 'ArrowDown') game.inputs.down = true;
    if (e.key === 'a' || e.key === 'ArrowLeft') game.inputs.left = true;
    if (e.key === 'd' || e.key === 'ArrowRight') game.inputs.right = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') game.inputs.up = false;
    if (e.key === 's' || e.key === 'ArrowDown') game.inputs.down = false;
    if (e.key === 'a' || e.key === 'ArrowLeft') game.inputs.left = false;
    if (e.key === 'd' || e.key === 'ArrowRight') game.inputs.right = false;
});

let lastTime = performance.now();

function gameLoop(time: number) {
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    // Convert screen coordinates to world coordinates for targeting
    game.inputs.targetX = mouseScreenX + game.player.pos.x - canvas.width / 2;
    game.inputs.targetY = mouseScreenY + game.player.pos.y - canvas.height / 2;

    game.update(deltaTime);

    gameRenderer.render(ctx, game, canvas.width, canvas.height);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
