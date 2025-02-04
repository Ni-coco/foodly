import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ApiCall } from '../services/ApiCall';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const SalesByLocationChart = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiCall.Get<any[]>('http://localhost:3000/api/stats')
      .then((response) => {
        if (response && response.data) {
          const labels = response.data.map((item) => item.cp);
          const data = response.data.map((item) => parseInt(item.count, 10));

          setChartData({
            labels,
            datasets: [
              {
                label: 'Ventes par code postal',
                data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 2,
              },
            ],
          });
        } else {
          throw new Error('Response is undefined');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Répartition des Ventes par Code Postal',
        font: {
          size: 18,
        },
      },
    },
  };

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  return (
    <div style={{ width: '50%', margin: '0 auto', height: '400px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default SalesByLocationChart;
