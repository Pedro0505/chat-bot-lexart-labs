import React from 'react';
import { useNavigate } from 'react-router-dom';
import homeImage from './assets/homeImage.svg';
import './style.css';

function Home() {
  const navigator = useNavigate();

  return (
    <main className="home-container">
      <section className="home-content-container">
        <img
          src={homeImage}
          alt="Imagem ilustrativa de uma mulher mexendo em um celular como simulando um app de banco"
          className="home-image"
        />
        <div className="home-text-button-container">
          <div className="home-text-container">
            <h1>Welcome to Loan Helper 👋</h1>
            <h2>Our virtual assistant</h2>
          </div>
          <button
            type="button"
            className="home-start-btn"
            onClick={() => {
              navigator('/chat');
            }}>
            Start a Conversation
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;
