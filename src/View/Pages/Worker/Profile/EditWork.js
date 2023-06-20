import { Avatar, Layout, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select'
import {
    Form,
    Button,
    Row,
    Col,
    InputGroup,
    FormControl,
    Container,
    Card,
    Alert,
    Spinner,
} from 'react-bootstrap';

const { Content } = Layout;

const EditWorkDetails = () => {
    const [worker, setWorker] = useState(null);
    const [validated, setValidated] = useState(false);
    const [skillOptions, setSkillOptions] = useState([]);
    const [activeOffer, setActiveOffer] = useState(null);
    const [loading, setLoading] = useState(false);

    const [inputData, setInputData] = useState({
        workAvailability: "",
        description: "",
        skills: [],
    })

    const history = useHistory();

    useEffect(() => {
        fetchWorker();
        fetchSkillOptions();
        fetchActiveWorkOffer();
    }, []);

    useEffect(() => {
        if (worker) {
            setInputData({
                workAvailability: worker.workAvailability,
                description: worker.description ?? '',
                skills: worker.skills ? worker.skills.map((skills) => skills.id) : [],
            });
        }
    }, [worker]);

    const fetchWorker = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.api.workerService}/worker/me?include=skills`, {
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

    const fetchSkillOptions = async () => {
        try {
            const response = await fetch(`${config.api.workerService}/skills`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            const skillOptions = data.map((skill) => ({
                value: skill.id,
                label: skill.tag,
            }));
            setSkillOptions(skillOptions);
        } catch (error) {
            console.error('Error fetching skill data:', error);
        }
    };

    const fetchActiveWorkOffer = async () => {
        try {
            const response = await fetch(`${config.api.workerService}/worker/work-offers/active?include=project`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setActiveOffer(data);
        } catch (error) {
            console.error('Error fetching active work offer data:', error);
            message.error('Gagal memuat data proyek aktif');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputData({ ...inputData, [name]: value });
    };

    const handleChangeSkills = (selectedOptions) => {
        const skills = selectedOptions ? selectedOptions.map((option) => option.value) : [];
        setInputData({ ...inputData, skills });
        console.log(inputData);
    };

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
            console.log(inputData);
            for (let key in inputData) {
                formData.append(key, inputData[key]);
            }
            try {
                setLoading(true);

                const response = await fetch(`${config.api.workerService}/worker/me`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(inputData)
                });
                const data = await response.json();
                setWorker(data.data);

                await fetchWorker();
                history.push('/worker/profile');
                message.success("Profil berhasil diperbarui.");
            } catch (error) {
                console.error('Gagal memperbarui profil:', error);
                message.error("Gagal memperbarui profil. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="12">
                    <Card className="text-center">
                        <Card.Header>
                            <h1>Edit Detail Pekerja</h1>
                        </Card.Header>
                        <Card.Body>
                            {
                                worker ? (
                                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                        {
                                            activeOffer ? (
                                                <Alert variant="warning">
                                                    Anda tidak dapat mengubah ketersediaan kerja karena masih memiliki proyek aktif.
                                                </Alert>
                                            ) : (
                                                <Row className="mb-3">
                                                    <Form.Label column md="2" htmlFor="formBasicWorkAvailability">Ketersediaan Kerja</Form.Label>
                                                    <Col md="10">
                                                        <Form.Select
                                                            name="workAvailability"
                                                            value={inputData.workAvailability}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="AVAILABLE">Tersedia</option>
                                                            <option value="NOT_AVAILABLE">Tidak tersedia</option>
                                                        </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            Mohon pilih ketersediaan kerja.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                        <Row className="mb-3">
                                            <Form.Label column md="2" htmlFor="formBasicName">
                                                Keahlian
                                            </Form.Label>
                                            <Col md="10">
                                                <Select
                                                    options={skillOptions}
                                                    isMulti
                                                    name='skills'
                                                    isClearable
                                                    isSearchable
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    value={skillOptions.filter((option) => inputData.skills.includes(option.value))}
                                                    onChange={handleChangeSkills}
                                                />
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Form.Label column md="2" htmlFor="formBasicDescription">Ringkasan Profil</Form.Label>
                                            <Col md="10">
                                                <FormControl
                                                    as="textarea"
                                                    placeholder="Masukkan ringkasan profil Anda"
                                                    name="description"
                                                    value={inputData.description}
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col md="12">
                                                <Link to="/worker/profile">
                                                    <Button variant="secondary" className='me-2'>
                                                        Batal
                                                    </Button>
                                                </Link>
                                                {
                                                    loading ? (
                                                        <Button variant="primary" disabled>
                                                            <Spinner animation="border" size="sm" />
                                                        </Button>
                                                    ) : (
                                                        <Button variant="primary" type="submit">
                                                            Simpan
                                                        </Button>
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                    </Form>
                                ) : (
                                    <div className="text-center">
                                        <Spinner animation="border" />
                                    </div>
                                )
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditWorkDetails;
