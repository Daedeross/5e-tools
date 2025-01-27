import { isNil } from 'lodash';
import React from 'react';
import { Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import { useAppSelector } from '../../app/hooks';
import { monsterSelectors } from './monster-slice';

interface Params {
    monsterId: number;
    attackId?: number | null;
}

const AttackInput: React.FC<Params> = ({ monsterId, attackId }) => {
    if (isNil(attackId)) {
        return (<></>)
    }

    const monster = useAppSelector(monsterSelectors.selectorById(monsterId));
    //const attack = useAppSelector(attack)

    return (
        <Row>
            <Col>
                <InputGroup>
                    <InputGroup.Text>Name</InputGroup.Text>
                    <Form.Control type="text" value={'foo'} />
                </InputGroup>
            </Col>
            <Col>
                <InputGroup>
                    <InputGroup.Text>To Hit</InputGroup.Text>
                    <Form.Control type="number" value={0} />
                </InputGroup>
            </Col>
        </Row>
    );
}

export default AttackInput;