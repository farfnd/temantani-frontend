import { Layout, Image, message, Spin } from 'antd';
import { Card, Row, Col, Badge, Button, Modal, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../Contexts/UserContext';
import WorkerProjectHeader from './Header';
import config from '../../../../config';
import Cookies from 'js-cookie';
import Datatable from '../../../Components/Datatable';
import { useHistory } from 'react-router-dom';

const { Content } = Layout;

const WorkHistory = () => {
    const [workOffers, setWorkOffers] = useState([]);
    const [activeOffer, setActiveOffer] = useState(null);
    const [project, setProject] = useState(null);
    const [workReports, setWorkReports] = useState([]);
    const [loadingOffer, setLoadingOffer] = useState(true);
    const [loadingLand, setLoadingLand] = useState(true);
    const [loadingProject, setLoadingProject] = useState(true);
    const [loadingWorkReport, setLoadingWorkReport] = useState(true);
    const [land, setLand] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedWeekString, setSelectedWeekString] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric' });
    const [inputData, setInputData] = useState({
        description: "",
        proof: null,
    })
    const history = useHistory();

    const {
        user, setUser,
        fetchUserIfEmpty
    } = useContext(UserContext);

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputData({ ...inputData, [name]: value });
    };

    const handleImage = (event) => {
        let name = event.target.name
        let value = event.target.files[0]
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(value);

        setInputData({ ...inputData, [name]: value })
    }

    const headers = [
        {
            prop: "weekDescription",
            title: "Minggu",
            isFilterable: true,
            isSortable: true
        },
        {
            prop: "description",
            title: "Deskripsi"
        },
        {
            prop: "proof",
            title: "Bukti",
            cell: (row) => (
                <>
                    {
                        row.proof ? (
                            <a href={`${config.api.workerService}/images/${row.proof}`} target="_blank" rel="noopener noreferrer">
                                Lihat Bukti
                            </a>
                        ) : null
                    }
                </>
            )
        },
        {
            prop: "status",
            title: "Status",
            isFilterable: true,
            isSortable: true,
            cell: (row) => (
                <>
                    <Badge bg={
                        row.status === "ACCEPTED" ? "success" : (
                            row.status === 'PENDING' ? 'warning' : (
                                row.status === 'REJECTED' ? 'danger' : 'secondary'
                            )
                        )
                    }>
                        {row.status}
                    </Badge>
                    {
                        row.status === 'REJECTED' ? (
                            <p className="mt-2">
                                <strong>Alasan:</strong> {row.rejectionMessage}
                            </p>
                        ) : null
                    }
                </>
            )
        },
        {
            prop: "actions",
            title: "Aksi",
            cell: (row) => (
                <>
                    {row.status === 'PENDING' || row.status === 'REJECTED' ? (
                        <Button
                            type="primary"
                            onClick={() => handleOpenModal(row)}
                        >
                            Edit
                        </Button>
                    ) : row.status === 'NOT SUBMITTED' ? (
                        <Button
                            type="primary"
                            onClick={() => handleOpenModal(row)}
                        >
                            Submit
                        </Button>
                    ) : null}
                </>
            )
        }
    ];

    const handleOpenModal = (row) => {
        setSelectedWeek(row.week);
        setSelectedWeekString(row.weekDescription);
        setShowModal(true)
        if (workReports.some((workReport) => workReport.week === row.week)) {
            const workReport = workReports.find((workReport) => workReport.week === row.week);
            setInputData({
                description: workReport.description,
            })
            setImagePreview(`${config.api.workerService}/images/${workReport.proof}`);
        } else {
            setInputData({
                description: "",
                proof: null
            })
        }
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
            if (response.ok) {
                const text = await response.text();
                const data = text ? JSON.parse(text) : null;
                if (data) {
                    setActiveOffer(data);
                    setProject(data.project);
                } else {
                    setActiveOffer(null);
                    setProject(null);
                }
            } else {
                setActiveOffer(null);
                setProject(null);
                message.error('Gagal memuat data proyek aktif');
            }
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

    const handleCloseModal = () => {
        setSelectedWeek(null);
        setSelectedWeekString(null);
        setShowModal(false);
        setInputData({
            description: "",
            proof: null
        });
        setImagePreview(null);
    };

    const renderWeekRange = (startOfWeek, endOfWeek, i) => {
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

    const weekRows = [];
    if (project && project.initiatedAt) {
        const start = new Date(project.initiatedAt);
        const end = new Date();
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));

        for (let i = 0; i < diff; i++) {
            const startOfWeek = new Date(start.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
            const endOfWeek = new Date(startOfWeek.getTime() + (6 * 24 * 60 * 60 * 1000));
            const weekRange = renderWeekRange(startOfWeek, endOfWeek, i);
            const uploadedReport = workReports.find(report => report.week === i + 1);
            weekRows.push({
                ...uploadedReport,
                weekDescription: weekRange,
                week: i + 1,
                description: uploadedReport ? uploadedReport.description : '',
                proof: uploadedReport ? uploadedReport.proof : '',
                status: uploadedReport ? uploadedReport.status : 'NOT SUBMITTED',
                actions: weekRange,
            });
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        } else {
            setValidated(true);

            const formData = new FormData();
            for (let key in inputData) {
                formData.append(key, inputData[key]);
            }

            const id = workReports.find(report => report.week === selectedWeek)?.id;
            let url = `${config.api.workerService}/worker/work-reports`;
            let method = 'POST';
            if (id) {
                url += `/${id}`;
                method = 'PUT';
            } else {
                formData.append('projectId', activeOffer.projectId);
                formData.append('week', selectedWeek);
            }

            try {
                setLoading(true);

                const response = await fetch(url, {
                    method,
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                    },
                    body: formData,
                });
                const data = await response.json();
                if (response.ok) {
                    message.success('Laporan kerja terkirim');
                    const index = workReports.findIndex(report => report.week === data.week);
                    workReports[index] = data.data;
                    setWorkReports([...workReports]);

                    await fetchWorkReports();
                } else {
                    message.error('Laporan kerja gagal terkirim');
                }
            } catch (error) {
                console.error('Laporan kerja gagal terkirim:', error);
                message.error("Laporan kerja gagal terkirim: " + error);
            } finally {
                setShowModal(false);
                setLoading(false);
            }
        }
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
                                    <h3>Proyek Aktif</h3>
                                </Card.Header>
                                {activeOffer ? (
                                    activeOffer.project.status === 'ONGOING' ? (
                                        <>
                                            <Card.Body>
                                                {loadingOffer && loadingLand ? (
                                                    <Spin />
                                                ) : (
                                                    activeOffer && land ? (
                                                        <>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Image
                                                                    src="https://ik.trn.asia/uploads/2021/04/lahan-pertanian-mulai-terbatas.jpg"
                                                                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                                                                />
                                                                <div style={{ marginLeft: '10px' }}></div>
                                                                <div style={{ flex: 1 }}>
                                                                    <Card.Title>{land.street}, {land.city}</Card.Title>
                                                                    <Card.Text>
                                                                        <strong>Status:</strong> {activeOffer.project.status}<br />
                                                                        <strong>Luas Lahan:</strong> {land.area ?? 3700} m<sup>2</sup><br />
                                                                        <strong>Deskripsi:</strong> {project.description ?? activeOffer.project.description}<br />
                                                                        <strong>Masa Proyek (tentatif):</strong>&nbsp;
                                                                        {project.initiatedAtReadable ?? "N/A"} - {project.estimatedFinishedReadable ?? "N/A"}<br />
                                                                    </Card.Text>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Card.Text className='text-center'>
                                                            Anda belum memiliki proyek aktif
                                                        </Card.Text>
                                                    )
                                                )}
                                            </Card.Body>
                                            <Card.Footer>
                                                {loadingWorkReport ? (
                                                    <Spin />
                                                ) : (
                                                    weekRows ? (
                                                        <>
                                                            <strong>Laporan Pekerjaan</strong>
                                                            <Datatable data={weekRows} headers={headers} />
                                                        </>
                                                    ) : (
                                                        <Card.Text>
                                                            Anda belum memiliki laporan pekerjaan
                                                        </Card.Text>
                                                    )
                                                )}
                                            </Card.Footer>
                                        </>
                                    ) : (
                                        <Card.Body>
                                            <Spin />
                                        </Card.Body>
                                    )
                                ) : (
                                    <Card.Body>
                                        <Card.Text className='text-center'>
                                            Anda belum memiliki proyek aktif
                                        </Card.Text>
                                    </Card.Body>
                                )}
                            </Card>
                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Tambah Laporan Pekerjaan Mingguan
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form encType="multipart/form-data">
                                        <h5><strong>{selectedWeekString}</strong></h5>
                                        <Form.Group className="mb-3" controlId="formDescription">
                                            <Form.Label>Deskripsi</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name='description'
                                                onChange={handleChange}
                                                defaultValue={inputData.description}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formProof">
                                            <Form.Label>File Bukti</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name='proof'
                                                accept='image/*'
                                                onChange={handleImage}
                                            />
                                        </Form.Group>
                                        {imagePreview && (
                                            <Row className="mb-3">
                                                <Col md="2">
                                                    <Form.Label>Image Preview:</Form.Label>
                                                </Col>
                                                <Col md="10">
                                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: "10rem" }} className="float-start" />
                                                </Col>
                                            </Row>
                                        )}
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Batal
                                    </Button>
                                    <Button variant="primary" onClick={handleSubmit}>
                                        Simpan
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Content>
    );
    
};

export default WorkHistory;
