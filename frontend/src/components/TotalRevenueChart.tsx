import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TotalRevenueChart = () => {
  const data = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Chiffre d\'Affaires (€)',
        data: [12000, 15000, 11000, 18000, 20000, 17000], 
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 25000,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chiffre d\'Affaires Global',
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div style={{ width: '50%', margin: '0 auto', height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TotalRevenueChart;
