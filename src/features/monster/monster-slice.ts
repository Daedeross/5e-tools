import { createEntityAdapter, createSlice, EntityState, PayloadAction, Update } from '@reduxjs/toolkit';
import { filter, has, isNil, isNull } from 'lodash';

import { Attack, DamageInstance, Monster, Monsters } from '../../dto/mob';
import { nextId, sortByName } from '../../app/utils';
import { RootState } from '../../app/store';
import { ChildUpdate } from '../../app';

export interface AttackState {
    id: number;
    name: string;
    toHit: number;
    bonus: number;
    damage: Array<DamageInstance>;
}

export const attackAdapter = createEntityAdapter<AttackState>();

export interface MonsterState {
    id: number;
    name: string;
    hp: number;
    tempHp: number;
    maxHp: number;
    attacks: EntityState<AttackState, number>;
}

export const monsterAdapter = createEntityAdapter<MonsterState>({
    sortComparer: sortByName
});

export interface MonstersState {
    monsters: EntityState<MonsterState, number>;
    currentMonster: MonsterState | null;
}

const initialState: MonstersState = {
    monsters: monsterAdapter.getInitialState(),
    currentMonster: null
}

export const monsterSlice = createSlice({
    name: 'monster',
    initialState,
    reducers: {
        setState: (state: MonstersState, action: PayloadAction<Array<MonsterState>>) => {
            monsterAdapter.setAll(state.monsters, action.payload);
        },
        addMonster: (state: MonstersState, action: PayloadAction<MonsterState | Monster>) => {
            //if ()
        },
        updateMonster: (state: MonstersState, action: PayloadAction<Update<MonsterState, number>>) => {
            monsterAdapter.updateOne(state.monsters, action.payload);
        },
        addAttack: (state: MonstersState, action: PayloadAction<AttackState>) => {
            if (isNil(state.currentMonster)) {
                return;
            }
            const next_id = nextId(state.currentMonster.attacks);
            attackAdapter.addOne(state.currentMonster.attacks, { ...action.payload, id: next_id });
        },
        deleteAttack: (state: MonstersState, action: PayloadAction<number>) => {
            if (isNil(state.currentMonster)) {
                return;
            }
            attackAdapter.removeOne(state.currentMonster.attacks, action.payload);
        },
        udpateAttack: (state: MonstersState, action: PayloadAction<ChildUpdate<AttackState, number>>) => {
            // if update does not have the correct structure, do nothing.
            if (!has(action.payload.update, 'changes')) return;
            const monster = monster_selectors.selectById(state.monsters, action.payload.id);

            // if the id is invalid, do nothing.
            if (isNil(monster)) return;

            const attacks = attackAdapter.updateOne(monster.attacks, action.payload.update as Update<AttackState, number>);
            monsterAdapter.updateOne(state.monsters, { id: action.payload.id, changes: { attacks }})
        },
        createNewMonster: (state: MonstersState, action: PayloadAction) => {
            state.currentMonster = {
                id: nextId(state.monsters),
                name: '',
                hp: 1,
                tempHp: 0,
                maxHp: 1,
                attacks: attackAdapter.getInitialState()
            }
        },
        startMonsterEdit: (state: MonstersState, action: PayloadAction<number>) => {
            const monster = monsterSelectors.selectById(state.monsters, action.payload);
            if (isNil(monster)) {
                state.currentMonster = null;
            } else {
                state.currentMonster = monster;
            }
        },
        updateCurrent: (state: MonstersState, action: PayloadAction<Partial<MonsterState>>) => {
            if (isNil(state.currentMonster)) return;

            state.currentMonster = { ...state.currentMonster, ...action.payload };
        },
        commitEdit: (state: MonstersState, action: PayloadAction) => {
            if (isNil(state.currentMonster)) return;

            monsterAdapter.setOne(state.monsters, state.currentMonster);
            state.currentMonster = null;
        },
        cancelEdit: (state: MonstersState, action: PayloadAction) => {
            state.currentMonster = null;
        },
        addAttackToCurrent: (state: MonstersState, action: PayloadAction<AttackState>) => {
            if (isNil(state.currentMonster)) {
                return;
            }
            const next_id = nextId(state.currentMonster.attacks);
            attackAdapter.addOne(state.currentMonster.attacks, { ...action.payload, id: next_id });
        },
        deleteAttackFromCurrent: (state: MonstersState, action: PayloadAction<number>) => {
            if (isNil(state.currentMonster)) {
                return;
            }
            attackAdapter.removeOne(state.currentMonster.attacks, action.payload);
        },
        udpateAttackOfCurrent: (state: MonstersState, action: PayloadAction<Update<AttackState, number>>) => {
            if (isNil(state.currentMonster)) {
                return;
            }
            attackAdapter.updateOne(state.currentMonster.attacks, action.payload);
        }
    }
});

export const monstersActions = { ...monsterSlice.actions };

export const selectMonsters = (state: RootState) => state.monster;

const attack_selectors = attackAdapter.getSelectors();
const monster_selectors = monsterAdapter.getSelectors();

const selectAttack = (monsterId: number, attackId: number) => (state: RootState) => {
    const mon = monster_selectors.selectById(state.monster.monsters, monsterId);
    if (isNil(mon)) {
        return;
    }
    return attack_selectors.selectById(mon.attacks, attackId);
}

export const monsterSelectors = {
    ...monster_selectors,
    selectorById: (id: number) => (state: RootState) => monster_selectors.selectById(state.monster.monsters, id),
    selectAttack,
    currentMonster: (state: RootState) => state.monster.currentMonster,
    currentMonsterAttack: (id: number | undefined) => (state: RootState) => isNil(state.monster.currentMonster) || isNil(id)
        ? undefined
        : attackAdapter.getSelectors().selectById(state.monster.currentMonster.attacks, id),
}

export const selectNewMonster = (state: RootState): MonsterState => {
    return {
        id: nextId(state.monster.monsters),
        name: '',
        hp: 1,
        tempHp: 0,
        maxHp: 1,
        attacks: attackAdapter.getInitialState()
    }
}

export function extractAttackDto(state: AttackState): Attack {
    return {
        ...state
    }
}

export function extractMonsterDto(state: MonsterState): Monster {
    return {
        id: state.id,
        name: state.name,
        hp: state.hp,
        tempHp: state.tempHp,
        maxHp: state.maxHp,
        attacks: filter(Object.values(state.attacks.entities), obj => !isNil(obj)).map(extractAttackDto) as Attack[],
    }
}

export function extractMonstersDto(state: MonstersState): Monsters {
    return {
        monsters: filter(Object.values(state.monsters.entities), obj => !isNil(obj)).map(extractMonsterDto) as Monster[],
    }
}

export default monsterSlice.reducer;