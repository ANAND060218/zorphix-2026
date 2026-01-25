import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaSearch, FaDownload, FaFilter, FaUsers, FaSortAmountDown,
    FaCalendarAlt, FaUniversity, FaEnvelope, FaPhone, FaTimes
} from 'react-icons/fa';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [eventFilter, setEventFilter] = useState('all');
    const [collegeFilter, setCollegeFilter] = useState('all');
    const [allEvents, setAllEvents] = useState([]);
    const [allColleges, setAllColleges] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('registeredAt');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'registrations'));
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Use updatedAt as the registration date (this is what Firebase stores)
                registeredAt: doc.data().updatedAt?.toDate?.() || new Date()
            }));

            setUsers(usersData);

            // Extract unique events and colleges for filters
            const events = new Set();
            const colleges = new Set();
            usersData.forEach(user => {
                if (user.events) user.events.forEach(e => events.add(e));
                if (user.college) colleges.add(user.college);
            });
            setAllEvents([...events].sort());
            setAllColleges([...colleges].sort());

        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = [...users];

        // Filter by search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.displayName?.toLowerCase().includes(term) ||
                u.email?.toLowerCase().includes(term) ||
                u.phone?.includes(term) ||
                u.college?.toLowerCase().includes(term)
            );
        }

        // Filter by event
        if (eventFilter !== 'all') {
            result = result.filter(u => u.events?.includes(eventFilter));
        }

        // Filter by college
        if (collegeFilter !== 'all') {
            result = result.filter(u => u.college === collegeFilter);
        }

        // Sort
        result.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'registeredAt') {
                // Handle Date objects properly - use getTime() directly
                aVal = aVal instanceof Date ? aVal.getTime() : new Date(aVal).getTime();
                bVal = bVal instanceof Date ? bVal.getTime() : new Date(bVal).getTime();
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal?.toLowerCase() || '';
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            }
            return aVal < bVal ? 1 : -1;
        });

        setFilteredUsers(result);
    }, [users, searchTerm, eventFilter, collegeFilter, sortBy, sortOrder]);

    const exportToExcel = (exportAll = false) => {
        const dataToExport = exportAll ? users : filteredUsers;

        if (dataToExport.length === 0) {
            toast.error('No data to export');
            return;
        }

        const exportData = dataToExport.map(user => ({
            'Name': user.displayName || '-',
            'Email': user.email || '-',
            'Phone': user.phone || '-',
            'College': user.college || '-',
            'Department': user.department || '-',
            'Degree': user.degree || '-',
            'Year': user.year || '-',
            'Events': user.events?.join(', ') || '-',
            'Registration Date': user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('en-IN') : '-'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');

        // Generate filename with date
        const date = new Date().toISOString().split('T')[0];
        const filename = exportAll
            ? `Zorphix_All_Users_${date}.xlsx`
            : `Zorphix_Filtered_Users_${date}.xlsx`;

        XLSX.writeFile(wb, filename);
        toast.success(`Exported ${dataToExport.length} users`);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setEventFilter('all');
        setCollegeFilter('all');
        setSortBy('registeredAt');
        setSortOrder('desc');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#e33e33] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black">User Management</h1>
                    <p className="text-gray-500 text-sm">
                        {filteredUsers.length} of {users.length} users
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => exportToExcel(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#97b85d] text-white rounded-xl text-sm font-medium hover:bg-[#7a9a4a] transition-colors"
                    >
                        <FaDownload size={12} />
                        Export Filtered
                    </button>
                    <button
                        onClick={() => exportToExcel(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#e33e33] text-white rounded-xl text-sm font-medium hover:bg-[#c62828] transition-colors"
                    >
                        <FaDownload size={12} />
                        Export All
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, or college..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#e33e33]"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-[#e33e33] text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                    >
                        <FaFilter size={12} />
                        Filters
                    </button>
                    {(eventFilter !== 'all' || collegeFilter !== 'all') && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 rounded-xl text-sm hover:text-white"
                        >
                            <FaTimes size={12} />
                            Clear
                        </button>
                    )}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#0a0a0a] border border-white/5 rounded-xl"
                    >
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Filter by Event</label>
                            <select
                                value={eventFilter}
                                onChange={(e) => setEventFilter(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#e33e33] [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                            >
                                <option value="all">All Events</option>
                                {allEvents.map(event => (
                                    <option key={event} value={event}>{event}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Filter by College</label>
                            <select
                                value={collegeFilter}
                                onChange={(e) => setCollegeFilter(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#e33e33] [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                            >
                                <option value="all">All Colleges</option>
                                {allColleges.map(college => (
                                    <option key={college} value={college}>{college}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Sort By</label>
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#e33e33] [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                                >
                                    <option value="registeredAt">Registration Date</option>
                                    <option value="displayName">Name</option>
                                    <option value="college">College</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white"
                                >
                                    <FaSortAmountDown className={`transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">College</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Events</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 text-gray-500">
                                        <FaUsers className="text-4xl mx-auto mb-4 opacity-50" />
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-white">{user.displayName || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{user.department || '-'} • Year {user.year || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300 max-w-[200px] truncate" title={user.college}>
                                                {user.college || '-'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <FaEnvelope size={10} /> {user.email || '-'}
                                                </p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <FaPhone size={10} /> {user.phone || '-'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {user.events && user.events.length > 0 ? (
                                                    <>
                                                        {user.events.slice(0, 2).map((event, i) => (
                                                            <span key={i} className="text-xs px-2 py-0.5 bg-[#e33e33]/20 text-[#e33e33] rounded-full">
                                                                {event.length > 12 ? event.slice(0, 12) + '...' : event}
                                                            </span>
                                                        ))}
                                                        {user.events.length > 2 && (
                                                            <span className="text-xs px-2 py-0.5 bg-white/10 text-gray-400 rounded-full">
                                                                +{user.events.length - 2}
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-500">No events</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <FaCalendarAlt size={10} />
                                                {formatDate(user.registeredAt)}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Footer */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Total: {users.length} users</span>
                <span>•</span>
                <span>Showing: {filteredUsers.length} users</span>
                <span>•</span>
                <span>Colleges: {allColleges.length}</span>
                <span>•</span>
                <span>Events: {allEvents.length}</span>
            </div>
        </motion.div>
    );
};

export default AdminUsers;
