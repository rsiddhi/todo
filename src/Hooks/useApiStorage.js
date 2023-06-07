import { useState, useEffect } from 'react';
import axios from 'axios';

function useApiStorage(key, apiLink) {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://10.76.242.200:8000';

    const [value, setValue] = useState(()=>{
        console.log('get data...');
        const item = localStorage.getItem(key);
        if (item)
            return JSON.parse(item);

        return [];
    });

    useEffect(() => {
        if (value === []) {
            axios.get(apiLink).then(response => {
                console.log(response);
                let initialArr = response.data;
                initialArr = initialArr.map(v => ({...v, isEditing: false}));
                setValue(initialArr);
                localStorage.setItem(key, JSON.stringify(value));
            }).catch(function (error) {
                alert(error.response.data.message);
            });
        }

        localStorage.setItem(key, JSON.stringify(value));
    }, [key,value]);

    return [value, setValue];
}

export default useApiStorage;