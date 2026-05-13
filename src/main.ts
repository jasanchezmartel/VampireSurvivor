import { Game } from './core/Game';
import { BackgroundRenderer } from './view/renderers/BackgroundRenderer';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const game = new Game();
const backgroundRenderer = new BackgroundRenderer('/background/background.png');

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

    // 1. CORE UPDATE (Model)
    game.update(deltaTime);

    // 2. RENDER (View)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Camera logic follows the player position
    const camX = -game.player.pos.x + canvas.width / 2;
    const camY = -game.player.pos.y + canvas.height / 2;
    ctx.translate(camX, camY);

    backgroundRenderer.draw(ctx, game.player.pos, canvas.width, canvas.height); 
    
    ctx.restore();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
