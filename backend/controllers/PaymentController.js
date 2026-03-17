// PaymentController.js

import { FusionPay } from "fusionpay";
import User from '../models/UserModel.js';
import 'dotenv/config';
import crypto from 'crypto';

// Configuration de l'API FusionPay depuis les variables d'environnement
const fusionPay = new FusionPay(process.env.FUSIONPAY_API_URL);

// On définit le prix de l'abonnement une seule fois, côté serveur.
const PRIX_ABONNEMENT = 999; // 9.99 EUR en centimes

// Logique pour l'initiation du paiement
export const initiatePayment = async (req, res) => {
  try {
    const { email, clientNumber, clientName } = req.body;

    // 1. Validation de la requête côté serveur
    if (!email || !clientNumber || !clientName) {
      return res.status(400).json({ msg: "Email, nom ou numéro de téléphone manquant." });
    }

    // 2. Vérification de l'utilisateur dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    // 4. Retourner l'URL de paiement spécifique demandée par l'utilisateur
    const paymentUrl = "https://payin.moneyfusion.net/payment/69b995c2d64e43f87154d437/318/KOUAKOU%20ROMARIC%20ANICET";
    return res.status(200).json({ url: paymentUrl });

  } catch (error) {
    console.error("Erreur interne lors de l'initialisation du paiement:", error);
    return res.status(500).json({ msg: "Une erreur interne est survenue.", details: error.message });
  }
};

// Logique pour le traitement du webhook
export const handleWebhook = async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Validation du token
    if (!token) {
      return res.status(400).json({ msg: "Token de paiement manquant." });
    }

    // 2. Vérification du statut du paiement auprès de FusionPay
    const status = await fusionPay.checkPaymentStatus(token);

    if (status.statut && status.data.statut === "paid") {
      const customData = status.data.personal_Info[0];
      const userId = customData.userId;

      const user = await User.findById(userId);

      if (user) {
        user.isSubscribed = true;
        user.subscriptionExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Ajoute 30 jours
        await user.save();
        console.log(`Abonnement activé pour l'utilisateur ${user.email}.`);
      }

      return res.status(200).json({ msg: "Paiement réussi, abonnement mis à jour." });
    } else {
      console.log(`Paiement en attente ou échoué. Statut: ${status.data.statut}`);
      return res.status(400).json({ msg: "Paiement en attente ou échoué." });
    }
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    res.status(500).json({ msg: "Erreur serveur lors du traitement du webhook." });
  }
};