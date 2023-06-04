import React, { useContext } from "react"
import { UserContext } from "../../Contexts/UserContext";
import { Layout, Menu } from 'antd';
import {PlusCircleOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo.png"
import { GamesContext } from "../../Contexts/GamesContext";
import { MoviesContext } from "../../Contexts/MoviesContext";

const Sidebar = () => {

    const { setLoginStatus, collapsed, setCollapsed } = useContext(UserContext)
    const {
        inputData: inputGame,
        setInputData: setInputGame,
        setCurrentId: setCurrentGameId
    } = useContext(GamesContext)

    const {
        inputData: inputMovie,
        setInputData: setInputMovie,
        setCurrentId: setCurrentMovieId
    } = useContext(MoviesContext)

    const { Sider } = Layout;

    const handleCreateGame = () => {
        setInputGame({
            name: "",
            genre: "",
            image_url: "",
            singlePlayer: true,
            multiplayer: true,
            platform: "",
            release: 2000,
        })
        setCurrentGameId(null)
    }
    
    const handleCreateMovie = () => {
        setInputMovie({
            title: "",
            genre: "",
            description: "",
            year: 1980,
            duration: 0,
            rating: 0,
            review: "",
            image_url: "",
        })
        setCurrentMovieId(null)
    }

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <Menu theme="dark" mode="inline">
                <Menu.Item key="0" style={{backgroundColor: "white", textAlign:"center"}} >
                    <Link to="/" className="logo">
                        <img src={Logo} width="150" alt="logo"/>
                    </Link>
                </Menu.Item>
                <Menu.Item key="1" icon={<PlusCircleOutlined />} onClick={() => { handleCreateMovie(); document.title="Add New Movie" }}>
                <Link to="/movies/create">
                        Add New Movie Data
                    </Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<PlusCircleOutlined/>} onClick={() => { handleCreateGame(); document.title="Add New Game" }}>
                    <Link to="/games/create">
                        Add New Game Data
                    </Link>
                </Menu.Item>
            </Menu>
        </Sider>
    )

}

export default Sidebar