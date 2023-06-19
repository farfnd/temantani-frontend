import Cookies from "js-cookie";
import React, { useState, createContext } from "react";
import jwt_decode from 'jwt-decode'
import config from "../config";

export const WorkOfferContext = createContext();

export const WorkOfferProvider = props => {
    const [workOffer, setWorkOffer] = useState({});

    const fetchWorkOffer = async () => {
        try {
            const response = await fetch(`${config.api.workerService}/worker/work-offers`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setWorkOffer(data);
        } catch (error) {
            console.error('Error fetching workOffer data:', error);
        }
    };

    const fetchWorkOfferIfEmpty = async () => {
        if (Object.keys(workOffer).length === 0 && workOffer.constructor === Object) {
            await fetchWorkOffer();
        }
    };

    return (
        <WorkOfferContext.Provider value={{
            workOffer, setWorkOffer,
            fetchWorkOffer, fetchWorkOfferIfEmpty
        }}>
            {props.children}
        </WorkOfferContext.Provider>
    );
};
