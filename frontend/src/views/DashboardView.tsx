import SalesByLocationChart from '../components/SalesByLocationChart';
import TotalRevenueChart from '../components/TotalRevenueChart';
import SalesAnalysisChart from '../components/SalesAnalysisChart';

const DashboardView = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-8 py-6">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition duration-300">
          <SalesByLocationChart />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition duration-300">
          <TotalRevenueChart />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 mt-4 hover:shadow-2xl transition duration-300 max-w-7xl mx-auto">
        <SalesAnalysisChart />
      </div>
    </div>
  );
};

export default DashboardView;
