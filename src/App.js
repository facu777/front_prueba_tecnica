// src/App.js
import React, { useState } from 'react';
import ReservationForm from './components/reservationForm';
import ReservationList from './components/reservationList';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, CssBaseline, Container } from '@mui/material';


const App = () => {
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const handleSuccess = () => {
        setSelectedReservationId(null);
  
    };

    return (
        <div>

            <Router>
                <CssBaseline />
                {/* Barra de navegación */}
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Reservas
                        </Typography>
                        <Button color="inherit" component={Link} to="/">
                            Reservar
                        </Button>
                        <Button color="inherit" component={Link} to="/ver-reservas">
                            Ver reservas
                        </Button>
                    </Toolbar>
                </AppBar>

                {/* Contenido principal con enrutamiento */}
                <Container sx={{ mt: 5 }}>
                    <Routes>
                        <Route path="/" element={<ReservationForm onSuccess={handleSuccess} />} />
                        <Route path="/ver-reservas" element={<ReservationList onSelectReservation={setSelectedReservationId} />} />
                    </Routes>
                </Container>
            </Router>
        </div>

    );
};

export default App;