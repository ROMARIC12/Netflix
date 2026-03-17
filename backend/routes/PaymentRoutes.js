// PaymentRoutes.js

// Importation des dépendances avec la syntaxe ESM
import express from "express";
const router = express.Router();

// Importation des fonctions du contrôleur de paiement
import { initiatePayment, handleWebhook } from "../controllers/PaymentController.js";

// Route pour initialiser un paiement
// Le nom de la route est plus explicite et correspond à la fonction du contrôleur
router.post("/initiate-payment", initiatePayment);

// Route pour le webhook (endpoint de notification)
// L'URL du webhook doit être la même que celle configurée dans la documentation de FusionPay
router.post("/webhook", handleWebhook);

// Exportation du routeur avec la syntaxe ESM
export default router;