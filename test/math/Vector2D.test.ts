import { describe, it, expect } from 'vitest';
import { Vector2D } from '../../src/math/Vector2D';

describe('Vector2D', () => {
    it('debería sumar otro vector correctamente', () => {
        const v1 = new Vector2D(10, 10);
        const v2 = new Vector2D(5, -2);
        v1.add(v2);
        expect(v1.x).toBe(15);
        expect(v1.y).toBe(8);
    });

    it('debería calcular la magnitud (longitud) correctamente', () => {
        const v = new Vector2D(3, 4); // Triángulo famoso 3-4-5
        expect(v.length()).toBe(5);
    });
});