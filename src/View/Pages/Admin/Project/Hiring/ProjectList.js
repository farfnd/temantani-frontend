import { Card, Row, Col, Badge, Form } from 'react-bootstrap';
import { Layout, Pagination, Spin, message } from 'antd';
import { Link, useHistory } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import Holder from 'holderjs';
import config from '../../../../../config';
import Cookies from 'js-cookie';

const { Content } = Layout;

const ProjectList = () => {
    const [projects, setProjects] = useState(() => {
        const cachedHiringProjects = localStorage.getItem('cachedHiringProjects');
        const cacheExpiryH = localStorage.getItem('cacheExpiryH');

        if (cachedHiringProjects && cacheExpiryH && Date.now() < parseInt(cacheExpiryH)) {
            return JSON.parse(cachedHiringProjects);
        }
        return [];
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage, setProjectsPerPage] = useState(4);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        Holder.run();
    }, [projects]);

    const fetchProjects = async () => {
        try {
            setLoading(true);

            const cachedHiringProjects = localStorage.getItem('cachedHiringProjects');
            let cacheExpiryH = localStorage.getItem('cacheExpiryH');

            // Check if cached data is still valid
            if (cachedHiringProjects && cacheExpiryH && Date.now() < parseInt(cacheExpiryH)) {
                setProjects(JSON.parse(cachedHiringProjects));
                setLoading(false);
                return;
            }

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

            // Cache the projects in localStorage with an expiry time of 30 minutes
            cacheExpiryH = Date.now() + 1800000;
            localStorage.setItem('cachedHiringProjects', JSON.stringify(updatedProjects));
            localStorage.setItem('cacheExpiryH', cacheExpiryH.toString());
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
        <>
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
                                            data-src="holder.js/300x180"
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
                            <Pagination
                                current={currentPage}
                                total={projects.length}
                                pageSize={projectsPerPage}
                                onChange={handlePageChange}
                            />
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
        </>
    );
};

export default ProjectList;
