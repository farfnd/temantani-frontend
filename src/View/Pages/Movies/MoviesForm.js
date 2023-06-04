import React, { useContext, useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { Typography, Button, Space, message, Input, Row, Col, Checkbox } from 'antd';
import { MoviesContext } from "../../../Contexts/MoviesContext";

const MoviesForm = () => {

    const {
        movies, setMovies,
        inputData, setInputData,
        currentId, setCurrentId,
        fetchStatus, setFetchStatus,

        fetchData,
        fetchDataById,
        submitData,
        updateData,
        deleteData
    } = useContext(MoviesContext)

    let history = useHistory();
    let { id } = useParams()

    useEffect(() => {
        if (!isNaN(id)) {
            document.title = "Edit Movie Data"
            fetchDataById(id)
        }
        else {
            document.title = "Add New Movie"
            setInputData({
                title: "",
                genre: "",
                description: "",
                year: 1980,
                duration: 0,
                rating: 0,
                review: "",
                image_url: "",
            })
        }
    }, [])

    const { Title } = Typography;

    const handleChange = (event) => {
        let name = event.target.name
        let value = event.target.value

        setInputData({ ...inputData, [name]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (currentId === null) {
            submitData()
        } else {
            updateData(currentId)
        }

        history.push("/movies")

        if (currentId === null) {
            message.success('Successfully added data!');
        } else {
            message.success('Successfully updated data!');
        }

        setInputData({
            title: "",
            genre: "",
            description: "",
            year: 1980,
            duration: 0,
            rating: 0,
            review: "",
            image_url: "",
        })

        setCurrentId(null)
    }

    const { TextArea } = Input;

    return (
        <>
            <Title>Movie Form</Title>
            <form onSubmit={handleSubmit} id="inputForm">
                <Row>
                    <Col span={4}>
                        <label>Title:</label>
                    </Col>
                    <Col span={20}>
                        <Input name="title" value={inputData.title} onChange={handleChange} required />
                    </Col>
                </Row>

                <Row>
                    <Col span={4}>
                        <label>Release Year:</label>
                    </Col>
                    <Col>
                        <Input type="number" name="year" value={inputData.year} onChange={handleChange} required min={1980} max={2021} />
                    </Col>
                </Row>

                <Row>
                    <Col span={4}>
                        <label>Duration:</label>
                    </Col>
                    <Col>
                        <Input type="number" name="duration" value={inputData.duration} onChange={handleChange} required min={0} />
                    </Col>
                </Row>

                <Row>
                    <Col span={4}>
                        <label>Genre:</label>
                    </Col>
                    <Col span={20}>
                        <Input name="genre" value={inputData.genre} onChange={handleChange} required />
                    </Col>
                </Row>

                <Row>
                    <Col span={4}>
                        <label>Description:</label>
                    </Col>
                    <Col span={20}>
                        <Input.TextArea name="description" value={inputData.description} onChange={handleChange} required />
                    </Col>
                </Row>

                <Row>
                    <Col span={4}>
                        <label>Rating:</label>
                    </Col>
                    <Col>
                        <Input type="number" name="rating" value={inputData.rating} onChange={handleChange} required min={0} max={10} />
                    </Col>
                </Row>

                <Row>
                    <Col span={4}>
                        <label>Review:</label>
                    </Col>
                    <Col span={20}>
                        <Input.TextArea name="review" value={inputData.review} onChange={handleChange} required />
                    </Col>
                </Row>

                <Row>
                    <Col span={4}>
                        <label>Image URL:</label>
                    </Col>
                    <Col span={20}>
                        <Input name="image_url" value={inputData.image_url} onChange={handleChange} required />
                    </Col>
                </Row>

                <Button type="primary" htmlType="submit" id="submitBtn">Submit</Button>
            </form>
        </>
    )
}

export default MoviesForm