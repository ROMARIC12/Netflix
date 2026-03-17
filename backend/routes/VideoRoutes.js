// VideoRoutes.js

// Importation des dépendances et fonctions avec la syntaxe ESM
import express from 'express';
const router = express.Router();

// Importation des fonctions du contrôleur vidéo
import {
  getVideosByCategory,
  getVideoStream,
  addVideo,
} from "../controllers/VideoController.js"; 

// Route pour obtenir des vidéos par catégorie
router.get("/category/:category", getVideosByCategory);

// Route pour obtenir l'URL de streaming d'une vidéo
router.post("/stream/:id", getVideoStream);

// Route pour le back-office : ajouter une vidéo
router.post("/add", addVideo);

// Exportation du routeur avec la syntaxe ESM
export default router;