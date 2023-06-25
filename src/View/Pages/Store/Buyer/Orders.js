import { Avatar, Layout, message, Image, Modal as AntdModal } from 'antd';
import { Card, Row, Col, Button, Spinner, Badge, Container, Pagination, Form, Modal, InputGroup } from "react-bootstrap";
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
    const [orders, setOrders] = useState(null);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentOrders, setCurrentOrders] = useState([]);
    const history = useHistory();

    useEffect(() => {
        fetchUserIfEmpty();
        fetchOrders();

        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';

        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;

        const myMidtransClientKey = config.midtrans.clientKey;
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);

        document.body.appendChild(scriptTag);

        return () => {
            document.body.removeChild(scriptTag);
        }
    }, []);

    useEffect(() => {
        // Update filteredOrders and currentOrders when perPage changes
        if (orders) {
            const updatedFilteredOrders = searchQuery
                ? orders.filter((order) =>
                    order.product.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                : orders;
            setFilteredOrders(updatedFilteredOrders);
            setCurrentPage(1); // Reset currentPage to 1 when perPage changes
        }
    }, [searchQuery, orders, perPage]);

    useEffect(() => {
        // Update currentOrders based on currentPage and perPage
        if (filteredOrders) {
            const indexLast = currentPage * perPage;
            const indexFirst = indexLast - perPage;
            const updatedCurrentOrders = filteredOrders.slice(indexFirst, indexLast);
            setCurrentOrders(updatedCurrentOrders);
        }
    }, [currentPage, perPage, filteredOrders]);

    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            const response = await fetch(`${config.api.orderService}/orders?include=product,address`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders data:', error);
            message.error('Gagal memuat data pesanan');
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleChangePerPage = (value) => {
        setPerPage(value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleOpenModal = (row) => {
        setSelectedOrder(row);
        setShowModal(true)
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setShowModal(false);
    };

    const handleCancelOrder = async () => {
        AntdModal.confirm({
            zIndex: 4000,
            title: 'Apakah anda yakin akan membatalkan pesanan ini?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Ya',
            cancelText: 'Tidak',
            onOk: async () => {
                try {
                    const response = await fetch(`${config.api.orderService}/orders/${selectedOrder.id}`, {
                        method: 'PATCH',
                        headers: {
                            Authorization: "Bearer " + Cookies.get('token'),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ status: 'CANCELLED' })
                    });

                    if (response.ok) {
                        message.success('Berhasil membatalkan pesanan');
                        await fetchOrders();
                    } else {
                        const responseBody = await response.json();
                        message.error('Gagal membatalkan pesanan: ' + responseBody.message);
                    }
                } catch (error) {
                    console.error(error);
                    message.error('Gagal membatalkan pesanan: ' + error.message);
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
                            <h4 className='mt-3'><strong>Pesanan Saya</strong></h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row className="mb-3">
                                <Col lg={12} className="d-flex flex-row">
                                    <InputGroup>
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
                                    </InputGroup>
                                </Col>

                            </Row>
                            <Card className='mt-0'>
                                <Card.Body className='p-0'>
                                    {loadingOrders ? (
                                        <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
                                            <Spinner animation='border' />
                                        </div>
                                    ) : (
                                        <div>
                                            {orders && orders.length === 0 ? (
                                                <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
                                                    <h5 className='text-center'>Anda belum memiliki pesanan</h5>
                                                </div>
                                            ) : (
                                                <div>
                                                    {currentOrders.length > 0 ? currentOrders.map((order, index) => (
                                                        <div key={index}>
                                                            <Row className='border-bottom py-3'>
                                                                <Col sm={2}>
                                                                    <Image
                                                                        src={`${config.api.inventoryService}/products/${order.productId}/image`}
                                                                        onError={(e) => {
                                                                            e.target.src = "https://via.placeholder.com/300x240?text=No+Image";
                                                                        }}
                                                                        width='100%'
                                                                    />

                                                                </Col>
                                                                <Col sm={10}>
                                                                    <Row>
                                                                        <Col>
                                                                            <span>
                                                                                <h5 className='d-inline-block me-2'><strong>{order.product.name}</strong></h5>
                                                                                <p className='d-inline-block mb-0'>({order.amount} kg)</p>
                                                                            </span>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col>
                                                                            <p className='text-muted mb-0'>
                                                                                <strong>Total:</strong> Rp{
                                                                                    order.paymentAmount
                                                                                        ? parseInt(order.paymentAmount).toLocaleString('id-ID')
                                                                                        : parseInt(order.product.price * order.amount + order.shippingCost).toLocaleString('id-ID')}</p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <p className='text-muted mb-0'><strong>Status:</strong> {order.status}</p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <p className='text-muted mb-0'><strong>Alamat Pengiriman:</strong> {`${order.address.address}, ${order.address.subdistrict}, ${order.address.district}, ${order.address.city}`}</p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <p className='text-muted mb-0'><strong>Tanggal Pemesanan:</strong> {new Date(order.createdAt).toLocaleDateString('id-ID', dateOptions)}</p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col className='mt-2'>
                                                                            <Button
                                                                                variant='outline-dark'
                                                                                className='me-2'
                                                                                onClick={() => handleOpenModal(order)}
                                                                            >
                                                                                Lihat Detail
                                                                            </Button>
                                                                            {
                                                                                order.status === 'PENDING' && (
                                                                                    <Button variant="success" onClick={() => window.snap.pay(order.transactionToken)}>
                                                                                        Bayar Sekarang
                                                                                    </Button>
                                                                                )
                                                                            }
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )) : (
                                                        <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
                                                            <h5 className='text-center'>Data pesanan tidak ditemukan</h5>
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
                                                {Array.from(Array(Math.ceil(filteredOrders.length / perPage)).keys()).map((page) => (
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
                                                    disabled={currentPage === Math.ceil(filteredOrders.length / perPage)}
                                                />
                                            </Pagination>
                                        </div>
                                        <div>
                                            <Form.Label className="me-2">Items per page:</Form.Label>
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
                                    <Modal.Title>Detail Pesanan</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            {
                                                selectedOrder && (
                                                    <>
                                                        <Image
                                                            src={`${config.api.inventoryService}/products/${selectedOrder.productId}/image`}
                                                            onError={(e) => {
                                                                e.target.src = "https://via.placeholder.com/300x240?text=No+Image";
                                                            }}
                                                            style={{
                                                                borderRadius: '10px',
                                                                maxHeight: '200px',
                                                                objectFit: 'cover',
                                                                objectPosition: 'center',
                                                            }}
                                                            wrapperClassName='w-100 mb-3'
                                                        />
                                                        <h5><strong>{selectedOrder.product.name}</strong></h5>
                                                        <p className='mb-0'>
                                                            <strong>Jumlah:</strong>&nbsp;
                                                            {selectedOrder.amount} kg
                                                        </p>
                                                        <p className='mb-0'>
                                                            <strong>Total:</strong>&nbsp;
                                                            Rp{parseInt(selectedOrder.product.price * selectedOrder.amount).toLocaleString('id-ID')}
                                                        </p>
                                                        <p className='mb-0'>
                                                            <strong>Ongkos Kirim:</strong>&nbsp;
                                                            Rp{parseInt(selectedOrder.shippingCost).toLocaleString('id-ID')}
                                                        </p>
                                                        <p className='mb-0'>
                                                            <strong>Status:</strong>&nbsp;
                                                            {selectedOrder.status}
                                                        </p>
                                                        <p className='mb-0'>
                                                            <strong>Alamat Pengiriman:</strong>
                                                            <br />
                                                            {`${selectedOrder.address.address}, ${selectedOrder.address.subdistrict}, ${selectedOrder.address.district}, ${selectedOrder.address.city} ${selectedOrder.address.postalCode}`}</p>
                                                        <p className='mb-0'>
                                                            <strong>Tanggal Pemesanan:</strong>&nbsp;
                                                            {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', dateOptions)}
                                                        </p>
                                                        {
                                                            (selectedOrder.paymentMethod) && (
                                                                <>
                                                                    <p className='mb-0'>
                                                                        <strong>Metode Pembayaran:</strong>&nbsp;
                                                                        {selectedOrder.paymentMethod.split("_")
                                                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                            .join(" ")}
                                                                    </p>
                                                                    {/* buka faktur pembelian */}
                                                                    <Button
                                                                        variant='outline-dark'
                                                                        className='me-2 mt-3'
                                                                        onClick={() => window.open(`/invoice/${selectedOrder.id}`, '_blank')}
                                                                    >
                                                                        Lihat Faktur
                                                                    </Button>
                                                                </>
                                                            )
                                                        }
                                                    </>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Tutup
                                    </Button>
                                    {
                                        selectedOrder && selectedOrder.status === 'PENDING' && (
                                            <>
                                                <Button variant="danger" onClick={handleCancelOrder}>
                                                    Batalkan Pesanan
                                                </Button>
                                                <Button variant="success" onClick={() => window.snap.pay(selectedOrder.transactionToken)}>
                                                    Bayar
                                                </Button>
                                            </>
                                        )
                                    }
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
