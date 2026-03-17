// UserController.js
import User from "../models/UserModel.js";
import { FusionPay } from "fusionpay";
import 'dotenv/config';

const FUSIONPAY_API_URL = process.env.FUSIONPAY_API_URL;
const RETURN_URL = process.env.RETURN_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

export const createOrUpdateUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required." });
    }
    
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({ email, likedMovies: [] });
      return res.status(201).json({ msg: "User successfully created.", user });
    } else {
      return res.status(200).json({ msg: "User already exists.", user });
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return res.status(500).json({ msg: "Error creating or updating user." });
  }
};


export const getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ msg: "success", movies: user.likedMovies });
    } else {
        return res.json({ msg: "User with given email not found." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching movies." });
  } 
};

// **NOUVELLE FONCTION** pour gérer toutes les actions
export const toggleUserAction = async (req, res) => {
  try {
    const { email, movieId, actionType } = req.body;

    if (!email || !movieId || !actionType) {
      return res.status(400).json({ msg: "Données manquantes." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    const likedMovies = user.likedMovies || [];
    let updatedMovies = [...likedMovies];

    const movieIndex = updatedMovies.findIndex((movie) => movie.movieId === movieId);
    const isAlreadyLiked = movieIndex !== -1;

    switch (actionType) {
      case 'isLiked':
        if (isAlreadyLiked) {
          // Si déjà aimé, le supprimer de la liste
          updatedMovies = updatedMovies.filter((movie) => movie.movieId !== movieId);
          await User.findByIdAndUpdate(user._id, { likedMovies: updatedMovies });
          return res.status(200).json({ msg: "Film retiré des films aimés.", isLiked: false });
        } else {
          // Sinon, l'ajouter
          updatedMovies.push({ movieId: movieId, liked: true });
          await User.findByIdAndUpdate(user._id, { likedMovies: updatedMovies });
          return res.status(200).json({ msg: "Film ajouté aux films aimés.", isLiked: true });
        }
      // Vous pouvez ajouter d'autres actions ici (isFavorite, isDisliked)
      default:
        return res.status(400).json({ msg: "Type d'action non valide." });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Erreur serveur lors de la mise à jour de l'action." });
  }
};

export const addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ movieId }) => movieId === data.movieId);
      
      if (movieAlreadyLiked) {
        return res.json({ msg: "Movie already added to the liked list." });
      } else {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },
          { new: true }
        );
      }
    } else {
      await User.create({ email, likedMovies: [data] });
    }
    
    return res.json({ msg: "Movie successfully added to liked list." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error adding movie to the liked list" });
  }
};

export const removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ movieId: mId }) => mId === movieId);
      
      if (movieIndex === -1) {
        return res.status(400).send({ msg: "Movie not found in the liked list." });
      }
      
      movies.splice(movieIndex, 1);
      
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: movies,
        },
        { new: true }
      );
      
      return res.json({ msg: "Movie successfully removed.", movies });
    } else {
        return res.json({ msg: "User with given email not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error removing movie from the liked list" });
  }
};

export const checkSubscriptionStatus = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email manquant." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }
    res.status(200).json({ isSubscribed: user.isSubscribed });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'abonnement:", error);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

export const abonement = async (req, res) => {
  try {
    const { email, clientName, clientNumber, price, orderId } = req.body;

    if (!email || !clientName || !clientNumber || !price || !orderId) {
      return res.status(400).json({ msg: "Veuillez remplir les informations nécessaires." });
    }

    const fusionPay = new FusionPay(FUSIONPAY_API_URL);

    fusionPay
      .totalPrice(price)
      .addArticle("Abonnement Netflix", price)
      .addInfo({
        orderId: orderId,
        customerEmail: email,
      })
      .clientName(clientName)
      .clientNumber(clientNumber)
      .returnUrl(RETURN_URL)
      .webhookUrl(WEBHOOK_URL);

    const response = await fusionPay.makePayment();
    
    return res.json({ msg: "Félicitation, votre abonnement a été reconduit.", url: response.url });

  } catch (error) {
    console.error("Payment initiation failed:", error);
    return res.status(500).json({ msg: "Error initiating payment.", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ msg: "Token missing from URL." });
    }

    const fusionPay = new FusionPay(FUSIONPAY_API_URL);
    const status = await fusionPay.checkPaymentStatus(token);

    if (status.statut && status.data.statut === "paid") {
      const { customerEmail } = status.data.personal_Info[0];
      
      await User.findOneAndUpdate(
        { email: customerEmail },
        { $set: { isSubscribed: true } },
        { new: true }
      );

      return res.redirect(`${RETURN_URL}?status=success`);
    } else {
      return res.redirect(`${RETURN_URL}?status=failed`);
    }

  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json({ msg: "Error verifying payment.", error: error.message });
  }
};