import React, { useState, createContext } from "react";
import axios from "axios"
import Cookies from "js-cookie";
import config from '../config';
import { useHistory } from "react-router"
import { Spin, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";

export const ProductsContext = createContext();

export const ProductsProvider = props => {
    const [products, setProducts] = useState([]);
    const [inputData, setInputData] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        status: "AVAILABLE",
        preOrderEstimatedStock: 0,
        preOrderEstimatedDate: "",
        expiryPeriod: 1,
        expiryPeriodUnit: "BULAN",
        image: null,
    })
    const [fetchStatus, setFetchStatus] = useState(true)
    const [currentId, setCurrentId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState("");
    const { confirm } = Modal;
    let history = useHistory();

    const fetchData = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${config.api.inventoryService}/products`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const productData = await response.json();

            if (productData) {
                setProducts(productData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchDataById = async (id) => {
        const result = await axios.get(`${config.api.inventoryService}/products/${id}`)

        let data = result.data
        setInputData({
            name: data.name,
            description: data.description,
            price: parseInt(data.price),
            stock: parseInt(data.stock),
            status: data.status,
            preOrderEstimatedStock: parseInt(data.preOrderEstimatedStock),
            preOrderEstimatedDate: data.preOrderEstimatedDate,
            expiryPeriod: parseInt(data.expiryPeriod),
            expiryPeriodUnit: data.expiryPeriodUnit,
        })
        setImagePreview(`${config.api.inventoryService}/images/${data.image}`)
        setCurrentId(data.id)
    }

    const handleFormSubmit = (id = null) => {
        setLoading(true);

        let preOrderEstimatedStock =
            (
                parseInt(inputData.preOrderEstimatedStock) === 0
                || inputData.preOrderEstimatedStock === ""
                || isNaN(parseInt(inputData.preOrderEstimatedStock))
            ) 
            && inputData.preOrderEstimatedDate === ""
                ? null
                : inputData.preOrderEstimatedStock;

        let preOrderEstimatedDate =
            inputData.preOrderEstimatedDate === ""
                ? null
                : inputData.preOrderEstimatedDate;

        const formData = new FormData();
        formData.append("name", inputData.name);
        formData.append("description", inputData.description);
        formData.append("price", inputData.price);
        formData.append("stock", inputData.stock);
        formData.append("status", inputData.status);
        if (preOrderEstimatedStock !== null && preOrderEstimatedDate !== null) {
            formData.append("preOrderEstimatedStock", preOrderEstimatedStock);
            formData.append("preOrderEstimatedDate", preOrderEstimatedDate);
        }
        formData.append("expiryPeriod", inputData.expiryPeriod);
        formData.append("expiryPeriodUnit", inputData.expiryPeriodUnit);
        if (inputData.image !== undefined) {
            formData.append("image", inputData.image)
        };

        const requestConfig = {
            headers: {
                Authorization: "Bearer " + Cookies.get('token'),
                "Content-Type": "multipart/form-data",
            },
        };

        const apiEndpoint = id
            ? `${config.api.inventoryService}/products/${id}`
            : `${config.api.inventoryService}/products`;

        const requestMethod = id ? axios.put : axios.post;

        requestMethod(apiEndpoint, formData, requestConfig)
            .then((res) => {
                const data = res.data;
                const preOrderEstimatedStock = data.preOrderEstimatedStock ? parseInt(data.preOrderEstimatedStock) : null;

                if (id) {
                    // Update existing product in the local state
                    const updatedProducts = products.map((product) => {
                        if (product.id === id) {
                            return {
                                ...product,
                                name: data.name,
                                description: data.description,
                                price: parseInt(data.price),
                                stock: parseInt(data.stock),
                                status: data.status,
                                preOrderEstimatedStock: preOrderEstimatedStock,
                                preOrderEstimatedDate: data.preOrderEstimatedDate,
                                expiryPeriod: parseInt(data.expiryPeriod),
                                expiryPeriodUnit: data.expiryPeriodUnit,
                            };
                        } else {
                            return product;
                        }
                    });

                    setProducts(updatedProducts);
                    message.success("Produk berhasil diperbarui");
                } else {
                    // Add new product to the local state
                    setProducts([
                        ...products,
                        {
                            id: data.id,
                            name: data.name,
                            description: data.description,
                            price: parseInt(data.price),
                            stock: parseInt(data.stock),
                            status: data.status,
                            preOrderEstimatedStock: preOrderEstimatedStock,
                            preOrderEstimatedDate: data.preOrderEstimatedDate,
                            expiryPeriod: parseInt(data.expiryPeriod),
                            expiryPeriodUnit: data.expiryPeriodUnit,
                        },
                    ]);
                    message.success("Produk berhasil ditambahkan");
                }

                history.push("/admin/products");
                setImagePreview("");
                setInputData({
                    name: "",
                    description: "",
                    price: 0,
                    stock: 0,
                    status: "AVAILABLE",
                    preOrderEstimatedStock: 0,
                    preOrderEstimatedDate: "",
                    expiryPeriod: 1,
                    expiryPeriodUnit: "BULAN",
                    image: null,
                });
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 400 && err.response.data.message === "No files were uploaded") {
                    message.error("Mohon unggah gambar produk");
                } else {
                    message.error("Gagal " + (id ? "memperbarui" : "menambahkan") + " produk: " + err.response.data.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const submitData = () => {
        handleFormSubmit()
    };

    const updateData = (id) => {
        handleFormSubmit(id)
    }

    const deleteData = (id) => {
        confirm({
            title: 'Apakah anda yakin akan menghapus produk ini?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const response = await fetch(`${config.api.inventoryService}/products/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: "Bearer " + Cookies.get('token'),
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        message.success('Berhasil menghapus produk');
                        const newProducts = products.filter(product => product.id !== id);
                        setProducts(newProducts);
                    } else {
                        const responseBody = await response.json();
                        message.error('Gagal menghapus produk: ' + responseBody.message);
                    }
                } catch (error) {
                    console.error(error);
                    message.error('Gagal menghapus produk: ' + error.message);
                }
            }
        });
    };

    return (
        <ProductsContext.Provider value={{
            products, setProducts,
            inputData, setInputData,
            currentId, setCurrentId,
            fetchStatus, setFetchStatus,
            loading, setLoading,
            imagePreview, setImagePreview,

            fetchData,
            fetchDataById,
            submitData,
            updateData,
            deleteData
        }}>
            {props.children}
        </ProductsContext.Provider>
    );
};