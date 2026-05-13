import { Vector2D } from '../../math/Vector2D';
import { eventBus } from '../events';

export class Player {
    public pos: Vector2D;
    public speed: number;

    public readonly type = 'player';

    // A simple unique ID for tracking entities in the renderer
    public readonly id: string;

    constructor(x: number, y: number, speed: number = 3) {
        this.id = 'player_' + Math.random().toString(36);
        this.pos = new Vector2D(x, y);
        this.speed = speed;

        // Broadcast spawn event
        eventBus.emit('spawn', { entity: this });
    }

    update() {
        const direction = new Vector2D(0, 0);
        const isMoving = direction.x !== 0 || direction.y !== 0;

        if (isMoving) {
            direction.normalize();
            this.pos.x += direction.x * this.speed;
            this.pos.y += direction.y * this.speed;
        }
    }
}