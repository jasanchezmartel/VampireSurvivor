import { Enemy } from '../../core/entities/Enemy';

export class EnemyRenderer {
    private enemy: Enemy;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(Math.floor(this.enemy.pos.x), Math.floor(this.enemy.pos.y));
        
        ctx.fillStyle = 'red';
        // Draw a simple square of 32x32 centered
        ctx.fillRect(-16, -16, 32, 32);

        ctx.restore();
    }
}
