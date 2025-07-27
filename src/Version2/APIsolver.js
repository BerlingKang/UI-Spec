import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://118.31.58.101:45500/',
    headers: { "Content-Type": "application/json" },
    method: "POST"
})

export const imageToSpec = (body) => {
    return apiClient.post('api/image_to_spec', body);
}

export const adjustSpecLayout = (body) =>{
    return apiClient.post('api/adjust_spec_layout', body);
}

export const textToSpec = (body) =>{
    return apiClient.post('api/text_to_spec', body);
}

export const editSpec = (body) => {
    return apiClient.post('api/edit_spec', body);
}

export const combineSpec = (body) => {
    return apiClient.post('/api/combine_spec', body);
}

export const generateCode = (body) => {
    return apiClient.post('/api/generate_code', body);
}
