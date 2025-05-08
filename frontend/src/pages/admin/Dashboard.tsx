"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Users, Film, CreditCard, TrendingUp, Activity, Server } from "lucide-react";
import { Pie, Bar, Line } from "react-chartjs-2"; // Ensure Line is imported
import {
  Chart as ChartJS,
  ArcElement, // Keep ArcElement for Pie Chart
  Tooltip,
  Legend,
  CategoryScale, // For Bar Chart and Line Chart
  LinearScale, // For Bar Chart and Line Chart
  BarElement, // For Bar Chart
  PointElement, // For Line Chart
  LineElement, // For Line Chart
  Title, // For Bar Chart and Line Chart
} from "chart.js";
import HeatMap from 'react-heatmap-grid';
ChartJS.register(
  ArcElement, // Register ArcElement for Pie Chart
  Tooltip,
  Legend,
  CategoryScale, // Register for Bar Chart and Line Chart
  LinearScale, // Register for Bar Chart and Line Chart
  BarElement, // Register for Bar Chart
  PointElement, // Register for Line Chart
  LineElement, // Register for Line Chart
  Title // Register for Bar Chart and Line Chart
);
// Bar Chart Component for Users by Region
const BarChartBox = ({ title, labels, data }: { title: string, labels: string[], data: number[] }) => {
  const regionColors = [
    '#10b981', // Asia
    '#3b82f6', // Europe
    '#f97316', // North America
    '#ec4899', // South America
    '#8b5cf6', // Africa
  ];
  const maxValue = Math.max(...data);
  const suggestedMax = maxValue * 1.5;
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">{title}</h3>
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: title,
                data,
                backgroundColor: labels.map((_, index) => regionColors[index % regionColors.length]),
                borderColor: "#1f2937",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
                labels: {
                  color: 'white',
                },
              },
              title: {
                display: false,
                text: title,
                color: 'white',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.label}: ${context.formattedValue}`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: 'white',
                  align: 'center'
                },
                grid: {
                  color: '#374151',
                },
              },
              y: {
                ticks: {
                  color: 'white',
                },
                grid: {
                  color: '#374151',
                },
                max: suggestedMax,
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};
// Pie Chart Component (retained for other charts)
const PieChartBox = ({ title, labels, data, colors }: { title: string, labels: string[], data: number[], colors: string[] }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <h3 className="text-xl font-semibold text-gray-300 mb-4">{title}</h3>
    <div style={{ height: '200px' }}>
      <Pie
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderWidth: 0,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'white',
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
            title: {
              display: false,
              text: title,
              color: 'white',
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.formattedValue || '';
                  const percentage = context.dataset.data.length > 0
                    ? ((Number(value) / context.dataset.data.reduce((a, b) => Number(a) + Number(b), 0)) * 100).toFixed(2) + '%'
                    : '';
                  return `${label}: <span class="math-inline">\{value\} \(</span>{percentage})`;
                },
              },
            },
          },
        }}
      />
    </div>
  </div>
);

// Line Chart Component for Monthly Revenue
const LineChartBox = ({ title, labels, data }: { title: string, labels: string[], data: number[] }) => {
  const maxValue = Math.max(...data);
  const suggestedMax = maxValue * 1.5;
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">{title}</h3>
      <div style={{ height: '200px' }}>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: title,
                data: data,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: 'rgba(75,192,192,1)',
                pointBorderColor: '#fff',
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
                labels: {
                  color: 'white',
                },
              },
              title: {
                display: false,
                text: title,
                color: 'white',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: ${context.formattedValue}`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: 'white',
                },
                grid: {
                  color: '#374151',
                },
              },
              y: {
                ticks: {
                  color: 'white',
                },
                grid: {
                  color: '#374151',
                },
                beginAtZero: true,
                max: suggestedMax,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [revenueData, setRevenueData] = useState<{ labels: string[]; data: number[] } | null>(null);
  const [revenueYearFilter, setRevenueYearFilter] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulate API call with a delay
        setTimeout(() => {
          setStats({
            totalUsers: 1254,
            newUsers: 48,
            totalMovies: 523,
            newMovies: 12,
            subscriptionPlans: 5,
            activeSubscriptions: 987,
            monthlyRevenue: "$3,214",
            totalRevenue: "$12,458",
            revenueChange: "8.2%",
            positiveRevenue: true,
            newActiveSubscriptions: 36,
            genderDistribution: { male: 740, female: 514 },
            regionDistribution: {
              Asia: 400,
              Europe: 250,
              "North America": 300,
              "South America": 180,
              Africa: 124,
            },
            planDistribution: {
              "Basic Plan": 300,
              "Standard Plan": 350,
              "Premium Plan": 250,
              "Family Plan": 200,
              "Annual Basic": 154,
            },
            recentActivities: [
              "User JohnDoe watched ‘Inception’",
              "New user JaneSmith registered",
              "Subscription upgraded to Premium Plan",
              "Movie ‘Avatar 2’ added to library",
            ],
            systemStatus: {
              serverUptime: "99.99%",
              activeStreams: 124,
              serverLoad: "Moderate",
              apiLatency: "230ms",
            },
            monthlyRevenueData: { // Simulate monthly revenue data
              2024: [2500, 2800, 3100, 2900, 3300, 3000, 3200, 3500, 3300, 3600, 3400, 3700],
              2025: [3000, 3200, 3500, 3300, 3700, 3400, 3600, 3900, 3700, 4000, 3800, 4100],
            }
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load dashboard statistics");
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (stats?.monthlyRevenueData) {
      const selectedYearData = stats.monthlyRevenueData[revenueYearFilter] || Array(12).fill(0);
      const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      setRevenueData({ labels: monthLabels, data: selectedYearData });
    }
  }, [stats, revenueYearFilter]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const revenueYears = Object.keys(stats?.monthlyRevenueData || {}).map(Number).sort((a, b) => b - a);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            {error}
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<Users size={24} className="text-blue-500" />}
                change={`+${stats.newUsers} this week`}
                positive={true}
              />
              <StatCard
                title="Content Library"
                value={stats.totalMovies}
                icon={<Film size={24} className="text-purple-500" />}
                change={`+${stats.newMovies} this week`}
                positive={true}
              />
              <StatCard
                title="Subscription Plans"
                value={stats.subscriptionPlans}
                icon={<CreditCard size={24} className="text-green-500" />}
              />
              <StatCard
                title="Total Revenue"
                value={stats.totalRevenue}
                icon={<TrendingUp size={24} className="text-yellow-500" />}
                change={stats.revenueChange}
                positive={stats.positiveRevenue}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <PieChartBox
                title="Users by Gender"
                labels={["Male", "Female"]}
                data={[stats.genderDistribution.male, stats.genderDistribution.female]}
                colors={["#3b82f6", "#ec4899"]}
              />
              <PieChartBox
                title="Users by Plan"
                labels={Object.keys(stats.planDistribution)}
                data={Object.values(stats.planDistribution)}
                colors={["#a78bfa", "#34d399", "#f87171", "#60a5fa", "#fbbf24"]}
              />
            </div>

            {/* Charts 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <BarChartBox
                title="Users by Region"
                labels={Object.keys(stats.regionDistribution)}
                data={Object.values(stats.regionDistribution)}
              />
              
              {revenueData && (
                <div className="bg-gray-800 rounded-lg p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-4">Revenue ({revenueYearFilter})</h3>
                  </div>
                  <div className="mb-4">
                    <select
                      className="bg-gray-700 text-white rounded px-4 py-2 text-sm"
                      value={revenueYearFilter}
                      onChange={(e) => setRevenueYearFilter(Number(e.target.value))}
                    >
                      {revenueYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <LineChartBox
                      title=""
                      labels={revenueData.labels}
                      data={revenueData.data}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Month / Year Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Month
                </label>
                <select
                  className="bg-gray-700 text-white rounded px-4 py-2"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Year
                </label>
                <select
                  className="bg-gray-700 text-white rounded px-4 py-2"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Monthly Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="New Active Subscriptions"
                value={stats.newActiveSubscriptions}
                icon={<CreditCard size={24} className="text-green-500" />}
                positive={true}
              />
              <StatCard
                title="Monthly Revenue"
                value={stats.monthlyRevenue}
                icon={<TrendingUp size={24} className="text-yellow-500" />}
                change={stats.revenueChange}
                positive={stats.positiveRevenue}
              />
              <StatCard
                title="New Movies This Month"
                value={stats.newMovies}
                icon={<Film size={24} className="text-purple-500" />}
                positive={true}
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {stats.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <div className={`bg-${["blue", "purple", "green"][index % 3]}-500/20 text-${["blue", "purple", "green"][index % 3]}-500 p-2 rounded`}>
                      {index === 0 && <Users size={20} />}
                      {index === 1 && <Film size={20} />}
                      {index === 2 && <CreditCard size={20} />}
                      {index > 2 && <Activity size={20} />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.split(' ')[0] === 'User' ? 'New user registered' : activity.split(' ')[0] === 'Movie' ? 'New movie added' : activity.split(' ')[0] === 'Subscription' ? 'New subscription' : activity}</p>
                      <p className="text-sm text-gray-400">{activity.includes('@') ? activity.split(' ').slice(-1)[0] : activity.includes('‘') ? activity.split('‘')[1]?.split('’')[0] : ''}</p>
                      <p className="text-xs text-gray-500 mt-1">{(index + 1) * 2} hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">System Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Server Load</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">42%</p>
                    <div className="w-2/3 bg-gray-600 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Storage</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">68%</p>
                    <div className="w-2/3 bg-gray-600 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "68%" }} />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Bandwidth</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">23%</p>
                    <div className="w-2/3 bg-gray-600 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "23%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;