import { Player, type InputState } from '../../src/core/entities/Player';

const canvas = document.getElementById('debug-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// --- 1. CONFIGURACIÓN FIJA (ESTÁNDAR LAB) ---
canvas.width = 800;
canvas.height = 600;

const player = new Player(canvas.width / 2, canvas.height / 2, 3);
const keys: InputState = { up: false, down: false, left: false, right: false };

// --- 2. INPUTS (TECLADO Y RATÓN) ---
window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup')    keys.up = true;
    if (k === 's' || k === 'arrowdown')  keys.down = true;
    if (k === 'a' || k === 'arrowleft')  keys.left = true;
    if (k === 'd' || k === 'arrowright') keys.right = true;
    if (e.code === 'Space') player.playAction('attack');
});

window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup')    keys.up = false;
    if (k === 's' || k === 'arrowdown')  keys.down = false;
    if (k === 'a' || k === 'arrowleft')  keys.left = false;
    if (k === 'd' || k === 'arrowright') keys.right = false;
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) player.playAction('attack');
});

// --- 3. FUNCIONES GLOBALES (PARA BOTONES HTML) ---
interface DebugWindow extends Window {
    triggerAction?: (action: 'attack' | 'hit' | 'death') => void;
    resetPlayer?: () => void;
}
(window as DebugWindow).triggerAction = (action: 'attack' | 'hit' | 'death') => player.playAction(action);
(window as DebugWindow).resetPlayer = () => location.reload();

// --- 4. RENDERIZADO MINIMALISTA ---
function drawCaveBackground(ctx: CanvasRenderingContext2D) {
    // Fondo base oscuro
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Detalle de rocas oscuras (estilo minimalista)
    ctx.fillStyle = '#0a0a0f';
    for (let i = 0; i < 30; i++) {
        const x = (Math.abs(Math.sin(i)) * canvas.width);
        const y = (Math.abs(Math.cos(i)) * canvas.height);
        ctx.fillRect(x, y, 20, 10);
    }

    // Viñeteado constante
    const grad = ctx.createRadialGradient(400, 300, 50, 400, 300, 450);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, 'rgba(0,0,0,0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loop() {
    drawCaveBackground(ctx);
    player.update(keys);
    requestAnimationFrame(loop);
}

loop();