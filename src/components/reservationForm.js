import React, { useState, useEffect } from 'react';
import { createReservation, updateReservation } from '../services/reservationService';
import { getMesas } from '../services/mesaService';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReservationForm = ({ existingReservation, onSuccess }) => {
    const [reservation, setReservation] = useState(existingReservation || {
        nombre: '',
        tiempoYHora: '',
        numeroDePersonas: 1,
        mesa: null,
        activa: true,
    });
    const [mesas, setMesas] = useState([]);

    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const mesasData = await getMesas();
                setMesas(mesasData);
            } catch (error) {
                console.error('Failed to fetch mesas:', error);
            }
        };
        fetchMesas();
    }, []);
    const navigate = useNavigate('ver-reservas')
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (existingReservation) {
                await updateReservation(existingReservation.id, reservation);
            } else {
                await createReservation(reservation);
            }
            onSuccess();

        } catch (error) {
            console.error('Failed to save reservation:', error);
        }
        navigate('/ver-reservas')
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservation({ ...reservation, [name]: value });
    };

    const handleChangeSelect = (e) => {
        setReservation({ ...reservation, mesa: { id: e.target.value } });
        
    };

    return (
        <>
        <Typography variant="h4" gutterBottom textAlign="center">
                {existingReservation ? "Modificar Reserva":"Crear reserva" }
            </Typography>
        <Box sx={{
            width: '100%', maxWidth: 600, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                <TextField label="Nombre" name="nombre" value={reservation.nombre} onChange={handleChange} required />
                <TextField
                    label="Dia y hora de reserva"
                    type="datetime-local"
                    name="tiempoYHora"
                    value={reservation.tiempoYHora}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Cantidad de gente"
                    type="number"
                    name="numeroDePersonas"
                    value={reservation.numeroDePersonas}
                    onChange={handleChange}
                    min="1"
                    required
                />
                <FormControl required>
                    <InputLabel>Mesa</InputLabel>
                    <Select name="mesa" value={reservation.mesa?.id || ''} onChange={handleChangeSelect}>
                        <MenuItem value="">
                            <em>Elige mesa</em>
                        </MenuItem>
                        {mesas.map((mesa) => (
                            <MenuItem key={mesa.id} value={mesa.id}>{`Mesa ${mesa.id}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    {existingReservation ? 'Actualizar' : 'Crear'}
                </Button>
            </Box>
        </Box>
        </>
    );
};

export default ReservationForm;
