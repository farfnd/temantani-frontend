import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';
import config from '../../../../config';
import Cookies from 'js-cookie';
import { Spin, message, Modal } from 'antd';
import Datatable from '../../../Components/Datatable';
import { ProductsContext } from "../../../../Contexts/ProductsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const ProductList = () => {
    const {
        products, setProducts,
        inputData, setInputData,
        currentId, setCurrentId,
        fetchStatus, setFetchStatus,
        loading, setLoading,

        fetchData,
        fetchDataById,
        submitData,
        updateData,
        deleteData
    } = useContext(ProductsContext)

    useEffect(() => {
        fetchData()
    }, []);

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
                        src={row.image ? `${config.api.inventoryService}/images/${row.image}` : "https://via.placeholder.com/50"}
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
        {
            prop: "status",
            title: 'Aksi',
            cell: (row) => (
                <div>
                    <Link to={`/admin/products/${row.id}/edit`} className="btn btn-primary btn-sm me-2">Edit</Link>
                    <Button variant="danger" size="sm" onClick={() => deleteData(row.id)}>Delete</Button>
                </div>
            )
        },
    ];

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                    <nav aria-label="breadcrumb" className="d-none d-md-inline-block">
                        <ol className="breadcrumb breadcrumb-dark breadcrumb-transparent">
                            <li className="breadcrumb-item"><Link to="/admin"><FontAwesomeIcon icon={faHouse}/></Link></li>
                            <li className="breadcrumb-item"><Link to="/admin/inventory">Inventaris Hasil Panen</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Daftar Produk</li>
                        </ol>
                    </nav>
                    <h2 className="h4">Daftar Produk</h2>
                    <p className="mb-0">Daftar produk yang tersedia di Inventaris Hasil Panen.</p>
                </div>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <Link to="/admin/products/create" className="btn btn-primary">Tambah Produk</Link>
                </div>
            </div>
            <Datatable headers={headers} data={products} />
        </>
    );
};

export default ProductList;
