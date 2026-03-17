// VideoController.js

import Video from "../models/VideoModel.js";
import User from "../models/UserModel.js"; 
import 'dotenv/config';

// Récupération des variables de configuration depuis .env
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const getStreamUrl = (videoPath) => {
  if (!R2_PUBLIC_URL || !videoPath) {
    throw new Error("R2_PUBLIC_URL ou videoPath manquant.");
  }
  return `${R2_PUBLIC_URL}/${videoPath}`;
};

export const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const videos = await Video.find({ category: category });
    if (videos.length === 0) {
      return res.status(404).json({ msg: "Aucune vidéo trouvée pour cette catégorie." });
    }
    return res.json({ videos });
  } catch (error) {
    return res.status(500).json({ msg: "Erreur lors de la récupération des vidéos.", error: error.message });
  }
};

export const getVideoStream = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body; 

    if (!email) {
      return res.status(401).json({ msg: "Authentification requise. Email manquant." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    // Tente de trouver la vidéo par l'ID de TheMovieDB
    let video = await Video.findOne({ videoId: id });

    // Nouvelle logique de redirection (fallback)
    if (!video) {
      console.log(`Vidéo avec l'ID ${id} non trouvée, redirection vers une vidéo par défaut.`);

      // Récupère une vidéo aléatoire depuis la base de données
      const allVideos = await Video.find({});
      if (allVideos.length > 0) {
        // Sélectionne une vidéo aléatoire
        const randomIndex = Math.floor(Math.random() * allVideos.length);
        video = allVideos[randomIndex];
      } else {
        // S'il n'y a aucune vidéo dans la base de données
        return res.status(404).json({ msg: "Aucune vidéo par défaut disponible." });
      }
    }
    
    // VERIFICATION DE L'ABONNEMENT ET DE SON EXPIRATION
    if (video.isPremium) {
      if (!user.isSubscribed) {
        // Si l'utilisateur n'est pas abonné, renvoyer une erreur 403
        return res.status(403).json({ msg: "Accès refusé. Veuillez vous abonner pour regarder ce contenu." });
      }

      const now = new Date();
      if (user.subscriptionExpiryDate && user.subscriptionExpiryDate < now) {
        // Si l'abonnement a expiré, le désactiver et renvoyer une erreur 403
        user.isSubscribed = false;
        await user.save();
        return res.status(403).json({ msg: "Votre abonnement a expiré. Veuillez le renouveler." });
      }
    }

    const videoUrl = getStreamUrl(video.videoPath);
    return res.json({ url: videoUrl, title: video.title });

  } catch (error) {
    console.error("Erreur dans getVideoUrl:", error);
    return res.status(500).json({ msg: "Erreur serveur lors de la lecture de la vidéo.", error: error.message });
  }
};

export const addVideo = async (req, res) => {
  try {
    const { title, description, category, thumbnail, videoPath, isPremium, videoId } = req.body;
    
    if (!title || !category || !videoPath || !videoId) {
      return res.status(400).json({ msg: "Les champs 'title', 'category', 'videoPath' et 'videoId' sont obligatoires." });
    }

    const newVideo = new Video({ title, description, category, thumbnail, videoPath, isPremium, videoId });
    await newVideo.save();

    return res.status(201).json({ msg: "Vidéo ajoutée avec succès.", video: newVideo });
  } catch (error) {
    return res.status(500).json({ msg: "Erreur lors de l'ajout de la vidéo.", error: error.message });
  }
};