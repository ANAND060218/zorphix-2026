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

interface Event {
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

const eventsData: Event[] = [
  {
    id: "xcoders",
    name: "xCoders",
    description: "CrossCoders is an electrifying coding competition where participants go beyond traditional coding. Contestants are expected to analyze code snippets and convert them into a language of their choice.",
    org1Name: "S Yathissh",
    org2Name: "Sachin A",
    org1Phone: "+91 87543 83899",
    org2Phone: "+91 98949 31196",
    venue: "To be Announced",
    price: 0,
  },
  {
    id: "thesis-precized",
    name: "Thesis-Precized",
    description: "Inspire us to redefine the tech landscape. Thesis Precised is your platform to present and engage in the presentation as they delve into the captivating realm of your thesis precisely.",
    org1Name: "Harini A",
    org2Name: "Poovizhi P",
    org1Phone: "+91 99520 51446",
    org2Phone: "+91 91500 02718",
    venue: "To be Announced",
    price: 0,
  },
  {
    id: "coin-quest",
    name: "Coin Quest",
    description: "Ever wanted to participate in a digital tech game event? Here's your chance! Participants play a series of wordplay, quizzes, and games that advance through rounds.",
    org1Name: "Ram Kumar M",
    org2Name: "Priyadharshini N",
    org1Phone: "+91 63809 41457",
    org2Phone: "+91 73959 30205",
    venue: "To be Announced",
    price: 0,
  },
  {
    id: "plutus",
    name: "Plutus",
    description: "66% of all statistics are made up. And we just made this up too. Plutus is an event based on the popular party game 2 Facts 1 Lie, albeit with a business touch to it!",
    org1Name: "Vinoth S",
    org2Name: "Adithya B",
    org1Phone: "+91 93425 37734",
    org2Phone: "+91 73390 44512",
    venue: "To be Announced",
    price: 0,
  },
  {
    id: "algo-rhythms",
    name: "ALGO-RHYTHMS",
    description: "Are you ready to dive into a world where melodies are composed by lines of code, and rhythm is dictated by algorithms? Let the beats and coding begin!",
    org1Name: "Jashvarthini R",
    org2Name: "Giridhar N",
    org1Phone: "+91 99400 23788",
    org2Phone: "+91 76049 50286",
    venue: "To be Announced",
    price: 0,
  },
  {
    id: "flip-it-quiz-it",
    name: "FLIP IT & QUIZ IT",
    description: "Prepare for an event of mind-bending scenarios, where the participants will be presented with complex situational questions that demand creative problem-solving.",
    org1Name: "Navinaa G",
    org2Name: "Mahmoodah Hafsah S",
    org1Phone: "+91 90802 30690",
    org2Phone: "+91 99402 61966",
    venue: "To be Announced",
    price: 0,
  },
  {
    id: "virtuoso",
    name: "Virtuoso",
    description: "Paying homage to Vijay TV's iconic Start Music, we're raising the stakes in music games. Join us for a day filled with musical excitement at Virtuoso!",
    org1Name: "Mathuku Jayasimha Reddy",
    org2Name: "Abirami S",
    org1Phone: "+91 83412 73412",
    org2Phone: "+91 73582 90831",
    venue: "To be Announced",
    price: 0,
  },
];

const TechEvents = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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

