import React, { useState, createContext } from "react";
import axios from "axios"
import Cookies from "js-cookie";
import config from '../config';
import { useHistory } from "react-router"
import { Spin, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";

export const OrdersContext = createContext();

export const OrdersProvider = props => {
    const [orders, setOrders] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(true)
    const [currentId, setCurrentId] = useState(null)
    const [loading, setLoading] = useState(false)
    const { confirm } = Modal;
    const api = config.api.orderService;
    let history = useHistory();

    const fetchData = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${api}/orders?include=user,product,address`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const orderData = await response.json();

            if (orderData) {
                setOrders(orderData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchDataById = async (id) => {
        const result = await axios.get(`${api}/orders/${id}`)

        let data = result.data
        setCurrentId(data.id)
    }

    const updateData = (inputData, id = null) => {
        const requestConfig = {
            headers: {
                Authorization: "Bearer " + Cookies.get('token'),
            },
        };

        axios.put(`${api}/orders/${id}`, inputData, requestConfig)
            .then((res) => {
                const data = res.data;
    
                const updatedOrders = orders.map((order) => {
                    if (order.id === id) {
                        return {
                            ...order,
                            status: data.orderStatus,
                        };
                    } else {
                        return order;
                    }
                });

                setOrders(updatedOrders);
                message.success("Order status updated successfully");
    
                history.push("/admin/orders");
                fetchData();
            })
            .catch((err) => {
                console.log(err);
                message.error("Failed to update order: " + err.response.data.message);
            });
    };

    const deleteData = (id) => {
        confirm({
            title: 'Are you sure you want to delete this order?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const response = await fetch(`${api}/orders/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: "Bearer " + Cookies.get('token'),
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        message.success('Successfully deleted order');
                        const newOrders = orders.filter(order => order.id !== id);
                        setOrders(newOrders);
                    } else {
                        const responseBody = await response.json();
                        message.error('Failed to delete order: ' + responseBody.message);
                    }
                } catch (error) {
                    console.error(error);
                    message.error('Failed to delete order: ' + error.message);
                }
            }
        });
    };

    return (
        <OrdersContext.Provider value={{
            orders, setOrders,
            currentId, setCurrentId,
            fetchStatus, setFetchStatus,
            loading, setLoading,

            fetchData,
            fetchDataById,
            updateData,
            deleteData
        }}>
            {props.children}
        </OrdersContext.Provider>
    );
};