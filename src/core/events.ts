import mitt from 'mitt';
import type { Player } from './entities/Player';
import type { Enemy } from './entities/Enemy';
import type { Projectile } from './entities/Projectile';

export type CoreEntity = Player | Enemy | Projectile;

export type GameEvents = {
    spawn: { entity: CoreEntity };
    death: { entity: CoreEntity };
    stateChange: { entity: Player, state: 'idle' | 'run' | 'attack' | 'hit' | 'death' };
};

export const eventBus = mitt<GameEvents>();
