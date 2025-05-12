"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Users, Film, CreditCard, TrendingUp } from "lucide-react";
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const API_URL = `/api/v1`;

// Bar Chart Component for Users by Region
const BarChartBox = ({ title, labels, data }: { title: string, labels: string[], data: number[] }) => {
  const regionColors = [
    '#ef4444',
    '#8b5cf6', // Africa
    '#10b981', // Asia
    '#3b82f6', // Europe
    '#f97316', // North America
    '#06b6d4', // Oceania (cyan/teal)
    '#ec4899', // South America
    '#9ca3af', // Antarctica (grey - no significant user base usually)

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

// Line Chart Component for Monthly Revenue
const LineChartBox = ({ title, labels, data }: { title: string; labels: string[]; data: number[] }) => {
  return (
    <div style={{ height: '200px' }}>
      <Line
        data={{
          labels: labels,
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
              callbacks: {
                label: (context) => {
                  return `${context.label}: $${context.formattedValue}`;
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
                callback: function (value) {
                  return '$' + value;
                },
              },
              grid: {
                color: '#374151',
              },
            },
          },
        }}
      />
    </div>
  );
};

// Pie Chart Component (retained for other charts)
const PieChartBox = ({
  title,
  labels,
  data,
  colors,
}: {
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
}) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <h3 className="text-xl font-semibold text-gray-300 mb-4">{title}</h3>
    <div style={{ height: '250px' }}>
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
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => Number(a) + Number(b), 0);
                  const percentage = total > 0
                    ? ((value / total) * 100).toFixed(2) + '%'
                    : '0%';
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

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topMovies, setTopMovies] = useState<any[]>([]);

  const [genderData, setGenderData] = useState<any>(null);
  const [packageData, setPackageData] = useState<any>(null);
  const [regionData, setRegionData] = useState<any>(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any>(null);
  const [currentMonthlyRevenue, setCurrentMonthlyRevenue] = useState<number>(0);
  const [revenueChange, setRevenueChange] = useState<string>("0.00");
  const [positiveRevenue, setPositiveRevenue] = useState<boolean>(true);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [newSubscriptions, setNewSubscriptions] = useState<number>(0);
  const [newMovies, setNewMovies] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [
          usersRes,
          moviesRes,
          plansRes,
          billingsRes,
          subscriptionsByMonthYearRes,
          moviesByMonthYearRes,
          revenueByYearRes,
          topMoviesRes, // New API call for top movies
        ] = await Promise.all([
          axios.get(`${API_URL}/admin/users`),
          axios.get(`${API_URL}/admin/movies`),
          axios.get(`${API_URL}/admin/plans`),
          axios.get(`${API_URL}/admin/billings`),
          axios.get(`${API_URL}/admin/subscriptions?month=${selectedMonth}&year=${selectedYear}`),
          axios.get(`${API_URL}/admin/movies?month=${selectedMonth}&year=${selectedYear}`),
          axios.get(`${API_URL}/admin/billings`),
	        axios.get(`${API_URL}/admin/movies?month=${selectedMonth}&year=${selectedYear}`),
          
        ]);

        const users = usersRes.data?.rows || [];

        // Users by Gender
        const genderCount = users.reduce((acc: any, user: any) => {
          const gender = user.gender || "Unknown";
          acc[gender] = (acc[gender] || 0) + 1;
          return acc;
        }, {});
        setGenderData({
          labels: Object.keys(genderCount),
          datasets: [
            {
              data: Object.values(genderCount),
              backgroundColor: ['#4f46e5', '#ec4899', '#10b981', '#f59e0b'],
            },
          ],
        });

        // Users by Plan (ordered labels)
        const planOrder = ["Basic", "Standard", "Premium", "None"];

        const planCount = users.reduce((acc: any, user: any) => {
          const plan = user.active_subscription || "None";
          acc[plan] = (acc[plan] || 0) + 1;
          return acc;
        }, {});

        const orderedLabels = planOrder.filter(plan => plan in planCount);
        const orderedData = orderedLabels.map(plan => planCount[plan]);

        setPackageData({
          labels: orderedLabels,
          datasets: [
            {
              data: orderedData,
              backgroundColor: ['#f59e0b','#3b82f6', '#10b981', '#ef4444'], // Basic, Standard, Premium, None
            },
          ],
        });

        // Users by Region
        const regionCount = users.reduce((acc: any, user: any) => {
          const region = user.region || "Unknown";
          acc[region] = (acc[region] || 0) + 1;
          return acc;
        }, {});
        setRegionData({
          labels: Object.keys(regionCount),
          datasets: [
            {
              label: 'Users by Region',
              data: Object.values(regionCount),
              backgroundColor: '#38bdf8',
            },
          ],
        });

        setStats({
          totalUsers: usersRes.data?.count || 0,
          totalMovies: moviesRes.data?.count || 0,
          subscriptionPlans: plansRes.data?.rows?.length || 0,
          totalRevenue: billingsRes.data?.totalRevenue || 0,
          revenueChange: billingsRes.data?.revenueChange || "0.00",
          positiveRevenue: billingsRes.data?.positiveRevenue ?? true,
          recentActivities: billingsRes.data?.recentActivities || [],
        });

        // Assuming your backend returns the count of new subscriptions and movies directly
        setNewSubscriptions(subscriptionsByMonthYearRes.data?.count || 0);
        setNewMovies(moviesByMonthYearRes.data?.count || 0);

        // Process yearly revenue data for the line chart
        const yearlyRevenue = revenueByYearRes.data?.monthlyRevenue || {};
        const revenueLabels = Object.keys(yearlyRevenue).sort((a, b) => parseInt(a) - parseInt(b)); // Sort by month number
        const revenueData = revenueLabels.map((month) => yearlyRevenue[month]);

        setMonthlyRevenueData({
          labels: revenueLabels.map(month => new Date(selectedYear, parseInt(month) - 1).toLocaleString('default', { month: 'short' })),
          data: revenueData,
        });

        // Set current monthly revenue and change
        const currentMonthStr = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
        let currentMonthRevenue = 0;
        billingsRes.data?.rows?.forEach(billing => {
          const paymentDate = new Date(billing.payment_date);
          const billingMonth = paymentDate.getMonth() + 1;
          const billingYear = paymentDate.getFullYear();

          if (billingMonth === selectedMonth && billingYear === selectedYear) {
            currentMonthRevenue += billing.amount;
          }
        });
        setCurrentMonthlyRevenue(currentMonthRevenue);

        // Revenue change data is not directly available in the provided API response.
        // You will need to implement logic to calculate this or have the backend provide it.
        setRevenueChange("N/A");
        setPositiveRevenue(true);

        // Set top movies data
        setTopMovies(topMoviesRes.data?.topMovies || []);

      } catch (err: any) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to fetch stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedMonth, selectedYear]);

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Users size={24} className="text-blue-500" />}
                title="Total Users"
                value={stats?.totalUsers}
              />
              <StatCard
                icon={<Film size={24} className="text-purple-500" />}
                title="Total Movies"
                value={stats?.totalMovies}
              />
              <StatCard
                title="Subscription Plans"
                value={stats?.subscriptionPlans}
                icon={<CreditCard size={24} className="text-green-500" />}
              />
              <StatCard
                title="Total Revenue"
                value={`$${stats?.totalRevenue?.toFixed(2)}`}
                icon={<TrendingUp size={24} className="text-yellow-500" />}
                change={stats?.revenueChange}
                positive={stats?.positiveRevenue}
              />
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-4 justify-items-center">
                {genderData && (
                  <PieChartBox
                    title="Users by Gender"
                    labels={genderData.labels}
                    data={genderData.datasets[0].data}
                    colors={genderData.datasets[0].backgroundColor}
                  />
                )}
                {packageData && (
                  <PieChartBox
                    title="Users by Subscription Plan"
                    labels={packageData.labels}
                    data={packageData.datasets[0].data}
                    colors={packageData.datasets[0].backgroundColor}
                  />
                )}
                {regionData && (
                  <BarChartBox
                    title="Users by Region"
                    labels={regionData.labels}
                    data={regionData.datasets[0].data}
                  />
                )}
              </div>
              <div className="flex gap-4 mb-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-gray-800 text-white rounded px-3 py-2"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-gray-800 text-white rounded px-3 py-2"
                >
                  {[new Date().getFullYear() - 1, new Date().getFullYear()].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Revenue Chart */}
              <div className="mb-8">
                {monthlyRevenueData && (
                  <div className="bg-gray-800 rounded-lg p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-4">
                        Revenue ({selectedYear})
                      </h3>
                    </div>
                    <div>
                      <LineChartBox
                        title=""
                        labels={monthlyRevenueData.labels}
                        data={monthlyRevenueData.data}
                      />
                      <StatCard
                        title={`Monthly Revenue in ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
                        value={`$${currentMonthlyRevenue.toFixed(2)}`}
                        icon={<TrendingUp size={24} className="text-yellow-500" />}
                        change={revenueChange}
                        positive={positiveRevenue}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Monthly Data Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard
                  title="New Active Subscriptions"
                  value={newSubscriptions}
                  icon={<CreditCard size={24} className="text-green-500" />}
                  positive={newSubscriptions !== 0} // Indicate positive if there are new subscriptions
                />
                <StatCard
                  title="New Movies This Month"
                  value={newMovies}
                  icon={<Film size={24} className="text-purple-500" />}
                  positive={newMovies !== 0} // Indicate positive if there are new movies
                />
              </div>

              {/* Top 10 Movies */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  Top 10 Movies in {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-800 uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          #
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Movie
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Year
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Genre
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Rating
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Hours Viewed
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topMovies.map((movie, index) => (
                        <tr key={index} className="bg-gray-800 border-b dark:bg-gray-800 dark:border-gray-700">
                          <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap dark:text-white">
                            {index + 1}
                          </th>
                          <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap dark:text-white">
                            {movie.title}
                          </th>
                          <td className="px-6 py-4 text-white">
                            {movie.year}
                          </td>
                          <td className="px-6 py-4 text-white">
                            {movie.genre}
                          </td>
                          <td className="px-6 py-4 text-white">
                            {movie.rating}
                          </td>
                          <td className="px-6 py-4 text-white">
                            {movie.hours_viewed}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {topMovies.length === 0 && <p className="text-gray-500 mt-4">No top movies data available for this month and year.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;