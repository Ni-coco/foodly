import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const SalesAnalysisChart = () => {
  const periods = {
    'Dernière semaine': [150, 180, 200, 220, 190, 230, 250],
    'Dernier mois': [1200, 1300, 1250, 1400, 1500, 1600, 1550, 1650, 1700, 1750, 1800, 1850, 1900, 2000],
    'Dernière année': [12000, 15000, 14000, 16000, 18000, 20000, 21000, 23000, 22000, 25000, 27000, 30000],
  };

  const generateLabels = (period) => {
    if (period === 'Dernière semaine' || period === 'Dernier mois') {
      return Array.from({ length: periods[period].length }, (_, i) => `Jour ${i + 1}`);
    } else if (period === 'Dernière année') {
      return Array.from({ length: periods[period].length }, (_, i) => `Mois ${i + 1}`);
    }
    return [];
  };
  
  const [selectedPeriod, setSelectedPeriod] = useState('Dernière semaine');

  const data = {
    labels: generateLabels(selectedPeriod),
    datasets: [
      {
        label: `Ventes (${selectedPeriod})`,
        data: periods[selectedPeriod],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
      },
    ],
  };
  

  const options = {
    responsive: true,
    maintainAspectRatio: true, 
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Analyse des ventes par période',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
<div
  style={{
    width: '90%',
    margin: '0 auto',
    minHeight: '300px', 
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
  }}
>
  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
    <label htmlFor="period-select" style={{ marginRight: '10px', fontSize: '14px', fontWeight: 'bold' }}>
      Sélectionner une période :
    </label>
    <select
      id="period-select"
      value={selectedPeriod}
      onChange={(e) => setSelectedPeriod(e.target.value)}
      style={{ padding: '8px', fontSize: '14px' }}
    >
      {Object.keys(periods).map((period) => (
        <option key={period} value={period}>
          {period}
        </option>
      ))}
    </select>
  </div>

  <div style={{ width: '100%', maxWidth: '600px', flexGrow: 1 }}>
        <Line data={data} options={options} />
  </div>
</div>

  );  
};

export default SalesAnalysisChart;
