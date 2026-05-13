import { Vector2D } from '../math/Vector2D';

export interface InputState {
    up: boolean; down: boolean; left: boolean; right: boolean;
}

// Tipos para los estados de animación
type AnimState = 'idle' | 'run' | 'attack' | 'hit' | 'death';

interface SpriteData {
    img: HTMLImageElement;
    frameWidth: number;
    frameHeight: number;
    totalFrames: number;
    isLoaded: boolean;
}

export class Player {
    public pos: Vector2D;
    public speed: number;

    private sprites: Record<AnimState, SpriteData>;
    private currentState: AnimState = 'idle';
    private isFacingLeft: boolean = false;

    private currentFrame: number = 0;
    private animCounter: number = 0;
    private animSpeed: number = 0.06;

    constructor(x: number, y: number, speed: number = 3) {
        this.pos = new Vector2D(x, y);
        this.speed = speed;

        // Inicializamos todos los estados. 
        // AJUSTA los totalFrames según tus archivos .png reales
        this.sprites = {
            idle: this.createSpriteData('/entities/player/Idle.png', 8),
            run: this.createSpriteData('/entities/player/Run.png', 8),
            attack: this.createSpriteData('/entities/player/Attack1.png', 8),
            hit: this.createSpriteData('/entities/player/Take hit.png', 3),
            death: this.createSpriteData('/entities/player/Death.png', 7)
        };
    }

    private createSpriteData(path: string, totalFrames: number): SpriteData {
        const data: SpriteData = {
            img: new Image(),
            frameWidth: 0,
            frameHeight: 0,
            totalFrames: totalFrames,
            isLoaded: false
        };
        data.img.src = path;
        data.img.onload = () => {
            data.frameWidth = data.img.width / totalFrames;
            data.frameHeight = data.img.height;
            data.isLoaded = true;
        };
        return data;
    }

    // Método para disparar animaciones desde el Lab
    public playAction(state: AnimState) {
        if (this.currentState === 'death') return; // Si está muerto, nada

        this.currentState = state;
        this.animCounter = 0; // Reiniciar animación para que empiece del frame 0
        this.currentFrame = 0;
    }

    update(input: InputState) {
        // 1. Si ya estamos en el último frame de la muerte, aquí sí congelamos todo
        const isDead = this.currentState === 'death';
        const currentSpriteData = this.sprites[this.currentState];

        if (isDead && this.currentFrame === currentSpriteData.totalFrames - 1) {
            return; // El personaje ya terminó de morir, no hacemos nada más
        }

        // 2. Comprobamos si estamos en una animación "de acción" o muerte
        // Añadimos 'death' aquí para que el movimiento se bloquee mientras cae
        const isLocked = ['attack', 'hit', 'death'].includes(this.currentState);

        const direction = new Vector2D(0, 0);

        // 3. Lógica de movimiento (solo si NO está bloqueado)
        if (!isLocked) {
            if (input.up) direction.y -= 1;
            if (input.down) direction.y += 1;
            if (input.left) direction.x -= 1;
            if (input.right) direction.x += 1;

            const isMoving = direction.x !== 0 || direction.y !== 0;

            if (isMoving) {
                this.currentState = 'run';
                if (direction.x < 0) this.isFacingLeft = true;
                if (direction.x > 0) this.isFacingLeft = false;
            } else {
                this.currentState = 'idle';
            }

            direction.normalize();
            this.pos.x += direction.x * this.speed;
            this.pos.y += direction.y * this.speed;
        }

        // 4. MANEJO DE ANIMACIÓN (Fuera del bloqueo de movimiento)
        if (currentSpriteData.isLoaded) {
            this.animCounter += this.animSpeed;

            // Calculamos el frame actual
            this.currentFrame = Math.floor(this.animCounter) % currentSpriteData.totalFrames;

            // 5. Finalización de animaciones puntuales
            if (this.currentFrame === currentSpriteData.totalFrames - 1) {
                // Si estaba atacando o recibiendo hit, volvemos a idle
                if (this.currentState === 'attack' || this.currentState === 'hit') {
                    this.currentState = 'idle';
                    this.animCounter = 0;
                }
                // Si es 'death', el primer IF de esta función se encargará de 
                // dejarlo en el último frame en el siguiente ciclo.
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const sprite = this.sprites[this.currentState];

        if (sprite.isLoaded && sprite.frameWidth > 0) {
            ctx.save();
            ctx.translate(Math.floor(this.pos.x), Math.floor(this.pos.y));

            if (this.isFacingLeft) {
                ctx.scale(-1, 1);
            }

            ctx.drawImage(
                sprite.img,
                this.currentFrame * sprite.frameWidth, 0,
                sprite.frameWidth, sprite.frameHeight,
                -sprite.frameWidth / 2, -sprite.frameHeight / 2,
                sprite.frameWidth, sprite.frameHeight
            );

            ctx.restore();
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.pos.x - 16, this.pos.y - 16, 32, 32);
        }
    }
}