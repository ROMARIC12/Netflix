import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const Account = () => {
  const { user } = useAuthStore();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://netflixback-go5x.onrender.com/api/user/subscription-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch subscription status.");
        }
        
        const data = await response.json();
        setSubscriptionInfo(data);
      } catch (err) {
        console.error("Error fetching subscription status:", err);
        setError("Impossible de récupérer les informations d'abonnement.");
        toast.error("Échec de la récupération des informations.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Chargement des informations du compte...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Veuillez vous connecter pour voir les détails de votre compte.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 md:px-10">
      <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>
      <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="mb-4">
          <p className="text-gray-400">Nom d'utilisateur</p>
          <p className="text-white text-lg font-medium">{user.username}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-400">Email</p>
          <p className="text-white text-lg font-medium">{user.email}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-400">Statut de l'abonnement</p>
          {subscriptionInfo?.isSubscribed ? (
            <p className="text-green-500 text-lg font-bold">Actif</p>
          ) : (
            <p className="text-red-500 text-lg font-bold">Inactif</p>
          )}
        </div>
        {subscriptionInfo?.isSubscribed && user.subscriptionExpiryDate && (
          <div className="mb-4">
            <p className="text-gray-400">Date d'expiration</p>
            <p className="text-white text-lg font-medium">
              {new Date(user.subscriptionExpiryDate).toLocaleDateString()}
            </p>
          </div>
        )}
        <div className="mt-8">
          <Link to="/" className="flex items-center space-x-2 text-red-500 hover:underline">
            <ChevronLeft size={20} />
            <span>Retourner à l'accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
