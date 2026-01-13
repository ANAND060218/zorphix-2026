import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Admin email
const ADMIN_EMAIL = 'admin@zorphix.com';

const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.email === ADMIN_EMAIL) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#e33e33] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default AdminRoute;
