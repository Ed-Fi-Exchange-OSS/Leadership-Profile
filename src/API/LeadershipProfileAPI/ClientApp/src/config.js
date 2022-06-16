function config() {
    var getUrl = window.location;
    const API_URL = process.env.NODE_ENV === 'production' ? new URL(`${getUrl.protocol}//${getUrl.host}/`) : new URL('https://localhost:5001/');
    const API_CONFIG = (method, body=null) => { 
        return {
            method: method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
            referrerPolicy: 'origin-when-cross-origin',
            body: body
        }
    }

    const SCHOOL_HEADER = "Leadership Portal"
    return {API_URL, API_CONFIG, SCHOOL_HEADER}
}

export default config;