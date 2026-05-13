import { Player } from '../../core/entities/Player';

export class PlayerRenderer {
    private player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(Math.floor(this.player.pos.x), Math.floor(this.player.pos.y));

        ctx.fillStyle = 'blue';
        // Draw a simple square of 32x32 centered
        ctx.fillRect(-16, -16, 32, 32);
        
        // Draw direction indicator (line pointing in the direction the player is facing)
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.player.direction.x * 16, this.player.direction.y * 16);
        ctx.stroke();
        
        ctx.restore();
    }
}
