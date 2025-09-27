import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import './App.css'; 

// Configuração da API (Mantido apenas GETs)
const API_URL = 'http://localhost:2100';

const api = {
  getPortfolio: async () => {
    // Simulação de delay na rede para efeito de carregamento do terminal
    await new Promise(resolve => setTimeout(resolve, 800)); 
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

// --- Componentes Modulares e Reutilizáveis (Estilo Terminal) ---

// Componente: Linha de Comando de Título
const CommandPrompt = ({ command, output }) => (
    <div className="console-line">
        <span className="prompt-prefix">user@backend-dev:~$</span> 
        <span className="prompt-command">{command}</span>
        {output && <div className="prompt-output">{output}</div>}
    </div>
);

// Componente: Navegação de Abas (Tabs) - Simula diferentes janelas do terminal
const ConsoleTabs = ({ sections, activeSection, setActiveSection }) => (
    <nav className="console-tabs">
        {sections.map(item => (
            <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`console-tab ${activeSection === item.id ? 'active' : ''}`}
            >
                {item.label}
            </button>
        ))}
    </nav>
);

// Componente: Skill Progress Orb (Adaptado para ícones e cores do terminal)
const SkillProgressOrb = ({ nivel, linguagem }) => {
  let colorClass = 'danger-color'; // Vermelho (1-4)
  if (nivel >= 5 && nivel <= 7) {
    colorClass = 'warning-color'; // Amarelo (5-7)
  } else if (nivel >= 8) {
    colorClass = 'success-color'; // Verde (8-10)
  }

  // Visualização do nível como uma barra de progresso no terminal
  return (
    <div className="skill-item-terminal">
      <span className={`skill-status-indicator ${colorClass}`}>■</span>
      <span className="skill-name-terminal">{linguagem}</span>
      <span className={`skill-level-terminal ${colorClass}`}>
        [{'|'.repeat(nivel)}{' '.repeat(10 - nivel)}] {nivel}/10
      </span>
    </div>
  );
};

// Componente: HERO SECTION (Terminal)
const HeroSection = ({ nome, cargo, setActiveSection }) => (
    <div className="console-section active" id="home">
        <CommandPrompt command="exec run_profile --verbose" />
        <pre className="console-output large-text">
            {`\n[[STATUS: ONLINE]]\n
    Iniciando Sessão...
    Acesso Concedido: `}
            <span className="success-color">{nome}</span>
            {`
    
    Perfil: `}
            <span className="accent-color">{cargo.toUpperCase()}</span>
            {`\n
    Use as abas para navegar ou execute:
    `}
            <button 
                onClick={() => setActiveSection('skills')} 
                className="console-link-button"
            >

            </button>
            {`\n`}
        </pre>
    </div>
);

// Componente: ABOUT SECTION (Terminal)
const AboutSection = ({ sobreMim, github, linkedin }) => (
    <div className="console-section" id="about">
        <CommandPrompt command="cat ./README.md" />
        <div className="console-output">
            <h3 className="section-title-terminal">-- SOBRE --</h3>
            {sobreMim.split('\n\n').map((paragraph, index) => (
                <p key={index} className="bio-paragraph-terminal">
                    {paragraph}
                </p>
            ))}
            <div className="social-links-terminal">
                <p>
                    <span className="success-color">CONNECT:</span>
                    <a href={`https://${github}`} target="_blank" rel="noopener noreferrer">
                         $ ssh {github}
                    </a>
                    <span className="pipe-separator"> | </span>
                    <a href={linkedin} target="_blank" rel="noopener noreferrer">
                         $ view_linkedin_profile
                    </a>
                </p>
            </div>
        </div>
    </div>
);

// Componente: SKILLS SECTION (Terminal)
const SkillsSection = ({ tecnologias }) => {
    const categories = [
        { name: 'Backend (Core)', key: 'backend' },
        { name: 'Frontend (Base)', key: 'frontend' },
        { name: 'Database (Persistence)', key: 'dB' },
        { name: 'Deploy & DevOps (Infra)', key: 'deploy' },
    ];

    return (
        <div className="console-section" id="skills">
            <CommandPrompt command="list_modules -l --stats" />
            <div className="console-output">
                <h3 className="section-title-terminal">-- HABILIDADES E STATS --</h3>
                <div className="skills-grid-terminal">
                    {categories.map(category => (
                        <div key={category.key} className="skill-category-terminal">
                            <p className="category-title-terminal accent-color">
                                [ {category.name} ]
                            </p>
                            <div className="skill-items-list">
                                {tecnologias[category.key] && tecnologias[category.key].map((skill, index) => (
                                    <SkillProgressOrb 
                                        key={index} 
                                        nivel={skill.nivel} 
                                        linguagem={skill.linguagem} 
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <SkillsDistributionChart tecnologias={tecnologias} />
            </div>
        </div>
    );
};

// Componente: Skills Distribution Chart (Gráfico estilo Terminal)
const SkillsDistributionChart = ({ tecnologias }) => {
    // Cores em variáveis CSS serão definidas no App.css
    const pieData = [
        { name: 'Backend', value: tecnologias.backend.length, color: 'var(--backend-color)' },
        { name: 'Frontend', value: tecnologias.frontend.length, color: 'var(--frontend-color)' },
        { name: 'Database', value: tecnologias.dB.length, color: 'var(--db-color)' },
        { name: 'Deploy', value: tecnologias.deploy.length, color: 'var(--deploy-color)' }
    ].filter(item => item.value > 0);

    if (pieData.length === 0) return null;

    return (
        <div className="chart-container-terminal">
            <p className="chart-title-small-terminal">
                <span className="accent-color">#STATS:</span> Distribuição de Módulos (Categorias)
            </p>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: 'var(--bg-color-dark)', 
                            border: '1px solid var(--accent-color)',
                            color: 'var(--text-color-light)',
                            fontFamily: 'monospace'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};


// Componente: EXPERIENCE SECTION (Terminal)
const ExperienceSection = ({ experiencia }) => (
    <div className="console-section" id="experience">
        <CommandPrompt command="show_history --work" />
        <div className="console-output">
            <h3 className="section-title-terminal">-- HISTÓRICO DE TRABALHO --</h3>
            <div className="experience-timeline-terminal">
                {experiencia.map((exp, index) => {
                    const formatDate = (dateString) => {
                        if (!dateString) return 'ACTIVE';
                        const date = new Date(dateString);
                        return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).toUpperCase();
                    };
                    const period = `${formatDate(exp.dataInicio)} >> ${formatDate(exp.dataFim)}`;

                    return (
                        <div key={index} className="job-item-terminal">
                            <p className="job-header">
                                <span className="success-color">[{period}]</span> 
                                <span className="job-title-terminal"> $ {exp.cargo}</span>
                            </p>
                            <p className="job-company-terminal">@ {exp.empresa}</p>
                            <p className="job-description-terminal">
                                <span className="accent-color">DESC: </span> {exp.descricao}
                            </p>
                            <p className="tech-stack-terminal">
                                <span className="warning-color">STACK: </span>
                                {Object.values(exp.tecnologiasUsadas).flat().map((tech, i) => (
                                    <span key={i} className="tech-tag-terminal">{tech.linguagem}</span>
                                ))}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
);

// Componente: PROJECTS SECTION (Terminal)
const ProjectsSection = ({ projects }) => (
    <div className="console-section" id="projects">
        <CommandPrompt command="ls -l ./repositories" />
        <div className="console-output">
            <h3 className="section-title-terminal">-- REPOSITÓRIOS --</h3>
            {projects.length === 0 ? (
                <p className="no-projects-terminal accent-color">
                    Diretório vazio. Mais projetos em breve.
                </p>
            ) : (
                <div className="projects-list-terminal">
                    {projects.map((projeto) => {
                        // Concatenando todas as tecnologias em uma string para o display minimalista
                        const techs = Object.values(projeto.tecnologiasProjeto).flat().join(', ');
                        return (
                            <div key={projeto._id} className="project-item-terminal">
                                <p className="project-name-terminal">
                                    <span className="accent-color">FILE: </span> 
                                    {projeto.tituloProjeto}
                                </p>
                                <p className="project-summary-terminal">
                                    <span className="text-muted">DESC: </span> 
                                    {projeto.resumoProjeto}
                                </p>
                                <p className="project-tech-terminal">
                                    <span className="text-muted">LANGS: </span> 
                                    {techs}
                                </p>
                                <div className="project-links-terminal">
                                    <a
                                        href={projeto.gitHubProjeto}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-terminal"
                                    >
                                        $ git clone {projeto.gitHubProjeto}
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
);

// Componente: CONTACT SECTION (Terminal)
const ContactSection = ({ email, telefone, linkedin, github }) => (
    <div className="console-section" id="contact">
        <CommandPrompt command="get_contact_info" />
        <div className="console-output">
            <h3 className="section-title-terminal">-- CONTATO --</h3>
            <p className="contact-line">
                <span className="accent-color">EMAIL:</span> 
                <a href={`mailto:${email}`} className="link-terminal"> $ mailto {email}</a>
            </p>
            <p className="contact-line">
                <span className="accent-color">PHONE:</span> 
                <a href={`tel:${telefone}`} className="link-terminal"> $ call {telefone}</a>
            </p>
            <p className="contact-line">
                <span className="accent-color">LINKEDIN:</span> 
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="link-terminal"> $ view {linkedin.split('/').pop()}</a>
            </p>
            <p className="contact-line">
                <span className="accent-color">GITHUB:</span> 
                <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="link-terminal"> $ view {github}</a>
            </p>
        </div>
    </div>
);


// --- Componente Principal Portfolio (O Console) ---
const Portfolio = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [portfolioData, setPortfolioData] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        { id: 'home', label: 'INÍCIO' },
        { id: 'about', label: 'SOBRE' },
        { id: 'skills', label: 'SKILLS' },
        { id: 'experience', label: 'HISTÓRICO' },
        { id: 'projects', label: 'PROJETOS' },
        { id: 'contact', label: 'CONTATO' }
    ];

    if (loading) return <div className="loading-screen terminal-font">Iniciando sistema... <span className="blinking-cursor">_</span></div>;
    if (error) return <div className="error-screen terminal-font danger-color">ERROR: {error}</div>;
    if (!portfolioData) return <div className="no-data-screen terminal-font warning-color">ERR: DATA NOT FOUND</div>;

    const { nome, cargo, sobreMim, tecnologias, experiencia, github, linkedin, telefone, email } = portfolioData;

    // Componente que renderiza a seção ativa
    const renderSection = () => {
        switch (activeSection) {
            case 'home':
                return <HeroSection nome={nome} cargo={cargo} setActiveSection={setActiveSection} />;
            case 'about':
                return <AboutSection sobreMim={sobreMim} github={github} linkedin={linkedin} />;
            case 'skills':
                return <SkillsSection tecnologias={tecnologias} />;
            case 'experience':
                return <ExperienceSection experiencia={experiencia} />;
            case 'projects':
                return <ProjectsSection projects={projects} />;
            case 'contact':
                return <ContactSection email={email} telefone={telefone} linkedin={linkedin} github={github} />;
            default:
                return <HeroSection nome={nome} cargo={cargo} setActiveSection={setActiveSection} />;
        }
    };

    return (
        <div className="portfolio-terminal-wrapper">
            <div className="portfolio-terminal-container">
                
                <ConsoleTabs 
                    sections={sections} 
                    activeSection={activeSection} 
                    setActiveSection={setActiveSection} 
                />

                <div className="terminal-content">
                    {renderSection()}
                </div>
            </div>
            
            <footer className="terminal-footer">
                <span className="prompt-prefix">portifolio-cli:~$</span> 
                <span className="blinking-cursor">_</span>
            </footer>
        </div>
    );
};

export default Portfolio;