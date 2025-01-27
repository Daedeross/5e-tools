import { isNil, toInteger } from 'lodash';
import { ReactElement, useState } from 'react';

import { Button, Col, Container, Form, FormGroup, InputGroup, Modal, Row, Stack } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { AttackState, monstersActions, monsterSelectors, MonsterState } from './monster-slice';
import { damageSummary } from '../../app/utils';
import DamageForm from './damage-form';

interface Params {
    monsterId?: number | null;
}

const MonsterForm = (): ReactElement => {
    const monster = useAppSelector(monsterSelectors.currentMonster);

    if (isNil(monster)) {
        return <></>;
    }

    const dispatch = useAppDispatch();

    const [currentAttackId, setCurrentAttackId] = useState<number | undefined>(undefined);
    const currentAttack = useAppSelector(monsterSelectors.currentMonsterAttack(currentAttackId));

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id: number | undefined) => {
        setCurrentAttackId(id);
        setShow(true);
    }

    const setMonster = (m: Partial<MonsterState>) => dispatch(monstersActions.updateCurrent({ ...monster, ...m }));
    const updateAttack = (id: number, a: Partial<AttackState>) => dispatch(monstersActions.udpateAttackOfCurrent({ id, changes: a }))
    const deleteAttack = (id: number) => dispatch(monstersActions.deleteAttackFromCurrent(id));

    const attackRow = (attack: AttackState) => {
        return (
            <Row key={attack.id} className='row-1'>
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>Name</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={attack.name}
                            onChange={e => updateAttack(attack.id, { name: e.target.value })} />
                    </InputGroup>
                </Col>
                <Col md={2}>
                    <Stack direction="horizontal" gap={3} >
                        <InputGroup>
                            <InputGroup.Text>To Hit</InputGroup.Text>
                            <Form.Control
                                type="number"
                                value={attack.toHit}
                                onChange={e => updateAttack(attack.id, { toHit: toInteger(e.target.value) })} />
                        </InputGroup>
                    </Stack>
                </Col>
                <Col md={4}>
                    <Stack direction="horizontal" gap={3}>
                        <InputGroup>
                            <InputGroup.Text>Damage</InputGroup.Text>
                            <Form.Control
                                type="text"
                                disabled
                                readOnly
                                value={damageSummary(attack.damage)} />
                            <Button variant="info" onClick={e => handleShow(attack.id)}>
                                <i className="bi bi-pencil-square"></i>
                            </Button>
                        </InputGroup>
                        <Button variant="danger" onClick={e => deleteAttack(attack.id)}>
                            <i className="bi bi-trash"></i>
                        </Button>
                    </Stack>
                </Col>
            </Row>
        );
    }
    const attackIds = monster.attacks.ids;
    const attackRows = attackIds.map(id => attackRow(monster.attacks.entities[id]));


    const addAttack = () => {
        const new_attack: AttackState = {
            id: 0,
            name: '',
            toHit: 0,
            bonus: 0,
            damage: []
        }
        dispatch(monstersActions.addAttackToCurrent(new_attack));
    }

    return (
        <>
            <Form className='container'>
                <h2>Monster Details</h2>
                <FormGroup id="monsterBasics">
                    <Row>
                        <Col md={9}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Name</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Monster Name..."
                                    value={monster.name}
                                    onChange={e => setMonster({ name: e.target.value })}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text >HP</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    value={monster.maxHp}
                                    onChange={e => setMonster({ maxHp: toInteger(e.target.value) })} />
                            </InputGroup>
                        </Col>
                    </Row>
                </FormGroup>
                <Stack direction="horizontal" gap={4}>
                    <h2>Attacks</h2>
                    <Button size="sm" onClick={addAttack}><i className="bi bi-plus-lg"></i></Button>
                </Stack>
                <FormGroup id="monsterAttacks">
                    <Container>
                        {attackRows}
                    </Container>
                </FormGroup>
            </Form>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edit Damage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DamageForm monsterId="current" attackId={currentAttackId} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default MonsterForm;