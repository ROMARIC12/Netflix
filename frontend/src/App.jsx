import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Player from "./pages/Player.jsx";
import {Toaster} from "react-hot-toast"
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import AIRecommendations from "./pages/AIRecommendations";
import Payment from "./pages/Payment"; 
import Success from "./pages/Success"; 
import Cancel from "./pages/Cancel";   
import LikedMovies from "./pages/LikedMovies.jsx";
import Account from "./pages/Account"; // Importez le nouveau composant


const App = () => {
  const {fetchUser, fetchingUser} = useAuthStore();

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if(fetchingUser){
    return <p className="text-[#e50914]">Chargement en cours...</p>
  }
  return (
    <div>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/movie/:id"} element={<Moviepage />} />
        <Route path={"/signin"} element={<SignIn />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/ai-recommendations"} element={<AIRecommendations />} />
        <Route path="/player/:id" element={<Player />} /> 
        <Route exact path="/payment" element={<Payment />} />
        <Route exact path="/success" element={<Success />} />
        <Route exact path="/cancel" element={<Cancel />} />
        <Route path="/liked-movies" element={<LikedMovies />} />
        <Route path="/account" element={<Account />} /> {/* Ajoutez cette nouvelle route */}
      </Routes>
    </div>
  );
};

export default App;