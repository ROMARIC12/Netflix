// src/pages/Player.jsx

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import Hls from 'hls.js';
import { useAuthStore } from "../store/authStore.js";
import axios from "axios";

const API_BASE_URL = "https://netflixback-go5x.onrender.com/api";

export default function Player() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();

  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideoStream = async () => {
      // 1. Vérification de l'authentification
      if (!user || !user.email) {
        navigate("/signin");
        return;
      }
      
      try {
        const response = await axios.post(`${API_BASE_URL}/videos/stream/${id}`, { email: user.email });
        
        if (response.status === 200) {
          setVideoUrl(response.data.url);
        }
      } catch (err) {
        // 2. Gestion de l'erreur 403 pour les abonnements
        if (err.response && err.response.status === 403) {
          // Redirection directe vers la page de paiement sans modale
          navigate("/payment");
        } else {
          // 3. Gestion des autres erreurs
          console.error("Erreur lors de la récupération de la vidéo :", err.message);
          setError("Une erreur est survenue lors de la lecture de la vidéo.");
        }
      }
    };
    
    fetchVideoStream();
  }, [id, user, navigate]);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.attachMedia(videoRef.current);
        hls.loadSource(videoUrl);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error(`HLS.js: ${data.details}`, event);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.recoverMediaError();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });
        
        return () => {
          hls.destroy();
        };

      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoUrl;
        videoRef.current.play();
      } else {
        setError("Votre navigateur ne peut pas lire ce type de vidéo.");
      }
    }
  }, [videoUrl]);

  return (
    <Container>
      <div className="player">
        <div className="back">
          <BsArrowLeft onClick={() => navigate(-1)} />
        </div>
        {videoUrl ? (
          <video ref={videoRef} autoPlay controls muted />
        ) : (
          <div className="loading">
            {error ? <p style={{color: 'red', textAlign: 'center'}}>{error}</p> : "Chargement de la vidéo..."}
          </div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .player {
    width: 100vw;
    height: 100vh;
    .back {
      position: absolute;
      padding: 2rem;
      z-index: 1;
      svg {
        font-size: 3rem;
        cursor: pointer;
      }
    }
    .loading {
      color: white;
      text-align: center;
      padding-top: 50vh;
      font-size: 1.5rem;
    }
    video {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
`;
