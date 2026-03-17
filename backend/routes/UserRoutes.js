// UserRoutes.js

import express from 'express';
const router = express.Router();

import {
  addToLikedMovies,
  getLikedMovies,
  removeFromLikedMovies,
  toggleUserAction, // NOUVEL IMPORT
  abonement,
  verifyPayment,
  checkSubscriptionStatus
} from "../controllers/UserController.js"; 

// Routes des films favoris
router.get("/liked/:email", getLikedMovies);
router.post("/add", addToLikedMovies); // Route originale
router.put("/remove", removeFromLikedMovies); // Route originale

// NOUVELLE ROUTE : pour gérer le "like" et les autres actions
router.post("/actions", toggleUserAction);

// Routes de paiement et d'abonnement
router.post("/abonement", abonement);
router.get("/verify-payment", verifyPayment);
router.post("/subscription-status", checkSubscriptionStatus);

export default router;