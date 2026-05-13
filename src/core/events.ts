import mitt from 'mitt';
import type { Player } from './entities/Player';
import type { Enemy } from './entities/Enemy';

export type CoreEntity = Player | Enemy;

export type GameEvents = {
    spawn: { entity: CoreEntity };
    death: { entity: CoreEntity };
    stateChange: { entity: Player, state: 'idle' | 'run' | 'attack' | 'hit' | 'death' };
};

export const eventBus = mitt<GameEvents>();
