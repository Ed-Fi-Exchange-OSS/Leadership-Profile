function config() {
    const API_URL = process.env.NODE_ENV !== 'production' ? new URL('https://localhost:5100/api') : new URL('https://localhost:5100/api');
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

    return {API_URL, API_CONFIG}
}

export default config;