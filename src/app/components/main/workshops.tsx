"use client";

import React, { useEffect, useState } from "react";
import PopupModal from "./popupmodal";
import Aos from "aos";
import 'aos/dist/aos.css';
import { auth, db } from "@/firebaseConfig";
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Workshop {
  id: string;
  name: string;
  description: string;
  org1Name: string;
  org2Name: string;
  org1Phone: string;
  org2Phone: string;
  venue: string;
  price: number;
}

const workshopsData: Workshop[] = [
  {
    id: "uiux-figma",
    name: "UI/UX Feat. Figma",
    description: "Discover this exceptional collaborative process in UI/UX workshops to elevate digital product design. Gain the technical skills to wield design tools and shape user-centric innovation.",
    org1Name: "Jey Shreemen GR",
    org2Name: "P Athulya Kairali",
    org1Phone: "+91 76048 13964",
    org2Phone: "+91 98400 92758",
    venue: "ILP - IOT Lab",
    price: 50,
  },
  {
    id: "trading-investment",
    name: "Trading & Investment",
    description: "Unlock financial empowerment through our trading and investment workshop. Gain the tools to navigate finance confidently. Get ready to go from zero to hero!",
    org1Name: "Prathap D",
    org2Name: "Madhukeshwar MS",
    org1Phone: "+91 63797 54326",
    org2Phone: "+91 80728 92365",
    venue: "ILP - IOT Lab",
    price: 50,
  },
];

const Workshops: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [registeredWorkshops, setRegisteredWorkshops] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [eventInfo, setEventInfo] = useState({
    heading: "",
    content: "",
    org1Name: "",
    org2Name: "",
    org1Phone: "",
    org2Phone: "",
    registrationLink: "",
    venue: "",
  });

  useEffect(() => {
    Aos.init({ duration: 1500 });

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;

      try {
        const registrationsRef = collection(db, "registrations");
        const q = query(registrationsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const eventIds = querySnapshot.docs.map(doc => doc.data().eventId);
        setRegisteredWorkshops(eventIds);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    fetchRegistrations();
  }, [user]);

  const toggle = (workshop: Workshop) => {
    setEventInfo({
      heading: workshop.name,
      content: workshop.description,
      org1Name: workshop.org1Name,
      org2Name: workshop.org2Name,
      org1Phone: workshop.org1Phone,
      org2Phone: workshop.org2Phone,
      registrationLink: "",
      venue: workshop.venue,
    });
    setPopupVisible(!isPopupVisible);
  };

  const openRegisterModal = (workshop: Workshop) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (registeredWorkshops.includes(workshop.id)) {
      alert("You are already registered for this workshop!");
      return;
    }

    setSelectedWorkshop(workshop);
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setSelectedWorkshop(null);
  };

  const proceedRegistration = async () => {
    if (!selectedWorkshop || !user) return;

    setLoading(selectedWorkshop.id);
    closeRegisterModal();

    try {
      await handlePayment(selectedWorkshop);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const registerForWorkshop = async (workshop: Workshop, paymentStatus: string, paymentId: string | null) => {
    await addDoc(collection(db, "registrations"), {
      eventId: workshop.id,
      eventName: workshop.name,
      userId: user!.uid,
      userEmail: user!.email,
      registeredAt: new Date().toISOString(),
      paymentStatus: paymentStatus,
      paymentId: paymentId,
      amount: workshop.price,
    });

    setRegisteredWorkshops([...registeredWorkshops, workshop.id]);
    alert(`Successfully registered for ${workshop.name}!`);
  };

  const handlePayment = async (workshop: Workshop) => {
    try {
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: workshop.price,
          eventId: workshop.id,
          eventName: workshop.name,
          userId: user!.uid,
          userEmail: user!.email,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      if (orderData.testMode) {
        const confirmTest = confirm(
          `[TEST MODE]\n\nWorkshop: ${workshop.name}\nAmount: ₹${workshop.price}\n\nRazorpay is not configured. Click OK to simulate a successful payment for testing.`
        );

        if (confirmTest) {
          await registerForWorkshop(workshop, "test_payment", `test_${Date.now()}`);
        }
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Zorphix 2026",
        description: `Registration for ${workshop.name}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/payment/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                eventId: workshop.id,
                userId: user!.uid,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              await registerForWorkshop(workshop, "completed", response.razorpay_payment_id);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          email: user!.email,
        },
        theme: {
          color: "#1e3a5f",
        },
        modal: {
          ondismiss: function () {
            setLoading(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="section-tours" id="workshops">
      {/* Registration Confirmation Modal */}
      {showRegisterModal && selectedWorkshop && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#1a1a2e',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '90%',
            border: '2px solid #00d4ff',
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
          }}>
            <h2 style={{ color: '#00d4ff', marginBottom: '20px', fontSize: '1.8rem' }}>
              Confirm Registration
            </h2>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>{selectedWorkshop.name}</h3>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>{selectedWorkshop.description}</p>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(0, 212, 255, 0.1)', borderRadius: '10px' }}>
              <p style={{ color: '#fff', margin: '5px 0' }}>
                <strong>Venue:</strong> {selectedWorkshop.venue}
              </p>
              <p style={{ color: '#fff', margin: '5px 0' }}>
                <strong>Fee:</strong> ₹{selectedWorkshop.price}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={closeRegisterModal}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  border: '2px solid #666',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Cancel
              </button>
              <button
                onClick={proceedRegistration}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#00d4ff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                Pay ₹{selectedWorkshop.price}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="u-center-text u-margin-bottom-big">
        <h2 className="heading-secondary white" data-aos="zoom-in">
          Workshops
        </h2>
      </div>

      <div className="row">
        {workshopsData.map((workshop, index) => {
          const isRegistered = registeredWorkshops.includes(workshop.id);
          const isLoading = loading === workshop.id;
          const backClass = `card__side--back-${(index % 3) + 1}`;

          return (
            <div className="col-1-of-2" key={workshop.id}>
              <div className="card" data-aos="fade-up">
                <div className="card__side card__side--front">
                  <div className={`card__picture card__picture--${index + 2}-workshop`}>
                    &nbsp;
                  </div>
                  <h4 className="card__heading">
                    <span className={`card__heading-span card__heading-span--${(index % 3) + 1} bold-white`}>
                      {workshop.name}
                      <span style={{ fontSize: '0.8rem', marginLeft: '10px' }}>₹{workshop.price}</span>
                    </span>
                  </h4>
                  <div className="card__details">
                    <p>{workshop.description}</p>
                  </div>
                </div>
                <div className={`card__side card__side--back ${backClass}`}>
                  <div className="card__cta">
                    <div className="card__price-box">
                      <p className="btn btn--white" onClick={() => toggle(workshop)}>
                        Know More
                      </p>
                    </div>
                    {isRegistered ? (
                      <span className="btn btn--white" style={{ backgroundColor: '#22c55e', cursor: 'default' }}>
                        ✓ Registered
                      </span>
                    ) : (
                      <button
                        className="btn btn--white"
                        onClick={() => openRegisterModal(workshop)}
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1 }}
                      >
                        {isLoading ? "Processing..." : `Pay ₹${workshop.price}`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PopupModal
        title={eventInfo.heading}
        content={eventInfo.content}
        name1={eventInfo.org1Name}
        name2={eventInfo.org2Name}
        phone1={eventInfo.org1Phone}
        phone2={eventInfo.org2Phone}
        register={eventInfo.registrationLink}
        venue={eventInfo.venue}
        isVisible={isPopupVisible}
        toggle={() => setPopupVisible(!isPopupVisible)}
      />
    </div>
  );
};

export default Workshops;
