import React, { useContext, useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { Typography, Button, Space, message, Input, Row, Col, Checkbox, Image } from 'antd';
import { MoviesContext } from "../../../Contexts/MoviesContext";

const MovieDetails = () => {

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
        document.title = 'Movie Detail'

        if (!isNaN(id)) fetchDataById(id)
    }, [])

    const { Title } = Typography;
    const { TextArea } = Input;

    return (
        <>
            <Row gutter={16}>
                <Col span={6}>
                    <Image src={inputData.image_url} className="details-image" alt={inputData.title + " Picture"} />
                </Col>
                <Col span={18} className="details">
                    <Title style={{ textAlign: "left", marginBottom: 0 }}>{inputData.title}</Title>
                    <hr/>
                    <Title level={4}><strong>Release Year:</strong>&nbsp;{inputData.year}</Title>
                    <Title level={4}><strong>Duration:</strong>&nbsp;{inputData.duration} minutes</Title>
                    <Title level={4}><strong>Genre:</strong>&nbsp;{inputData.genre}</Title>
                    <Title level={4}><strong>Description:</strong><br/>{inputData.description}</Title>
                    <Title level={4}><strong>Rating:</strong>&nbsp;{inputData.rating}/10</Title>
                    <Title level={4}><strong>Review:</strong><br/>{inputData.description}</Title>
                </Col>
            </Row>
        </>
    )
}

export default MovieDetails