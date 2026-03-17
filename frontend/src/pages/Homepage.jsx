import React from "react";
import Hero from "../components/Hero";
import CardList from "../components/CardList";
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <div className="p-5">
      <Hero />
      <CardList title="en cours" category="now_playing" />
      <CardList title="Mieux noté" category="top_rated" />
      <CardList title="Populaire" category="popular" />
      <CardList title="Bientot" category="upcoming" />
      <Footer />
    </div>
  );
};

export default Homepage;
