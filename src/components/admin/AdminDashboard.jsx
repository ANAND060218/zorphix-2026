import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaUsers, FaCalendarAlt, FaQuestionCircle, FaChartBar,
    FaSignOutAlt, FaTachometerAlt, FaUsersCog, FaEnvelope, FaDownload
} from 'react-icons/fa';
import { toPng } from 'html-to-image';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalQueries: 0,
        pendingQueries: 0,
        totalEvents: 0
    });
    const [registrationData, setRegistrationData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [recentQueries, setRecentQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const reportRef = useRef(null);

    const downloadStats = async () => {
        if (reportRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toPng(reportRef.current, { cacheBust: true, backgroundColor: '#050505' });
            const link = document.createElement('a');
            link.download = `zorphix-stats-${new Date().toISOString().split('T')[0]}.png`;
            link.href = dataUrl;
            link.click();
            toast.success('Stats downloaded successfully');
        } catch (err) {
            console.error('Failed to download stats', err);
            toast.error('Failed to download stats');
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // Real-time listener for queries
        const unsubscribe = onSnapshot(collection(db, 'queries'), (snapshot) => {
            const queries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const pending = queries.filter(q => q.status === 'pending').length;
            setStats(prev => ({ ...prev, totalQueries: queries.length, pendingQueries: pending }));
            setRecentQueries(queries.slice(0, 5));
        });

        return () => unsubscribe();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch registrations
            const regSnapshot = await getDocs(collection(db, 'registrations'));
            const registrations = regSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setStats(prev => ({ ...prev, totalUsers: registrations.length }));

            // Process registration dates for chart
            const dateMap = {};
            registrations.forEach(reg => {
                // Use updatedAt as the registration date (this is what Firebase stores)
                const timestamp = reg.updatedAt;
                if (timestamp) {
                    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
                    const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
                    dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
                }
            });

            // Convert to array and sort by date chronologically
            const chartData = Object.entries(dateMap)
                .map(([date, count]) => ({ date, users: count }))
                .sort((a, b) => {
                    // Parse the date strings (format: "Jan 25") to sort chronologically
                    const parseDate = (dateStr) => {
                        const [month, day] = dateStr.split(' ');
                        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
                        return new Date(2026, monthIndex, parseInt(day));
                    };
                    return parseDate(a.date) - parseDate(b.date);
                })
                .slice(-10); // Last 10 entries after sorting
            setRegistrationData(chartData);

            // Process event registrations
            // Process event registrations
            const eventMap = {};
            const eventNameMapping = {
                "Reverse Coding": "CodeBack",
                "ReverseCoding": "CodeBack" // Handle potential variations
            };

            registrations.forEach(reg => {
                if (reg.events && Array.isArray(reg.events)) {
                    reg.events.forEach(event => {
                        // Normalize the event name
                        let normalizedEventName = event.trim();
                        if (eventNameMapping[normalizedEventName]) {
                            normalizedEventName = eventNameMapping[normalizedEventName];
                        }

                        eventMap[normalizedEventName] = (eventMap[normalizedEventName] || 0) + 1;
                    });
                }
            });

            const eventChartData = Object.entries(eventMap)
                .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, value }))
                .sort((a, b) => b.value - a.value);

            setEventData(eventChartData);
            setStats(prev => ({ ...prev, totalEvents: Object.keys(eventMap).length }));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully');
            navigate('/admin');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    const COLORS = ['#e33e33', '#97b85d', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

    const isActive = (path) => location.pathname === path;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono flex">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-[#0a0a0a] border border-white/10 rounded-xl"
            >
                <div className="w-5 h-4 flex flex-col justify-between">
                    <span className={`block h-0.5 bg-white transition-all ${sidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block h-0.5 bg-white transition-all ${sidebarOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-0.5 bg-white transition-all ${sidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
            </button>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col fixed h-full z-50 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-white/5">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#e33e33] to-[#97b85d] rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-lg">Z</span>
                        </div>
                        <div>
                            <span className="text-white font-bold text-lg">ZORPHIX</span>
                            <span className="block text-[10px] text-gray-500 uppercase tracking-widest">Admin Panel</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <NavItem to="/admin/dashboard" icon={FaTachometerAlt} label="Dashboard" active={isActive('/admin/dashboard')} onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/admin/queries" icon={FaQuestionCircle} label="Queries" active={isActive('/admin/queries')} badge={stats.pendingQueries} onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/admin/users" icon={FaUsersCog} label="Users" active={isActive('/admin/users')} onClick={() => setSidebarOpen(false)} />
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                {location.pathname === '/admin/dashboard' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-black">Dashboard</h1>
                                <p className="text-gray-500 text-sm">Welcome back, Admin</p>
                            </div>
                            <button
                                onClick={downloadStats}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium"
                            >
                                <FaDownload />
                                <span>Download Report</span>
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                            <StatCard
                                icon={FaUsers}
                                label="Total Users"
                                value={stats.totalUsers}
                                color="#97b85d"
                                change="+12%"
                            />
                            <StatCard
                                icon={FaQuestionCircle}
                                label="Pending Queries"
                                value={stats.pendingQueries}
                                color="#e33e33"
                                change={stats.pendingQueries > 0 ? "Action Required" : "All Clear"}
                            />
                            <StatCard
                                icon={FaCalendarAlt}
                                label="Active Events"
                                value={stats.totalEvents}
                                color="#3b82f6"
                            />
                            <StatCard
                                icon={FaEnvelope}
                                label="Total Queries"
                                value={stats.totalQueries}
                                color="#f59e0b"
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Registration Trend */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 md:p-6">
                                <h3 className="text-lg font-bold mb-4">Daily Registrations</h3>
                                <div className="overflow-x-auto">
                                    <div className="h-64 min-w-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={registrationData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#666"
                                                    fontSize={10}
                                                    tickLine={false}
                                                    axisLine={{ stroke: '#333' }}
                                                />
                                                <YAxis
                                                    stroke="#666"
                                                    fontSize={10}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    allowDecimals={false}
                                                    width={30}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: '#111',
                                                        border: '1px solid #333',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                                    }}
                                                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                />
                                                <Bar
                                                    dataKey="users"
                                                    fill="#97b85d"
                                                    radius={[4, 4, 0, 0]}
                                                    name="Registrations"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Events Distribution */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-4">Event Registrations</h3>
                                <div className="overflow-x-auto">
                                    <div className="h-64 min-w-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={eventData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={70}
                                                    fill="#8884d8"
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, value }) => `${value}`}
                                                >
                                                    {eventData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Queries */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 md:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Recent Queries</h3>
                                <Link to="/admin/queries" className="text-[#e33e33] text-sm hover:underline">View All</Link>
                            </div>
                            <div className="space-y-3 overflow-x-auto">
                                {recentQueries.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No queries yet</p>
                                ) : (
                                    recentQueries.map((q) => (
                                        <div key={q.id} className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl min-w-[280px]">
                                            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${q.status === 'pending' ? 'bg-[#e33e33]' : 'bg-[#97b85d]'}`}></div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium truncate">{q.email}</p>
                                                    <p className="text-xs text-gray-500 truncate">{q.message}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-2 md:px-3 py-1 rounded-full flex-shrink-0 ml-2 ${q.status === 'pending' ? 'bg-[#e33e33]/20 text-[#e33e33]' : 'bg-[#97b85d]/20 text-[#97b85d]'}`}>
                                                {q.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Off-screen stats report for downloading */}
                        <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
                            <div ref={reportRef} className="bg-[#050505] p-8 min-w-[600px] text-white font-mono border border-white/10 rounded-3xl relative overflow-hidden">
                                {/* Background Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#e33e33]/10 rounded-full blur-[100px] pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#97b85d]/10 rounded-full blur-[100px] pointer-events-none"></div>

                                {/* Header */}
                                <div className="flex items-center gap-4 mb-8 relative z-10">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#e33e33] to-[#97b85d] rounded-2xl flex items-center justify-center shadow-lg shadow-[#e33e33]/20">
                                        <span className="text-white font-black text-4xl">Z</span>
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-black tracking-tight mb-1">ZORPHIX '26</h1>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#97b85d] animate-pulse"></span>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Live Statistics</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                                    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-[#97b85d]/20 flex items-center justify-center">
                                                <FaUsers className="text-[#97b85d]" />
                                            </div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Total Users</p>
                                        </div>
                                        <p className="text-5xl font-black text-white mb-2">{stats.totalUsers}</p>
                                        <div className="flex items-center gap-2 text-[#97b85d] text-xs font-bold bg-[#97b85d]/10 w-fit px-2 py-1 rounded-full">
                                            <span>+12% Trend</span>
                                        </div>
                                    </div>
                                    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/20 flex items-center justify-center">
                                                <FaCalendarAlt className="text-[#3b82f6]" />
                                            </div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Total Events</p>
                                        </div>
                                        <p className="text-5xl font-black text-white mb-2">{stats.totalEvents}</p>
                                        <div className="flex items-center gap-2 text-[#3b82f6] text-xs font-bold bg-[#3b82f6]/10 w-fit px-2 py-1 rounded-full">
                                            <span>Active Categories</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Breakdown */}
                                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden relative z-10">
                                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <FaChartBar className="text-[#e33e33]" />
                                            Event Breakdown
                                        </h3>
                                        <span className="text-xs text-gray-500 font-mono">{new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {eventData.map((event, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-500 font-mono text-xs">{(idx + 1).toString().padStart(2, '0')}</span>
                                                    <span className="text-gray-200 font-bold">{event.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-full"
                                                            style={{ width: `${(event.value / Math.max(...eventData.map(e => e.value), 1)) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="bg-white/10 px-3 py-1 rounded-lg text-white font-mono font-bold w-12 text-center text-sm">{event.value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10 relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Generated via Admin Panel</span>
                                        <span className="text-[10px] text-gray-600 font-mono">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[#e33e33] font-black tracking-tighter text-lg">ZORPHIX</span>
                                        <span className="text-xs text-gray-500 block">Where Coders Rise</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Render child routes */}
                {children}
            </main>
        </div >
    );
};

// Helper Components
const NavItem = ({ to, icon: Icon, label, active, badge, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${active
            ? 'bg-[#e33e33] text-white'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon />
            <span className="text-sm">{label}</span>
        </div>
        {badge > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-[#e33e33] text-white'}`}>
                {badge}
            </span>
        )}
    </Link>
);

const StatCard = ({ icon: Icon, label, value, color, change }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-[#0a0a0a] border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: color }}></div>
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon className="text-sm md:text-xl" style={{ color }} />
                </div>
                {change && (
                    <span className="text-[10px] md:text-xs text-gray-500 hidden md:block">{change}</span>
                )}
            </div>
            <p className="text-xl md:text-3xl font-black">{value}</p>
            <p className="text-gray-500 text-[10px] md:text-sm mt-1 truncate">{label}</p>
        </div>
    </motion.div>
);

export default AdminDashboard;
