// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BackgroundRenderer } from '../../src/view/renderers/BackgroundRenderer';

describe('Background', () => {
    let bg: BackgroundRenderer;

    beforeEach(() => {
        // Inicializamos el fondo
        bg = new BackgroundRenderer('/background/Grass Pack Spritesheet.png');
    });

    it('inicializa correctamente', () => {
        expect(bg).toBeInstanceOf(BackgroundRenderer);
    });

    it('utiliza todas las variedades de baldosas del spritesheet (biomas)', () => {
        // Accedemos al método privado getTileAt para verificar la lógica de ruido
        // Usamos (bg as unknown) para saltar la restricción de 'private' en el test
        const getTile = (bg as unknown as { getTileAt: (x: number, y: number) => { y: number } }).getTileAt.bind(bg);

        const filasEncontradas = new Set<number>();

        // Escaneamos un área mayor para asegurar que el ruido genere variedad
        for (let x = 0; x < 200; x++) {
            for (let y = 0; y < 200; y++) {
                const tile = getTile(x, y);
                filasEncontradas.add(tile.y);
            }
        }

        // Verificamos que el sistema es capaz de mostrar las 4 filas del spritesheet:
        // Fila 0: Hierba normal
        // Fila 1: Transición
        // Fila 2: Zona oscura
        // Fila 3: Tierra
        expect(filasEncontradas.has(0)).toBe(true);
        expect(filasEncontradas.has(1)).toBe(true);
        expect(filasEncontradas.has(2)).toBe(true);
        expect(filasEncontradas.has(3)).toBe(true);
    });

    it('gestiona correctamente los chunks en memoria', () => {
        const chunks = (bg as unknown as { chunks: Map<string, unknown> }).chunks;
        expect(chunks).toBeInstanceOf(Map);
        expect(chunks.size).toBe(0); // Empieza vacío
    });
});