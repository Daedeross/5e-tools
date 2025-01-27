// dto definitions for mob tracking
export interface DamageInstance {
    expression: string;
    value: number;
    bonus: number;
    type: string;
}

export interface Attack {
    id: number;
    name: string;
    toHit: number;
    bonus: number;
    damage: Array<DamageInstance>;
}

export interface Monster {
    id: number;
    name: string;
    hp: number;
    tempHp: number;
    maxHp: number;
    attacks: Array<Attack>;
}

export interface Monsters {
    monsters: Array<Monster>;
}

export interface Mob {
    id: number;
    name: string;
    monsterId: number;
    hp: number;
    count: number;
    max: number;
}

export interface Mobs {
    mobs: Array<Mob>;
}