import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const LikedMovies = () => {
  const { user } = useAuthStore();
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedMovies = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        // L'URL a été corrigée pour correspondre à la route de votre serveur
        const response = await fetch(`http://localhost:5000/api/user/liked/${user.email}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch liked movies.');
        }
        const data = await response.json();
        if (data.movies) {
          setLikedMovies(data.movies);
        }
      } catch (err) {
        console.error("Error fetching liked movies:", err);
        setError("Échec de la récupération de vos films. Veuillez réessayer plus tard.");
        toast.error("Échec de la récupération de la liste des favoris.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedMovies();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Chargement de vos films préférés...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Veuillez vous connecter pour voir vos films aimés.</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">{error}</div>;
  }

  if (likedMovies.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre liste de favoris est vide</h1>
        <p className="text-lg text-gray-400 mb-8">
          Ajoutez des films que vous aimez en cliquant sur le cœur dans les fiches.
        </p>
        <Link to="/" className="flex items-center space-x-2 text-red-500 hover:underline">
          <ChevronLeft size={20} />
          <span>Retourner à l'accueil</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 md:px-10">
      <h1 className="text-3xl font-bold mb-8">Mes Films Aimés</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {likedMovies.map((movie) => (
          <Link key={movie.movieId} to={`/movie/${movie.movieId}`}>
            <div className="group relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.image}`}
                alt={movie.title}
                className="h-60 w-full object-cover rounded-lg"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
                <p className="text-white text-sm font-semibold truncate">{movie.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LikedMovies;
