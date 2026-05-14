import { Enemy } from "../../core/entities/Enemy";

export class EnemyRenderer {
    private enemy: Enemy;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(Math.floor(this.enemy.pos.x), Math.floor(this.enemy.pos.y));

        ctx.fillStyle = "black";
        // Draw a simple square of 32x32 centered
        ctx.fillRect(-16, -16, 32, 32);

        // Draw direction indicator (line pointing in the direction the enemy is facing)
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.enemy.direction.x * 16, this.enemy.direction.y * 16);
        ctx.stroke();

        ctx.restore();
    }
}
