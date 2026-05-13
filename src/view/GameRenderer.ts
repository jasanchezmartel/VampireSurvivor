import { Game } from '../core/Game';
import { BackgroundRenderer } from './renderers/BackgroundRenderer';
import { PlayerRenderer } from './renderers/PlayerRenderer';
import { EnemyRenderer } from './renderers/EnemyRenderer';

export class GameRenderer {
    private readonly backgroundRenderer: BackgroundRenderer;
    private readonly playerRenderer: PlayerRenderer;
    private readonly enemyRenderers = new Map<string, EnemyRenderer>();

    constructor(game: Game) {
        this.backgroundRenderer = new BackgroundRenderer('/background/background.png');
        this.playerRenderer = new PlayerRenderer(game.player);
    }

    public render(ctx: CanvasRenderingContext2D, game: Game, width: number, height: number) {
        ctx.clearRect(0, 0, width, height);
        ctx.save();

        const camX = -game.player.pos.x + width / 2;
        const camY = -game.player.pos.y + height / 2;
        ctx.translate(camX, camY);

        this.backgroundRenderer.draw(ctx, game.player.pos, width, height);
        this.playerRenderer.draw(ctx);

        for (const enemy of game.enemies) {
            if (!this.enemyRenderers.has(enemy.id)) {
                this.enemyRenderers.set(enemy.id, new EnemyRenderer(enemy));
            }

            this.enemyRenderers.get(enemy.id)!.draw(ctx);
        }

        ctx.restore();
    }
}