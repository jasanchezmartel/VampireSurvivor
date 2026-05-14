import { Vector2D } from '../../math/Vector2D';
import { BaseEntity } from './BaseEntity';

export class Enemy extends BaseEntity {
    public hp: number = 0;

    constructor() {
        super('enemy', 0, 0, 1, new Vector2D(1, 0));
    }

    public init(x: number, y: number, speed: number, hp: number) {
        this.pos.x = x;
        this.pos.y = y;
        this.speed = speed;
        this.hp = hp;
        this.direction.x = 1;
        this.direction.y = 0;
        return this;
    }

    public takeDamage(amount: number) {
        this.hp -= amount;
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
