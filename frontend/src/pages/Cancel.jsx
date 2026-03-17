import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Paiement Annulé</h1>
        <p className="text-gray-400 mb-8">
          Votre paiement a été annulé ou a échoué. Votre abonnement n'a pas été activé.
        </p>
        <button
          onClick={() => navigate('/payment')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors mr-4"
        >
          Réessayer
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Cancel;
