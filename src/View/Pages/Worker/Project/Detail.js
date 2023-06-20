import { Layout, Image, message, Spin } from 'antd';
import { Card, Row, Col, Badge, Button, Modal, Form, Pagination } from "react-bootstrap";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../Contexts/UserContext';
import WorkerProjectHeader from './Header';
import config from '../../../../config';
import Cookies from 'js-cookie';
import Datatable from '../../../Components/Datatable';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faClock, faExclamation, faExclamationCircle, faHouse, faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { LeftCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;

const WorkerProjectDetail = () => {
    const [project, setProject] = useState(null);
    const [workReports, setWorkReports] = useState([]);
    const [loadingLand, setLoadingLand] = useState(true);
    const [loadingProject, setLoadingProject] = useState(true);
    const [loadingWorkReport, setLoadingWorkReport] = useState(true);
    const [loadingImage, setLoadingImage] = useState(false);
    const [land, setLand] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric' });
    const history = useHistory();
    let { id } = useParams();

    const {
        user, setUser,
        fetchUserIfEmpty
    } = useContext(UserContext);

    useEffect(() => {
        fetchUserIfEmpty();
        fetchProject();
        fetchWorkReports();
    }, []);

    useEffect(() => {
        if (project) {
            fetchLand();
        }
    }, [project]);


    const fetchProject = async () => {
        try {
            setLoadingProject(true);

            const response = await fetch(`${config.api.projectService}/projects/${id}`, {
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
                `${config.api.workerService}/worker/work-reports?filter[projectId]=${id}`, {
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


    const fetchLand = async () => {
        try {
            setLoadingLand(true);
            const landResponse = await fetch(`${config.api.landService}/lands/${project.landId}`, {
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

    const handleWeekButtonClick = (week) => {
        setSelectedWeek(week);
    };

    const getReportVariant = (week) => {
        const report = workReports.find((r) => r.week === week);
        if (report) {
            return report.status === 'ACCEPTED'
                ? 'success'
                : report.status === 'REJECTED'
                    ? 'danger'
                    : report.status === 'PENDING'
                        ? 'warning'
                        : 'secondary';
        }
        return 'secondary';
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

    const renderWeekRange = (week) => {
        if (!(project && project.initiatedAt)) {
            return "N/A";
        }

        const start = new Date(project.initiatedAt);

        const startOfWeek = new Date(start.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

        if (startOfWeek.getDay() === 0) {
            // If initiatedAt is a Sunday, adjust the first week range to be 8 days
            const adjustedEndOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
            return renderWeekRangeString(startOfWeek, adjustedEndOfWeek, week - 1);
        }

        return renderWeekRangeString(startOfWeek, endOfWeek, week - 1);
    };

    const renderWeekRangeString = (startOfWeek, endOfWeek, i) => {
        const startDate = startOfWeek.toLocaleDateString('id-ID', dateOptions);
        const endDate = endOfWeek.toLocaleDateString('id-ID', dateOptions);
        const startMonth = startOfWeek.getMonth();
        const endMonth = endOfWeek.getMonth();
        const startYear = startOfWeek.getFullYear();
        const endYear = endOfWeek.getFullYear();

        let weekCount = `Minggu ${i + 1} `;
        let weekRange = ``;
        if (startMonth === endMonth && startYear === endYear) {
            weekRange = `${startOfWeek.getDate()} - ${endDate}`;
        } else if (startMonth === endMonth) {
            weekRange = `${startDate} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString('id-ID', { month: 'short' })}`;
        } else if (startYear === endYear) {
            weekRange = `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('id-ID', { month: 'short' })} - ${endDate}`;
        } else {
            weekRange = `${startDate} - ${endDate}`;
        }
        return weekCount + '(' + weekRange + ')';
    };

    return (
        <Content className="mx-5 mb-3">
            <Row>
                <Col>
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4">
                        <div className="d-block">
                            <nav aria-label="breadcrumb" className="d-none d-md-inline-block">
                                <ol className="breadcrumb breadcrumb-dark breadcrumb-transparent">
                                    <li className="breadcrumb-item"><Link to="/worker"><FontAwesomeIcon icon={faHouse} /></Link></li>
                                    <li className="breadcrumb-item"><Link to="/worker/projects">Proyek</Link></li>
                                    <li className="breadcrumb-item"><Link to="/worker/projects/history">Riwayat Proyek</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Detail Proyek</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <Card className='mt-0'>
                        <Link to="/worker/projects/history" style={{ display: 'flex', alignItems: 'center' }}>
                            <LeftCircleOutlined style={{ marginRight: '5px' }} />
                            <span>Kembali</span>
                        </Link>
                        <h6 className="mb-0 mt-2">Detail Pekerjaan</h6>
                        <Card.Title className='my-0'>
                            {land ? `${land.street}, ${land.city}` : 'N/A'}
                        </Card.Title>
                        <p>{project && renderProjectRange(project)}</p>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Title className='my-0'>
                            Laporan Mingguan
                        </Card.Title>
                        <Card.Body className="pb-0">
                            <Row>
                                {workReports.map((workReport, index) => (
                                    <Col key={workReport.id} className="mb-2" xs={12} sm={6} md={4} lg={2}>
                                        <Button
                                            variant={getReportVariant(workReport.week)}
                                            className="w-100"
                                            onClick={() => handleWeekButtonClick(workReport)}
                                        >
                                            {workReport.week}
                                        </Button>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>

                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        {
                            selectedWeek ? (
                                <>
                                    <Card.Title className='p-0'>
                                        <Badge bg={getReportVariant(selectedWeek.week)} className='mb-2'>
                                            {
                                                selectedWeek.status === 'PENDING' ? (
                                                    <FontAwesomeIcon icon={faClock} />
                                                ) : (
                                                    selectedWeek.status === 'ACCEPTED' ? (
                                                        <FontAwesomeIcon icon={faCheckCircle} />
                                                    ) : (
                                                        selectedWeek.status === 'REJECTED' ? (
                                                            <FontAwesomeIcon icon={faTimesCircle} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                        )
                                                    )
                                                )
                                            }
                                            &nbsp;
                                            {selectedWeek.status}
                                        </Badge>
                                        <br />
                                        <h5>
                                            {renderWeekRange(selectedWeek.week)}
                                        </h5>
                                    </Card.Title>
                                    <Card.Body className='p-0'>
                                        <h6>
                                            <strong>Deskripsi:</strong>
                                            <br />
                                            {selectedWeek.description}
                                        </h6>
                                        <h6>
                                            <strong>Bukti:</strong>
                                            <br />
                                            {loadingImage ? (
                                                <Spin />
                                            ) : (
                                                <Image
                                                    className='mt-2'
                                                    src={selectedWeek.proof ? `${config.api.workerService}/images/${selectedWeek.proof}` : ''}
                                                    fluid
                                                    style={{ maxWidth: "10rem" }}
                                                    onLoad={() => setLoadingImage(false)}
                                                    onError={() => setLoadingImage(false)}
                                                />
                                            )}
                                        </h6>
                                    </Card.Body>
                                </>
                            ) : (
                                <Card.Body className='my-0 p-0'>
                                    <p className='my-0'>Silakan pilih minggu untuk melihat laporan pekerjaan.</p>
                                </Card.Body>
                            )
                        }
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default WorkerProjectDetail;
