// src/components/HeroSection.js
import React from 'react';

const HeroSection = ({ nome, cargo }) => (
    <section id="home" className="section-full-height hero-section">
        <h1 className="hero-name">{nome}</h1>
        <h2 className="hero-title">{cargo}</h2>
        <p className="hero-bio">
            Transformando requisitos complexos em soluções robustas e escaláveis usando as melhores práticas de Back-end.
        </p>
        <div className="hero-cta">
            <a href="#projects" className="cta-button primary">Ver Projetos</a>
            <a href="#contact" className="cta-button secondary">Fale Comigo</a>
        </div>
    </section>
);

export default HeroSection;