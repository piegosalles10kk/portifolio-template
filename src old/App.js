import React, { useState, useEffect, useRef } from 'react';
import './App.css'; 

// Configuração da API (Mantida Inalterada)
const API_URL = 'http://localhost:2100';

const api = {
    getPortfolio: async () => {
        await new Promise(resolve => setTimeout(resolve, 600)); 
        const response = await fetch(`${API_URL}/portifolio`);
        if (!response.ok) throw new Error('Erro ao buscar portfólio. Verifique o servidor JSON.');
        const data = await response.json();
        return data[0]; 
    },
    
    getProjects: async () => {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Erro ao buscar projetos. Verifique o servidor JSON.');
        return response.json();
    }
};

// --- Componentes Modulares e Reutilizáveis ---

// Componente: Navegação/Menu Fixo
const Navbar = ({ sections, sectionRefs, isDarkMode, toggleDarkMode }) => {
    const scrollToSection = (id) => {
        if (sectionRefs.current[id]) {
            sectionRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <header className="navbar-container">
            <div className="navbar-logo">{'<Dev />'}</div>
            <nav className="navbar-menu">
                {sections.map(item => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="nav-link"
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            {/* Botão de Dark Mode */}
            <button 
                onClick={toggleDarkMode} 
                className="dark-mode-toggle" 
                aria-label={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
        </header>
    );
};

// Componente: Skill Icon (Simplificado, sem barra de nível)
const SkillVisualItem = ({ linguagem }) => {
    // Tenta extrair a chave do ícone (ex: 'Node.js(Express)' -> 'nodejs')
    const iconKeyMatch = linguagem.match(/^([^(\s]+)/);
    let iconKey = iconKeyMatch ? iconKeyMatch[1].toLowerCase().trim() : linguagem.toLowerCase().trim();
    iconKey = iconKey.replace(/\./g, '').replace(/ /g, '');

    // Mapeamento manual para casos comuns onde o regex falha ou a skillicons usa outra chave
    const iconMap = {
        'nodejs': 'nodejs',
        'java': 'java',
        'python': 'python',
        'react': 'react',
        'php': 'php',
        'sql': 'mysql', 
        'nosql': 'mongodb', 
        'express': 'express',
        'spring': 'spring',
        'flask': 'flask',
        'aws': 'aws',
        'azure': 'azure',
        'vps': 'linux', 
        'hyperv': 'windows', 
        'docker': 'docker',
    };
    const finalIconKey = iconMap[iconKey] || iconKey;


    return (
        <li className="skill-visual-item-simple"> {/* Nova classe para o estilo simplificado */}
            {/* Ícone da Skill (Usando a API skillicons.dev) */}
            <img 
                src={`https://skillicons.dev/icons?i=${finalIconKey}`} 
                alt={`${linguagem} Icon`}
                className="skill-icon"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://skillicons.dev/icons?i=default"; }} // Fallback para ícone padrão
            />
            <span className="skill-name-text">{linguagem}</span>
        </li>
    );
};

// Componente: HERO SECTION (Mantido)
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

// Componente: ABOUT SECTION (Mantido)
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
                <a href={`mailto:${email}`} className="contact-value">
                    Email <span className="arrow">→</span>
                </a>
            </div>
        </div>
    </section>
);

// Componente: SKILLS SECTION (Atualizado: Sem Nível)
const SkillsSection = ({ tecnologias }) => {
    const categories = [
        { name: 'Back-end', key: 'backend' },
        { name: 'Front-end (Base)', key: 'frontend' },
        { name: 'Database', key: 'dB' },
        { name: 'DevOps & Cloud', key: 'deploy' },
    ];

    return (
        <section id="skills" className="section-padding skills-section">
            <h2 className="section-heading">Stack e Habilidades</h2>
            
            <div className="skills-grid">
                {categories.map(category => (
                    <div key={category.key} className="skill-category-card">
                        <h3 className="category-title">{category.name}</h3>
                        <ul className="skill-visual-list">
                            {tecnologias[category.key] && tecnologias[category.key].map((skill, index) => (
                                <SkillVisualItem 
                                    key={index}
                                    linguagem={skill.linguagem}
                                />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Componente: EXPERIENCE SECTION (Mantido)
const ExperienceSection = ({ experiencia }) => (
    <section id="experience" className="section-padding experience-section">
        <h2 className="section-heading">Experiência Profissional</h2>
        <div className="timeline-container">
            {experiencia.map((exp, index) => {
                const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : 'Atual';
                const period = `${formatDate(exp.dataInicio)} — ${formatDate(exp.dataFim)}`;

                return (
                    <div key={index} className="timeline-item">
                        <div className="timeline-date">{period}</div>
                        <div className="timeline-content">
                            <h3 className="job-title">{exp.cargo}</h3>
                            <p className="job-company">{exp.empresa}</p>
                            <p className="job-description">{exp.descricao}</p>
                            <div className="job-tags">
                                {Object.values(exp.tecnologiasUsadas).flat().map((tech, i) => (
                                    <span key={i} className="tech-tag">{tech.linguagem}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </section>
);

// Componente: PROJECTS SECTION (Atualizado: Botão Deploy Condicional)
const ProjectsSection = ({ projects }) => (
    <section id="projects" className="section-padding projects-section">
        <h2 className="section-heading">Principais Projetos</h2>
        <div className="projects-grid-minimal">
            {projects.length === 0 ? (
                <p className="no-projects">Nenhum projeto encontrado. Repositórios em breve.</p>
            ) : (
                projects.map((projeto) => {
                    const techs = Object.values(projeto.tecnologiasProjeto).flat().map(t => t.linguagem).join(', ');
                    
                    // Verifica se o campo deployProjeto existe e não está vazio
                    const hasDeploy = projeto.deployProjeto && projeto.deployProjeto.trim() !== '';

                    return (
                        <div key={projeto._id} className="project-card">
                            {/* Imagem do Projeto */}
                            <div className="project-image-wrapper">
                                <img 
                                    src={projeto.imagemProjeto} 
                                    alt={`Preview do Projeto ${projeto.tituloProjeto}`} 
                                    className="project-image"
                                />
                            </div>

                            <h3 className="project-card-title">{projeto.tituloProjeto}</h3>
                            <p className="project-card-summary">{projeto.resumoProjeto}</p>
                            
                            <div className="project-card-details">
                                <p className="project-card-tech">Stack: {techs || "N/A"}</p>
                                
                                <div className="project-links-group">
                                    <a
                                        href={projeto.gitHubProjeto}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-link-button-minimal"
                                    >
                                        Código →
                                    </a>
                                    
                                    {/* NOVO: Botão de Deploy Condicional */}
                                    {hasDeploy && (
                                        <a
                                            href={projeto.deployProjeto}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link-button-deploy"
                                        >
                                            Deploy ★
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </section>
);

// --- Componente Principal Portfolio (One-Page) ---
const Portfolio = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Referências para scroll
    const sectionRefs = useRef({});

    // Lógica do Dark Mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedMode = localStorage.getItem('darkMode');
        if (storedMode !== null) {
            return JSON.parse(storedMode);
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };
    
    // Aplica a classe 'dark-mode' ao body
    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : '';
    }, [isDarkMode]);


    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [portfolioResponse, projectsResponse] = await Promise.all([
                api.getPortfolio(),
                api.getProjects()
            ]);
            setPortfolioData(portfolioResponse);
            setProjects(projectsResponse);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const sections = [
        { id: 'home', label: 'Início' },
        { id: 'about', label: 'Sobre' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Histórico' },
        { id: 'projects', label: 'Projetos' },
    ];
    
    // Funções de carregamento/erro
    if (loading) return <div className="loading-screen">Carregando perfil profissional...</div>;
    if (error) return <div className="error-screen">Erro: Falha ao carregar dados.</div>;
    if (!portfolioData) return <div className="no-data-screen">Dados não encontrados.</div>;

    const { nome, cargo, sobreMim, tecnologias, experiencia, github, linkedin, telefone, email } = portfolioData;

    // Componente de renderização principal
    const renderSection = (Component, props, id) => (
        <div ref={el => sectionRefs.current[id] = el}>
            <Component {...props} />
        </div>
    );
    
    return (
        <div className="portfolio-minimalist-wrapper">
            <Navbar 
                sections={sections} 
                sectionRefs={sectionRefs} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={toggleDarkMode} 
            />

            <main className="main-content-scroll">
                {renderSection(HeroSection, { nome, cargo }, 'home')}
                <div className="content-divider"></div>
                {renderSection(AboutSection, { sobreMim, github, linkedin, email, telefone }, 'about')}
                <div className="content-divider"></div>
                {renderSection(SkillsSection, { tecnologias }, 'skills')}
                <div className="content-divider"></div>
                {renderSection(ProjectsSection, { projects }, 'projects')}                
                <div className="content-divider"></div>
                {renderSection(ExperienceSection, { experiencia }, 'experience')}

            </main>
            
            <footer className="footer-minimalist">
                <p>Desenvolvido por {nome} | {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
};

export default Portfolio;