import { Vector2D } from '../../math/Vector2D';
import { eventBus } from '../events';

export class Player {
    public pos: Vector2D;
    public speed: number;
    public direction: Vector2D; // Direction the player is facing

    public readonly type = 'player';

    // A simple unique ID for tracking entities in the renderer
    public readonly id: string;

    constructor(x: number, y: number, speed: number = 3) {
        this.id = 'player_' + Math.random().toString(36);
        this.pos = new Vector2D(x, y);
        this.speed = speed;
        this.direction = new Vector2D(1, 0); // Default facing right

        // Broadcast spawn event
        eventBus.emit('spawn', { entity: this });
    }

    update(inputs?: { up: boolean; down: boolean; left: boolean; right: boolean }) {
        const direction = new Vector2D(0, 0);
        
        if (inputs) {
            if (inputs.up) direction.y -= 1;
            if (inputs.down) direction.y += 1;
            if (inputs.left) direction.x -= 1;
            if (inputs.right) direction.x += 1;
        }
        
        // Update facing direction if moving
        if (direction.x !== 0 || direction.y !== 0) {
            direction.normalize();
            this.direction = direction;
        }
        
        const isMoving = direction.x !== 0 || direction.y !== 0;

        if (isMoving) {
            direction.normalize();
            this.pos.x += direction.x * this.speed;
            this.pos.y += direction.y * this.speed;
        }
    }
}