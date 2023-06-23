import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { ProductsContext } from "../../../../Contexts/ProductsContext"
import {
    Form,
    Button,
    Row,
    Col,
    InputGroup,
    FormControl,
    Container,
    Card,
    Alert,
    Spinner,
} from 'react-bootstrap';

const ProductForm = () => {
    const {
        inputData, setInputData,
        currentId, setCurrentId,
        loading,
        imagePreview, setImagePreview,

        fetchDataById,
        submitData,
        updateData,
    } = useContext(ProductsContext)
    const [validated, setValidated] = useState(false);

    let { id } = useParams()

    useEffect(() => {
        if (id) {
            document.title = "Edit Product Data"
            fetchDataById(id)
        }
        else {
            document.title = "Add New Product"
            setInputData({
                name: "",
                description: "",
                price: 0,
                stock: 0,
                status: "AVAILABLE",
                preOrderEstimatedStock: 0,
                preOrderEstimatedDate: "",
                expiryPeriod: 1,
                image: null,
            })
        }
    }, [])

    const handleChange = (event) => {
        let name = event.target.name
        let value = event.target.value

        setInputData({ ...inputData, [name]: value })
    }

    const handleImage = (event) => {
        let name = event.target.name
        let value = event.target.files[0]
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(value);

        setInputData({ ...inputData, [name]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        } else {
            setValidated(true);

            if (currentId === null) {
                submitData();
            } else {
                updateData(currentId);
            }

            setCurrentId(null);
        }
    };

    return (
        <>
            <Container className="mb-3">
                <Row className="justify-content-md-center">
                    <Col md="12">
                        <Card className="text-center">
                            <Card.Header>
                                <h1>{currentId === null ? "Add New Product" : "Edit Product Data"}</h1>
                            </Card.Header>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit} encType="multipart/form-data">
                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicName">
                                            Nama Produk
                                        </Form.Label>
                                        <Col md="10">
                                            <Form.Control
                                                type="text"
                                                placeholder="Masukkan nama produk"
                                                name="name"
                                                value={inputData.name}
                                                onChange={handleChange}
                                                required
                                                minLength={3}
                                                maxLength={50}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Mohon masukkan nama produk (3-50 karakter).
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicDescription">Deskripsi</Form.Label>
                                        <Col md="10">
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Masukkan deskripsi"
                                                name="description"
                                                value={inputData.description}
                                                onChange={handleChange}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Masukkan deskripsi produk.
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicPrice">Harga</Form.Label>
                                        <Col md="10">
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>Rp</InputGroup.Text>
                                                <FormControl
                                                    type="number"
                                                    placeholder="Masukkan harga"
                                                    name="price"
                                                    value={inputData.price}
                                                    onChange={handleChange}
                                                    required
                                                    min={1000}
                                                    step={100}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Mohon masukkan harga produk (minimal Rp1000).
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3 align-items-center">
                                        <Col md={2}>
                                            <Form.Label htmlFor="formBasicStock">Stok</Form.Label>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Masukkan stok"
                                                name="stock"
                                                value={inputData.stock}
                                                onChange={handleChange}
                                                min={0}
                                                required
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Form.Label htmlFor="formBasicStatus">Status</Form.Label>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Select
                                                aria-label="Default select example"
                                                name="status"
                                                onChange={handleChange}
                                                value={inputData.status || ""}
                                                required
                                            >
                                                <option label="Pilih status" value="" disabled hidden></option>
                                                <option value="AVAILABLE">Tersedia</option>
                                                <option value="PREORDER">Pre-Order</option>
                                                <option value="NOT_AVAILABLE">Tidak Tersedia</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Mohon pilih status produk.
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicPreOrderEstimatedStock">Estimasi Stok Pre-order</Form.Label>
                                        <Col md={4}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Masukkan estimasi stok pre-order"
                                                name="preOrderEstimatedStock"
                                                value={inputData.preOrderEstimatedStock}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Form.Label column md="2" htmlFor="formBasicPreOrderEstimatedDate">Estimasi Tanggal Tersedia</Form.Label>
                                        <Col md={4}>
                                            <Form.Control
                                                type="date"
                                                placeholder="Masukkan estimasi tanggal tersedia"
                                                name="preOrderEstimatedDate"
                                                value={inputData.preOrderEstimatedDate}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicExpiryPeriod">Umur Simpan</Form.Label>
                                        <Col md={10}>
                                            <InputGroup className="mb-3" hasValidation>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Masukkan umur simpan"
                                                    name="expiryPeriod"
                                                    value={inputData.expiryPeriod}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Select
                                                    aria-label="Default select example"
                                                    name="expiryPeriodUnit"
                                                    onChange={handleChange}
                                                    value={inputData.expiryPeriodUnit || ""}
                                                    required
                                                >
                                                    <option label="Pilih satuan" value="" disabled hidden></option>
                                                    <option value="Hari">Hari</option>
                                                    <option value="Bulan">Bulan</option>
                                                    <option value="Tahun">Tahun</option>
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Mohon masukkan umur simpan produk.
                                                </Form.Control.Feedback>

                                            </InputGroup>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicImage">Gambar</Form.Label>
                                        <Col md="10">
                                            <Form.Control
                                                type="file"
                                                placeholder="Unggah gambar"
                                                name="image"
                                                onChange={handleImage}
                                                required={currentId === null}
                                            />
                                        </Col>
                                    </Row>

                                    {imagePreview && (
                                        <Row className="mb-3">
                                            <Col md="2">
                                                <Form.Label>Pratinjau Gambar:</Form.Label>
                                            </Col>
                                            <Col md="10">
                                                <img src={imagePreview} alt="Preview" style={{ maxWidth: "10rem" }} className="float-start" />
                                            </Col>
                                        </Row>
                                    )}

                                    <Button
                                        variant="primary"
                                        type="submit"
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
                                            "Submit"
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ProductForm