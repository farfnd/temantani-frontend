import React, { useState, createContext } from "react";
import axios from "axios"
import Cookies from "js-cookie";

export const GamesContext = createContext();

export const GamesProvider = props => {
    const [games, setGames] = useState([]);
    const [inputData, setInputData] = useState({
        name: "",
        genre: "",
        image_url: "",
        singlePlayer: true,
        multiplayer: true,
        platform: "",
        release: 2000,
    })
    const [fetchStatus, setFetchStatus] = useState(true)
    const [currentId, setCurrentId] = useState(null)

    const fetchData = async () => {
        const result = await axios.get(`https://backendexample.sanbersy.com/api/data-game`)

        setGames(result.data.map(x => {
            return {
                id: x.id,
                name: x.name,
                genre: x.genre,
                image_url: x.image_url,
                singlePlayer: x.singlePlayer,
                multiplayer: x.multiplayer,
                platform: x.platform,
                release: parseInt(x.release),
            }
        }))
    }

    const fetchDataById = async (id) => {
        const result = await axios.get(`https://backendexample.sanbersy.com/api/data-game/${id}`)

        let data = result.data
        setInputData({
            name: data.name,
            genre: data.genre,
            image_url: data.image_url,
            singlePlayer: data.singlePlayer,
            multiplayer: data.multiplayer,
            platform: data.platform,
            release: data.release,
        })
        setCurrentId(data.id)
    }

    const submitData = () => {
        axios.post(`https://backendexample.sanbersy.com/api/data-game`,
        {
            name: inputData.name,
            genre: inputData.genre,
            image_url: inputData.image_url,
            singlePlayer: inputData.singlePlayer,
            multiplayer: inputData.multiplayer,
            platform: inputData.platform,
            release: inputData.release,
        }, 
        {
            headers: {
                "Authorization" : "Bearer "+ Cookies.get('token')
            }
        }).then(res => {
            let data = res.data
            setGames([...games, {
                id: data.id,
                name: data.name,
                genre: data.genre,
                image_url: data.image_url,
                singlePlayer: data.singlePlayer,
                multiplayer: data.multiplayer,
                platform: data.platform,
                release: parseInt(data.release),
            }])
        })
    }

    const updateData = (id) => {
        axios.put(`https://backendexample.sanbersy.com/api/data-game/${id}`,
        {
            name: inputData.name,
            genre: inputData.genre,
            image_url: inputData.image_url,
            singlePlayer: inputData.singlePlayer,
            multiplayer: inputData.multiplayer,
            platform: inputData.platform,
            release: inputData.release,
        }, 
        {
            headers: {
                "Authorization" : "Bearer "+ Cookies.get('token')
            }
        }).then(() => {
            let updatedGame = games.find(el => el.id === currentId)

            updatedGame.name = inputData.name
            updatedGame.genre = inputData.genre
            updatedGame.image_url = inputData.image_url
            updatedGame.singlePlayer = inputData.singlePlayer
            updatedGame.multiplayer = inputData.multiplayer
            updatedGame.platform = inputData.platform
            updatedGame.release = parseInt(inputData.release)

            setGames([...games])
        })
    }

    const deleteData = (id) => {
        axios.delete(`https://backendexample.sanbersy.com/api/data-game/${id}`,
        {
            headers: {
                "Authorization" : "Bearer "+ Cookies.get('token')
            }
        }).then(() => {
            let newGames = games.filter(el => { return el.id !== id })
            setGames(newGames)
        })
    }

    return (
        <GamesContext.Provider value={{
            games, setGames,
            inputData, setInputData,
            currentId, setCurrentId,
            fetchStatus, setFetchStatus,

            fetchData,
            fetchDataById,
            submitData,
            updateData,
            deleteData
        }}>
            {props.children}
        </GamesContext.Provider>
    );
};