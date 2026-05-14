import { Projectile } from "../../../../server/core/entities/Projectile";

export class ProjectileRenderer {
    public static draw(ctx: CanvasRenderingContext2D, projectile: Projectile) {
        ctx.save();
        ctx.translate(Math.floor(projectile.pos.x), Math.floor(projectile.pos.y));

        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
