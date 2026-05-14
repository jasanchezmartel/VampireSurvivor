import { Game } from './core/Game';
import { GameRenderer } from './view/GameRenderer.ts';
import { InputHandler } from './core/inputs/InputHandler';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const menu = document.getElementById('menu') as HTMLDivElement;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
const nameDisplay = document.getElementById('player-name-display') as HTMLDivElement;

let game: Game;
let gameRenderer: GameRenderer;
const inputHandler = new InputHandler();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

startBtn.addEventListener('click', () => {
    const playerName = playerNameInput.value || 'Player';
    game = new Game(playerName);
    gameRenderer = new GameRenderer(game);
    
    menu.style.display = 'none';
    nameDisplay.textContent = `Name: ${playerName}`;
    nameDisplay.style.display = 'block';
    
    requestAnimationFrame(gameLoop);
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let lastTime = performance.now();

function gameLoop(time: number) {
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    inputHandler.update(game.player.pos, canvas);

    game.update(deltaTime, inputHandler.state);
    gameRenderer.render(ctx, game, canvas.width, canvas.height);

    requestAnimationFrame(gameLoop);
}
