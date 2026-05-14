import { Vector2D } from '../../math/Vector2D';
import { eventBus } from '../events';

export abstract class BaseEntity {
    public readonly id: string;
    public readonly type: string;
    public pos: Vector2D;
    public direction: Vector2D;
    public speed: number;

    constructor(type: string, x: number, y: number, speed: number, direction: Vector2D = new Vector2D(1, 0)) {
        this.type = type;
        this.id = type + '_' + Math.random().toString(36).substring(2, 9);
        this.pos = new Vector2D(x, y);
        this.speed = speed;
        this.direction = new Vector2D(direction.x, direction.y).normalize();

        // Emit spawn event here since everything is initialized
        eventBus.emit('spawn', { entity: this });
    }
}
