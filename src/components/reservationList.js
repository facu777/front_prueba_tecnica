import React, { useState, useEffect } from 'react';
import reservationService from '../services/reservationService';
import ReservationForm from './reservationForm';
import { Card, CardContent, Typography, Button, Box, Container, TextField } from '@mui/material';
import { format } from 'date-fns';
import TrashIcon from './trashIcon';


const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [editingReservation, setEditingReservation] = useState(null);
    const [filter, setFilter] = useState({
        nombre: '',
        fecha: '',
        cantidad: '',
    });
    const estiloBoxPrincipal = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '5em',

    }
    const estiloTarjeta = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center', // Centers the cards horizontally
        alignItems: 'center',    // Centers the cards vertically
        gap: 2,
        padding: '1em',
        backgroundColor: '#ffffff', // Línea 59: Fondo blanco en cada tarjeta
        boxShadow: 3, // Línea 59: Sombra para una apariencia moderna
        borderRadius: 2, // Línea 59: Bordes redondeados
    }

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await reservationService.fetchReservations();
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const handleEdit = (reservation) => {
        setEditingReservation(reservation);
    };

    const handleDeactivate = async (reservation) => {
        try {
            reservation.activa = !reservation.activa;
            await reservationService.updateReservation(reservation.id, reservation);
            fetchReservations();
        } catch (error) {
            console.error("Failed to deactivate reservation:", error);
        }
    };

    const handleFormSuccess = () => {
        setEditingReservation(null);
        fetchReservations();
    };
    const handleDelete = async (id) => {
        try {
            await reservationService.deleteReservation(id);
            fetchReservations(); // Vuelve a cargar las reservas después de eliminar
        } catch (error) {
            console.error("Failed to delete reservation:", error);
        }
    };

    return (
        <Container
            sx={estiloBoxPrincipal}
        >


            {editingReservation ? (

                <ReservationForm
                    existingReservation={editingReservation}
                    onSuccess={handleFormSuccess}
                />

            ) : (
                <>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        Reservations List
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <TextField
                            label="Filter by Name"
                            variant="outlined"
                            value={filter.nombre}
                            onChange={(e) => setFilter({ ...filter, nombre: e.target.value })}
                            sx={{ mr: 2 }}
                        />
                        <TextField
                            label="Filter by Date (YYYY-MM-DD)"
                            variant="outlined"
                            value={filter.fecha}
                            onChange={(e) => setFilter({ ...filter, fecha: e.target.value })}
                            sx={{ mr: 2 }}
                        />
                        <TextField
                            label="Filter by Quantity"
                            variant="outlined"
                            type="number"
                            value={filter.cantidad}
                            onChange={(e) => setFilter({ ...filter, cantidad: e.target.value })}
                        />
                    </Box>

                    <Box
                        sx={estiloTarjeta}
                    >
                        {reservations.filter((reservation) => {
                            const matchesNombre = reservation.nombre.toLowerCase().includes(filter.nombre.toLowerCase());
                            const matchesFecha = filter.fecha ? reservation.tiempoYHora.split('T')[0] === filter.fecha : true;
                            const matchesCantidad = filter.cantidad ? reservation.numeroDePersonas === Number(filter.cantidad) : true;
                            return matchesNombre && matchesFecha && matchesCantidad;
                        }).map((reservation) => (
                            <Card key={reservation.id} sx={{ width: 310, textAlign: 'left' }}>
                                <CardContent>
                                    <Typography variant="h6">A nombre de: {reservation.nombre}</Typography>
                                    <Typography variant="body2">
                                        <strong>Fecha y hora: </strong>{format(new Date(reservation.tiempoYHora), 'dd/MM/yyyy hh:mm a')}
                                    </Typography>
                                    <Typography variant="body2"><strong>Cantidad de personas: </strong>{reservation.numeroDePersonas}</Typography>
                                    <Typography variant="body2"><strong>Nro de mesa: </strong>{reservation.mesa.id}</Typography>

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEdit(reservation)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={reservation.activa ? "warning" : "secondary"}
                                        sx={{ marginRight: 1 }}
                                        onClick={() => handleDeactivate(reservation)}
                                    >
                                        {reservation.activa ? "Cancelar" : "Reactivar"}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(reservation.id)} // Agrega el manejador para eliminar
                                    >
                                       <TrashIcon> </TrashIcon>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </>

            )}
        </Container>
    );
};

export default ReservationList;
