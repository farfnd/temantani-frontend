import { Avatar, Layout, Modal, message, Image } from 'antd';
import { Card, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import React, { useContext, useEffect, useState } from 'react';
import config from '../../../config';
import Cookies from 'js-cookie';
import { Link, useHistory } from 'react-router-dom';
import { AimOutlined, LeftCircleOutlined, UserOutlined } from '@ant-design/icons';
import { UserContext } from '../../../Contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faTimesCircle, faWheatAwn } from '@fortawesome/free-solid-svg-icons';

const { Content } = Layout;

const WorkerProjectDashboard = () => {
    const {
        user,
        fetchUserIfEmpty,
    } = useContext(UserContext);
    const [loadingOffer, setLoadingOffer] = useState(true);
    const [loadingLand, setLoadingLand] = useState(true);
    const [loadingProject, setLoadingProject] = useState(true);
    const [loadingWorkReport, setLoadingWorkReport] = useState(true);
    const [activeOffer, setActiveOffer] = useState(null);
    const [project, setProject] = useState(null);
    const [land, setLand] = useState(null);
    const [workReports, setWorkReports] = useState([]);
    const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        fetchUserIfEmpty();
        fetchActiveWorkOffer();
    }, []);

    useEffect(() => {
        if (activeOffer) {
            fetchLand();
            fetchProject();
            fetchWorkReports();
        }
    }, [activeOffer]);

    const history = useHistory();

    const handleLogout = () => {
        Modal.confirm({
            title: 'Logout',
            content: 'Are you sure you want to logout?',
            onOk: () => {
                history.push('/logout');
            },
        });
    };


    const fetchActiveWorkOffer = async () => {
        try {
            setLoadingOffer(true);
            const response = await fetch(`${config.api.workerService}/worker/work-offers/active?include=project`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setActiveOffer(data);
            setProject(data.project);
        } catch (error) {
            console.error('Error fetching active work offer data:', error);
            message.error('Gagal memuat data proyek aktif');
        } finally {
            setLoadingOffer(false);
        }
    };

    const fetchLand = async () => {
        try {
            setLoadingLand(true);
            const landResponse = await fetch(`${config.api.landService}/lands/${activeOffer.project.landId}`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const landData = await landResponse.json();
            setLand(landData);
        } catch (error) {
            console.error('Error fetching land data:', error);
            message.error('Gagal memuat data lahan');
        } finally {
            setLoadingLand(false);
        }
    };

    const fetchProject = async () => {
        try {
            setLoadingProject(true);

            const response = await fetch(`${config.api.projectService}/projects/${activeOffer.projectId}`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const projectData = await response.json();

            if (projectData) {
                if (projectData.initiatedAt) {
                    projectData.initiatedAtReadable = new Date(projectData.initiatedAt).toLocaleDateString('id-ID', dateOptions);
                }
                if (projectData.estimatedFinished) {
                    projectData.estimatedFinishedReadable = new Date(projectData.estimatedFinished).toLocaleDateString('id-ID', dateOptions);
                }
                setProject(projectData);
            }
        } catch (error) {
            console.error(error);
            message.error('Gagal memuat data proyek');
        } finally {
            setLoadingProject(false);
        }
    };

    const fetchWorkReports = async () => {
        try {
            setLoadingWorkReport(true);
            const response = await fetch(
                `${config.api.workerService}/worker/work-reports?filter[projectId]=${activeOffer.projectId}`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setWorkReports(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingWorkReport(false);
        }
    };

    let isReportComplete = false;

    if (project && project.initiatedAt) {
        const start = new Date(project.initiatedAt);
        const end = new Date();
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));

        isReportComplete = workReports.length >= diff;
    }

    const getReportStatus = (week) => {
        const report = workReports.find((r) => r.week === week);
        if (report) {
            return report.status;
        }
        return 'Belum ada laporan';
    };

    const getReportBadgeVariant = (week) => {
        const report = workReports.find((r) => r.week === week);
        if (report) {
            return report.status === 'ACCEPTED'
                ? 'success'
                : report.status === 'REJECTED'
                    ? 'danger'
                    : report.status === 'PENDING'
                        ? 'warning'
                        : 'outline-secondary';
        }
        return 'outline-secondary';
    };

    const getWeeksArray = () => {
        if (project && project.initiatedAt) {
            const start = new Date(project.initiatedAt);
            const end = new Date();
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
            return Array.from({ length: diff }, (_, index) => index + 1);
        }
        return [];
    };

    return (
        <Content className="mx-3">
            <Row>
                <Col sm={4}>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Title className="my-0">
                                    {
                                        user ? (
                                            <Row className="align-middle">
                                                <Col md={2}>
                                                    {user.profilePictureUrl ? (
                                                        <Avatar src={`${config.api.userService}/images/${user.profilePictureUrl}`} size={50} />
                                                    ) : (
                                                        <Avatar size={50} icon={<UserOutlined />} />
                                                    )}
                                                </Col>
                                                <Col md={10}>
                                                    <Row>
                                                        <h5 className="mb-1">Hello, {user?.name}</h5>
                                                    </Row>
                                                    <Row>
                                                        <h6 className="text-muted m-0">Worker</h6>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        ) : (
                                            <Row className="align-middle">
                                                <Col md={2}>
                                                    <Spinner animation="border" />
                                                </Col>
                                                <Col md={10}>
                                                    <Row>
                                                        <h5 className="mb-1">Hello, </h5>
                                                    </Row>
                                                    <Row>
                                                        <h6 className="text-muted m-0">Worker</h6>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                </Card.Title>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <Link to="/worker/profile">
                                                <Button variant="outline-primary" className="w-100">Profil</Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <Link to="/worker/bank-account">
                                                <Button variant="outline-primary" className="w-100">Kelola Rekening Bank</Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <Link to="/change-password">
                                                <Button variant="outline-primary" className="w-100">Ganti Password</Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <Button variant="outline-danger" className="w-100" onClick={handleLogout}>Logout</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col sm={8}>
                    <Row>
                        <Col>
                            <h4 className='mt-3'><strong>Proyek Aktif</strong></h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className='mt-0'>
                                <Card.Body className='p-0'>
                                    <Row className='mb-3'>
                                        <Col md={1} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <FontAwesomeIcon icon={faWheatAwn} size='3x' className='m-3' />
                                        </Col>
                                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                                            {
                                                land ? (
                                                    <div>
                                                        <div>
                                                            <h5 className='mb-0'>
                                                                <strong>{land.street}, {land.city}</strong>
                                                            </h5>
                                                        </div>
                                                        <div>
                                                            <p className='m-0' style={{ wordBreak: 'break-word' }}>
                                                                {project.initiatedAtReadable ?? "N/A"} - {project.estimatedFinishedReadable ?? "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Spinner animation="border" />
                                                )
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Col>
                                            {
                                                land ? (
                                                    <Image
                                                        src={
                                                            land.imageUrl ? `${config.api.landService}/images/${land.imageUrl}`
                                                                : 'https://ik.trn.asia/uploads/2021/04/lahan-pertanian-mulai-terbatas.jpg'
                                                        }
                                                        fluid
                                                        style={{
                                                            borderRadius: '10px',
                                                            maxHeight: '200px',
                                                            objectFit: 'cover',
                                                            objectPosition: 'center',
                                                        }}
                                                        wrapperClassName='w-100'
                                                    />
                                                ) : (
                                                    <Spinner animation="border" />
                                                )
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Col>
                                            {
                                                project ? (
                                                    <h6>
                                                        <strong>Deskripsi:</strong><br />{project.description}
                                                    </h6>
                                                ) : (
                                                    <Spinner animation="border" />
                                                )
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Col>
                                            {
                                                land ? (
                                                    <h6>
                                                        <strong>Pemilik Lahan:</strong><br />{land.owner.name}
                                                    </h6>
                                                ) : (
                                                    <Spinner animation="border" />
                                                )
                                            }
                                        </Col>
                                        <Col>
                                            {
                                                land ? (
                                                    <h6>
                                                        <strong>Komoditas:</strong><br />{land.harvest ?? "Padi"}
                                                    </h6>
                                                ) : (
                                                    <Spinner animation="border" />
                                                )
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Col>
                                            <Row>
                                                <Col>
                                                    <h6>
                                                        <strong>Laporan Mingguan:</strong>
                                                    </h6>
                                                    {
                                                        isReportComplete ? (
                                                            <Badge bg='success' className='mr-2'>
                                                                <FontAwesomeIcon icon={faCheckCircle} className='mr-1' />
                                                                &nbsp;
                                                                Lengkap
                                                            </Badge>
                                                        ) : (
                                                            <Badge bg='danger' className='mr-2'>
                                                                <FontAwesomeIcon icon={faTimesCircle} className='mr-1' />
                                                                &nbsp;
                                                                Belum Lengkap
                                                            </Badge>
                                                        )
                                                    }

                                                </Col>
                                                <Col xs={12} sm={6} lg={4} className="d-flex flex-col justify-content-end align-items-end">
                                                    {
                                                        project && (
                                                            <Link to={`/worker/projects/active`}>
                                                                <Button variant='outline-primary' className='w-100'>Lihat Semua</Button>
                                                            </Link>
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                            <Row className='mt-3'>
                                                {getWeeksArray().map((week) => (
                                                    <Col lg={1} key={week}>
                                                        <Button
                                                            variant={getReportBadgeVariant(week)}
                                                            className="w-100 disabled-button"
                                                            title={getReportStatus(week)}
                                                        >
                                                            {week}
                                                        </Button>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Content>
    );
};

export default WorkerProjectDashboard;
