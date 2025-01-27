import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { filter, isNil } from 'lodash';

import { Attack, DamageInstance, Mob, Mobs, Monster } from '../../dto/mob';
import { extractMonsterDto, MonsterState } from '../monster/monster-slice';

export const monsterAdapter = createEntityAdapter<MonsterState>();

export interface MobState {
    id: number;
    name: string;
    monsterId: number;
    hp: number;
    count: number;
    max: number;
}

export const mobAdapter = createEntityAdapter<MobState>();

export interface MobsState {
    mobs: EntityState<MobState, number>;
}

const initialState: MobsState = {
    mobs: mobAdapter.getInitialState()
}

export const mobSlice = createSlice({
    name: 'mob',
    initialState,
    reducers: {
        setMobs: (state: MobsState, action: PayloadAction<MobsState>) => {
            return action.payload;
        },
        addMob: (state: MobsState, action: PayloadAction<Mobs>) => {

        }
    }
});

export function extractMobDto(state: MobState): Mob {
    return {
        ...state
    };
}

export function extractMobsDto(state: MobsState): Mobs {
    return {
        mobs: filter(Object.values(state.mobs.entities), obj => !isNil(obj)).map(extractMobDto) as Mob[]
    };
}

export default mobSlice.reducer;