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
    const { user, setUser } = useContext(UserContext);
    const [validated, setValidated] = useState(false);
    const [bankOptions, setBankOptions] = useState([]);

    const [inputData, setInputData] = useState({
        bank: "",
        bankAccountNumber: "",
        bankAccountHolderName: "",
    })

    const history = useHistory();

    useEffect(() => {
        fetchUserData();
        fetchBankOptions();
    }, []);

    const fetchUserData = async () => {
        try {
            if (Object.keys(user).length === 0 && user.constructor === Object) {
                const response = await fetch(`${config.api.userService}/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setUser(data);
            }
            setInputData({
                bank: user.bank,
                bankAccountNumber: user.bankAccountNumber,
                bankAccountHolderName: user.bankAccountHolderName,
            })
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

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
                const response = await fetch(`${config.api.userService}/me`, {
                    method: 'PUT',
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                    },
                    body: formData,
                });
                const data = await response.json();
                setUser(data.data);
                if (response.ok) {
                    history.push('/worker/bank-account');
                    message.success("Data rekening berhasil diperbarui.");
                } else {
                    message.error("Gagal memperbarui data rekening. Silakan coba lagi.");
                }
            } catch (error) {
                console.error('Gagal memperbarui data rekening:', error);
                message.error("Gagal memperbarui data rekening. Silakan coba lagi.");
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
                                                <Button variant="primary" type="submit" onClick={handleSubmit}>
                                                    Simpan
                                                </Button>
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
