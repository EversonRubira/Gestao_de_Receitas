// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gestão de Receitas - Sistema carregado');

    // Dropdown menu handling
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });

    // Confirmação de eliminação
    const deleteButtons = document.querySelectorAll('[data-confirm]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm(this.getAttribute('data-confirm'))) {
                e.preventDefault();
            }
        });
    });
});

// API Helper functions
const API = {
    async get(endpoint) {
        try {
            const response = await fetch(`/api${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error('Erro na requisição GET:', error);
            throw error;
        }
    },

    async post(endpoint, data) {
        try {
            const response = await fetch(`/api${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro na requisição POST:', error);
            throw error;
        }
    },

    async put(endpoint, data) {
        try {
            const response = await fetch(`/api${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro na requisição PUT:', error);
            throw error;
        }
    },

    async delete(endpoint) {
        try {
            const response = await fetch(`/api${endpoint}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Erro na requisição DELETE:', error);
            throw error;
        }
    }
};

// Função para buscar receita aleatória externa
async function getRandomExternalRecipe() {
    try {
        const result = await API.get('/external/random');
        if (result.success) {
            console.log('Receita externa:', result.data);
            return result.data;
        }
    } catch (error) {
        console.error('Erro ao buscar receita externa:', error);
    }
}

// Exportar para uso global
window.API = API;
window.getRandomExternalRecipe = getRandomExternalRecipe;
