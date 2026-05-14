import { Player } from '../../core/entities/Player';

export class PlayerRenderer {
    private player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    public draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(Math.floor(this.player.pos.x), Math.floor(this.player.pos.y));

        context.fillStyle = 'blue';
        // Draw a simple square of 32x32 centered
        context.fillRect(-16, -16, 32, 32);
        
        // Draw direction indicator (line pointing in the direction the player is facing)
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.player.direction.x * 16, this.player.direction.y * 16);
        context.stroke();
        
        context.restore();
    }
}
