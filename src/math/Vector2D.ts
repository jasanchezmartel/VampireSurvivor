export class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(v: Vector2D): Vector2D {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    public sub(v: Vector2D): Vector2D {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    public multiply(s: number): Vector2D {
        this.x *= s;
        this.y *= s;
        return this;
    }

    public normalize(): Vector2D {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }
}