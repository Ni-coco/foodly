import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ApiCall } from '../services/ApiCall';  

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const SalesAnalysisChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('Dernière semaine');
  const [loading, setLoading] = useState(true);

  const fetchRevenueData = async () => {
    try {
      const response = await ApiCall.Get('http://localhost:3000/api/stats/revenue');
      if (response && response.data) {
        setRevenueData(response.data);
      } else {
        throw new Error('Response is undefined');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de revenus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const generateLabels = (period) => {
    if (period === 'Dernière semaine' || period === 'Dernier mois') {
      return Array.from({ length: revenueData.length }, (_, i) => `Jour ${i + 1}`);
    } else if (period === 'Dernière année') {
      return Array.from({ length: revenueData.length }, (_, i) => `Mois ${i + 1}`);
    }
    return [];
  };

  const data = {
    labels: generateLabels(selectedPeriod),
    datasets: [
      {
        label: `Revenu (${selectedPeriod})`,
        data: revenueData.map((entry) => entry.total_revenue),
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
        text: 'Analyse des Revenus par Période',
        font: {
          size: 16,
        },
      },
    },
  };

  if (loading) {
    return <div>Chargement des données...</div>;
  }

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
          {['Dernière semaine', 'Dernier mois', 'Dernière année'].map((period) => (
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
