import { Card, Row, Col, Button } from "react-bootstrap";
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const WorkerProjectHeader = () => {
    const location = useLocation();

    const isActivePath = (path) => {
        if(path === '/worker/projects/active') return location.pathname === path || location.pathname === '/worker/projects';
        return location.pathname === path;
    };

    const TabButton = ({ path, text }) => {
        return (
            <Link to={path}>
                <Button
                    variant="outline-primary"
                    className={`w-100 ${isActivePath(path) ? 'active' : ''}`}
                >
                    {text}
                </Button>
            </Link>
        );
    };

    return (
        <>
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header className="text-center">
                                    <h1>Proyek</h1>
                                </Card.Header>
                                <Card.Body className='pb-0'>
                                    <Row className='px-3'>
                                        <Col>
                                            <TabButton path="/worker/projects/active" text="Proyek Aktif" />
                                        </Col>
                                        <Col>
                                            <TabButton path="/worker/projects/history" text="Riwayat Proyek" />
                                        </Col>
                                        <Col>
                                            <TabButton path="/worker/projects/offers" text="Riwayat Tawaran Pekerjaan" />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default WorkerProjectHeader;
