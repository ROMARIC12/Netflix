// Moviepage.jsx

import { Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js"; 

const Moviepage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Récupérer l'utilisateur et son statut d'abonnement directement depuis le store
  const { user, isSubscribed } = useAuthStore(); 
  
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzljMmVhZmY4ZmRjYTQ2NTViNmIyZjJjZmQ4NDNkOCIsIm5iZiI6MTc0Nzc1MzE5OS45ODEsInN1YiI6IjY4MmM5OGVmZjVhNGY0ZWFjODBiZGVlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cmyUJszskZoKvz-S5n-Tpmc4l3wGUuFF-VoJPVvpqqo",
    },
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then((res) => res.json())
      .then((res) => {
        setMovie(res);
      })
      .catch((err) => console.error(err));

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setRecommendations(res.results || []))
      .catch((err) => console.error(err));

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        const trailer = res.results?.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        setTrailerKey(trailer?.key || null);
      })
      .catch((err) => console.error(err));
      
  }, [id]);

  // Nouvelle fonction pour gérer le clic sur "Regarder maintenant"
  const handleWatchNow = () => {
    // Vérifier si l'utilisateur est connecté
    if (!user || !user.email) {
      navigate("/signin"); 
      return;
    }
    
    // Logique pour vérifier si le film est premium
    const isPremium = movie?.vote_average >= 8;

    if (isPremium && !isSubscribed) {
      // Rediriger vers la page de paiement si le film est premium et l'utilisateur non abonné
      navigate("/payment");
    } else {
      // Sinon, rediriger vers la page du lecteur
      navigate(`/player/${id}`);
    }
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl text-red-500">Chargement...</span>
      </div>
    );
  }

  // La logique pour déterminer le texte du bouton est maintenant dans le JSX
  const buttonText = (movie?.vote_average >= 8 && !isSubscribed)
    ? "S'abonner maintenant"
    : "Regarder maintenant";

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <div
        className="relative h-[60vh] flex item-end"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>

        <div className="relative z-10 flex items-end p-8 gap-8">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            className="rounded-lg shadow-lg w-48 hidden md:block"
          />

          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>{movie.release_date}</span>
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="max-w-2xl text-gray-200">{movie.overview}</p>
              <button 
              onClick={handleWatchNow}
              className="flex justify-center items-center bg-[#e50914]  text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base mt-2 md:mt-4"
            >
              <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> 
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>
        <div className="bg-[#232323] rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <ul className="text-gray-300 space-y-3">
              <li>
                <span className="font-semibold text-white">Status: </span>
                <span className="ml-2">{movie.status}</span>
              </li>

              <li>
                <span className="font-semibold text-white">Date: </span>
                <span className="ml-2">{movie.release_date}</span>
              </li>

              <li>
                <span className="font-semibold text-white">
                  Langues:
                </span>
                <span className="ml-2">
                  {movie.original_language?.toUpperCase()}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">Prix: </span>
                <span className="ml-2">
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">Revenue:</span>{" "}
                <span className="ml-2">
                  {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">
                  Production :
                </span>
                <span className="ml-2">
                  {movie.production_companies &&
                  movie.production_companies.length > 0
                    ? movie.production_companies.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">Villes:</span>
                <span className="ml-2">
                  {movie.production_countries &&
                  movie.production_countries.length > 0
                    ? movie.production_countries.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">
                  Langue:
                </span>
                <span className="ml-2">
                  {movie.spoken_languages && movie.spoken_languages.length > 0
                    ? movie.spoken_languages
                        .map((l) => l.english_name)
                        .join(", ")
                    : "N/A"}
                </span>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Tagline</h3>
            <p className="italic text-gray-400 mb-6">
              {movie.tagline || "No tagline available."}
            </p>

            <h3 className="font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-200">{movie.overview}</p>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Vous pourez aimer ca...
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec) => (
              <div
                key={rec.id}
                className="bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition"
              >
                <Link to={`/movie/${rec.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="text-sm font-semibold">{rec.title}</h3>
                    <span className="text-xs text-gray-400">
                      {rec.release_date?.slice(0, 4)}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Moviepage;