import { Vector2D } from '../../math/Vector2D';

export class BackgroundRenderer {
    private image: HTMLImageElement;
    private isLoaded: boolean = false;
    private readonly tileSize: number = 32;
    private chunks: Map<string, HTMLCanvasElement> = new Map();
    private readonly chunkSize: number = 720;

    constructor(path: string) {
        this.image = new Image();
        this.image.src = path;
        this.image.onload = () => { this.isLoaded = true; };
    }

    private getTileAt(x: number, y: number) {
        const noise1 = Math.sin(x * 0.05) * Math.cos(y * 0.05);
        const noise2 = Math.sin(x * 0.02 + y * 0.02) * 1.8;
        const noise3 = Math.sin(x * 0.12) * Math.cos(y * 0.08) * 0.5;
        const intensity = (noise1 + noise2 + noise3 + 3) / 6;
        const varietyNoise = (Math.sin(x * 0.25) * Math.cos(y * 0.25) + 1) / 2;
        const detailHash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;

        let row = 0;
        let col = 0;

        if (intensity > 0.78) {
            row = 3;
        } else if (intensity > 0.75) {
            row = 1;
        } else if (intensity > 0.22) {
            row = 0;
        } else if (intensity > 0.18) {
            row = 1;
        } else {
            row = 2;
        }
        if (row === 3) {
            if (varietyNoise > 0.7) {
                col = (detailHash > 0.5) ? 2 : 0;
            } else if (varietyNoise > 0.4) {
                col = (detailHash > 0.8) ? 1 : 0;
            } else {
                col = 0;
            }
        } else if (row === 0) {
            if (varietyNoise > 0.82) {
                col = (detailHash > 0.5) ? 1 : 2;
            } else if (varietyNoise > 0.65 && detailHash > 0.9) {
                col = 1;
            } else {
                col = 0;
            }
        } else {
            col = (detailHash > 0.96) ? (Math.floor(detailHash * 10) % 2) + 1 : 0;
        }

        return { x: col, y: row };
    }

    private renderChunk(chunkX: number, chunkY: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = this.chunkSize;
        canvas.height = this.chunkSize;
        const pCtx = canvas.getContext('2d')!;

        const stepX = 72;
        const stepY = 18;
        const displaySize = 73;

        const worldStartX = chunkX * this.chunkSize;
        const worldStartY = chunkY * this.chunkSize;

        const startR = Math.floor(worldStartY / stepY) - 4;
        const endR = Math.ceil((worldStartY + this.chunkSize) / stepY) + 4;
        const startC = Math.floor(worldStartX / stepX) - 4;
        const endC = Math.ceil((worldStartX + this.chunkSize) / stepX) + 4;

        for (let r = startR; r <= endR; r++) {
            const isShifted = r % 2 !== 0;
            const shiftX = isShifted ? stepX / 2 : 0;
            const drawY = r * stepY - worldStartY;

            for (let c = startC; c <= endC; c++) {
                const drawX = c * stepX + shiftX - worldStartX;

                if (drawX < -displaySize || drawX > this.chunkSize ||
                    drawY < -displaySize || drawY > this.chunkSize) continue;

                const tile = this.getTileAt(c, r);
                pCtx.drawImage(
                    this.image,
                    tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize,
                    drawX, drawY, displaySize, displaySize
                );
            }
        }
        return canvas;
    }

    public draw(ctx: CanvasRenderingContext2D, playerPos: Vector2D, width: number, height: number) {
        if (!this.isLoaded) return;

        const startVisibleX = playerPos.x - width / 2;
        const endVisibleX = playerPos.x + width / 2;
        const startVisibleY = playerPos.y - height / 2;
        const endVisibleY = playerPos.y + height / 2;

        const startChunkX = Math.floor(startVisibleX / this.chunkSize);
        const endChunkX = Math.floor(endVisibleX / this.chunkSize);
        const startChunkY = Math.floor(startVisibleY / this.chunkSize);
        const endChunkY = Math.floor(endVisibleY / this.chunkSize);

        for (let cx = startChunkX; cx <= endChunkX; cx++) {
            for (let cy = startChunkY; cy <= endChunkY; cy++) {
                const key = `${cx},${cy}`;
                if (!this.chunks.has(key)) {
                    this.chunks.set(key, this.renderChunk(cx, cy));
                }
                const chunkCanvas = this.chunks.get(key)!;
                ctx.drawImage(chunkCanvas, cx * this.chunkSize, cy * this.chunkSize);
            }
        }

        if (this.chunks.size > 30) {
            this.chunks.clear();
        }
    }
}
