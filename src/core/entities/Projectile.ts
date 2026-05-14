import { Vector2D } from '../../math/Vector2D';
import { BaseEntity } from './BaseEntity';

export class Projectile extends BaseEntity {
    public damage: number;
    public lifeTime: number = 0;

    constructor(x: number, y: number, direction: Vector2D, speed: number = 5, damage: number = 1) {
        super('projectile', x, y, speed, direction);
        this.damage = damage;
    }

    public update(deltaTime: number) {
        this.pos.x += this.direction.x * this.speed;
        this.pos.y += this.direction.y * this.speed;
        this.lifeTime += deltaTime;
    }
}
