// src/components/AboutSection.js
import React from 'react';

const AboutSection = ({ sobreMim, github, linkedin, email, telefone }) => (
    <section id="about" className="section-padding about-section">
        <h2 className="section-heading">Sobre Mim</h2>
        <div className="about-content">
            <div className="about-text">
                {sobreMim.split('\n\n').map((paragraph, index) => {
                    const content = paragraph.trim(); 
                    if (!content) return null; 
                    return (
                        <p key={index} className="about-paragraph">
                            {content}
                        </p>
                    );
                })}
            </div>
            <div className="social-links-minimal">
                <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    GitHub <span className="arrow">→</span>
                </a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                    LinkedIn <span className="arrow">→</span>
                </a>
                <a href={`https://wa.me/${telefone}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    WhatsApp <span className="arrow">→</span>
                </a>
                <a href={`mailto:${email}`} className="social-link">
                    Email <span className="arrow">→</span>
                </a>
            </div>
        </div>
    </section>
);

export default AboutSection;