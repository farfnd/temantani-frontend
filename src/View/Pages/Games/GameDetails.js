import React, { useContext, useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { Typography, Button, Space, message, Input, Row, Col, Checkbox, Image } from 'antd';
import { GamesContext } from "../../../Contexts/GamesContext";

const GameDetails = () => {

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
        document.title = 'Game Detail'
        if (!isNaN(id)) fetchDataById(id)
    }, [])

    const { Title } = Typography;
    const { TextArea } = Input;

    return (
        <>
            <Row gutter={16}>
                <Col span={6}>
                    <Image src={inputData.image_url} className="details-image" alt={inputData.name + " Picture"} />
                </Col>
                <Col span={18} className="details">
                    <Title style={{ textAlign: "left", marginBottom: 0 }}>{inputData.name}</Title>
                    <hr/>
                    <Title level={4}><strong>Release Year:</strong>&nbsp;{inputData.release}</Title>
                    <Title level={4}><strong>Genre:</strong>&nbsp;{inputData.genre}</Title>
                    <Title level={4}><strong>Platform:</strong>&nbsp;{inputData.platform}</Title>
                    <Title level={4}><strong>Mode:</strong>&nbsp;{inputData.singlePlayer ? (inputData.multiplayer ? `Single Player, Multi Player` : 'Single Player') : (inputData.multiplayer ? 'Multi Player' : '')}</Title>
                </Col>
            </Row>
        </>
    )
}

export default GameDetails