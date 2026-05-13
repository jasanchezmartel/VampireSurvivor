import { Vector2D } from '../../math/Vector2D';
import { eventBus } from '../events';

export class Enemy {
    public readonly id: string;
    public readonly type = 'enemy';
    public pos: Vector2D;
    public speed: number;

    constructor(x: number, y: number, speed: number = 1) {
        this.id = 'enemy_' + Math.random().toString(36).substr(2, 9);
        this.pos = new Vector2D(x, y);
        this.speed = speed;
        
        eventBus.emit('spawn', { entity: this as any });
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

        this.pos.x += direction.x * this.speed;
        this.pos.y += direction.y * this.speed;
    }
}
