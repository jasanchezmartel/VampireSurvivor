import { Vector2D } from '../../math/Vector2D';
import { BaseEntity } from './BaseEntity';

export class Player extends BaseEntity {
    public name: string;

    constructor(x: number, y: number, speed: number = 3, name: string = 'Player') {
        super('player', x, y, speed, new Vector2D(1, 0));
        this.name = name;
    }

    update(inputs: { up: boolean; down: boolean; left: boolean; right: boolean }) {
        const direction = new Vector2D(0, 0);
        if (inputs.up) direction.y -= 1;
        if (inputs.down) direction.y += 1;
        if (inputs.left) direction.x -= 1;
        if (inputs.right) direction.x += 1;

        if (direction.x !== 0 || direction.y !== 0) {
            this.direction = direction.normalize();
        }

        const isMoving = direction.x !== 0 || direction.y !== 0;

        if (isMoving) {
            direction.normalize();
            this.pos.x += direction.x * this.speed;
            this.pos.y += direction.y * this.speed;
        }
    }
}