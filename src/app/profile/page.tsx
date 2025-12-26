"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import './profile.css';

interface Registration {
    eventId: string;
    eventName: string;
    registeredAt: string;
    paymentStatus: string;
    paymentId: string | null;
    amount: number;
}

interface UserData {
    uid: string;
    email: string;
    name: string;
    department: string;
    year: string;
    contactNo: string;
    collegeName: string;
    degree: string;
    qrCodeBase64?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Edit mode states
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<UserData>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
    const [userDocId, setUserDocId] = useState<string>("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            try {
                // Query by uid field (works with old data saved with random doc IDs)
                const usersRef = collection(db, "users");
                const userQuery = query(usersRef, where("uid", "==", user.uid));
                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                    const docSnap = userSnapshot.docs[0];
                    const data = docSnap.data() as UserData;
                    console.log("User data found:", data);
                    setUserData(data);
                    setUserDocId(docSnap.id);
                    setEditData({
                        name: data.name || '',
                        department: data.department || '',
                        year: data.year || '',
                        contactNo: data.contactNo || '',
                        collegeName: data.collegeName || '',
                        degree: data.degree || '',
                    });

                    // Check multiple possible field names for QR code
                    const qrCode = data.qrCodeBase64;
                    if (qrCode) {
                        setQrCodeUrl(qrCode);
                    } else {
                        // If QR code is missing, generate it on the fly
                        try {
                            const qrResponse = await fetch("/api/qrcode", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    uid: user.uid,
                                    name: data.name,
                                    email: data.email,
                                    department: data.department,
                                    year: data.year,
                                    contactNo: data.contactNo,
                                    collegeName: data.collegeName,
                                    degree: data.degree,
                                }),
                            });
                            const qrData = await qrResponse.json();
                            if (qrData.qrCodeBase64) {
                                setQrCodeUrl(qrData.qrCodeBase64);
                            }
                        } catch (err) {
                            console.error("Error generating missing QR:", err);
                        }
                    }
                } else {
                    console.log("No user doc found for uid:", user.uid);
                }

                const registrationsRef = collection(db, "registrations");
                const q = query(registrationsRef, where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const regs: Registration[] = querySnapshot.docs.map(doc => doc.data() as Registration);
                setRegistrations(regs);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleEditToggle = () => {
        if (isEditMode) {
            // Cancel edit - reset to original data
            setEditData({
                name: userData?.name || '',
                department: userData?.department || '',
                year: userData?.year || '',
                contactNo: userData?.contactNo || '',
                collegeName: userData?.collegeName || '',
                degree: userData?.degree || '',
            });
            setSaveError(null);
            setSaveSuccess(null);
        }
        setIsEditMode(!isEditMode);
    };

    const handleInputChange = (field: keyof UserData, value: string) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        if (!user || !userDocId) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            // Update Firestore document
            const userRef = doc(db, "users", userDocId);
            await updateDoc(userRef, {
                name: editData.name,
                department: editData.department,
                year: editData.year,
                contactNo: editData.contactNo,
                collegeName: editData.collegeName,
                degree: editData.degree,
            });

            // Generate new QR code with updated data
            const qrResponse = await fetch("/api/qrcode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user.uid,
                    name: editData.name,
                    email: userData?.email,
                    department: editData.department,
                    year: editData.year,
                    contactNo: editData.contactNo,
                    collegeName: editData.collegeName,
                    degree: editData.degree,
                }),
            });

            const qrData = await qrResponse.json();

            if (qrData.qrCodeBase64) {
                // Update QR code in Firestore
                await updateDoc(userRef, {
                    qrCodeBase64: qrData.qrCodeBase64,
                });

                // Update local state
                setQrCodeUrl(qrData.qrCodeBase64);
                setUserData(prev => prev ? {
                    ...prev,
                    name: editData.name || prev.name,
                    department: editData.department || prev.department,
                    year: editData.year || prev.year,
                    contactNo: editData.contactNo || prev.contactNo,
                    collegeName: editData.collegeName || prev.collegeName,
                    degree: editData.degree || prev.degree,
                    qrCodeBase64: qrData.qrCodeBase64,
                } : null);

                setSaveSuccess("Profile updated and new QR code sent to your email!");
            } else {
                setSaveSuccess("Profile updated successfully!");
            }

            setIsEditMode(false);
        } catch (error) {
            console.error("Error saving profile:", error);
            setSaveError("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading || loadingData) {
        return (
            <div className="section-profile">
                <p style={{ color: '#fff', textAlign: 'center', fontSize: '2rem' }}>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="section-profile">
            <div className="profile__navigation">
                <button className="profile__back-button" onClick={() => router.push('/')}>
                    ← Back
                </button>
                <button className="profile__logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="u-center-text">
                <h2 className="heading-secondary">Your Profile</h2>
            </div>

            {/* Success/Error Messages */}
            {saveSuccess && (
                <div className="profile__message profile__message--success">
                    {saveSuccess}
                </div>
            )}
            {saveError && (
                <div className="profile__message profile__message--error">
                    {saveError}
                </div>
            )}

            {qrCodeUrl && (
                <div className="profile__qr u-center-text">
                    <img
                        src={qrCodeUrl}
                        alt="Your QR Code"
                        className="profile__qr-image"
                    />
                    <p style={{ color: '#888', marginTop: '10px', fontSize: '1.5rem' }}>
                        Your unique event pass
                    </p>
                </div>
            )}

            <div className="profile__info-container">
                <div className="profile__info-header">
                    <h3>Personal Information</h3>
                    <button
                        className={`profile__edit-btn ${isEditMode ? 'profile__edit-btn--cancel' : ''}`}
                        onClick={handleEditToggle}
                    >
                        {isEditMode ? '✕ Cancel' : '✎ Edit Profile'}
                    </button>
                </div>

                <div className="profile__info">
                    <div className="profile__field">
                        <strong>Email:</strong>
                        <span>{user.email}</span>
                    </div>

                    <div className="profile__field">
                        <strong>Name:</strong>
                        {isEditMode ? (
                            <input
                                type="text"
                                className="profile__input"
                                value={editData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your name"
                            />
                        ) : (
                            <span>{userData?.name || 'Not specified'}</span>
                        )}
                    </div>

                    <div className="profile__field">
                        <strong>Department:</strong>
                        {isEditMode ? (
                            <input
                                type="text"
                                className="profile__input"
                                value={editData.department || ''}
                                onChange={(e) => handleInputChange('department', e.target.value)}
                                placeholder="Enter your department"
                            />
                        ) : (
                            <span>{userData?.department || 'Not specified'}</span>
                        )}
                    </div>

                    <div className="profile__field">
                        <strong>College:</strong>
                        {isEditMode ? (
                            <input
                                type="text"
                                className="profile__input"
                                value={editData.collegeName || ''}
                                onChange={(e) => handleInputChange('collegeName', e.target.value)}
                                placeholder="Enter your college name"
                            />
                        ) : (
                            <span>{userData?.collegeName || 'Not specified'}</span>
                        )}
                    </div>

                    <div className="profile__field">
                        <strong>Degree:</strong>
                        {isEditMode ? (
                            <input
                                type="text"
                                className="profile__input"
                                value={editData.degree || ''}
                                onChange={(e) => handleInputChange('degree', e.target.value)}
                                placeholder="Enter your degree"
                            />
                        ) : (
                            <span>{userData?.degree || 'Not specified'}</span>
                        )}
                    </div>

                    <div className="profile__field">
                        <strong>Year:</strong>
                        {isEditMode ? (
                            <select
                                className="profile__input profile__select"
                                value={editData.year || ''}
                                onChange={(e) => handleInputChange('year', e.target.value)}
                            >
                                <option value="">Select Year</option>
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                            </select>
                        ) : (
                            <span>{userData?.year ? `Year ${userData.year}` : 'Not specified'}</span>
                        )}
                    </div>

                    <div className="profile__field">
                        <strong>Contact:</strong>
                        {isEditMode ? (
                            <input
                                type="tel"
                                className="profile__input"
                                value={editData.contactNo || ''}
                                onChange={(e) => handleInputChange('contactNo', e.target.value)}
                                placeholder="Enter your contact number"
                            />
                        ) : (
                            <span>{userData?.contactNo || 'Not specified'}</span>
                        )}
                    </div>

                    {isEditMode && (
                        <button
                            className="profile__save-btn"
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : '💾 Save & Update QR Code'}
                        </button>
                    )}
                </div>
            </div>

            <div className="u-center-text" style={{ marginTop: '3rem' }}>
                <h3 style={{ color: '#fff', fontSize: '3rem', marginBottom: '2rem' }}>
                    Registered Events ({registrations.length})
                </h3>
                {registrations.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '1.8rem' }}>No events registered yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                        {registrations.map((reg, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    padding: '2rem',
                                    borderRadius: '15px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    minWidth: '280px',
                                    textAlign: 'left'
                                }}
                            >
                                <h4 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1rem' }}>{reg.eventName}</h4>
                                <p style={{ color: '#888', fontSize: '1.4rem', margin: '0.5rem 0' }}>
                                    Registered: {formatDate(reg.registeredAt)}
                                </p>
                                <p style={{ color: '#888', fontSize: '1.4rem', margin: '0.5rem 0' }}>
                                    Amount: {reg.amount > 0 ? `₹${reg.amount}` : 'FREE'}
                                </p>
                                <p style={{
                                    color: reg.paymentStatus === 'completed' || reg.paymentStatus === 'free' || reg.paymentStatus === 'test_payment' ? '#22c55e' : '#fbbf24',
                                    fontSize: '1.4rem',
                                    margin: '0.5rem 0'
                                }}>
                                    Status: {reg.paymentStatus === 'completed' ? '✓ Paid' : reg.paymentStatus === 'free' ? '✓ Registered' : reg.paymentStatus === 'test_payment' ? '✓ Test Payment' : reg.paymentStatus}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
