import React, { useEffect, useState, useContext } from "react"
import { MoviesContext } from "../../Contexts/MoviesContext";
import { GamesContext } from "../../Contexts/GamesContext"
import { Typography } from 'antd';
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo.png"
import Button from 'react-bootstrap/Button';


const Home = () => {
    const {
        games,
        fetchData: fetchGameData
    } = useContext(GamesContext)

    const {
        movies,
        fetchData: fetchMovieData
    } = useContext(MoviesContext)

    useEffect(() => {
        document.title = 'Home'
        fetchGameData()
        fetchMovieData()
    }, [])

    const { Title, Text } = Typography;

    return (
        <>
            <div className="d-grid gap-2 mb-3">
                <Link to="/login">
                    <Button variant="success" className="w-100">Masuk</Button>{' '}
                </Link>
            </div>

            <div className="d-grid gap-2">
                <Link to="/register">
                    <Button variant="outline-success" className="w-100">Daftar</Button>{' '}
                </Link>
            </div>
        </>
    )
}

export default Home