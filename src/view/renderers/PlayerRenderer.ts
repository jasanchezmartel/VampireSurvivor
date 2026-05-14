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
        context.fillRect(-16, -16, 32, 32);
        
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.player.direction.x * 16, this.player.direction.y * 16);
        context.stroke();

        // Draw player name above
        context.fillStyle = '#ff0707';
        context.font = 'bold 12px Arial';
        context.textAlign = 'center';
        context.fillText(this.player.name, 0, -25);
        
        context.restore();
    }
}
