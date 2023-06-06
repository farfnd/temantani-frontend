import React, { useState, createContext } from "react";
import axios from "axios"
import Cookies from "js-cookie";

export const WorkersContext = createContext();

export const WorkersProvider = props => {
    const [workers, setWorkers] = useState([]);
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
        const result = await axios.get(`https://backendexample.sanbersy.com/api/data-worker`)

        setWorkers(result.data.map(x => {
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
        const result = await axios.get(`https://backendexample.sanbersy.com/api/data-worker/${id}`)

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

    const updateData = (id) => {
        axios.put(`https://backendexample.sanbersy.com/api/data-worker/${id}`,
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
            let updatedWorker = workers.find(el => el.id === currentId)

            updatedWorker.name = inputData.name
            updatedWorker.genre = inputData.genre
            updatedWorker.image_url = inputData.image_url
            updatedWorker.singlePlayer = inputData.singlePlayer
            updatedWorker.multiplayer = inputData.multiplayer
            updatedWorker.platform = inputData.platform
            updatedWorker.release = parseInt(inputData.release)

            setWorkers([...workers])
        })
    }

    return (
        <WorkersContext.Provider value={{
            workers, setWorkers,
            inputData, setInputData,
            currentId, setCurrentId,
            fetchStatus, setFetchStatus,

            fetchData,
            fetchDataById,
            updateData,
        }}>
            {props.children}
        </WorkersContext.Provider>
    );
};