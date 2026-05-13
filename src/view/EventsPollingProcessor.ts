import { eventBus, type GameEvents } from '../core/events';
import { PlayerRenderer } from './renderers/PlayerRenderer';
import { EnemyRenderer } from './renderers/EnemyRenderer';
import type { Player } from '../core/entities/Player';
import type { Enemy } from '../core/entities/Enemy';

type EventPayload<T extends keyof GameEvents> = {
    type: T;
    payload: GameEvents[T];
};

export class EventsPollingProcessor {
    private queue: EventPayload<keyof GameEvents>[] = [];
    
    // Maps entity id to its renderer
    private playerRenderers: Map<string, PlayerRenderer> = new Map();
    private enemyRenderers: Map<string, EnemyRenderer> = new Map();

    constructor() {
        // Listen to all events and queue them
        eventBus.on('*', (type, payload) => {
            this.queue.push({ type: type as keyof GameEvents, payload: payload as any });
        });
    }

    public processQueue() {
        // Process all events currently in the queue
        while (this.queue.length > 0) {
            const event = this.queue.shift()!;
            
            if (event.type === 'spawn') {
                const { entity } = event.payload as GameEvents['spawn'];
                if (entity.type === 'player') {
                    const renderer = new PlayerRenderer(entity as Player);
                    this.playerRenderers.set(entity.id, renderer);
                } else if (entity.type === 'enemy') {
                    const renderer = new EnemyRenderer(entity as Enemy);
                    this.enemyRenderers.set(entity.id, renderer);
                }
            } 
            else if (event.type === 'death') {
                const { entity } = event.payload as GameEvents['death'];
                if (entity.type === 'player') {
                    this.playerRenderers.delete(entity.id);
                } else if (entity.type === 'enemy') {
                    this.enemyRenderers.delete(entity.id);
                }
            }
            else if (event.type === 'stateChange') {
                // Currently only Player has state
                const { entity, state } = event.payload as GameEvents['stateChange'];
                if (entity.type === 'player') {
                    const renderer = this.playerRenderers.get(entity.id);
                    if (renderer) {
                        renderer.onStateChange(state);
                    }
                }
            }
        }
    }

    public drawAll(ctx: CanvasRenderingContext2D) {
        for (const renderer of this.enemyRenderers.values()) {
            renderer.draw(ctx);
        }
        for (const renderer of this.playerRenderers.values()) {
            renderer.draw(ctx);
        }
    }
}
