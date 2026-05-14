import mitt from 'mitt';
import type { BaseEntity } from './entities/BaseEntity';

export type CoreEntity = BaseEntity;

export type GameEvents = {
    spawn: { entity: CoreEntity };
    death: { entity: CoreEntity };
    stateChange: { entity: CoreEntity, state: 'idle' | 'run' | 'attack' | 'hit' | 'death' };
};

export const eventBus = mitt<GameEvents>();
