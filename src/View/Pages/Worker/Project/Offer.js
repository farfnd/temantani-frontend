import { Layout, Image, message, Spin } from 'antd';
import { Card, Row, Col, Badge, Button, Modal, Form, Pagination, Spinner } from "react-bootstrap";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../Contexts/UserContext';
import WorkerProjectHeader from './Header';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Datatable from '../../../Components/Datatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faWheatAwn } from '@fortawesome/free-solid-svg-icons';

const { Content } = Layout;

const WorkerProjectOffers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage, setProjectsPerPage] = useState(4);
    const [workOffers, setWorkOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loadingOffer, setLoadingOffer] = useState(true);
    const [land, setLand] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric' });
    const history = useHistory();

    const showModal = (row) => {
        console.log(row);
        setSelectedOffer(row);
        setOpen(true)
    };

    const {
        user, setUser,
        fetchUserIfEmpty
    } = useContext(UserContext);

    useEffect(() => {
        fetchUserIfEmpty();
        fetchWorkOffer();
    }, []);

    const headers = [
        {
            prop: "location",
            title: "Lokasi",
            isFilterable: true,
            isSortable: true,
            cell: (row) => (
                `${row.land.street}, ${row.land.city}`
            )
        },
        {
            prop: "dateRange",
            title: "Masa Proyek",
            isFilterable: true,
            isSortable: true,
            cell: (row) => (renderProjectRange(row.project))
        },
        {
            prop: "project.harvest",
            title: "Komoditas",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                const commodityNames = ["Padi", "Gandum", "Teh", "Jagung"];
                return commodityNames[Math.floor(Math.random() * commodityNames.length)];
            }
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
                </>
            )
        },
        {
            prop: "action",
            title: "Action",
            isFilterable: true,
            isSortable: true,
            cell: (row) => (
                <>
                    <Button type="primary" size="small" onClick={() => showModal(row)}>
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                </>
            )
        },
    ];

    const fetchWorkOffer = async () => {
        try {
            setLoadingOffer(true);
            const response = await fetch(`${config.api.workerService}/worker/work-offers?include=project`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setWorkOffers(data);

            // Fetch land and project data concurrently
            const fetchLandPromises = data.map(async (workOffer) => {
                const landResponse = await fetch(`${config.api.landService}/lands/${workOffer.project.landId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                        'Content-Type': 'application/json'
                    }
                });
                return await landResponse.json();
            });

            const fetchProjectPromises = data.map(async (workOffer) => {
                const projectResponse = await fetch(`${config.api.projectService}/projects/${workOffer.projectId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                        'Content-Type': 'application/json'
                    }
                });
                return await projectResponse.json();
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

    const handleCloseModal = () => {
        setSelectedOffer(null);
        setOpen(false);
        setImagePreview(null);
    };


    const handleUpdate = async (id, status) => {
        try {
            const response = await fetch(`${config.api.workerService}/worker/work-offers/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({status})
            });

            if (response.ok) {
                if (status === "ACCEPTED") {
                    const userResponse = await fetch(`${config.api.workerService}/worker/me`, {
                        method: 'PATCH',
                        headers: {
                            Authorization: "Bearer " + Cookies.get('token'),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({workAvailability: 'NOT_AVAILABLE'})
                    });
                    if (userResponse.ok) {
                        const userBody = await userResponse.json();
                        setUser(userBody);
                    }
                    message.success("Tawaran kerja berhasil diterima");
                } else {
                    message.success("Tawaran kerja berhasil ditolak");
                }
                handleCloseModal();
                await fetchWorkOffer();
            } else {
                const responseBody = await response.json();
                message.error(`Gagal memperbarui status tawaran kerja: ${responseBody}`);
            }

        } catch (error) {
            console.error(error);
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
                                    {
                                        loadingOffer ?
                                            <div className="text-center">
                                                <Spin />
                                            </div>
                                            :
                                            <Datatable data={workOffers} headers={headers} />
                                    }
                                </Card.Body>
                            </Card>
                            <Modal show={open} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Informasi Tawaran Proyek
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {
                                        selectedOffer ? (
                                            <>
                                                <Row className='mb-3'>
                                                    <Col style={{ display: 'flex', alignItems: 'center' }}>

                                                        <div>
                                                            <div>
                                                                <h5 className='mb-0'>
                                                                    <strong>{selectedOffer.land.street}, {selectedOffer.land.city}</strong>
                                                                </h5>
                                                            </div>
                                                            <div>
                                                                <p className='m-0' style={{ wordBreak: 'break-word' }}>
                                                                    {selectedOffer.project.initiatedAtReadable ?? "N/A"} - {selectedOffer.project.estimatedFinishedReadable ?? "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row className='mb-3'>
                                                    <Col>
                                                        <Image
                                                            src={selectedOffer.land.imageUrl ? `${config.api.landService}/images/${selectedOffer.land.imageUrl}`
                                                                : 'https://ik.trn.asia/uploads/2021/04/lahan-pertanian-mulai-terbatas.jpg'}
                                                            fluid
                                                            style={{
                                                                borderRadius: '10px',
                                                                maxHeight: '200px',
                                                                objectFit: 'cover',
                                                                objectPosition: 'center',
                                                            }}
                                                            wrapperClassName='w-100' />
                                                    </Col>
                                                </Row>
                                                <Row className='mb-3'>
                                                    <Col>
                                                        <h6>
                                                            <strong>Deskripsi:</strong><br />{selectedOffer.project.description ?? "N/A"}
                                                        </h6>
                                                    </Col>
                                                </Row><Row className='mb-3'>
                                                    <Col>
                                                        <h6>
                                                            <strong>Pemilik Lahan:</strong><br />{selectedOffer.land.owner.name ?? "N/A"}
                                                        </h6>
                                                    </Col>
                                                    <Col>
                                                        <h6>
                                                            <strong>Komoditas:</strong><br />{selectedOffer.land.harvest ?? "Padi"}
                                                        </h6>
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                                <Spinner animation="border" />
                                            </div>
                                        )
                                    }
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Tutup
                                    </Button>
                                    {
                                        selectedOffer && selectedOffer.status === 'PENDING' && user.workAvailability === 'AVAILABLE' &&
                                        <>
                                            <Button
                                                variant="primary"
                                                className='me-2' c
                                                onClick={() => handleUpdate(selectedOffer.id, "ACCEPTED")}
                                            >
                                                Terima
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleUpdate(selectedOffer.id, "ACCEPTED")}
                                            >
                                                Tolak
                                            </Button>
                                        </>
                                    }
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Content>
    );
};

export default WorkerProjectOffers;
