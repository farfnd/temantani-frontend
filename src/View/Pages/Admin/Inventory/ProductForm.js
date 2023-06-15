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
            <Container>
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
                                            Name
                                        </Form.Label>
                                        <Col md="10">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter name"
                                                name="name"
                                                value={inputData.name}
                                                onChange={handleChange}
                                                required
                                                minLength={3}
                                                maxLength={50}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a valid name (3-50 characters).
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicDescription">Description</Form.Label>
                                        <Col md="10">
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Enter description"
                                                name="description"
                                                value={inputData.description}
                                                onChange={handleChange}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a valid description.
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicPrice">Price</Form.Label>
                                        <Col md="10">
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>Rp</InputGroup.Text>
                                                <FormControl
                                                    type="number"
                                                    placeholder="Enter price"
                                                    name="price"
                                                    value={inputData.price}
                                                    onChange={handleChange}
                                                    required
                                                    min={1000}
                                                    step={100}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid price (minimum Rp1000).
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicStock">Stock</Form.Label>
                                        <Col md="10">
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter stock"
                                                name="stock"
                                                value={inputData.stock}
                                                onChange={handleChange}
                                                min={0}
                                                required
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicStatus">Status</Form.Label>
                                        <Col md="10">
                                            <Form.Select
                                                aria-label="Default select example"
                                                name="status"
                                                onChange={handleChange}
                                                defaultValue={inputData.status}
                                                required
                                            >
                                                <option value="AVAILABLE">Available</option>
                                                <option value="PREORDER">Pre-Order</option>
                                                <option value="NOT_AVAILABLE">Not Available</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select a valid status.
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicPreOrderEstimatedStock">Pre-Order Estimated Stock</Form.Label>
                                        <Col md="10">
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter pre-order estimated stock"
                                                name="preOrderEstimatedStock"
                                                value={inputData.preOrderEstimatedStock}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicPreOrderEstimatedDate">Pre-Order Estimated Date</Form.Label>
                                        <Col md="10">
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter pre-order estimated date"
                                                name="preOrderEstimatedDate"
                                                value={inputData.preOrderEstimatedDate}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Label column md="2" htmlFor="formBasicImage">Image</Form.Label>
                                        <Col md="10">
                                            <Form.Control
                                                type="file"
                                                placeholder="Enter image"
                                                name="image"
                                                onChange={handleImage}
                                                required={currentId === null}
                                            />
                                        </Col>
                                    </Row>

                                    {imagePreview && (
                                        <Row className="mb-3">
                                            <Col md="2">
                                                <Form.Label>Image Preview:</Form.Label>
                                            </Col>
                                            <Col md="10">
                                                <img src={imagePreview} alt="Preview" style={{ maxWidth: "10rem" }} className="float-start"/>
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