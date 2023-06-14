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
  const [land, setLand] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {

  }, []);

  const { confirm } = Modal;

  // Create table headers consisting of 4 columns.
  const headers = [
    {
      prop: "name",
      title: "Name",
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
      prop: "email",
      title: "Email"
    },
    {
      prop: "button",
      title: "Action",
    }
  ];


  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);

      const response = await fetch(`${config.api.productService}/products/${id}`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      });
      const productData = await response.json();

      if (productData) {
        setProduct(productData);
        const landResponse = await fetch(`${config.api.landService}/lands/${productData.landId}`, {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + Cookies.get('token'),
            'Content-Type': 'application/json'
          }
        });
        const landData = await landResponse.json();
        setLand(landData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProduct(false);
    }
  };

  return (
    <>
      <Datatable data={availableWorkers} headers={headers} />
    </>
  );
};

export default ProductDetail;
