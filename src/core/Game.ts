import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';

export class Game {
    public player: Player;
    public enemies: Enemy[] = [];

    // Inputs are driven externally (from window listeners in main.ts)
    public inputs: InputState = { up: false, down: false, left: false, right: false };

    private spawnTimer = 0;

    constructor() {
        this.player = new Player(0, 0, 1.8);
    }

    public update(deltaTime: number) {
        // Update player
        this.player.update(this.inputs);

        // Spawn enemies occasionally
        this.spawnTimer += deltaTime;
        if (this.spawnTimer > 2) { // spawn every 2 seconds
            this.spawnTimer = 0;
            const spawnX = this.player.pos.x + (Math.random() > 0.5 ? 500 : -500);
            const spawnY = this.player.pos.y + (Math.random() > 0.5 ? 500 : -500);
            this.enemies.push(new Enemy(spawnX, spawnY, 1));
        }

        // Update enemies
        for (const enemy of this.enemies) {
            enemy.update(this.player.pos);
        }
    }
}
