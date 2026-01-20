import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/intro.css";

const OPEN_ANIMATION_DURATION = 1800;

export default function Intro() {
  const navigate = useNavigate();
  const [isOpening, setIsOpening] = useState(false);

  /* 👉 Ajout / retrait de la classe body */
  useEffect(() => {
    document.body.classList.add("intro-page");
    return () => {
      document.body.classList.remove("intro-page");
    };
  }, []);

  const handleOpenBook = useCallback(() => {
    if (isOpening) return;

    setIsOpening(true);

    setTimeout(() => {
      navigate("/home");
    }, OPEN_ANIMATION_DURATION);
  }, [isOpening, navigate]);

  return (
    <div className="scene">
      {/* Fond */}
      <div className="bg-image" />
      <div className="bg-light" />

      {/* Étoiles */}
      <div className="fairy-dust" />

      {/* Livre */}
      <div
        className={`book-container ${isOpening ? "opening" : ""}`}
        onClick={handleOpenBook}
        role="button"
        tabIndex={0}
        aria-label="Entrer dans le livre"
      >
        <div className="book-wrapper">

          {/* Pages */}
          <div className="pages-inner">
            <div className="page">
              <div className="page-content">
                <h2>Le Commencement</h2>
                <p>
                  Depuis toujours, les histoires façonnent notre monde.
                  Chaque page est une porte, chaque mot une lumière.
                </p>
                <p>Ici commence votre voyage.</p>
              </div>
            </div>

            <div className="page">
              <div className="page-content">
                <h2>À la Découverte</h2>
                <p>
                  Explorer, apprendre, grandir.
                  Les savoirs prennent racine dans l’imaginaire.
                </p>
              </div>
            </div>

            <div className="page">
              <div className="page-content">
                <h2>OmbreLune</h2>
                <p>
                  Une bibliothèque vivante, nichée entre nature et poésie.
                </p>
              </div>
            </div>
          </div>

          {/* Couverture */}
          <div className="book-cover">
            <div className="book-title">OmbreLune</div>
            <div className="book-subtitle">Bibliothèque vivante</div>
          </div>

        </div>
      </div>
    </div>
  );
}
