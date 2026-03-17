import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { Heart, ThumbsDown, Star } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

// L'URL de votre API Backend pour interagir avec MongoDB.
// Elle a été mise à jour pour correspondre à la route que nous avons ajoutée dans le backend.
const BACKEND_API_URL = "http://localhost:5000/api/user/actions";

const CardList = ({ title, category }) => {
  const [data, setData] = useState([]);
  const [userActions, setUserActions] = useState({});
  const { user } = useAuthStore();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzljMmVhZmY4ZmRjYTQ2NTViNmIyZjJjZmQ4NDNkOCIsIm5iZiI6MTc0Nzc1MzE5OS45ODEsInN1YiI6IjY4MmM5OGVmZjVhNGY0ZWFjODBiZGVlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cmyUJszskZoKvz-S5n-Tpmc4l3wGUuFF-VoJPVvpqqo",
    },
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`, options)
      .then((res) => res.json())
      .then((res) => {
        setData(res.results);
      })
      .catch((err) => console.error(err));
  }, [category]);

  const toggleAction = async (movieId, actionType) => {
    if (!user || !user.email) {
      toast.error("Veuillez vous connecter pour effectuer cette action.");
      return;
    }
    
    // Optimistic UI update
    setUserActions(prevActions => ({
      ...prevActions,
      [movieId]: {
        ...prevActions[movieId],
        [actionType]: !prevActions[movieId]?.[actionType]
      }
    }));

    try {
      const response = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // La clé "email" est maintenant utilisée au lieu de "userId"
        // pour correspondre à la logique de votre contrôleur
        body: JSON.stringify({ movieId, actionType, email: user.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update action");
      }
      
      const result = await response.json();
      console.log("Action updated:", result);
      toast.success(result.msg || `Action ${actionType} mise à jour !`);

      // Mettez à jour l'UI avec l'état exact renvoyé par le serveur
      // pour garantir la synchronisation
      setUserActions(prevActions => ({
        ...prevActions,
        [movieId]: {
            ...prevActions[movieId],
            [actionType]: result.isLiked // Assurez-vous que votre API renvoie l'état
        }
      }));

    } catch (error) {
      console.error("Error updating action:", error);
      toast.error("Échec de la mise à jour de l'action.");
      // Annuler l'optimistic update en cas d'erreur
      setUserActions(prevActions => ({
        ...prevActions,
        [movieId]: {
          ...prevActions[movieId],
          [actionType]: !prevActions[movieId]?.[actionType]
        }
      }));
    }
  };

  const handleLike = (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleAction(movieId, "isLiked");
  };

  const handleDislike = (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleAction(movieId, "isDisliked");
  };

  const handleFavorite = (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleAction(movieId, "isFavorite");
  };

  const getButtonClass = (movieId, actionType) => {
    const isActive = userActions[movieId]?.[actionType];
    const baseClass = "p-3 rounded-full transition-colors duration-300";
    if (actionType === "isLiked") {
      return `${baseClass} ${isActive ? "bg-red-600" : "bg-gray-800 hover:bg-red-600"}`;
    }
    if (actionType === "isDisliked") {
      return `${baseClass} ${isActive ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-600"}`;
    }
    if (actionType === "isFavorite") {
      return `${baseClass} ${isActive ? "bg-yellow-400" : "bg-gray-800 hover:bg-yellow-400"}`;
    }
    return baseClass;
  };

  return (
    <div className="text-white md:px-4">
      <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>
      <Swiper slidesPerView={"auto"} spaceBetween={10} className="mySwiper">
        {data.map((item) => (
          <SwiperSlide key={item.id} className="max-w-72 relative group rounded-lg overflow-hidden">
            <Link to={`/movie/${item.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                alt={item.original_title}
                className="h-44 w-full object-center object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-4">
                  <button
                    onClick={(e) => handleLike(e, item.id)}
                    className={getButtonClass(item.id, "isLiked")}
                  >
                    <Heart size={20} className="text-white" />
                  </button>
                </div>
              </div>
              <p className="text-center pt-2 font-medium">{item.original_title}</p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardList;
