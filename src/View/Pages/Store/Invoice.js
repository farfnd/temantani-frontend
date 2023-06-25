import React, { useEffect, useState } from "react";
import config from "../../../config";
import Cookies from "js-cookie";
import { Button, message } from "antd";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Container, Spinner, Badge } from "react-bootstrap";

const Invoice = () => {
    const [invoice, setInvoice] = useState({});
    const [loadingInvoice, setLoadingInvoice] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        fetchInvoice();
    }, []);

    const fetchInvoice = async () => {
        try {
            setLoadingInvoice(true);
            const response = await fetch(`${config.api.invoiceService}/invoices/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setInvoice(data);
            } else {
                message.error("Gagal memuat data faktur");
            }
        } catch (error) {
            console.log(error);
            message.error("Gagal memuat data faktur " + error.message);
        } finally {
            setLoadingInvoice(false);
        }
    };

    return (
        <Container className="my-3">
            <Row className="print-hidden">
                <Col>
                    <div className="text-center">
                        <Button variant="primary" onClick={() => window.print()}>
                            Cetak
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="text-center">
                            <Card.Title>Faktur Pembelian</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {
                                loadingInvoice ? (
                                    <div className="text-center">
                                        <Spinner animation="border" />
                                    </div>
                                ) : (
                                    <>
                                        <Row>
                                            <Col>
                                                <p>
                                                    <strong>Nomor:</strong> {invoice.invoiceNumber}
                                                    <br />
                                                    <strong>ID Pesanan:</strong> {invoice.orderId}
                                                    <br />
                                                    <strong>Tanggal:</strong> {new Date(invoice.createdAt).toLocaleDateString('id-id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    <br />
                                                    <strong>Dipesan Oleh:</strong> {invoice.customerDetails.firstName} ({invoice.customerDetails.email})
                                                </p>
                                            </Col>
                                            <Col>
                                                <p>
                                                    <strong>Metode Pembayaran:</strong> {invoice.paymentMethod.split("_")
                                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                        .join(" ")}
                                                    <br />
                                                    <strong>Status Pembayaran:</strong> <Badge bg="success">Lunas</Badge>
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <p>
                                                    <strong>Penerima:</strong>
                                                    <br />
                                                    {invoice.shippingDetails.firstName}
                                                    <br />
                                                    {invoice.shippingDetails.address}, {invoice.shippingDetails.city}, {invoice.shippingDetails.postalCode}
                                                    <br />
                                                    {invoice.shippingDetails.phone}
                                                </p>
                                            </Col>
                                            <Col>
                                                <p>
                                                    <strong>Pengirim:</strong>
                                                    <br />
                                                    TemanTani
                                                    <br />
                                                    Jl. Raya ITS, Keputih, Kec. Sukolilo, Kota SBY, Jawa Timur 60111
                                                    <br />
                                                    081234567890
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row className="mt-3">
                                            <Col>
                                                <h6>
                                                    <strong>Daftar Produk:</strong>
                                                </h6>
                                                <table className="table table-striped" border="1">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Nama</th>
                                                            <th scope="col">Harga</th>
                                                            <th scope="col">Jumlah</th>
                                                            <th scope="col">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {invoice.orderDetails
                                                            .filter(item => item.id !== "shipping-fee")
                                                            .map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{item.name}</td>
                                                                    <td>Rp{item.price.toLocaleString("id-ID")}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>Rp{(item.price * item.quantity).toLocaleString("id-ID")}</td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </Col>
                                        </Row>
                                        <Row className="mt-3">
                                            <Col>
                                                <h6>
                                                    <strong>Ringkasan:</strong>
                                                </h6>
                                                <table className="table table-striped" border="1">
                                                    <tbody>
                                                        <tr>
                                                            <td>Subtotal</td>
                                                            <td>
                                                                Rp
                                                                {invoice.orderDetails
                                                                    .filter(item => item.id !== "shipping-fee")
                                                                    .reduce((total, item) => total + item.price * item.quantity, 0)
                                                                    .toLocaleString("id-ID")}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Ongkos Kirim</td>
                                                            <td>
                                                                Rp
                                                                {invoice.orderDetails.find(item => item.id === "shipping-fee").price.toLocaleString("id-ID")}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Total</strong></td>
                                                            <td><strong>Rp{invoice.paymentAmount.toLocaleString("id-ID")}</strong></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </Col>
                                        </Row>

                                    </>
                                )
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Invoice;