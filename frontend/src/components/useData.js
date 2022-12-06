import { useState, useEffect } from 'react';

const jsonURL = 'https://data.cdc.gov/resource/pbkm-d27e.json';

//using this hook to get the data
export const useData =  () => {
    const [data, setData] = useState([]);    
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(jsonURL);
            const jsonResponse = await response.json(); 
            setData(jsonResponse);
        }

        fetchData(); 
    }, []);
    return data; 
}