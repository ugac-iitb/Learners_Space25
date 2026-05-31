const configuredBaseURL = process.env.REACT_APP_baseURL || process.env.REACT_APP_BASE_URL;

const baseURL = configuredBaseURL || 'http://127.0.0.1:8000/';

export default baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
