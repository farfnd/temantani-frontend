import React, { useState, createContext } from "react";
import axios from "axios"
import Cookies from "js-cookie";

export const ProjectsContext = createContext();

export const ProjectsProvider = props => {
    const [projects, setProjects] = useState([]);
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
        const result = await axios.get(`https://backendexample.sanbersy.com/api/data-project`)

        setProjects(result.data.map(x => {
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
        const result = await axios.get(`https://backendexample.sanbersy.com/api/data-project/${id}`)

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
        axios.put(`https://backendexample.sanbersy.com/api/data-project/${id}`,
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
            let updatedProject = projects.find(el => el.id === currentId)

            updatedProject.name = inputData.name
            updatedProject.genre = inputData.genre
            updatedProject.image_url = inputData.image_url
            updatedProject.singlePlayer = inputData.singlePlayer
            updatedProject.multiplayer = inputData.multiplayer
            updatedProject.platform = inputData.platform
            updatedProject.release = parseInt(inputData.release)

            setProjects([...projects])
        })
    }

    return (
        <ProjectsContext.Provider value={{
            projects, setProjects,
            inputData, setInputData,
            currentId, setCurrentId,
            fetchStatus, setFetchStatus,

            fetchData,
            fetchDataById,
            updateData,
        }}>
            {props.children}
        </ProjectsContext.Provider>
    );
};