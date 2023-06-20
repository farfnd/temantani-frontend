import { LeftCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';
import config from '../../../../../config';
import Cookies from 'js-cookie';
import { Spin, message, Modal } from 'antd';
import Datatable from '../../../../Components/Datatable';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            setLoadingProduct(true);

            const response = await fetch(`${config.api.inventoryService}/products`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const productData = await response.json();

            if (productData) {
                setProduct(productData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingProduct(false);
        }
    };

    // Create table headers consisting of 4 columns.
    const headers = [
        {
            prop: "name",
            title: "Nama Produk",
            isFilterable: true,
            isSortable: true,
            cell: (row) => (
                <div>
                    <img
                        src="https://placehold.co/50x50"
                        alt="Placeholder"
                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    {row.name}
                </div>
            )
        },
        {
            prop: "description",
            title: "Deskripsi",
            isFilterable: true,
            isSortable: true,
        },
        {
            prop: "price",
            title: "Harga",
            isFilterable: true,
            isSortable: true,
        },
        {
            prop: "stock",
            title: "Stok",
            isFilterable: true,
            isSortable: true,
        },
    ];

    return (
        <>
            {
                loadingProduct ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
                      <Datatable data={product} headers={headers} />
                    </>
                )
            }
        </>
    );
};

export default ProductDetail;
