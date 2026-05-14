import { Vector2D } from '../../math/Vector2D';
import { BaseEntity } from './BaseEntity';

export class Projectile extends BaseEntity {
    public damage: number = 1;
    public lifeTime: number = 0;

    constructor() {
        super('projectile', 0, 0, 5, new Vector2D(1, 0));
    }

    public init(x: number, y: number, direction: Vector2D, speed: number, damage: number) {
        this.pos.x = x;
        this.pos.y = y;
        this.direction.x = direction.x;
        this.direction.y = direction.y;
        this.direction.normalize();
        this.speed = speed;
        this.damage = damage;
        this.lifeTime = 0;
        return this;
    }

    public update(deltaTime: number) {
        this.pos.x += this.direction.x * this.speed;
        this.pos.y += this.direction.y * this.speed;
        this.lifeTime += deltaTime;
    }
}
