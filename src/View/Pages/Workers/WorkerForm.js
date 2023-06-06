import React, { useContext, useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { Typography, Button, Space, message, Input, Row, Col, Checkbox } from 'antd';
import { GamesContext } from "../../../Contexts/GamesContext"

const GamesForm = () => {

    const {
        games, setGames,
        inputData, setInputData,
        currentId, setCurrentId,
        fetchStatus, setFetchStatus,

        fetchData,
        fetchDataById,
        submitData,
        updateData,
        deleteData
    } = useContext(GamesContext)

    let history = useHistory();
    let { id } = useParams()

    useEffect(() => {
        if (!isNaN(id)) {
            document.title = "Edit Game Data"
            fetchDataById(id)
        }
        else {
            document.title = "Add New Game"
            setInputData({
                name: "",
                genre: "",
                image_url: "",
                singlePlayer: true,
                multiplayer: true,
                platform: "",
                release: 2000,
            })
        }
    }, [])

    const { Title } = Typography;

    const handleChange = (event) => {
        let name = event.target.name
        let value = event.target.value
        if (name === "singlePlayer" || name === "multiplayer") {
            value = event.target.checked
        }

        setInputData({ ...inputData, [name]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (currentId === null) {
            submitData()
        } else {
            updateData(currentId)
        }

        history.push("/games")

        if (currentId === null) {
            message.success('Successfully added data!');
        } else {
            message.success('Successfully updated data!');
        }

        setInputData({
            name: "",
            genre: "",
            image_url: "",
            singlePlayer: true,
            multiplayer: true,
            platform: "",
            release: 2000,
        })

        setCurrentId(null)
    }

    const { TextArea } = Input;

    return (
        <>
            <Title>Game Form</Title>
            <form onSubmit={handleSubmit} id="inputForm">
                <Row>
                    <Col span={4}>
                        <label>Name:</label>
                    </Col>
                    <Col span={20}>
                        <Input name="name" value={inputData.name} onChange={handleChange} required />
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
                        <label>Platform:</label>
                    </Col>
                    <Col span={20}>
                        <Input name="platform" value={inputData.platform} onChange={handleChange} required />
                    </Col>
                </Row>

                <Row>
                    <Col span={4}>
                        <label>Release Year:</label>
                    </Col>
                    <Col>
                        <Input type="number" name="release" value={inputData.release} onChange={handleChange} required min={2000} max={2021} />
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

                <Row>
                    <Col span={4}>
                        <label>Mode:</label>
                    </Col>
                    <Col span={20}>
                        <Checkbox name="singlePlayer" onChange={handleChange} checked={inputData.singlePlayer}>Single Player</Checkbox>
                        <br />
                        <Checkbox name="multiplayer" onChange={handleChange} checked={inputData.multiplayer}>Multi Player</Checkbox>
                    </Col>
                </Row>

                <Button type="primary" htmlType="submit" id="submitBtn">Submit</Button>
            </form>
        </>
    )
}

export default GamesForm