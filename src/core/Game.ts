import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Projectile } from './entities/Projectile';
import { Vector2D } from '../math/Vector2D';
import type { InputState } from './inputs/InputHandler';

export class Game {
    public player: Player;
    public enemies: Enemy[] = [];
    public projectiles: Projectile[] = [];

    // Inputs are driven externally (from window listeners in main.ts)
    public inputs: InputState = { up: false, down: false, left: false, right: false };

    private shootTimer = 0;
    public wave = 1;
    private waveTimer = 0;
    private lastSpawnedWave = 0;

    constructor(playerName: string = 'Player') {
        this.player = new Player(0, 0, 1.8, playerName);
    }

    private spawnEnemies(count: number) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 500 + Math.random() * 200;
            const spawnX = this.player.pos.x + Math.cos(angle) * distance;
            const spawnY = this.player.pos.y + Math.sin(angle) * distance;
            this.enemies.push(new Enemy(spawnX, spawnY, 1 + this.wave * 0.1, 2));
        }
    }

    public update(deltaTime: number) {
        // Update player
        this.player.update(this.inputs);

        // Shooting logic
        this.shootTimer += deltaTime;
        if (this.shootTimer > 0.5) { // Shoot every 0.5 seconds
            this.shootTimer = 0;
            let projDir = this.player.direction;
            if (this.inputs.targetX !== undefined && this.inputs.targetY !== undefined) {
                const dirX = this.inputs.targetX - this.player.pos.x;
                const dirY = this.inputs.targetY - this.player.pos.y;
                if (dirX !== 0 || dirY !== 0) {
                    projDir = new Vector2D(dirX, dirY).normalize();
                }
            }
            this.projectiles.push(new Projectile(this.player.pos.x, this.player.pos.y, projDir, 7, 1));
        }

        // Update projectiles and check collisions
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.update(deltaTime);
            if (proj.lifeTime > 2) { // Remove after 2 seconds
                this.projectiles.splice(i, 1);
                continue;
            }

            // Check collision with enemies
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const dx = proj.pos.x - enemy.pos.x;
                const dy = proj.pos.y - enemy.pos.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 400) { // Assuming radius of ~20 -> 20^2 = 400
                    enemy.takeDamage(proj.damage);
                    this.projectiles.splice(i, 1);
                    if (enemy.hp <= 0) {
                        this.enemies.splice(j, 1);
                    }
                    break;
                }
            }
        }

        // Wave logic
        this.waveTimer += deltaTime;
        if (this.waveTimer > 20) { // New wave every 20 seconds
            this.waveTimer = 0;
            this.wave++;
        }

        // Burst spawn at start of each wave
        if (this.wave > this.lastSpawnedWave) {
            const enemiesToSpawn = 10 + (this.wave - 1) * 5;
            this.spawnEnemies(enemiesToSpawn);
            this.lastSpawnedWave = this.wave;
        }

        // Update enemies
        for (const enemy of this.enemies) {
            enemy.update(this.player.pos);
        }
    }
}
