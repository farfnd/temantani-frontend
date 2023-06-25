import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap"
import { useLocation, useHistory } from "react-router-dom";
import config from "../../../../config";
import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import Cookies from "js-cookie";

const axios = require('axios');

const ConfirmOrder = () => {
    const location = useLocation();
    const { address, product, amount } = location.state;
    const origin = config.shipping.origin;
    const [shippingCost, setShippingCost] = useState(null);
    const [loading, setLoading] = useState(false);
    const { confirm } = Modal;
    const history = useHistory();

    useEffect(() => {
        calculateShippingCost();

        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';

        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;

        const myMidtransClientKey = config.midtrans.clientKey;
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);

        document.body.appendChild(scriptTag);

        return () => {
            document.body.removeChild(scriptTag);
        }
    }, []); //

    const getDistance = async (address) => {
        const destination = encodeURIComponent(
            `${address.subdistrict}, ${address.district}, ${address.city}, ${address.postalCode}`
        );
        const originAddress = encodeURIComponent(
            `${origin.subdistrict}, ${origin.district}, ${origin.city}, ${origin.postalCode}`
        );

        try {
            const response = await axios.get(
                `${config.api.orderService}/get-distance?origin=${originAddress}&destination=${destination}`
            );
            const data = await response.data.data;
            return data;
        } catch (error) {
            console.error(error);
            return 0;
        }
    };

    const calculateShippingCost = async () => {
        const distance = await getDistance(address);
        const cost =
            config.shipping.cost.base +
            config.shipping.cost.perKmUnder10Km * Math.ceil(distance / 1000) +
            (distance > 10000
                ? config.shipping.cost.perKmAbove10Km * Math.ceil((distance - 10000) / 1000)
                : 0);

        setShippingCost(cost);
    };

    const confirmStoreOrder = async () => {
        try {
            setLoading(true);
            const body = {
                addressId: address.id,
                productId: product.id,
                amount: amount,
                shippingCost: shippingCost,
            };
            console.log(JSON.stringify(body));
            const response = await fetch(`${config.api.orderService}/orders`, {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                const data = await response.json();
                window.snap.pay(data.token, {
                    onSuccess: function (result) {
                        history.push('/store/me/orders');
                        message.success('Pesanan berhasil dibuat');
                    },
                    onError: function (result) {
                        history.push('/store/me/orders');
                        message.error('Gagal membuat pesanan');
                    },
                    onClose: function () {
                        history.push('/store/me/orders');
                        message.success('Pesanan berhasil dibuat, silahkan lakukan pembayaran sebelum 24 jam');
                    }
                })
                return data;
            }
        } catch (error) {
            console.error('Error fetching orders data:', error);
            message.error('Gagal menyimpan pesanan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 py-4 px-xl-5">
            <Row>
                <Col>
                    <h1>Konfirmasi Pesanan</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                <strong>Detail Pesanan</strong>
                                            </Card.Title>
                                            <Card className="flex-row">
                                                <Card.Img
                                                    variant="left"
                                                    src={product.image ? `${config.api.inventoryService}/products/${product.id}/image` : "https://via.placeholder.com/300x200?text=No+Image"}
                                                    className="example-card-img-responsive"
                                                    height="200"
                                                />
                                                <Card.Body>
                                                    <Card.Title>{product.name}</Card.Title>
                                                    <Card.Text>
                                                        {product.description}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        {amount} x Rp{parseInt(product.price).toLocaleString('id-ID')}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>Total:</strong> Rp{parseInt(amount * product.price).toLocaleString('id-ID')}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="d-flex h-100">
                                        <Card className="flex-fill">
                                            <Card.Body>
                                                <Card.Title>
                                                    <strong>Alamat Pengiriman</strong>
                                                </Card.Title>
                                                <Card.Text>
                                                    {address.name} ({address.phoneNumber})
                                                    <br />
                                                    {address.address}, {address.subdistrict}, {address.district}
                                                    <br />
                                                    {address.city}, {address.postalCode}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="d-flex h-100">
                                        <Card className="flex-fill">
                                            <Card.Body>
                                                <Card.Title>
                                                    <strong>Total Pembayaran</strong>
                                                </Card.Title>
                                                <Card.Text>
                                                    <strong>Subtotal:</strong> Rp{parseInt(amount * product.price).toLocaleString('id-ID')}
                                                    <br />
                                                    <strong>Ongkos Kirim:</strong> {shippingCost !== null ? `Rp${parseInt(shippingCost).toLocaleString('id-ID')}` : 'Loading...'}
                                                </Card.Text>
                                                <hr />
                                                <h5><strong>Total:</strong> {
                                                    shippingCost !== null ?
                                                        `Rp ${parseInt(amount * product.price + parseInt(shippingCost)).toLocaleString('id-ID')}`
                                                        : 'Loading...'
                                                }</h5>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Alert variant="info" className="mt-3 text-center">
                                        Metode pembayaran yang tersedia saat ini adalah <strong>Transfer Bank</strong> menggunakan virtual account.<br />
                                        Mohon untuk melakukan pembayaran sebelum 1x24 jam setelah melakukan pemesanan.<br />
                                        Pesanan yang sudah dibayar tidak dapat dibatalkan.
                                    </Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="text-center">
                                    <Button
                                        variant="primary"
                                        onClick={confirmStoreOrder}
                                        disabled={loading}
                                    >
                                        {loading ? (
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
                                            "Konfirmasi Pesanan"
                                        )}
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ConfirmOrder;