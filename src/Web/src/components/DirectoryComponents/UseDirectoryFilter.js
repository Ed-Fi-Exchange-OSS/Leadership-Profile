import React, {useState, useEffect} from "react";
import config from '../../config';

function UseDirectoryFilters () {
    const { API_URL, API_CONFIG } = config();
    const [positions, setPositions] = useState([]);

    async function GetPositions(){
        let unmounted = false;
        const apiUrl = new URL(API_URL + `webcontrols/dropdownlist/assignments`);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                var newResponse = [];
                response.assignments.forEach(element => {
                    newResponse.push({
                        "text": element.text,
                        "value": element.value,
                        "checked": false
                    })
                });
                setPositions(newResponse);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    useEffect(() => {
        GetPositions();
    }, [])

    return {positions, setPositions};
}

export default UseDirectoryFilters;