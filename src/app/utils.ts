import { EntityState } from '@reduxjs/toolkit';
import { join, max } from 'lodash';
import { DamageInstance } from '../dto/mob';

type HasName = {
    name: string
}

export const nextId = <T>(state: EntityState<T, number>): number => (max(state.ids) ?? -1) + 1;

export const sortByName = (a: HasName, b: HasName): number => a.name.localeCompare(b.name);

export const damageSummary = (damage: Array<DamageInstance>): string => {
    return join(damage.map(d => `${d.value}`), '+');
}