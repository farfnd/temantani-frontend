import { Avatar, Layout, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { Link, useHistory } from 'react-router-dom';
import banks from '../../../../assets/data/banks.json';
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
import { UserContext } from '../../../../Contexts/UserContext';

const { Content } = Layout;

const EditBankAccount = () => {
    const { user, setUser, fetchUser } = useContext(UserContext);
    const [validated, setValidated] = useState(false);
    const [bankOptions, setBankOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [inputData, setInputData] = useState({
        bank: "",
        bankAccountNumber: "",
        bankAccountHolderName: "",
    })

    const history = useHistory();

    useEffect(() => {
        fetchUser();
        fetchBankOptions();
    }, []);

    useEffect(() => {
        if (user) {
            setInputData({
                bank: user.bank,
                bankAccountNumber: user.bankAccountNumber,
                bankAccountHolderName: user.bankAccountHolderName,
            });
        }
    }, [user]);

    const fetchBankOptions = async () => {
        const bankOptions = banks.map((bank) => ({
            id: bank.id,
            name: bank.name,
        }));
        setBankOptions(bankOptions);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputData({ ...inputData, [name]: value });
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
                const response = await fetch(`${config.api.userService}/me`, {
                    method: 'PUT',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                    },
                    body: formData,
                });
                if (response.ok) {
                    await fetchUser();
                    message.success('Data rekening berhasil diperbarui');
                } else {
                    const responseBody = await response.json();
                    message.error('Gagal memperbarui data rekening: ' + responseBody.message);
                }
                history.push('/worker/bank-account');
            } catch (error) {
                console.error('Gagal memperbarui data rekening:', error);
                message.error("Gagal memperbarui data rekening. Silakan coba lagi.");
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
                            <h1>Edit Rekening Bank</h1>
                        </Card.Header>
                        <Card.Body>
                            {
                                user ? (
                                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                        <Row className="mb-3">
                                            <Form.Label column md="2" htmlFor="formBasicName">
                                                Bank
                                            </Form.Label>
                                            <Col md="10">
                                                <Form.Select
                                                    name='bank'
                                                    value={inputData.bank}
                                                    onChange={handleChange}
                                                >
                                                    <option hidden>Silakan pilih bank</option>
                                                    {bankOptions.map((bank) => (
                                                        <option key={bank.id} value={bank.name}>
                                                            {bank.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Form.Label column md="2" htmlFor="formBasicBankAccountNumber">Nomor Rekening</Form.Label>
                                            <Col md="10">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Masukkan nomor rekening"
                                                    name="bankAccountNumber"
                                                    value={inputData.bankAccountNumber}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Mohon masukkan nomor rekening.
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Form.Label column md="2" htmlFor="formBasicBankAccountHolderName">Nama Pemilik Rekening</Form.Label>
                                            <Col md="10">
                                                <FormControl
                                                    type="text"
                                                    placeholder="Masukkan nama pemilik rekening"
                                                    name="bankAccountHolderName"
                                                    value={inputData.bankAccountHolderName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Mohon masukkan nama pemilik rekening.
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col md="12">
                                                <Link to="/worker/bank-account">
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

export default EditBankAccount;
