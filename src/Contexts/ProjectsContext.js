import React, { useState, createContext } from "react";
import axios from "axios"
import Cookies from "js-cookie";
import config from "../config";

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
        const result = await axios.get(`${config.api.projectService}/projects`)

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
        const result = await axios.get(`${config.api.projectService}/projects/${id}`)

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


    return (
        <ProjectsContext.Provider value={{
            projects, setProjects,
            inputData, setInputData,
            currentId, setCurrentId,
            fetchStatus, setFetchStatus,

            fetchData,
            fetchDataById,
        }}>
            {props.children}
        </ProjectsContext.Provider>
    );
};