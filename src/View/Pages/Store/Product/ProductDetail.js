import RelatedProduct from "../../../Components/Store/Product/RelatedProduct";
import { Link } from "react-router-dom";
import ScrollToTopOnMount from "../../../Components/Store/ScrollToTopOnMount";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import config from "../../../../config";
import { Image, message } from "antd";
import { Badge, Breadcrumb, BreadcrumbItem, Button, Col, Container, Form, InputGroup, Modal, Nav, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import StockBadge from "../../../Components/Store/StockBadge";
import Cookies from "js-cookie";

const iconPath =
  "M18.571 7.221c0 0.201-0.145 0.391-0.29 0.536l-4.051 3.951 0.96 5.58c0.011 0.078 0.011 0.145 0.011 0.223 0 0.29-0.134 0.558-0.458 0.558-0.156 0-0.313-0.056-0.446-0.134l-5.011-2.634-5.011 2.634c-0.145 0.078-0.29 0.134-0.446 0.134-0.324 0-0.469-0.268-0.469-0.558 0-0.078 0.011-0.145 0.022-0.223l0.96-5.58-4.063-3.951c-0.134-0.145-0.279-0.335-0.279-0.536 0-0.335 0.346-0.469 0.625-0.513l5.603-0.815 2.511-5.078c0.1-0.212 0.29-0.458 0.547-0.458s0.446 0.246 0.547 0.458l2.511 5.078 5.603 0.815c0.268 0.045 0.625 0.179 0.625 0.513z";

function ProductDetail() {
  let { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(1);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.api.inventoryService}/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error(error);
      message.error('Error fetching product');
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpenModal = async (row) => {
    await fetchAddresses();
    setShowModal(true)
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getStatusVariant = (status) => {
    return status === 'AVAILABLE'
      ? 'success'
      : status === 'NOT_AVAILABLE'
        ? 'danger'
        : status === 'PREORDER'
          ? 'warning'
          : 'outline-secondary';
  }

  const image = product && product.image ? `${config.api.inventoryService}/images/${product.image}` : "https://via.placeholder.com/300x240?text=No+Image";

  return (
    <Container className="mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />

      <nav aria-label="breadcrumb" className="bg-custom-light rounded">
        <ol className="breadcrumb p-3">
          <li className="breadcrumb-item">
            <Link
              className="text-decoration-none"
              to="/store"
              replace
            >
              <FontAwesomeIcon icon={faHouse} />
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/store/products">
              Daftar Produk
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product ? product.name : ""}
          </li>
        </ol>
      </nav>

      <Row className="row mb-4">
        {
          loading || !product ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <Col lg={6}>
                <div className="row">
                  <div className="col-12 mb-4">
                    <Image wrapperClassName="w-100" className="border rounded" alt="" src={image} />
                  </div>
                </div>


                {/* <div className="row mt-2">
      <div className="col-12">
        <div
          className="d-flex flex-nowrap"
          style={{ overflowX: "scroll" }}
        >
          {Array.from({ length: 8 }, (_, i) => {
            return (
              <a key={i} href="!#">
                <img
                  className="cover rounded mb-2 me-2"
                  width="70"
                  height="70"
                  alt=""
                  src={Image}
                />
              </a>
            );
          })}
        </div>
      </div>
    </div> */}

              </Col>
              <Col lg={6}>
                <div className="d-flex flex-column h-100">
                  <h2 className="mb-1">{product ? product.name : "N/A"}</h2>
                  <h4 className="text-muted mb-4">
                    Rp{product ? parseInt(product.price).toLocaleString('id-id') : "N/A"}
                    <small className="text-muted">/kg</small>
                  </h4>

                  <div className="row g-3 mb-4">
                    {/* <Col>
                      <button className="btn btn-outline-dark py-2 w-100">
                        Add to cart
                      </button>
                    </div> */}
                    <Col>
                      <Button variant="success" className="py-2 w-100" onClick={handleOpenModal}>
                        Beli
                      </Button>
                    </Col>
                  </div>

                  <h4 className="mb-0">Informasi Produk</h4>
                  <hr />
                  <dl className="row">
                    <dt className="col-sm-4">Status</dt>
                    <dd className="col-sm-8 mb-3">
                      <Badge bg={getStatusVariant(product.status)}>
                        {product.status}
                      </Badge>
                    </dd>
                    {
                      product.status === 'AVAILABLE' && (
                        <>
                          <dt className="col-sm-4">Stok</dt>
                          <dd className="col-sm-8 mb-3">{product.stock} kg</dd>
                        </>
                      )
                    }
                    {
                      product.status === 'PREORDER' && (
                        <>
                          <dt className="col-sm-4">Estimasi Tanggal Ketersediaan</dt>
                          <dd className="col-sm-8 mb-3">{product.preOrderEstimationDate}</dd>

                          <dt className="col-sm-4">Estimasi Stok Tersedia</dt>
                          <dd className="col-sm-8 mb-3">{product.preOrderEstimationStock}</dd>
                        </>
                      )
                    }
                    <dt className="col-sm-4">Umur Simpan</dt>
                    <dd className="col-sm-8 mb-3">{product.expiryPeriod ?? 1} {product.expiryPeriodUnit ?? "Bulan"}</dd>
                  </dl>

                  <h4 className="mb-0">Deskripsi</h4>
                  <hr />
                  <p className="lead flex-shrink-0">
                    <small>
                      {product ? product.description : "N/A"}
                    </small>
                  </p>
                </div>
              </Col>
            </>
          )
        }
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Beli Produk
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nama Produk</Form.Label>
              <h5>{product ? product.name : "N/A"}</h5>
            </Form.Group>

            <Form.Label>Jumlah</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                placeholder="Jumlah"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
                max={product ? product.stock : 1}
              />
              <InputGroup.Text>kg</InputGroup.Text>
            </InputGroup>

            {
              addresses && addresses.length > 0 ? (
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Alamat Pengiriman</Form.Label>
                  <Form.Select
                    defaultValue={selectedAddress ?? ""}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  >
                    <option label="Pilih alamat" value="" disabled hidden></option>
                    {addresses.map((address, index) => (
                      <option key={index} value={address.id}>
                        {`${address.name} (${address.phoneNumber})\n${address.address}, ${address.subdistrict}, ${address.district}, ${address.city}, ${address.postalCode}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Batal
          </Button>
          <Link
            to={{
              pathname: "/store/checkout",
              state: {
                product: product,
                amount: amount,
                address: addresses.find(address => address.id === selectedAddress)
              }
            }}
          >
            <Button variant="primary">
              Beli
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default ProductDetail;
