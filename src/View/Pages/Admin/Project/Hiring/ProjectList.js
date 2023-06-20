import { Card, Row, Col, Badge, Form, Pagination } from 'react-bootstrap';
import { Layout, Spin, message } from 'antd';
import { Link, useHistory } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import Holder from 'holderjs';
import config from '../../../../../config';
import Cookies from 'js-cookie';

const { Content } = Layout;

const ProjectList = () => {
    const [projects, setProjects] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage, setProjectsPerPage] = useState(4);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${config.api.projectService}/projects?filter[status]=HIRING`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            const updatedProjects = await Promise.all(data.map(async (project) => {
                const landResponse = await fetch(`${config.api.landService}/lands/${project.landId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                        'Content-Type': 'application/json'
                    }
                });
                const landData = await landResponse.json();
                project.land = landData;
                return project;
            }));

            setProjects(updatedProjects);
            setLoading(false);
        } catch (error) {
            console.error(error);
            message.error('Error fetching projects');
            setLoading(false);
        }
    };

    // Get current projects
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    // Change page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleChangePerPage = (value) => {
        setProjectsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <Content className="mx-5 mb-3">
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header className="text-center">
                                    <h3>Cari Pekerja</h3>
                                </Card.Header>
                                <Card.Body>
                                    {loading ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                                            <Spin size="large" />
                                        </div>
                                    ) : (
                                        <>
                                            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-4 pb-3" xs={1} md={2} lg={4} gap={16}>
                                                {currentProjects.map((project) => (
                                                    <Col key={project.id}>
                                                        <Link to={`/admin/projects/hiring/${project.id}`}>
                                                            <Card className="h-100">
                                                                <Card.Img
                                                                    variant="top"
                                                                    src="https://ik.trn.asia/uploads/2021/04/lahan-pertanian-mulai-terbatas.jpg"
                                                                    className="img-fluid"
                                                                    style={{ objectFit: "cover", height: "180px" }}
                                                                />
                                                                <Card.Body>
                                                                    <Badge variant="info" className='mb-1'>{project.status}</Badge>
                                                                    <Card.Title>
                                                                        {project.land && (
                                                                            <>
                                                                                {project.land.street}, {project.land.city}
                                                                            </>
                                                                        )}
                                                                    </Card.Title>
                                                                </Card.Body>
                                                            </Card>
                                                        </Link>
                                                    </Col>
                                                ))}
                                            </Row>

                                            <div className="d-flex justify-content-between mt-3">
                                                <div>
                                                    <Pagination>
                                                        <Pagination.Prev
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                        />
                                                        {Array.from(Array(Math.ceil(projects.length / projectsPerPage)).keys()).map((page) => (
                                                            <Pagination.Item
                                                                key={page + 1}
                                                                active={page + 1 === currentPage}
                                                                onClick={() => handlePageChange(page + 1)}
                                                            >
                                                                {page + 1}
                                                            </Pagination.Item>
                                                        ))}
                                                        <Pagination.Next
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                            disabled={currentPage === Math.ceil(projects.length / projectsPerPage)}
                                                        />
                                                    </Pagination>
                                                </div>
                                                <div>
                                                    <Form.Label className="me-2">
                                                        Items per page:
                                                    </Form.Label>
                                                    <Form.Select
                                                        value={projectsPerPage}
                                                        onChange={(e) => handleChangePerPage(e.target.value)}
                                                    >
                                                        <option value="4">4</option>
                                                        <option value="8">8</option>
                                                        <option value="12">12</option>
                                                    </Form.Select>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Content>
    );
};

export default ProjectList;
