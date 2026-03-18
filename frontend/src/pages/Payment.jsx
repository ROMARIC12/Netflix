import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://netflixback-go5x.onrender.com/api";

const Payment = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [clientName, setClientName] = useState('');
  const [clientNumber, setClientNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    if (!user || !user.email) {
      navigate('/signin');
      return;
    }

    if (!clientName || !clientNumber) {
      setError("Veuillez remplir votre nom et votre numéro de téléphone.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/payments/initiate-payment`, {
        email: user.email,
        clientName,
        clientNumber,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error("Erreur lors de la redirection vers le paiement:", err);
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-4">Abonnement Premium</h1>
        <p className="text-gray-400 mb-8">
          Accédez à des films et séries exclusifs, sans publicité.
        </p>
        <div className="mb-4 space-y-4">
          <input
            type="text"
            placeholder="Votre nom"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            placeholder="Votre numéro de téléphone"
            value={clientNumber}
            onChange={(e) => setClientNumber(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors w-full disabled:bg-red-800 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Redirection...' : 'Payer et S\'abonner'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
