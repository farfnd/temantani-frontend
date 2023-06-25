import { Layout, Image, message, Spin, Modal as AntdModal } from 'antd';
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
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;

const WorkerProjectOffers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage, setProjectsPerPage] = useState(4);
    const [worker, setWorker] = useState(null);
    const [workOffers, setWorkOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loadingOffer, setLoadingOffer] = useState(true);
    const [land, setLand] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [openWorkContract, setOpenWorkContract] = useState(false);
    const [modalData, setModalData] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const [userName, setUserName] = useState("");
    const [validated, setValidated] = useState(false);
    const [workContractModalButtonDisabled, setWorkContractModalButtonDisabled] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric' });
    const history = useHistory();

    const showModal = (row) => {
        setSelectedOffer(row);
        setOpen(true)
    };

    const {
        user, setUser,
        fetchUserIfEmpty
    } = useContext(UserContext);

    useEffect(() => {
        fetchUserIfEmpty();
        fetchWorker();
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

    const fetchWorker = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.api.workerService}/worker/me`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setWorker(data);
        } catch (error) {
            console.error('Error fetching worker data:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleOpenWorkContract = () => {
        setOpenWorkContract(true);
    };

    const handleCloseWorkContract = () => {
        setOpenWorkContract(false);
    };

    const handleNameChange = (e) => {
        e.persist();
        setUserName(e.target.value);
        setWorkContractModalButtonDisabled(e.target.value.toLowerCase() !== worker.name.toLowerCase());
        console.log(e.target.value);
    };

    const handleDenyOffer = async (id) => {
        AntdModal.confirm({
            zIndex: 4000,
            title: 'Apakah anda yakin akan menolak tawaran kerja ini?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Ya',
            cancelText: 'Tidak',
            onOk: async () => await handleUpdate(id, "REJECTED")
        });
    };
    const handleUpdate = async (id, status) => {
        setLoadingUpdate(true);
        let body = { status };
        if (status === "ACCEPTED") {
            body.workContractAccepted = 1;
        }
        try {
            const response = await fetch(`${config.api.workerService}/worker/work-offers/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                if (status === "ACCEPTED") {
                    const userResponse = await fetch(`${config.api.workerService}/worker/me`, {
                        method: 'PATCH',
                        headers: {
                            Authorization: "Bearer " + Cookies.get('token'),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ workAvailability: 'NOT_AVAILABLE' })
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
        } finally {
            setLoadingUpdate(false);
            setWorkContractModalButtonDisabled(false);
            setOpenWorkContract(false);
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
                                    <h3>Riwayat Tawaran Pekerjaan</h3>
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
                                        selectedOffer ? (
                                            selectedOffer.status === 'PENDING' && worker.workAvailability === 'AVAILABLE' &&
                                            <>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleOpenWorkContract(selectedOffer)}
                                                >
                                                    Terima
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDenyOffer(selectedOffer.id)}
                                                >
                                                    Tolak
                                                </Button>
                                            </>
                                        ) : (
                                            <></>
                                        )

                                    }
                                </Modal.Footer>
                            </Modal>
                            <Modal
                                show={openWorkContract}
                                onHide={handleCloseWorkContract}
                                size='lg'
                                dialogClassName='modal-70w'
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Kontrak Kerja Proyek
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{
                                    maxHeight: 'calc(100vh - 210px)',
                                    overflowY: 'auto'
                                }}>
                                    {
                                        selectedOffer ? (
                                            <>
                                                <Card.Text>
                                                    Tangggal: {new Date().toLocaleDateString('id-ID', dateOptions)}
                                                    <br />
                                                    Perihal: Kontrak Kerja
                                                </Card.Text>
                                                <p>Yang bertanda tangan di bawah ini:</p>
                                                <p>
                                                    <strong>PIHAK PERTAMA</strong><br />
                                                    Nama: {worker.name}<br />
                                                    Alamat: {user.street}, {user.city}, {user.postalCode}<br />
                                                    No. HP: {user.phoneNumber}<br />
                                                    Email: {worker.email}<br />
                                                </p>
                                                <p>
                                                    <strong>PIHAK KEDUA</strong><br />
                                                    Nama: TemanTani<br />
                                                    Alamat: Jl. Raya ITS, Keputih, Kec. Sukolilo, Kota SBY, Jawa Timur 60111<br />
                                                    Email: admin@temantani.com
                                                </p>
                                                <p>
                                                    Selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong> dan <strong>PIHAK KEDUA</strong> secara bersama-sama disebut sebagai <strong>PIHAK</strong>.
                                                    <br />
                                                    Menyatakan bahwa <strong>PIHAK</strong> sepakat untuk mengadakan perjanjian kerja sama dalam bidang pertanian dengan ketentuan sebagai berikut:
                                                </p>
                                                <p>
                                                    <div className="text-center">
                                                        <strong>PASAL 1<br />
                                                            KETENTUAN UMUM</strong><br />
                                                    </div>
                                                    <strong>1.1</strong> Pihak Pertama dengan ini menyatakan bahwa Pihak Pertama adalah seorang pekerja yang memiliki keahlian dalam bidang pertanian.<br />
                                                    <strong>1.2</strong> Pihak Kedua dengan ini menyatakan bahwa Pihak Kedua adalah sebuah perusahaan yang bergerak di bidang pertanian.<br />
                                                    <strong>1.3</strong> Pihak Pertama dan Pihak Kedua dengan ini sepakat untuk melakukan kerjasama dalam bidang pertanian.<br />
                                                    <strong>1.4</strong> Proyek yang akan dilaksanakan oleh Pihak Pertama dan Pihak Kedua adalah sebagai berikut:<br />
                                                    <ul>
                                                        <li>Lokasi: {selectedOffer.land.street}, {selectedOffer.land.city}</li>
                                                        <li>Luas: {selectedOffer.land.area ?? "3700"} m<sup>2</sup></li>
                                                        <li>Deskripsi: {selectedOffer.project.description}</li>
                                                        <li>Komoditas: {selectedOffer.land.harvest ?? "Padi"}</li>
                                                        <li>Pemilik Lahan: {selectedOffer.land.owner.name ?? "N/A"}</li>
                                                        <li>Perkiraan Masa Proyek: {selectedOffer.project.initiatedAtReadable ?? "N/A"} - {selectedOffer.project.estimatedFinishedReadable ?? "N/A"}</li>
                                                    </ul>

                                                </p>
                                                <p>
                                                    <div className="text-center">
                                                        <strong>PASAL 2<br />
                                                            SYARAT-SYARAT KERJA
                                                        </strong><br />
                                                    </div>
                                                    <strong>2.1</strong> Pihak Pertama setuju untuk bekerja selama periode proyek yang telah ditentukan.<br />
                                                    <strong>2.2</strong> Pihak Pertama akan melaksanakan tugas dan tanggung jawab yang terkait dengan proyek, termasuk tetapi tidak terbatas pada:<br />
                                                    <ul className='mb-0'>
                                                        <li style={{ listStyleType: 'initial' }}>Pengelolaan lahan</li>
                                                        <li>Pemeliharaan tanaman</li>
                                                        <li>Pemanenan</li>
                                                        <li>Pengolahan pascapanen</li>
                                                    </ul>
                                                    <strong>2.3</strong> Pihak Pertama akan menjalankan tugas dengan penuh dedikasi dan memastikan pekerjaan dilakukan dengan baik.<br />
                                                    <strong>2.4</strong> Pihak Kedua akan memberikan pengawasan dan bimbingan kepada Pihak Pertama selama proyek berlangsung.<br />
                                                    <strong>2.5</strong> Pihak Pertama akan memberikan laporan kemajuan mingguan kepada Pihak Kedua.<br />
                                                </p>
                                                <p>
                                                    <div className="text-center">
                                                        <strong>PASAL 3<br />
                                                            PEMBAYARAN
                                                        </strong><br />
                                                    </div>
                                                    <strong>3.1</strong> Pihak Kedua akan membayar Pihak Pertama sesuai dengan kesepakatan yang telah disepakati sebelumnya.<br />
                                                    <strong>3.2</strong> Pembayaran akan dilakukan setelah proyek selesai dan laporan kemajuan mingguan diterima dan diverifikasi oleh Pihak Kedua.<br />
                                                    <strong>3.3</strong> Pihak Pertama setuju untuk menerima pembayaran dari Pihak Kedua melalui transfer bank.<br />
                                                </p>
                                                <p>
                                                    <div className="text-center">
                                                        <strong>PASAL 4<br />
                                                            KEWAJIBAN PIHAK PERTAMA
                                                        </strong><br />
                                                    </div>
                                                    <strong>4.1</strong> Pihak Pertama setuju untuk bekerja selama periode proyek yang telah ditentukan.<br />
                                                    <strong>4.2</strong> Pihak Pertama harus mematuhi instruksi dan petunjuk yang diberikan oleh Pihak Kedua.<br />
                                                    <strong>4.3</strong> Pihak Pertama bertanggung jawab untuk menjaga kebersihan dan keamanan di lokasi proyek.<br />
                                                    <strong>4.4</strong> Pihak Pertama bertanggung jawab untuk memastikan bahwa semua peralatan yang digunakan dalam proyek berada dalam kondisi baik.<br />
                                                </p>
                                                <p>
                                                    <div className="text-center">
                                                        <strong>PASAL 5<br />
                                                            KEWAJIBAN PIHAK KEDUA
                                                        </strong><br />
                                                    </div>
                                                    <strong>5.1</strong> Pihak Kedua akan menyediakan semua peralatan dan bahan yang diperlukan untuk melaksanakan proyek.<br />
                                                    <strong>5.2</strong> Pihak Kedua akan memberikan dukungan dan bimbingan kepada Pihak Pertama.<br />
                                                    <strong>5.3</strong> Pihak Kedua akan memberikan pembayaran kepada Pihak Pertama sesuai dengan kesepakatan yang telah disepakati sebelumnya.<br />
                                                </p>
                                                <p>
                                                    <div className="text-center">
                                                        <strong>PASAL 6<br />
                                                            KONDISI UMUM
                                                        </strong><br />
                                                    </div>
                                                    <strong>6.1</strong> Pihak Pertama dan Pihak Kedua dengan ini menyatakan bahwa mereka adalah pihak yang sah dan berwenang untuk mengikat pihak mereka masing-masing dalam perjanjian ini.<br />
                                                    <strong>6.2</strong> Pihak Pertama dan Pihak Kedua dengan ini menyatakan bahwa mereka telah membaca dan memahami isi dari perjanjian ini.<br />
                                                    <strong>6.3</strong> Perjanjian ini akan berlaku efektif pada tanggal yang disebutkan di atas dan akan berakhir pada tanggal yang disebutkan di atas.<br />
                                                    <strong>6.4</strong> Perjanjian ini dapat diperpanjang dengan persetujuan tertulis dari kedua belah pihak.<br />
                                                    <strong>6.5</strong> Dalam hal terjadi pelanggaran terhadap perjanjian ini oleh salah satu pihak, pihak lain memiliki hak untuk mengakhiri kontrak dan mengambil langkah hukum yang diperlukan<br />
                                                </p>
                                                <hr />
                                                <p>
                                                    Dengan mengetikkan nama dan menekan tombol "Setuju", Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui semua syarat dan ketentuan dalam Perjanjian ini.
                                                </p>
                                                <div className="mb-3">
                                                    <label htmlFor="userName" className="form-label">
                                                        Nama
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="userName"
                                                        required
                                                        value={userName}
                                                        onChange={handleNameChange}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Nama tidak sesuai dengan nama pengguna</Form.Control.Feedback>
                                                </div>

                                            </>
                                        ) : (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                                <Spinner animation="border" />
                                            </div>
                                        )
                                    }
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseWorkContract}>
                                        Tutup
                                    </Button>
                                    {selectedOffer ? (
                                        selectedOffer.status === "PENDING" ? (
                                            <Button
                                                variant="primary"
                                                onClick={() => handleUpdate(selectedOffer.id, "ACCEPTED")}
                                                disabled={workContractModalButtonDisabled}
                                            >
                                                {loadingUpdate ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="grow"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                        &nbsp;
                                                        Loading...
                                                    </>
                                                ) : (
                                                    "Terima Tawaran"
                                                )}
                                            </Button>
                                        ) : (
                                            <></>
                                        )
                                    ) : (
                                        <></>
                                    )}
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
