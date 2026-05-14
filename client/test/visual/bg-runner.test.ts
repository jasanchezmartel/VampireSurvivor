const canvas = document.getElementById('debug-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// --- 1. CONFIGURACIÓN FIJA ---
canvas.width = 800;
canvas.height = 600;

const camera = { x: 0, y: 0, speed: 5 };
const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false };

interface WorldObject {
    x: number; y: number;
    size: number;
    points?: {x: number, y: number}[];
    color: string;
    parallax: number;
    type: 'poly' | 'star' | 'hair' | 'pixel';
    glow?: boolean;
}

let objects: WorldObject[] = [];
let currentBiome = 'cave';

interface BiomeConfig {
    bg: string;
    count: number;
    shadow: string;
}

const BIOMES: Record<string, BiomeConfig> = {
    cave:  { bg: '#0a0812', count: 50, shadow: 'rgba(10, 5, 20, 0.7)' },
    snow:  { bg: '#080d1a', count: 125, shadow: 'rgba(0,0,0,0.3)' },
    grass: { bg: '#659a65', count: 120, shadow: 'rgba(20,40,20,0.3)' }, // Verde suave césped
    void:  { bg: '#000000', count: 80, shadow: 'rgba(0,0,0,0)' }
};

function createObject(type = currentBiome): WorldObject {
    const depth = Math.random();
    const p = 0.2 + depth * 0.8;
    const obj: WorldObject = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0, color: '', parallax: p, type: 'poly'
    };

    if (type === 'cave') {
        const isLuminous = Math.random() > 0.7;
        obj.size = 6 + Math.random() * 12;
        if (isLuminous) {
            obj.color = `hsl(${280 + Math.random() * 40}, 70%, ${50 + depth * 20}%)`;
            obj.glow = true;
        } else {
            const g = 15 + Math.floor(depth * 15);
            obj.color = `rgb(${g}, ${g-5}, ${g+10})`;
        }
        const v = 5 + Math.floor(Math.random() * 3);
        obj.points = Array.from({length: v}, (_, i) => ({
            x: Math.cos((i/v)*Math.PI*2) * (obj.size * (0.6+Math.random()*0.4)),
            y: Math.sin((i/v)*Math.PI*2) * (obj.size * (0.6+Math.random()*0.4))
        }));
    } 
    else if (type === 'snow') {
        obj.size = 2 + Math.random() * 2;
        obj.color = `rgba(255, 255, 255, ${0.4 + depth * 0.6})`;
        obj.type = 'star';
    }
    else if (type === 'grass') {
        obj.size = 8 + Math.random() * 12;
        obj.color = `rgba(10, 40, 10, ${0.4 + depth * 0.6})`; // Verde oscuro para "pelillos"
        obj.type = 'hair';
    }
    else if (type === 'void') {
        obj.size = 2;
        obj.color = `hsl(${Math.random() * 360}, 60%, 60%)`;
        obj.type = 'pixel';
    }
    return obj;
}

window.addEventListener('keydown', (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false; });

function loop() {
    if (keys.w) camera.y -= camera.speed; if (keys.s) camera.y += camera.speed;
    if (keys.a) camera.x -= camera.speed; if (keys.d) camera.x += camera.speed;

    const conf = BIOMES[currentBiome];
    ctx.fillStyle = conf.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    objects.forEach(obj => {
        let dx = (obj.x - camera.x * obj.parallax) % canvas.width;
        let dy = (obj.y - camera.y * obj.parallax) % canvas.height;
        if (dx < 0) dx += canvas.width; if (dy < 0) dy += canvas.height;

        if (obj.type === 'poly' && obj.points) {
            if (obj.glow) {
                ctx.shadowBlur = 15; ctx.shadowColor = obj.color;
            }
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.moveTo(dx + obj.points[0].x, dy + obj.points[0].y);
            obj.points.forEach(p => ctx.lineTo(dx + p.x, dy + p.y));
            ctx.fill();
            ctx.shadowBlur = 0;
        } 
        else if (obj.type === 'star') {
            ctx.strokeStyle = obj.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dx - obj.size, dy); ctx.lineTo(dx + obj.size, dy);
            ctx.moveTo(dx, dy - obj.size); ctx.lineTo(dx, dy + obj.size);
            ctx.stroke();
        } 
        else if (obj.type === 'hair') {
            ctx.strokeStyle = obj.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(dx, dy);
            // Curva simple para efecto de pelo/hierbajo
            ctx.quadraticCurveTo(dx + 2, dy - obj.size/2, dx - 1, dy - obj.size);
            ctx.stroke();
        }
        else if (obj.type === 'pixel') {
            ctx.fillStyle = obj.color;
            ctx.fillRect(dx, dy, obj.size, obj.size);
        }
    });

    // Viñeteado radial estandarizado
    const grad = ctx.createRadialGradient(400, 300, 0, 400, 300, 450);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, conf.shadow);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(loop);
}

// Iniciar con Cueva
interface BiomeWindow extends Window {
    setBiome?: (biome: string) => void;
}
(window as BiomeWindow).setBiome?.('cave');
loop();