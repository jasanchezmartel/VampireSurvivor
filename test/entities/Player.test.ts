// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Player } from '../../src/core/entities/Player';

describe('Player Logic', () => {
    let player: Player;

    beforeEach(() => {
        // 1. MOCK DE LA IMAGEN
        // Necesario porque el constructor hace 'new Image()' y en los tests no existe el navegador.
        vi.stubGlobal('Image', class {
            src: string = '';
            width: number = 100;
            height: number = 100;
            onload: () => void = () => { };
            onerror: () => void = () => { };
            // Simulamos que al crearse, avisa de que ha cargado (opcional, pero buena práctica)
            constructor() {
                setTimeout(() => this.onload && this.onload(), 0);
            }
        });

        // 2. Crear jugador en (0,0) con velocidad 10 para facilitar los cálculos
        player = new Player(0, 0, 10);
    });

    afterEach(() => {
        vi.unstubAllGlobals(); // Limpieza
    });

    // TEST 1: Verificar que se han pedido cargar las imágenes
    it('inicializa los sprites correctamente (Idle y Run)', () => {
        // Accedemos a la propiedad privada 'sprites' usando 'any'
        const p = player as unknown as { sprites: { idle: { img: { src: string } }, run: { img: { src: string } } } };

        // Verificamos que el objeto de sprites existe
        expect(p.sprites).toBeDefined();

        // Verificamos que las rutas son las correctas
        expect(p.sprites.idle.img.src).toContain('Idle.png');
        expect(p.sprites.run.img.src).toContain('Run.png');
    });

    // TEST 2: Movimiento en todas direcciones
    it('se mueve correctamente en todas las direcciones', () => {
        // DERECHA
        player.update({ up: false, down: false, left: false, right: true });
        expect(player.pos.x).toBe(10);
        expect(player.pos.y).toBe(0);

        // RESET POSICIÓN
        player.pos.x = 0; player.pos.y = 0;

        // IZQUIERDA
        player.update({ up: false, down: false, left: true, right: false });
        expect(player.pos.x).toBe(-10);

        // RESET POSICIÓN
        player.pos.x = 0; player.pos.y = 0;

        // ARRIBA (Recordemos que en Canvas Y negativo es hacia arriba)
        player.update({ up: true, down: false, left: false, right: false });
        expect(player.pos.y).toBe(-10);

        // RESET POSICIÓN
        player.pos.x = 0; player.pos.y = 0;

        // ABAJO
        player.update({ up: false, down: true, left: false, right: false });
        expect(player.pos.y).toBe(10);
    });
});