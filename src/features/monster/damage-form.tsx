import { concat, isNil, toInteger } from 'lodash';
import { ReactElement, useState } from 'react';

import { Button, Col, Container, Form, FormGroup, InputGroup, Modal, Row, Stack } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { AttackState, monstersActions, monsterSelectors, MonsterState } from './monster-slice';
import { damageSummary } from '../../app/utils';
import { DamageInstance } from '../../dto/mob';
import { DAMAGE_TYPES } from '../../config/damge_types';

interface Params {
    monsterId?: number | 'current' | null;
    attackId?: number | null;
}

const damageOptions = concat((<option key="">type...</option>), DAMAGE_TYPES.map(t => (<option key={t} value={t}>{t}</option>)));

const DamageForm: React.FC<Params> = ({ monsterId, attackId }) => {
    if (isNil(monsterId) || isNil(attackId)) return;

    const dispatch = useAppDispatch();

    const currentAttack = monsterId === 'current'
        ? useAppSelector(monsterSelectors.currentMonsterAttack(attackId))
        : useAppSelector(monsterSelectors.selectAttack(monsterId, attackId));
    if (isNil(currentAttack)) {
        console.warn(`Attack not found. monsterId: ${monsterId}, attackId: ${attackId}`);
        return;
    }

    const updateAttack = (attack: Partial<AttackState>) => {
        if (monsterId == 'current') {
            dispatch(monstersActions.udpateAttackOfCurrent({ id: attackId, changes: attack }))
        } else {
            dispatch(monstersActions.udpateAttack({ id: monsterId, update: { id: attackId, changes: attack } }))
        }
    }

    const addDamage = () => {
        const new_damage_insance: DamageInstance = {
            expression: '',
            value: 1,
            bonus: 0,
            type: 'acid'
        }

        updateAttack({ damage: concat(currentAttack.damage, new_damage_insance) });
    }

    const updateDamage = (index: number, changes: Partial<DamageInstance>) => {
        let damage = [...currentAttack.damage]
        damage[index] = { ...damage[index], ...changes };
        updateAttack({ damage });
    }

    const deleteRow = (index: number) => {
        let damage = [...currentAttack.damage]
        damage.splice(index, 1);
        updateAttack({ damage })
    }

    const damageRow = (d: DamageInstance, index: number) => {
        return (
            <Row key={index} className="row-1">
                <Col>
                    <Stack direction="horizontal" gap={3}>
                        <InputGroup>
                            <InputGroup.Text>Value</InputGroup.Text>
                            <Form.Control
                                type="number"
                                value={d.value}
                                onChange={e => updateDamage(index, { value: toInteger(e.target.value) })} />
                            <InputGroup.Text>Type</InputGroup.Text>
                            <Form.Select
                                value={d.type}
                                onChange={e => updateDamage(index, { type: e.target.value })}
                            >
                                {damageOptions}
                            </Form.Select>
                        </InputGroup>
                        <Button variant="danger" onClick={e => deleteRow(index)}>
                            <i className="bi bi-trash"></i>
                        </Button>
                    </Stack>
                </Col>
            </Row>
        );
    };

    const damageRows = currentAttack?.damage.map(damageRow);


    return (
        <Form>
            <Container>
                {damageRows}
                <Row className="row-1">
                    <Button onClick={addDamage}><i className="bi bi-plus-lg"></i></Button>
                </Row>
            </Container>
        </Form>
    )
}

export default DamageForm;