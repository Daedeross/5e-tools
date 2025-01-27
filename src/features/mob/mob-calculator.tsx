import React from 'react';
import { ReactElement } from "react";
import { Col, Container, Row } from "react-bootstrap";
import MonsterForm from '../monster/monster-form';

function MobCalculator(): ReactElement {
    return (
    <Container>
        <Row>
            <Col>
                <h1>Mob Calculator</h1>
            </Col>
        </Row>
        <Row>
            <MonsterForm>
                
            </MonsterForm>
        </Row>
    </Container>
    );
}

export default MobCalculator;