import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaArrowLeft } from 'react-icons/fa';  // Cambio de icono aquí
import { useNavigate, useParams } from 'react-router-dom';
import { getSensorById } from '../../../api/SensorAPI';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const DetalleSensorConGraficas = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetching sensor data using useQuery
  const { data: sensorData, isLoading, error } = useQuery({
    queryKey: ['sensor', id],
    queryFn: () => getSensorById(id),
  });

  if (isLoading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>Error al cargar datos: {error.message}</p>;
  }

  // Extraer las lecturas de las entidades del sensor
  const lecturas = sensorData?.lecturaEntidades || [];

  // Preparar los datos para las gráficas
  const data = lecturas.map(reading => ({
    name: new Date(reading.registerDate).toLocaleDateString(),
    pH: reading.ph_parameter,
    turbidez: reading.turbidez_parameter,
    orp: reading.orp_parameter,
    temperatura: reading.temperature || 25 // Si no existe temperatura, puedes ajustar o eliminar esto
  }));

  // Función para descargar el reporte en PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(18);
    doc.text(`Reporte de Sensor: ${sensorData?.nombreSensor}`, 14, 16);
    doc.setFontSize(12);

    // Generar la tabla automáticamente
    doc.autoTable({
      startY: 22,
      head: [['Fecha', 'pH', 'Turbidez (NTU)', 'ORP (mV)', 'Temperatura']],
      body: lecturas.map(reading => [
        new Date(reading.registerDate).toLocaleDateString('es-ES'),
        reading.ph_parameter,
        reading.turbidez_parameter,
        reading.orp_parameter,
        reading.temperature || 25,
      ]),
    });

    doc.save(`reporte-sensor-${sensorData?.nombreSensor}.pdf`);
  };

  // Función para descargar el reporte en Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(lecturas.map(reading => ({
      Fecha: new Date(reading.registerDate).toLocaleDateString('es-ES'),
      pH: reading.ph_parameter,
      'Turbidez (NTU)': reading.turbidez_parameter,
      'ORP (mV)': reading.orp_parameter,
      Temperatura: reading.temperature || 25,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ReporteSensor');
    XLSX.writeFile(workbook, `reporte-sensor-${sensorData?.nombreSensor}.xlsx`);
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Lecturas del Sensor: {sensorData?.nombreSensor}</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => navigate('/')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Volver a Sensores
        </button>
        <div className="flex space-x-2">
          <button
            onClick={downloadPDF}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Descargar PDF
          </button>
          <button
            onClick={downloadExcel}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Descargar Excel
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">Sensor de pH</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[6.8, 7.8]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pH" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">Sensor de Cloro Residual (ORP)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orp" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded col-span-2">
          <h2 className="text-xl font-semibold mb-3 text-center">Sensor de Turbidez (NTU)</h2>
          <ResponsiveContainer width="50%" height={300} className="mx-auto">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="turbidez" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DetalleSensorConGraficas;
