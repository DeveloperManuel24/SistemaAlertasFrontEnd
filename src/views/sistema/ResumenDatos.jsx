import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { name: '05-01', pH: 7.2, turbidez: 0.5, orp: 250, temperatura: 25 },
  { name: '05-02', pH: 7.4, turbidez: 1.0, orp: 300, temperatura: 24 },
  { name: '05-03', pH: 7.1, turbidez: 0.7, orp: 270, temperatura: 22 },
  { name: '05-04', pH: 7.3, turbidez: 0.9, orp: 280, temperatura: 24 },
  { name: '05-05', pH: 7.6, turbidez: 1.2, orp: 340, temperatura: 31 },
  { name: '05-06', pH: 6.9, turbidez: 1.1, orp: 240, temperatura: 22 },
  { name: '05-07', pH: 7.5, turbidez: 0.9, orp: 310, temperatura: 28 },
];

const ResumenDatos = () => {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Pantalla Resumen de Datos</h1>
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

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">Sensor de Turbidez (NTU)</h2>
          <ResponsiveContainer width="100%" height={300}>
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

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">Sensor de Temperatura (°C)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperatura" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ResumenDatos;
