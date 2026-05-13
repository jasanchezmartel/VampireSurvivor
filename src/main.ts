import { Player, type InputState } from './entities/Player';
import { Background } from './entities/Background';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const player = new Player(0, 0, 1.8);
(window as any).player = player;
const background = new Background('/background/background.png');

const keys: InputState = { up: false, down: false, left: false, right: false };

window.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') keys.up = true;
    if (e.key === 's' || e.key === 'ArrowDown') keys.down = true;
    if (e.key === 'a' || e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'd' || e.key === 'ArrowRight') keys.right = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') keys.up = false;
    if (e.key === 's' || e.key === 'ArrowDown') keys.down = false;
    if (e.key === 'a' || e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'd' || e.key === 'ArrowRight') keys.right = false;
});

function gameLoop() {
    player.update(keys);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    const camX = -player.pos.x + canvas.width / 2;
    const camY = -player.pos.y + canvas.height / 2;
    ctx.translate(camX, camY);
    background.draw(ctx, player.pos, canvas.width, canvas.height);
    player.draw(ctx);
    ctx.restore();
    requestAnimationFrame(gameLoop);
}

gameLoop();