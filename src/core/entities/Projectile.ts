import { Vector2D } from '../../math/Vector2D';
import { eventBus } from '../events';

export class Projectile {
    public pos: Vector2D;
    public direction: Vector2D;
    public speed: number;
    public damage: number;
    public lifeTime: number = 0;
    public readonly id: string;
    public readonly type = 'projectile';

    constructor(x: number, y: number, direction: Vector2D, speed: number = 5, damage: number = 1) {
        this.id = 'proj_' + Math.random().toString(36);
        this.pos = new Vector2D(x, y);
        this.direction = new Vector2D(direction.x, direction.y).normalize();
        this.speed = speed;
        this.damage = damage;
        
        eventBus.emit('spawn', { entity: this });
    }

    public update(deltaTime: number) {
        this.pos.x += this.direction.x * this.speed;
        this.pos.y += this.direction.y * this.speed;
        this.lifeTime += deltaTime;
    }
}
