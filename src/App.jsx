import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LayoutApp from './layout/LayoutApp';
import PantallaMonitoreo from './views/sistema/PantallaMonitoreo';
import Alertas from './views/sistema/Alertas';
import ManejoDeUsuarios from './views/usuarios/ManejoDeUsuarios';
import FormularioUsuario from './components/FormularioUsuario';
import VerUsuario from './views/usuarios/VerUsuario';
import ManejoDeSensor from './views/sistema/ManejoDeSensor';
import FormularioSensor from './components/FormularioSensor'
import VerSensor from './views/sistema/VerSensor';
import AuthLayout from './layout/AuthLayout';
import Login from "./views/usuarios/Login";
import ProtectedRoute from './components/ProtectedRoute';
import AccesoDenegado from './components/AccesoDenegado';
import ListadoSensores from './views/sistema/ListadoSensores';
import DetalleSensor from './views/sistema/DetalleSensor';

// Crear una instancia de QueryClient
const queryClient = new QueryClient();

function App() {
  const handleSaveSensor = (sensor) => {
    console.log('Guardando sensor:', sensor);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            {/* Otras rutas de autenticación */}
          </Route>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<LayoutApp />}>
              <Route index element={<ListadoSensores />} />
              <Route path="PantallaMonitoreo" element={<PantallaMonitoreo />} />
              <Route path="alertas" element={<Alertas />} />

              <Route path="sensores" element={<ManejoDeSensor />} />
              
              <Route path="sensores/view/:id" element={<VerSensor />} />

              <Route path='GraficasPorSensor/:id' element={<DetalleSensor />} />

              {/* Rutas protegidas por el rol de administrador */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="usuarios" element={<ManejoDeUsuarios />} />
                <Route path="usuarios/create" element={<FormularioUsuario />} />
                <Route path="usuarios/edit/:id" element={<FormularioUsuario />} />
                <Route path="usuarios/view/:id" element={<VerUsuario />} />

                <Route path="sensores/create" element={<FormularioSensor onSave={handleSaveSensor} />} />
                <Route path="sensores/edit/:id" element={<FormularioSensor onSave={handleSaveSensor} />} />
              </Route>

             
              {/* Ruta de acceso denegado */}
              <Route path="/acceso-denegado" element={<AccesoDenegado />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
