
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    uid: uuid(),
    name: '',
    email: '',
    password: '',
    department: '',
    year: '',
    contactNo: '',
    collegeName: '',
    degree: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, name, department, year, contactNo, collegeName, degree } = formData;
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        name,
        department,
        year,
        contactNo,
        collegeName,
        degree,
      });

    /*   await fetch('/api/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          name,
          email,
        }),
      }); */

      router.push('/auth/login');
    } catch (error) {
      setError('Failed to create an account. Please try again.');
      console.log(error);
      
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 border border-gray-300 rounded-lg shadow-md text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="contactNo"
          placeholder="Contact No"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="collegeName"
          placeholder="College Name"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="degree"
          placeholder="Degree"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className={`w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? 'cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
