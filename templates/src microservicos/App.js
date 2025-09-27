import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import './App.css'; // Usaremos um novo CSS para o tema Dashboard

// Configuração da API (Mantida Inalterada)
const API_URL = 'http://localhost:2100';

const api = {
  getPortfolio: async () => {
    // Simulação de delay na rede
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

// --- Componentes Modulares e Reutilizáveis (Estilo Dashboard) ---

// Componente: Dashboard Card (Principal contêiner visual)
const DashboardCard = ({ title, children, statusClass = '' }) => (
    <div className={`dashboard-card ${statusClass}`}>
        <header className="card-header">
            <span className="card-icon">◇</span>
            <h2 className="card-title">{title}</h2>
        </header>
        <div className="card-content">
            {children}
        </div>
    </div>
);

// Componente: Botão de Ação Rápida no Menu (simula Links)
const QuickLinkButton = ({ label, target, setActiveSection }) => (
    <button 
        onClick={() => setActiveSection(target)} 
        className="quick-link-button"
    >
        &gt; {label}
    </button>
);

// Componente: Skill Bar Chart (Substitui o Gráfico de Pizza)
const ProficencyBarChart = ({ tecnologias }) => {
    // Coleta as 8 principais skills por nível de proficiência, ordenadas.
    const allSkills = [
        ...(tecnologias.backend || []),
        ...(tecnologias.frontend || []),
        ...(tecnologias.dB || []),
        ...(tecnologias.deploy || [])
    ];

    const chartData = allSkills
        .sort((a, b) => b.nivel - a.nivel)
        .slice(0, 8)
        .map(skill => ({
            name: skill.linguagem,
            Nível: skill.nivel
        }));
    
    // Função para definir a cor da barra com base no nível
    const getBarColor = (nivel) => {
        if (nivel >= 8) return 'var(--success-color)';
        if (nivel >= 5) return 'var(--warning-color)';
        return 'var(--danger-color)';
    };

    return (
        <DashboardCard title="Proficiência em Stack (Top 8)">
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis 
                        dataKey="name" 
                        stroke="var(--text-color-muted)" 
                        style={{ fontSize: '0.75rem' }} 
                        interval={0}
                        angle={-30} 
                        textAnchor="end"
                        height={50}
                    />
                    <YAxis 
                        domain={[0, 10]} 
                        ticks={[0, 5, 10]} 
                        stroke="var(--text-color-muted)"
                        style={{ fontSize: '0.8rem' }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'var(--bg-card-dark)', 
                            border: '1px solid var(--accent-color)', 
                            color: 'var(--text-color)',
                            fontSize: '0.9rem'
                        }}
                    />
                    <Bar dataKey="Nível">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.Nível)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </DashboardCard>
    );
};

// Componente: HERO SECTION (Status e Links)
const HeroSection = ({ nome, cargo, setActiveSection }) => (
    <div className="dashboard-grid-hero">
        <DashboardCard title="STATUS DO DEV" statusClass="status-online">
            <div className="status-detail">
                <span className="status-label">NOME:</span> 
                <span className="status-value highlight">{nome}</span>
            </div>
            <div className="status-detail">
                <span className="status-label">CARGO:</span> 
                <span className="status-value accent">{cargo.toUpperCase()} DEVELOPER</span>
            </div>
            <div className="status-detail">
                <span className="status-label">ARQUITETURA:</span> 
                <span className="status-value success">Microservices Ready</span>
            </div>
        </DashboardCard>
        
        <DashboardCard title="NAVEGAÇÃO RÁPIDA">
            <div className="quick-links">
                <QuickLinkButton label="Detalhes do Perfil" target="about" setActiveSection={setActiveSection} />
                <QuickLinkButton label="Ver Stack & Proficiência" target="skills" setActiveSection={setActiveSection} />
                <QuickLinkButton label="Histórico de Deployments" target="experience" setActiveSection={setActiveSection} />
                <QuickLinkButton label="Repositórios e Projetos" target="projects" setActiveSection={setActiveSection} />
            </div>
        </DashboardCard>
    </div>
);

// Componente: ABOUT SECTION (Logs de Inicialização)
const AboutSection = ({ sobreMim, github, linkedin }) => (
    <DashboardCard title="LOGS: Inicialização do Módulo Principal (ABOUT)">
        <pre className="log-output">
            $ init_module_about... [OK]
            $ loading_bio.txt...
            <p className="bio-dashboard">{sobreMim}</p>
            $ check_social_config...
            <div className="social-links-dashboard">
                <span>[GIT]: </span> 
                <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="link-github">{github}</a>
                <span className="divider"> | </span>
                <span>[LINKEDIN]: </span>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="link-linkedin">Acessar Perfil</a>
            </div>
            [COMPLETO]
        </pre>
    </DashboardCard>
);

