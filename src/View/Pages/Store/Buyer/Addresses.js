import { Avatar, Layout, message, Image, Modal as AntdModal } from 'antd';
import { Card, Row, Col, Button, Spinner, Badge, Container, Pagination, Form, Modal } from "react-bootstrap";
import React, { useContext, useEffect, useState } from 'react';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../../../Contexts/UserContext';
import Sider from './Sider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;

const BuyerDashboard = () => {
    const {
        user,
        fetchUserIfEmpty,
    } = useContext(UserContext);
    const [addresses, setAddresses] = useState(null);
    const [validated, setValidated] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric' });
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [inputData, setInputData] = useState({});
    const [cities, setCities] = useState(null);
    const [districts, setDistricts] = useState(null);
    const [subdistricts, setSubdistricts] = useState(null);

    useEffect(() => {
        fetchUserIfEmpty();
        fetchAddresses();
        fetchCities();
        setInputData({
            name: "",
            phoneNumber: "",
            address: "",
            city: "",
            district: "",
            subdistrict: "",
            postalCode: "",
        });
    }, []);


    const history = useHistory();

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const response = await fetch(`${config.api.orderService}/addresses`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setAddresses(data);
        } catch (error) {
            console.error('Error fetching addresses data:', error);
            message.error('Gagal memuat data alamat');
        } finally {
            setLoadingAddresses(false);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/35.json`);
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities data:', error);
            message.error('Gagal memuat data kota/kabupaten');
        }
    };

    const fetchDistricts = async (cityId) => {
        try {
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`);
            const data = await response.json();
            setDistricts(data);
        } catch (error) {
            console.error('Error fetching districts data:', error);
            message.error('Gagal memuat data kecamatan');
        }
    };

    const fetchSubdistricts = async (districtId) => {
        try {
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`);
            const data = await response.json();
            setSubdistricts(data);
        } catch (error) {
            console.error('Error fetching subdistricts data:', error);
            message.error('Gagal memuat data desa/kelurahan');
        }
    };

    const filteredAddresses = addresses
        ? (searchQuery
            ? addresses.filter((address) => JSON.stringify(address).toLowerCase().includes(searchQuery.toLowerCase()))
            : addresses)
        : [];

    // Get current addresses
    const indexLast = currentPage * perPage;
    const indexFirst = indexLast - perPage;
    const currentAddresses = filteredAddresses ? filteredAddresses.slice(indexFirst, indexLast) : []

    // Change page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleChangePerPage = (value) => {
        setPerPage(value);
        setCurrentPage(1);
    };

    const handleOpenModal = async (row) => {
        console.log(row)
        setSelectedAddress(row);
        setShowModal(true);
        setInputData(row);

        const city = cities.find((city) => city.name === row.city);
        await fetchDistricts(city.id);
    };

    const handleCloseModal = () => {
        setSelectedAddress(null);
        setShowModal(false);

        setInputData({
            name: "",
            phoneNumber: "",
            address: "",
            city: "",
            district: "",
            subdistrict: "",
            postalCode: "",
        });
    };

    const handleAddAddress = () => {
        setValidated(false);
        setInputData({
            name: "",
            phoneNumber: "",
            address: "",
            city: "",
            district: "",
            subdistrict: "",
            postalCode: "",
        });
        setShowModal(true);
    }

    const handleChangeCity = async (e) => {
        console.log(e.target.value)
        const city = cities.find((city) => city.name === e.target.value);
        setInputData({
            ...inputData,
            city: city.name,
        });

        await fetchDistricts(city.id);
    };

    const handleChangeDistrict = async (e) => {
        console.log(e.target.value)
        const district = districts.find((district) => district.name === e.target.value);
        setInputData({
            ...inputData,
            district: district.name,
        });

        await fetchSubdistricts(district.id);
    };

    const handleChangeSubdistrict = async (e) => {
        console.log(e.target.value)
        const subdistrict = subdistricts.find((subdistrict) => subdistrict.name === e.target.value);
        setInputData({
            ...inputData,
            subdistrict: subdistrict.name,
        });
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

            const url = selectedAddress ? `${config.api.orderService}/addresses/${selectedAddress.id}` : `${config.api.orderService}/addresses`;
            const method = selectedAddress ? 'PUT' : 'POST';

            try {
                setLoading(true);
                const response = await fetch(url, {
                    method,
                    headers: {
                        Authorization: "Bearer " + Cookies.get('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(inputData),
                });
                if (response.ok) {
                    await fetchAddresses();
                    setShowModal(false);
                    setValidated(false);
                    message.success('Data alamat berhasil diperbarui');
                } else {
                    const responseBody = await response.json();
                    message.error('Gagal memperbarui data alamat: ' + responseBody.message);
                }
            } catch (error) {
                console.error('Gagal memperbarui data alamat:', error);
                message.error("Gagal memperbarui data alamat. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteAddress = async (address) => {
        AntdModal.confirm({
            zIndex: 4000,
            title: 'Apakah anda yakin akan menghapus alamat ini?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Ya',
            cancelText: 'Tidak',
            onOk: async () => {
                try {
                    const response = await fetch(`${config.api.orderService}/addresses/${address.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: "Bearer " + Cookies.get('token'),
                            'Content-Type': 'application/json'
                        },
                    });

                    if (response.ok) {
                        message.success('Berhasil menghapus alamat');
                        await fetchAddresses();
                    } else {
                        const responseBody = await response.json();
                        message.error('Gagal menghapus alamat: ' + responseBody.message);
                    }
                } catch (error) {
                    console.error(error);
                    message.error('Gagal menghapus alamat: ' + error.message);
                } finally {
                    handleCloseModal();
                }
            }
        });
    };

    return (
        <Container className="mt-5 py-4 px-xl-5">
            <Row>
                <Sider />
                <Col sm={8}>
                    <Row>
                        <Col>
                            <h4 className='mt-3'><strong>Alamat Saya</strong></h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row className="mb-3">
                                <Col lg={10} className="d-flex flex-row">
                                    <div className="input-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Cari produk"
                                            aria-label="search input"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <Button variant="outline-dark">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </Button>
                                    </div>
                                </Col>
                                <Col className="d-flex flex-row">
                                    <Button variant='primary' className='w-100' onClick={handleAddAddress}>
                                        Tambah
                                    </Button>
                                </Col>
                            </Row>
                            <Card className='mt-0'>
                                <Card.Body className='p-0'>
                                    {loadingAddresses ? (
                                        <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
                                            <Spinner animation='border' />
                                        </div>
                                    ) : (
                                        <div>
                                            {addresses && addresses.length === 0 ? (
                                                <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
                                                    <h5 className='text-center'>Anda belum memiliki alamat tersimpan</h5>
                                                </div>
                                            ) : (
                                                <div>
                                                    {currentAddresses.length > 0 ? currentAddresses.map((address, index) => (
                                                        <div key={index}>
                                                            <Row className='border-bottom py-3'>
                                                                <Col md={10}>
                                                                    <Row>
                                                                        <Col>
                                                                            <p className='text-muted mb-0'>
                                                                                {address.name ?? "N/A"} ({address.phoneNumber ?? "N/A"})
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <p className='text-muted mb-0'>
                                                                                {address.address ?? "N/A"}
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <p className='text-muted mb-0'>
                                                                                {address.subdistrict ?? "N/A"}{`, ${address.district}`}
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <p className='text-muted mb-0'>
                                                                                {address.city ?? "N/A"} {address.postalCode ?? "N/A"}
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col md={2}>
                                                                    <Button
                                                                        variant='outline-dark'
                                                                        className='btn-sm w-100 mb-2'
                                                                        onClick={() => handleOpenModal(address)}
                                                                    >
                                                                        Ubah
                                                                    </Button>
                                                                    <Button
                                                                        variant='danger'
                                                                        className='btn-sm w-100'
                                                                        onClick={() => handleDeleteAddress(address)}
                                                                    >
                                                                        Hapus
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )) : (
                                                        <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
                                                            <h5 className='text-center'>Data alamat tidak ditemukan</h5>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card.Body>
                                <Card.Footer>
                                    <div className="d-flex justify-content-between mt-3">
                                        <div>
                                            <Pagination>
                                                <Pagination.Prev
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                />
                                                {Array.from(Array(Math.ceil(currentAddresses.length / perPage)).keys()).map((page) => (
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
                                                    disabled={currentPage === Math.ceil(currentAddresses.length / perPage)}
                                                />
                                            </Pagination>
                                        </div>
                                        <div>
                                            <Form.Label className="me-2">
                                                Items per page:
                                            </Form.Label>
                                            <Form.Select
                                                value={perPage}
                                                onChange={(e) => handleChangePerPage(e.target.value)}
                                            >
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                            </Form.Select>
                                        </div>
                                    </div>
                                </Card.Footer>
                            </Card>
                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Detail Alamat</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>Nama Penerima</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Masukkan nama penerima"
                                                        defaultValue={inputData.name ?? (
                                                            selectedAddress ? selectedAddress.name : ""
                                                        )}
                                                        onChange={handleChange}
                                                        name='name'
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>Nomor Telepon</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Masukkan nomor telepon"
                                                        defaultValue={inputData.phoneNumber ?? (
                                                            selectedAddress ? selectedAddress.phoneNumber : ""
                                                        )}
                                                        onChange={handleChange}
                                                        name='phoneNumber'
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>Alamat</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Masukkan alamat"
                                                        defaultValue={inputData.address ?? (
                                                            selectedAddress ? selectedAddress.address : ""
                                                        )}
                                                        onChange={handleChange}
                                                        name='address'
                                                        required
                                                    />
                                                </Form.Group>
                                                <Row>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Kota/kabupaten</Form.Label>
                                                            <Form.Select
                                                                name='city'
                                                                onInput={handleChangeCity}
                                                                defaultValue={inputData.city ?? (
                                                                    selectedAddress ? selectedAddress.city : ""
                                                                )}
                                                                required
                                                            >
                                                                <option value='' >Pilih kota/kabupaten</option>
                                                                {
                                                                    cities && cities.map((city, index) => (
                                                                        <option key={index} value={city.name}>{city.name}</option>
                                                                    ))
                                                                }
                                                            </Form.Select>
                                                            <Form.Control.Feedback type="invalid">
                                                                Mohon pilih kota/kabupaten
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>

                                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Kecamatan</Form.Label>
                                                            <Form.Select
                                                                name='district'
                                                                onInput={handleChangeDistrict}
                                                                defaultValue={inputData.district ?? (
                                                                    selectedAddress ? selectedAddress.district : ""
                                                                )}
                                                                required
                                                            >
                                                                <option value=''>Pilih Kecamatan</option>
                                                                {
                                                                    districts && districts.map((district, index) => (
                                                                        <option key={index} value={district.name}>{district.name}</option>
                                                                    ))
                                                                }
                                                            </Form.Select>
                                                            <Form.Control.Feedback type="invalid">
                                                                Mohon pilih kecamatan
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Desa/Kelurahan</Form.Label>
                                                            <Form.Select
                                                                name='subdistrict'
                                                                onInput={handleChangeSubdistrict}
                                                                defaultValue={inputData.subdistrict ?? (
                                                                    selectedAddress ? selectedAddress.subdistrict : ""
                                                                )}
                                                                required
                                                            >
                                                                <option value=''>Pilih Desa/Kelurahan</option>
                                                                {
                                                                    subdistricts && subdistricts.map((subdistrict, index) => (
                                                                        <option key={index} value={subdistrict.name}>{subdistrict.name}</option>
                                                                    ))
                                                                }
                                                            </Form.Select>
                                                            <Form.Control.Feedback type="invalid">
                                                                Mohon pilih desa/kelurahan
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>

                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Kode Pos</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Masukkan kode pos"
                                                                name='postalCode'
                                                                defaultValue={inputData.postalCode ?? (
                                                                    selectedAddress ? selectedAddress.postalCode : ""
                                                                )}
                                                                onChange={handleChange}
                                                                minLength={5}
                                                                maxLength={5}
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Form.Control.Feedback type="invalid">
                                                            Mohon masukkan kode pos yang valid
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Tutup
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
        </Container>
    );
};

export default BuyerDashboard;
