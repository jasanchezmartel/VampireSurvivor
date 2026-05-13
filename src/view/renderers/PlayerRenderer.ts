import type { Player, AnimState } from '../../core/entities/Player';

interface SpriteData {
    img: HTMLImageElement;
    frameWidth: number;
    frameHeight: number;
    totalFrames: number;
    isLoaded: boolean;
}

export class PlayerRenderer {
    private player: Player;
    private sprites: Record<AnimState, SpriteData>;
    
    private currentFrame: number = 0;
    private animCounter: number = 0;
    private readonly animSpeed: number = 0.06;

    constructor(player: Player) {
        this.player = player;
        
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

    // Called by the Event Processor when the core player changes state
    public onStateChange(_newState: AnimState) {
        this.animCounter = 0;
        this.currentFrame = 0;
    }

    public updateAnimation() {
        const currentSpriteData = this.sprites[this.player.currentState];
        
        const isDead = this.player.currentState === 'death';
        if (isDead && this.currentFrame === currentSpriteData.totalFrames - 1) {
            return; // Animation finished
        }

        if (currentSpriteData.isLoaded) {
            this.animCounter += this.animSpeed;
            this.currentFrame = Math.floor(this.animCounter) % currentSpriteData.totalFrames;

            // Notice: State changes back to idle are now handled by core, 
            // but for "one-off" animations like hit or attack, we might need a way to tell the core it finished,
            // OR the core has a timer. Since core doesn't have a timer right now, 
            // we will let the renderer just loop until core changes state, or we hack it to loop once.
            // In a strict MVC, the core should decide when 'attack' is over.
            // Since we stripped it from core, let's just loop it for now or emit an event back.
            // For simplicity and keeping core clean without timing hacks yet, we just render what core says.
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.updateAnimation();
        
        const sprite = this.sprites[this.player.currentState];

        if (sprite.isLoaded && sprite.frameWidth > 0) {
            ctx.save();
            ctx.translate(Math.floor(this.player.pos.x), Math.floor(this.player.pos.y));

            if (this.player.isFacingLeft) {
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
            ctx.fillRect(this.player.pos.x - 16, this.player.pos.y - 16, 32, 32);
        }
    }
}
