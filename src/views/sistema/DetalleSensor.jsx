import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaArrowLeft } from 'react-icons/fa';
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
    return <p className="text-center text-gray-500 py-4">Cargando datos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">Error al cargar datos: {error.message}</p>;
  }

  // Función para convertir fecha y hora a formato legible con espacio
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('es-ES');
    const formattedTime = date.toLocaleTimeString('es-ES');
    return `${formattedDate} ${formattedTime}`; // Usar espacio entre fecha y hora
  };

  // Extraer las lecturas de las entidades del sensor y preparar los datos
  const data = (sensorData?.lecturaEntidades || []).map((reading) => ({
    name: formatDateTime(reading.registerDate),
    hour: new Date(reading.registerDate).toLocaleTimeString('es-ES'), // Hora sola para el Tooltip
    pH: reading.ph_parameter,
    turbidez: reading.turbidez_parameter,
    orp: reading.orp_parameter,
    temperatura: reading.temperature || 25, // Si no existe temperatura, puedes ajustar o eliminar esto
  }));

  // Función para personalizar el Tooltip y mostrar la hora
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="text-sm font-bold text-blue-600">{`Fecha: ${label.split(' ')[0]}`}</p>
          <p className="text-xs text-gray-700">{`Hora: ${payload[0].payload.hour}`}</p>
          <p className="text-xs text-gray-600">{`pH: ${payload[0].value}`}</p>
          {payload.length > 1 && <p className="text-xs text-gray-600">{`ORP: ${payload[1].value}`}</p>}
          {payload.length > 2 && <p className="text-xs text-gray-600">{`Turbidez: ${payload[2].value}`}</p>}
        </div>
      );
    }
    return null;
  };

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
      head: [['Fecha y Hora', 'pH', 'Turbidez (NTU)', 'ORP (mV)']],
      body: data.map((reading) => [
        reading.name,
        reading.pH,
        reading.turbidez,
        reading.orp,
       
      ]),
    });

    doc.save(`reporte-sensor-${sensorData?.nombreSensor}.pdf`);
  };

  // Función para descargar el reporte en Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map((reading) => ({
      'Fecha y Hora': reading.name,
      pH: reading.pH,
      'Turbidez (NTU)': reading.turbidez,
      'ORP (mV)': reading.orp,
      Temperatura: reading.temperatura,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ReporteSensor');
    XLSX.writeFile(workbook, `reporte-sensor-${sensorData?.nombreSensor}.xlsx`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Lecturas del Sensor: {sensorData?.nombreSensor}</h1>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition-transform hover:scale-105"
          >
            <FaArrowLeft className="mr-2" /> Volver a Sensores
          </button>
          <div className="flex space-x-4">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              Descargar PDF
            </button>
            <button
              onClick={downloadExcel}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              Descargar Excel
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Sensor de pH</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="name" tick={false} />
                <YAxis domain={[6.5, 8.5]} tick={{ fontSize: 12 }} />
                <Tooltip content={customTooltip} />
                <Legend />
                <Line type="monotone" dataKey="pH" stroke="#4a90e2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Sensor de Cloro Residual (ORP)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="name" tick={false} />
                <YAxis domain={[100, 700]} tick={{ fontSize: 12 }} />
                <Tooltip content={customTooltip} />
                <Legend />
                <Line type="monotone" dataKey="orp" stroke="#82ca9d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Sensor de Turbidez (NTU)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="name" tick={false} />
                <YAxis domain={[0, 1.5]} tick={{ fontSize: 12 }} />
                <Tooltip content={customTooltip} />
                <Legend />
                <Line type="monotone" dataKey="turbidez" stroke="#ffc658" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleSensorConGraficas;
