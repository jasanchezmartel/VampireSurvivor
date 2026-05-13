import { Vector2D } from '../../math/Vector2D';
import { eventBus } from '../events';

export class Enemy {
    public readonly id: string;
    public readonly type = 'enemy';
    public pos: Vector2D;
    public speed: number;
    public direction: Vector2D; // Direction the enemy is facing

    constructor(x: number, y: number, speed: number = 1) {
        this.id = 'enemy_' + Math.random().toString(36);
        this.pos = new Vector2D(x, y);
        this.speed = speed;
        this.direction = new Vector2D(1, 0); // Default facing right
        
        eventBus.emit('spawn', { entity: this });
    }

    public update(targetPos: Vector2D) {
        // Move towards target
        const direction = new Vector2D(targetPos.x - this.pos.x, targetPos.y - this.pos.y);
        
        // Simple normalization
        const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (length > 0) {
            direction.x /= length;
            direction.y /= length;
        }
        
        // Update facing direction
        this.direction = direction;

        this.pos.x += direction.x * this.speed;
        this.pos.y += direction.y * this.speed;
    }
}