// Componente: SKILLS SECTION (Tabela de Status de Componentes)
const SkillsSection = ({ tecnologias }) => {
    const categories = [
        { name: 'Backend (Services)', key: 'backend' },
        { name: 'Frontend (Client)', key: 'frontend' },
        { name: 'Database (Storage)', key: 'dB' },
        { name: 'Deploy (Infra & Ops)', key: 'deploy' },
    ];

    return (
        <div className="skills-dashboard">
            <DashboardCard title="Visão Geral da Arquitetura" statusClass="status-performance">
                <div className="status-table-container">
                    <table className="status-table">
                        <thead>
                            <tr>
                                <th>MÓDULO</th>
                                <th>STATUS</th>
                                <th>SKILLS (COMPONENTS)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.key}>
                                    <td className="module-name">{category.name}</td>
                                    <td className="module-status">
                                        <span className="status-indicator success-color">▲ ONLINE</span>
                                    </td>
                                    <td>
                                        {tecnologias[category.key] && tecnologias[category.key].map((skill, i) => (
                                            <span key={i} className="skill-tag">{skill.linguagem}</span>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DashboardCard>

            <ProficencyBarChart tecnologias={tecnologias} />
        </div>
    );
};


// Componente: EXPERIENCE SECTION (Timeline de Eventos/Deployments)
const ExperienceSection = ({ experiencia }) => (
    <DashboardCard title="LOGS DE EVENTOS: Histórico de Deployments (Trabalho)" statusClass="status-history">
        <div className="deployment-timeline">
            {experiencia.map((exp, index) => {
                const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).toUpperCase() : 'ACTIVE';
                const period = `${formatDate(exp.dataInicio)} - ${formatDate(exp.dataFim)}`;

                return (
                    <div key={index} className="deployment-event">
                        <span className="event-icon">■</span>
                        <div className="event-details">
                            <p className="event-title">
                                <span className="highlight-text">[{period}]</span> DEPLOYMENT: {exp.cargo} @ {exp.empresa}
                            </p>
                            <p className="event-description">Detalhes: {exp.descricao}</p>
                            <p className="event-stack">
                                Stack: {Object.values(exp.tecnologiasUsadas).flat().map(tech => tech.linguagem).join(', ')}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    </DashboardCard>
);

// Componente: PROJECTS SECTION (Repositórios em Bloco)
const ProjectsSection = ({ projects }) => (
    <DashboardCard title="REPOSITÓRIOS: Microservices Prontos">
        <div className="projects-grid">
            {projects.length === 0 ? (
                <p className="no-projects-dashboard">Nenhum projeto encontrado. Repositórios em construção.</p>
            ) : (
                projects.map((projeto) => {
                    const techs = Object.values(projeto.tecnologiasProjeto).flat().map(t => t.linguagem).join(', ');
                    return (
                        <div key={projeto._id} className="project-tile">
                            <h4 className="project-title-tile">{projeto.tituloProjeto}</h4>
                            <p className="project-summary-tile">{projeto.resumoProjeto}</p>
                            <p className="project-tech-tile">Stack: <span className="tech-list">{techs}</span></p>
                            <a
                                href={projeto.gitHubProjeto}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link-tile"
                            >
                                Acessar Repo &gt;
                            </a>
                        </div>
                    );
                })
            )}
        </div>
    </DashboardCard>
);

// Componente: CONTACT SECTION (Endpoint de Contato)
const ContactSection = ({ email, telefone, linkedin, github }) => (
    <DashboardCard title="ENDPOINT DE CONTATO: Status 200 OK">
        <div className="contact-endpoint">
            <p><span className="endpoint-label">EMAIL:</span> {email}</p>
            <p><span className="endpoint-label">TELEFONE:</span> {telefone}</p>
            <p><span className="endpoint-label">LINKEDIN:</span> <a href={linkedin} target="_blank" rel="noopener noreferrer" className="link-linkedin">{linkedin.split('/').pop()}</a></p>
            <p><span className="endpoint-label">GITHUB:</span> <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="link-github">{github}</a></p>
        </div>
    </DashboardCard>
);

// --- Componente Principal Portfolio (O Dashboard) ---

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
        { id: 'home', label: 'Dashboard' },
        { id: 'about', label: 'Sobre' },
        { id: 'skills', label: 'Stack' },
        { id: 'experience', label: 'Histórico' },
        { id: 'projects', label: 'Projetos' },
        { id: 'contact', label: 'Contato' }
    ];

    if (loading) return <div className="loading-screen dashboard-font">Iniciando Dashboard...</div>;
    if (error) return <div className="error-screen dashboard-font error-color">ERRO FATAL: {error}</div>;
    if (!portfolioData) return <div className="no-data-screen dashboard-font warning-color">DADOS NÃO ENCONTRADOS.</div>;

    const { nome, cargo, sobreMim, tecnologias, experiencia, github, linkedin, telefone, email } = portfolioData;

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
        <div className="portfolio-dashboard-wrapper">
            <header className="dashboard-header">
                <span className="logo">BACKEND PORTFOLIO v3.0</span>
                <nav className="dashboard-tabs">
                    {sections.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`dashboard-tab ${activeSection === item.id ? 'active' : ''}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="dashboard-main-content">
                {renderSection()}
            </main>
            
            <footer className="dashboard-footer">
                <p>Status: <span className="success-color">Services UP</span> | Latency: 2ms</p>
            </footer>
        </div>
    );
};

export default Portfolio;