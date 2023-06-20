import { Layout, Image, message, Spin } from 'antd';
import { Card, Row, Col, Badge, Button, Modal, Form, Pagination } from "react-bootstrap";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../Contexts/UserContext';
import WorkerProjectHeader from './Header';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const { Content } = Layout;

const WorkerProjectHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage, setProjectsPerPage] = useState(4);
    const [workOffers, setWorkOffers] = useState([]);
    const [loadingOffer, setLoadingOffer] = useState(true);
    const [land, setLand] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric' });
    const history = useHistory();

    const {
        user, setUser,
        fetchUserIfEmpty
    } = useContext(UserContext);

    useEffect(() => {
        fetchUserIfEmpty();
        fetchWorkOffer();
    }, []);

    const fetchWorkOffer = async () => {
        try {
            setLoadingOffer(true);
            const response = await fetch(`${config.api.workerService}/worker/work-offers?filter[status]=ACCEPTED&filter[workContractAccepted]=1&include=project`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setWorkOffers(data);
    
            // Fetch land and project data concurrently
            const fetchLandPromises = data.map((workOffer) => {
                return fetch(`${config.api.landService}/lands/${workOffer.project.landId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                        'Content-Type': 'application/json'
                    }
                }).then((landResponse) => landResponse.json());
            });
    
            const fetchProjectPromises = data.map((workOffer) => {
                return fetch(`${config.api.projectService}/projects/${workOffer.projectId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                        'Content-Type': 'application/json'
                    }
                }).then((projectResponse) => projectResponse.json());
            });
    
            const [landData, projectData] = await Promise.all([Promise.all(fetchLandPromises), Promise.all(fetchProjectPromises)]);
    
            // Update work offers with land and project data
            const updatedWorkOffers = data.map((workOffer, index) => {
                return {
                    ...workOffer,
                    land: landData[index],
                    project: projectData[index]
                };
            });
    
            setWorkOffers(updatedWorkOffers);
        } catch (error) {
            console.error('Error fetching active work offer data:', error);
            message.error('Gagal memuat data proyek aktif');
        } finally {
            setLoadingOffer(false);
        }
    };

    const renderProjectRange = (project) => {
        if (project.initiatedAt) {
            project.initiatedAtReadable = new Date(project.initiatedAt).toLocaleDateString('id-ID', dateOptions);
        }
        if (project.estimatedFinished) {
            project.estimatedFinishedReadable = new Date(project.estimatedFinished).toLocaleDateString('id-ID', dateOptions);
        }
        return `${project.initiatedAtReadable ?? 'N/A'} - ${project.estimatedFinishedReadable ?? 'N/A'}`;
    };


    // Get current projects
    const indexLast = currentPage * projectsPerPage;
    const indexFirst = indexLast - projectsPerPage;
    const offers = workOffers.slice(indexFirst, indexLast);

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
            <WorkerProjectHeader />
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header className="text-center">
                                    <h3>Riwayat Proyek</h3>
                                </Card.Header>
                                <Card.Body>
                                    {loading ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                                            <Spin size="large" />
                                        </div>
                                    ) : (
                                        <>
                                            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-4 pb-3" xs={1} md={2} lg={4} gap={16}>
                                                {offers.map((offer) => (
                                                    <Col key={offer.id}>
                                                        <Link to={`/worker/projects/history/${offer.project.id}`}>
                                                            <Card className="h-100">
                                                                <Card.Img
                                                                    variant="top"
                                                                    data-src="holder.js/300x180"
                                                                    className="img-fluid"
                                                                    style={{ objectFit: "cover", height: "180px" }}
                                                                />
                                                                <Card.Body>
                                                                    <Badge bg="info" className='mb-1'>{offer.project.status}</Badge>
                                                                    <Card.Title>
                                                                        {offer.land && (
                                                                            <>
                                                                                {offer.land.street}, {offer.land.city}
                                                                            </>
                                                                        )}
                                                                    </Card.Title>
                                                                    <Card.Text>
                                                                        {offer.project && renderProjectRange(offer.project)}
                                                                        <br />
                                                                        {offer.project && offer.project.description}
                                                                    </Card.Text>
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
                                                        {Array.from(Array(Math.ceil(workOffers.length / projectsPerPage)).keys()).map((page) => (
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
                                                            disabled={currentPage === Math.ceil(workOffers.length / projectsPerPage)}
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

export default WorkerProjectHistory;
