// src/services/reservationService.js
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL_RESERVA= apiUrl+'/reservas';
export const fetchReservations = (filters = {}) => {
    // Filtramos parámetros nulos, indefinidos o cadenas vacías
    const filteredParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value != null && value !== "")
    );

    // Si no hay filtros después de filtrar, usa solo la URL base
    if (Object.keys(filteredParams).length === 0) {
        return axios.get(API_URL_RESERVA);
    }
    
    // Si hay filtros, inclúyelos en la solicitud
    return axios.get(API_URL_RESERVA, { params: filteredParams });
};

export const fetchReservationById = (id) => {
    return axios.get(`${API_URL_RESERVA}/${id}`);
};

export const createReservation = (data) => {
    return axios.post(API_URL_RESERVA, data);
};

export const updateReservation = (id, data) => {
    return axios.put(`${API_URL_RESERVA}/${id}`, data);
};

export const deleteReservation = (id) => {
    return axios.delete(`${API_URL_RESERVA}/${id}`);
};

// Exporting the service object as default
const reservationService = { fetchReservationById, fetchReservations, createReservation, updateReservation, deleteReservation };
export default reservationService;
