import React from "react";

const Footer = () => {
  return (
    <div className="text-[#737373] md:px-10">
      <div className="py-20">
        <p>Devellopé par ROMARIC</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid exercitationem ipsum repudiandae ullam ut iusto corrupti. Animi sed veritatis minima numquam, doloribus quisquam eaque, modi illum hic alias nemo perferendis?.
        </p>
      </div>
      <p className="pb-5">Questions? Contactez-nous.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 text-sm pb-10 max-w-5xl">
        <ul className="flex flex-col space-y-2">
          <li>FAQ</li>
          <li>Politique de confidentialité</li>
          <li>Privacy</li>
          <li>Test rapide</li>
        </ul>

        <ul className="flex flex-col space-y-2">
          <li>Centre d'aide</li>
          <li>Jobs</li>
          <li>Cookie</li>
          <li>Info</li>
        </ul>

        <ul className="flex flex-col space-y-2">
          <li>Compte</li>
          <li>Regardez</li>
          <li>Information</li>
          <li>Seulement sur Netflix</li>
        </ul>

        <ul className="flex flex-col space-y-2">
          <li>Media Center</li>
          <li>Conditions d'utilisation</li>
          <li>Contactez nous</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
