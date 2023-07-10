import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { Spin, message, Modal } from 'antd';
import Datatable from '../../../Components/Datatable';
import { OrdersContext } from "../../../../Contexts/OrdersContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHouse } from "@fortawesome/free-solid-svg-icons";

const OrderList = () => {
    const {
        orders,
        loading, setLoading,
        fetchData
    } = useContext(OrdersContext)
    const [open, setOpen] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setLoadingModal(true);
        setTimeout(() => {
            setLoadingModal(false);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetchData()
    }, []);

    const bgs = {
        "PENDING": "warning",
        "PAID": "success",
        "SENT": "primary",
        "CANCELLED": "danger",
        "PROCESSED": "primary",
    }

    const headers = [
        {
            prop: "product.name",
            title: "Nama Produk",
            isFilterable: true,
            isSortable: true,
            cell: (row) => row.product.name
        },
        {
            prop: "amount",
            title: "Jumlah",
            isFilterable: true,
            isSortable: true,
        },
        {
            prop: "status",
            title: "Status",
            isFilterable: true,
            isSortable: true,
            cell: (row) => (
                <Badge bg={bgs[row.status] || 'primary'}>{row.status}</Badge>
            )
        },
        {
            prop: "user.name",
            title: "Pemesan",
            isFilterable: true,
            isSortable: true,
            cell: (row) => row.user.name
        },
        {
            prop: "address",
            title: "Alamat",
            isFilterable: true,
            isSortable: true,
            cell: (row) => row.address.address + ", " + row.address.subdistrict + ", " + row.address.district + ", " + row.address.city
        },
        {
            prop: "paymentMethod",
            title: "Metode Pembayaran",
            isFilterable: true,
            isSortable: true,
        },
        {
            prop: "updatedAt",
            title: "Updated At",
            isFilterable: true,
            isSortable: true,
            cell: (row) => new Date(row.updatedAt).toLocaleString()
        },
        {
            prop: "actions",
            title: "Aksi",
            cell: (row) => (
                <div>
                    <Button type="primary" size="small" onClick={() => showEditModal(row)}>
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                </div>
            )
        },
    ];

    const showEditModal = (row) => {
        setModalData(row);
        showModal();
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setLoading(true);
        try {
            const response = await fetch(`${config.api.orderService}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            const responseBody = await response.json();
            if (response.ok) {
                message.success('Status pesanan berhasil diperbarui');
            } else {
                message.error(`Gagal memperbarui pesanan: ${responseBody}`);
            }
            setLoading(false);
            setOpen(false);
            fetchData();
        } catch (error) {
            setLoading(false);
            console.error(error);
            message.error('Gagal memperbarui pesanan: ' + error);
        }
    };


    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                    <nav aria-label="breadcrumb" className="d-none d-md-inline-block">
                        <ol className="breadcrumb breadcrumb-dark breadcrumb-transparent">
                            <li className="breadcrumb-item"><Link to="/admin"><FontAwesomeIcon icon={faHouse} /></Link></li>
                            <li className="breadcrumb-item"><Link to="/admin/orders">Pesanan</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Daftar Pesanan</li>
                        </ol>
                    </nav>
                    <h2 className="h4">Daftar Pesanan</h2>
                    <p className="mb-0">Daftar pesanan hasil panen yang telah dibuat oleh pengguna.</p>
                </div>
            </div>
            <Datatable headers={headers} data={orders} />

            <Modal
                title="View Order"
                visible={open}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel} className="me-2" variant="outline-danger">
                        Tutup
                    </Button>,
                    ((modalData.status === 'PAID' && (
                        loading ? (
                            <Button key="markProcessed" type="primary" disabled>
                                <Spin />
                            </Button>
                        ) : (
                            <Button key="markProcessed" type="primary" onClick={() => updateOrderStatus(modalData.id, 'PROCESSED')}>
                                Tandai Sedang Diproses
                            </Button>
                        )
                    )) || (modalData.status === 'PROCESSED' && (
                        <Button key="markSent" type="primary" onClick={() => updateOrderStatus(modalData.id, 'SENT')}>
                            Tandai Sedang Dikirim
                        </Button>
                    ))
                    )
                ]}
            >
                <div>
                    <p>
                        <strong>Order ID:</strong> {modalData.id}
                    </p>
                    <p>
                        <strong>Nama Produk:</strong> {modalData.product?.name}
                    </p>
                    <p>
                        <strong>Jumlah:</strong> {modalData.amount}
                    </p>
                    <p>
                        <strong>Status:</strong> {modalData.status}
                    </p>
                    <p>
                        <strong>Pemesan:</strong> {modalData.user?.name} ({modalData.user?.email})
                    </p>
                    {
                        modalData.status === 'PAID' && (
                            <>
                                <p>
                                    <strong>Metode Pembayaran:</strong> {modalData.paymentMethod}
                                </p>
                                <p>
                                    <strong>Jumlah Dibayar:</strong> {modalData.paymentAmount}
                                </p>
                            </>
                        )
                    }
                    <p>
                        <strong>Alamat Pengiriman:</strong>
                        <br />
                        {modalData.address?.name}<br />
                        {modalData.address?.phoneNumber}<br />
                        {modalData.address?.address}, {modalData.address?.subdistrict}, {modalData.address?.district}<br /> {modalData.address?.city} {modalData.address?.postalCode}
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default OrderList;
