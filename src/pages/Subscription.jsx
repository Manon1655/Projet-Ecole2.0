import { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { subscriptionPlans, annualPlans } from '../data/subscriptions';
import '../styles/subscription.css';

export default function Subscription() {
  const { subscription, subscribe } = useSubscription();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = isAnnual ? annualPlans : subscriptionPlans;

  const handleSubscribe = (plan) => {
    subscribe({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features,
      subscribedAt: new Date().toISOString()
    });
    alert(`Félicitations ! Vous êtes abonné à ${plan.name}`);
  };

  return (
    <div className="subscription-container">
      {/* Hero Section */}
      <section className="subscription-hero">
        <h1>Choisissez Votre Plan d'Abonnement</h1>
        <p>Accédez à des milliers de livres et explorez des mondes imaginaires sans limites</p>
      </section>

      {/* Toggle Section */}
      <section className="toggle-section">
        <div className="toggle-container">
          <button 
            className={`toggle-btn ${!isAnnual ? 'active' : ''}`}
            onClick={() => setIsAnnual(false)}
          >
            Mensuel
          </button>
          <button 
            className={`toggle-btn ${isAnnual ? 'active' : ''}`}
            onClick={() => setIsAnnual(true)}
          >
            Annuel
            <span className="savings-badge">Économisez jusqu'à 40%</span>
          </button>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="plans-section">
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">⭐ Le Plus Populaire</div>}
              
              {plan.savings && (
                <div className="savings-label">
                  Économisez {plan.savings}%
                </div>
              )}

              <div className="plan-header">
                <h2>{plan.name}</h2>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-pricing">
                <div className="price-display">
                  {plan.originalPrice && (
                    <span className="original-price">{plan.originalPrice.toFixed(2)}€</span>
                  )}
                  <span className="price">{plan.price.toFixed(2)}€</span>
                  <span className="duration">{plan.duration}</span>
                </div>
              </div>

              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`plan-btn ${subscription?.id === plan.id ? 'active' : ''}`}
                onClick={() => handleSubscribe(plan)}
              >
                {subscription?.id === plan.id ? '✓ Abonné' : 'S\'abonner'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Questions Fréquemment Posées</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Puis-je changer de plan ?</h3>
            <p>Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont effectifs immédiatement.</p>
          </div>
          <div className="faq-item">
            <h3>Y a-t-il une période d'essai ?</h3>
            <p>Oui ! Vous avez 7 jours d'essai gratuit pour tester notre service sans engagement.</p>
          </div>
          <div className="faq-item">
            <h3>Puis-je annuler à tout moment ?</h3>
            <p>Bien sûr ! Vous pouvez annuler votre abonnement n'importe quand, sans frais supplémentaires.</p>
          </div>
          <div className="faq-item">
            <h3>Quels moyens de paiement acceptez-vous ?</h3>
            <p>Nous acceptons les cartes bancaires, PayPal, Apple Pay et Google Pay pour votre commodité.</p>
          </div>
          <div className="faq-item">
            <h3>Les audiolivres sont-ils inclus ?</h3>
            <p>Les audiolivres sont inclus dans les plans Premium et Illimité. Le plan Découverte propose un accès limité.</p>
          </div>
          <div className="faq-item">
            <h3>Puis-je télécharger des livres ?</h3>
            <p>Oui, les plans Premium et Illimité permettent de télécharger des livres pour une lecture hors ligne.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2>Pourquoi Nous Choisir ?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">📚</div>
            <h3>Vaste Collection</h3>
            <p>Des milliers de titres couvrant tous les genres et tous les goûts de lecture.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>Accès Rapide</h3>
            <p>Accédez instantanément à vos livres préférés sur tous vos appareils.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h3>Recommandations</h3>
            <p>Découvrez des livres parfaitement adaptés à vos préférences grâce à notre IA.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👥</div>
            <h3>Partage Familial</h3>
            <p>Avec le plan Illimité, partagez votre abonnement avec toute votre famille.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