    // Load Razorpay script
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
        setRegisteredEvents(eventIds);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    fetchRegistrations();
  }, [user]);

  const toggle = (event: Event) => {
    setEventInfo({
      heading: event.name,
      content: event.description,
      org1Name: event.org1Name,
      org2Name: event.org2Name,
      org1Phone: event.org1Phone,
      org2Phone: event.org2Phone,
      registrationLink: "",
      venue: event.venue,
    });
    setPopupVisible(!isPopupVisible);
  };

  const openRegisterModal = (event: Event) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (registeredEvents.includes(event.id)) {
      alert("You are already registered for this event!");
      return;
    }

    setSelectedEvent(event);
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setSelectedEvent(null);
  };

  const proceedRegistration = async () => {
    if (!selectedEvent || !user) return;

    setLoading(selectedEvent.id);
    closeRegisterModal();

    try {
      if (selectedEvent.price === 0) {
        await registerForEvent(selectedEvent, "free", null);
      } else {
        await handlePayment(selectedEvent);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const registerForEvent = async (event: Event, paymentStatus: string, paymentId: string | null) => {
    await addDoc(collection(db, "registrations"), {
      eventId: event.id,
      eventName: event.name,
      userId: user!.uid,
      userEmail: user!.email,
      registeredAt: new Date().toISOString(),
      paymentStatus: paymentStatus,
      paymentId: paymentId,
      amount: event.price,
    });

    setRegisteredEvents([...registeredEvents, event.id]);
    alert(`Successfully registered for ${event.name}!`);
  };

  const handlePayment = async (event: Event) => {
    try {
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: event.price,
          eventId: event.id,
          eventName: event.name,
          userId: user!.uid,
          userEmail: user!.email,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // Check if it's test mode
      if (orderData.testMode) {
        const confirmTest = confirm(
          `[TEST MODE]\n\nEvent: ${event.name}\nAmount: ₹${event.price}\n\nRazorpay is not configured. Click OK to simulate a successful payment for testing.`
        );

        if (confirmTest) {
          await registerForEvent(event, "test_payment", `test_${Date.now()}`);
        }
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Zorphix 2026",
        description: `Registration for ${event.name}`,
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
                eventId: event.id,
                userId: user!.uid,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              await registerForEvent(event, "completed", response.razorpay_payment_id);
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
    <div className="section-tours" id="events">
      {/* Registration Confirmation Modal */}
      {showRegisterModal && selectedEvent && (
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
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>{selectedEvent.name}</h3>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>{selectedEvent.description}</p>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(0, 212, 255, 0.1)', borderRadius: '10px' }}>
              <p style={{ color: '#fff', margin: '5px 0' }}>
                <strong>Venue:</strong> {selectedEvent.venue}
              </p>
              <p style={{ color: '#fff', margin: '5px 0' }}>
                <strong>Fee:</strong> {selectedEvent.price > 0 ? `₹${selectedEvent.price}` : 'FREE'}
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
                {selectedEvent.price > 0 ? `Pay ₹${selectedEvent.price}` : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="u-center-text u-margin-bottom-big">
        <h2 className="heading-secondary white" data-aos="zoom-in">
          Events
        </h2>
      </div>

      <div className="row">
        {eventsData.slice(0, 3).map((event, index) => {
          const isRegistered = registeredEvents.includes(event.id);
          const isLoading = loading === event.id;
          const backClass = `card__side--back-${(index % 3) + 1}`;

          return (
            <div className="col-1-of-3" key={event.id}>
              <div className="card" data-aos="fade-up">
                <div className="card__side card__side--front">
                  <div className={`card__picture card__picture--${index + 1}-tech`}>
                    &nbsp;
                  </div>
                  <h4 className="card__heading">
                    <span className={`card__heading-span card__heading-span--${(index % 3) + 1} bold-white`}>
                      {event.name}
                      {event.price > 0 && <span style={{ fontSize: '0.8rem', marginLeft: '10px' }}>₹{event.price}</span>}
                    </span>
                  </h4>
                  <div className="card__details">
                    <p>{event.description}</p>
                  </div>
                </div>
                <div className={`card__side card__side--back ${backClass}`}>
                  <div className="card__cta">
                    <div className="card__price-box">
                      <p className="btn btn--white" onClick={() => toggle(event)}>
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
                        onClick={() => openRegisterModal(event)}
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1 }}
                      >
                        {isLoading ? "Processing..." : "Register Now"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sm-padding" id="section-tours">
        <div className="row">
          {eventsData.slice(3, 6).map((event, index) => {
            const isRegistered = registeredEvents.includes(event.id);
            const isLoading = loading === event.id;
            const backClass = `card__side--back-${(index % 3) + 1}`;

            return (
              <div className="col-1-of-3" key={event.id}>
                <div className="card" data-aos="fade-up">
                  <div className="card__side card__side--front">
                    <div className={`card__picture card__picture--${index + 4}-tech`}>
                      &nbsp;
                    </div>
                    <h4 className="card__heading">
                      <span className={`card__heading-span card__heading-span--${(index % 3) + 1} bold-white`}>
                        {event.name}
                        {event.price > 0 && <span style={{ fontSize: '0.8rem', marginLeft: '10px' }}>₹{event.price}</span>}
                      </span>
                    </h4>
                    <div className="card__details">
                      <p>{event.description}</p>
                    </div>
                  </div>
                  <div className={`card__side card__side--back ${backClass}`}>
                    <div className="card__cta">
                      <div className="card__price-box">
                        <p className="btn btn--white" onClick={() => toggle(event)}>
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
                          onClick={() => openRegisterModal(event)}
                          disabled={isLoading}
                          style={{ opacity: isLoading ? 0.7 : 1 }}
                        >
                          {isLoading ? "Processing..." : "Register Now"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sm-padding" id="section-tours">
        <div className="row">
          {eventsData.slice(6).map((event, index) => {
            const isRegistered = registeredEvents.includes(event.id);
            const isLoading = loading === event.id;
            const backClass = `card__side--back-${(index % 3) + 1}`;

            return (
              <div className="col-1-of-3" key={event.id}>
                <div className="card" data-aos="fade-up">
                  <div className="card__side card__side--front">
                    <div className={`card__picture card__picture--${(index % 6) + 1}-tech`}>
                      &nbsp;
                    </div>
                    <h4 className="card__heading">
                      <span className={`card__heading-span card__heading-span--${(index % 3) + 1} bold-white`}>
                        {event.name}
                        {event.price > 0 && <span style={{ fontSize: '0.8rem', marginLeft: '10px' }}>₹{event.price}</span>}
                      </span>
                    </h4>
                    <div className="card__details">
                      <p>{event.description}</p>
                    </div>
                  </div>
                  <div className={`card__side card__side--back ${backClass}`}>
                    <div className="card__cta">
                      <div className="card__price-box">
                        <p className="btn btn--white" onClick={() => toggle(event)}>
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
                          onClick={() => openRegisterModal(event)}
                          disabled={isLoading}
                          style={{ opacity: isLoading ? 0.7 : 1 }}
                        >
                          {isLoading ? "Processing..." : "Register Now"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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

export default TechEvents;
