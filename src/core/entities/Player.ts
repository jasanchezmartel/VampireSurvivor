import { Vector2D } from '../../math/Vector2D';
import { eventBus } from '../events';

export interface InputState {
    up: boolean; down: boolean; left: boolean; right: boolean;
}

export type AnimState = 'idle' | 'run' | 'attack' | 'hit' | 'death';

export class Player {
    public pos: Vector2D;
    public speed: number;
    public currentState: AnimState = 'idle';
    public isFacingLeft: boolean = false;

    public readonly type = 'player';

    // A simple unique ID for tracking entities in the renderer
    public readonly id: string;

    constructor(x: number, y: number, speed: number = 3) {
        this.id = 'player_' + Math.random().toString(36).substr(2, 9);
        this.pos = new Vector2D(x, y);
        this.speed = speed;
        
        // Broadcast spawn event
        eventBus.emit('spawn', { entity: this });
    }

    public playAction(state: AnimState) {
        if (this.currentState === 'death') return;

        this.setState(state);
    }

    private setState(newState: AnimState) {
        if (this.currentState === newState) return;
        this.currentState = newState;
        eventBus.emit('stateChange', { entity: this, state: newState });
    }

    update(input: InputState) {
        if (this.currentState === 'death') return;

        // Comprobamos si estamos en una animación "de acción" que bloquee el movimiento
        const isLocked = ['attack', 'hit', 'death'].includes(this.currentState);

        const direction = new Vector2D(0, 0);

        if (!isLocked) {
            if (input.up) direction.y -= 1;
            if (input.down) direction.y += 1;
            if (input.left) direction.x -= 1;
            if (input.right) direction.x += 1;

            const isMoving = direction.x !== 0 || direction.y !== 0;

            if (isMoving) {
                this.setState('run');
                if (direction.x < 0) this.isFacingLeft = true;
                if (direction.x > 0) this.isFacingLeft = false;
            } else {
                this.setState('idle');
            }

            direction.normalize();
            this.pos.x += direction.x * this.speed;
            this.pos.y += direction.y * this.speed;
        }
    }
}
