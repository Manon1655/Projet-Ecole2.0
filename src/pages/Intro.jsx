import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TRANSITION_DURATION = 1800; // plus lent, plus cinéma

export default function Intro() {
  const navigate = useNavigate();
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    document.body.classList.add("intro-page");
    return () => document.body.classList.remove("intro-page");
  }, []);

  const handleTouch = () => {
    if (touched) return;
    setTouched(true);

    setTimeout(() => {
      navigate("/home");
    }, TRANSITION_DURATION);
  };

  return (
    <div
      className={`scene ${touched ? "touched" : ""}`}
      onClick={handleTouch}
      role="button"
      tabIndex={0}
      aria-label="Entrer dans le monde magique"
    >
      <div className="bg-light" />

      <div className="stars-back" />
      <div className="stars-mid" />
      <div className="stars-front" />

      <div className="portal" />

      <div className="guardian" />
      <div className="guardian-hand" />
    </div>
  );
}
