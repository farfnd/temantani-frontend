import React, { useState, createContext } from "react";
import axios from "axios"
import Cookies from "js-cookie";

export const MoviesContext = createContext();

export const MoviesProvider = props => {
    const [movies, setMovies] = useState([]);
    const [inputData, setInputData] = useState({
        title: "",
        genre: "",
        description: "",
        year: 1980,
        duration: 0,
        rating: 0,
        review: "",
        image_url: "",
    })
    const [fetchStatus, setFetchStatus] = useState(true)
    const [currentId, setCurrentId] = useState(null)

    const fetchData = async () => {
        const result = await axios.get(`https://backendexample.sanbersy.com/api/data-movie`)

        setMovies(result.data.map(x => {
            return {
                id: x.id,
                title: x.title,
                genre: x.genre,
                description: x.description,
                year: parseInt(x.year),
                duration: parseInt(x.duration),
                rating: parseInt(x.rating),
                review: x.review,
                image_url: x.image_url,
            }
        }))
    }

    const fetchDataById = async (id) => {
        const result = await axios.get(`https://backendexample.sanbersy.com/api/data-movie/${id}`)

        let data = result.data
        setInputData({
            title: data.title,
            genre: data.genre,
            description: data.description,
            year: data.year,
            duration: data.duration,
            rating: data.rating,
            review: data.review,
            image_url: data.image_url,
        })
        setCurrentId(data.id)
    }

    const submitData = () => {
        axios.post(`https://backendexample.sanbersy.com/api/data-movie`,
            {
                title: inputData.title,
                genre: inputData.genre,
                description: inputData.description,
                year: inputData.year,
                duration: inputData.duration,
                rating: inputData.rating,
                review: inputData.review,
                image_url: inputData.image_url,
            },
            {
                headers: {
                    "Authorization": "Bearer " + Cookies.get('token')
                }
            }).then(res => {
                let data = res.data
                setMovies([...movies, {
                    id: data.id,
                    title: data.title,
                    genre: data.genre,
                    description: data.description,
                    year: parseInt(data.year),
                    duration: parseInt(data.duration),
                    rating: parseInt(data.rating),
                    review: data.review,
                    image_url: data.image_url,
                }])
            })
    }

    const updateData = (id) => {
        axios.put(`https://backendexample.sanbersy.com/api/data-movie/${id}`,
            {
                title: inputData.title,
                genre: inputData.genre,
                description: inputData.description,
                year: inputData.year,
                duration: inputData.duration,
                rating: inputData.rating,
                review: inputData.review,
                image_url: inputData.image_url,
            },
            {
                headers: {
                    "Authorization": "Bearer " + Cookies.get('token')
                }
            }).then(() => {
                let updatedMovie = movies.find(el => el.id === currentId)
                
                updatedMovie.title = inputData.title
                updatedMovie.genre = inputData.genre
                updatedMovie.description = inputData.description
                updatedMovie.year = parseInt(inputData.year)
                updatedMovie.duration = parseInt(inputData.duration)
                updatedMovie.rating = parseInt(inputData.rating)
                updatedMovie.review = inputData.review
                updatedMovie.image_url = inputData.image_url

                setMovies([...movies])
            })
    }

    const deleteData = (id) => {
        axios.delete(`https://backendexample.sanbersy.com/api/data-movie/${id}`,
            {
                headers: {
                    "Authorization": "Bearer " + Cookies.get('token')
                }
            }).then(() => {
                let newMovies = movies.filter(el => { return el.id !== id })
                setMovies(newMovies)
            })
    }

    return (
        <MoviesContext.Provider value={{
            movies, setMovies,
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
        </MoviesContext.Provider>
    );
};