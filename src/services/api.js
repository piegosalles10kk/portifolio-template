// src/services/api.js
const API_URL = 'http://localhost:2100';

export const api = {
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

// src/services/index.js
export * from './api';