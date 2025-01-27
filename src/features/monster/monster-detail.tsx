import { isNil } from 'lodash';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { useAppSelector } from '../../app/hooks';
import { monsterSelectors } from './monster-slice';

interface Params {
    monsterId?: number | null;
}

const MonsterDetail: React.FC<Params> = ({ monsterId }) => {
    if (isNil(monsterId)) {
        return (<></>)
    }

    const monster = useAppSelector(monsterSelectors.selectorById(monsterId));

    return (
        <Container>
            <Row>
            <label>Name</label><span>{monster.name}</span>
            </Row>
        </Container>
    );
}

export default MonsterDetail;