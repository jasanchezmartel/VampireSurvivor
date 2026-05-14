import { test, expect } from '@playwright/test';

test.describe('Visualización de Background', () => {
    test('muestra los diferentes biomas del mapa', async ({ page }) => {
        await page.goto('/');

        // Esperamos a que el canvas esté listo
        const canvas = page.locator('#game-canvas');
        await expect(canvas).toBeVisible();

        // Función para mover al jugador a una posición específica y esperar a que el fondo cargue
        const checkPosition = async (x: number, y: number, name: string) => {
            await page.evaluate(({ x, y }) => {
                const p = (window as unknown as { player?: { pos: { x: number, y: number } } }).player;
                if (p) {
                    p.pos.x = x;
                    p.pos.y = y;
                }
            }, { x, y });

            // Esperamos un poco para que los chunks se rendericen
            await page.waitForTimeout(1000);
            await page.screenshot({ path: `./test/visual/screenshots/biome-${name}.png` });
        };

        // Escenarios de prueba (Coordenadas donde solemos encontrar biomas por el ruido)
        await test.step('Ver zona de Hierba', async () => {
            await checkPosition(0, 0, 'grass');
        });

        await test.step('Ver zona de Tierra', async () => {
            await checkPosition(1500, 1500, 'dirt');
        });

        await test.step('Ver zona de Transición', async () => {
            await checkPosition(800, 0, 'transition');
        });

        await test.step('Ver zona Oscura', async () => {
            await checkPosition(-1000, -1000, 'dark');
        });
    });
});
