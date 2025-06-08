/**
 * Aplicação Principal Atualizada - AlfaReview Geografia
 * Integra sistema completo de questões interativas
 */

class AlfaReviewApp {
    constructor() {
        this.currentPage = 'home';
        this.currentUnit = null;
        this.sidebarOpen = false;
        this.gameStats = this.loadGameStats();
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initApp());
        } else {
            this.initApp();
        }
    }
    
    initApp() {
        this.bindEvents();
        this.updateProgressDisplay();
        this.showHome();
    }
    
    /**
     * Vincula eventos da aplicação
     */
    bindEvents() {
        // Eventos de navegação
        window.showHome = () => this.showHome();
        window.openUnit = (unitId) => this.openUnit(unitId);
        window.toggleSidebar = () => this.toggleSidebar();
        window.closeSidebar = () => this.closeSidebar();
        window.resetUnit = (unitId, event) => this.resetUnit(unitId, event);
        window.stitchSpeak = () => this.stitchSpeak();
        window.stitchWelcome = () => this.stitchWelcome();
        
        // Eventos de questões
        window.startQuestions = (unitId) => this.startQuestions(unitId);
        window.showUnitContent = (unitId, tab) => this.showUnitContent(unitId, tab);
        
        // Eventos de fechamento
        window.closeOverlays = () => this.closeOverlays();
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeOverlays();
            }
        });
    }
    
    /**
     * Mostra página inicial
     */
    showHome() {
        this.currentPage = 'home';
        this.currentUnit = null;
        
        // Mostrar página inicial
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById('home-page').classList.add('active');
        
        // Atualizar navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.getElementById('home-btn').classList.add('active');
        
        // Atualizar Stitch do header
        this.updateHeaderStitch(1);
        
        // Atualizar progresso
        this.updateProgressDisplay();
        
        // Fala aleatória do Stitch
        this.randomStitchWelcome();
    }
    
    /**
     * Abre uma unidade específica
     */
    openUnit(unitId) {
        this.currentUnit = unitId;
        this.currentPage = 'unit';
        
        // Mostrar página da unidade
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById('unit-page').classList.add('active');
        
        // Atualizar navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-unit="${unitId}"]`).classList.add('active');
        
        // Atualizar Stitch do header
        this.updateHeaderStitch(unitId);
        
        // Carregar conteúdo da unidade
        this.loadUnitContent(unitId);
        
        // Fechar sidebar em mobile
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
    }
    
    /**
     * Carrega conteúdo da unidade
     */
    loadUnitContent(unitId) {
        const unitPage = document.getElementById('unit-page');
        const unitData = this.getUnitData(unitId);
        
        unitPage.innerHTML = `
            <div class="unit-header unit-${unitId}">
                <div class="unit-title">
                    <h1>${unitData.title}</h1>
                    <p>${unitData.subtitle}</p>
                </div>
                <div class="unit-stitch">
                    <img src="assets/stitch/Unidade${unitId}.png" alt="Stitch" onclick="app.stitchExplain(${unitId})">
                </div>
            </div>
            
            <div class="unit-tabs">
                <button class="tab-btn active" onclick="app.showUnitContent(${unitId}, 'mindmap')">
                    🗺️ Mapa Mental
                </button>
                <button class="tab-btn" onclick="app.showUnitContent(${unitId}, 'review')">
                    📖 Revisão
                </button>
                <button class="tab-btn" onclick="app.showUnitContent(${unitId}, 'questions')">
                    ❓ Questões
                </button>
            </div>
            
            <div class="unit-content">
                <div id="unit-content-area">
                    <!-- Conteúdo será carregado aqui -->
                </div>
            </div>
        `;
        
        // Mostrar mapa mental por padrão
        this.showUnitContent(unitId, 'mindmap');
    }
    
    /**
     * Mostra conteúdo específico da unidade
     */
    showUnitContent(unitId, tab) {
        // Atualizar abas ativas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        const contentArea = document.getElementById('unit-content-area');
        
        switch (tab) {
            case 'mindmap':
                contentArea.innerHTML = `
                    <div class="mindmap-container">
                        <img src="assets/mindmaps/mapa-unidade-${unitId}.png" 
                             alt="Mapa Mental Unidade ${unitId}" 
                             class="mindmap-image">
                    </div>
                `;
                break;
                
            case 'review':
                this.loadVisualReview(unitId, contentArea);
                break;
                
            case 'questions':
                contentArea.innerHTML = `
                    <div class="questions-intro">
                        <h2>🎮 Hora das Questões!</h2>
                        <p>Teste seus conhecimentos sobre esta unidade.</p>
                        <button class="btn btn-primary btn-large" onclick="questionsSystem.startQuestions(${unitId})">
                            🚀 Começar Questões
                        </button>
                    </div>
                    <div id="questions-container">
                        <!-- Questões aparecerão aqui -->
                    </div>
                `;
                break;
        }
    }
    
    /**
     * Carrega revisão visual da unidade
     */
    async loadVisualReview(unitId, container) {
        try {
            const response = await fetch(`assets/data/revisao_visual_unidade_${unitId}.txt`);
            if (response.ok) {
                const content = await response.text();
                container.innerHTML = content;
            } else {
                container.innerHTML = this.getDefaultReviewContent(unitId);
            }
        } catch (error) {
            container.innerHTML = this.getDefaultReviewContent(unitId);
        }
    }
    
    /**
     * Obtém conteúdo de revisão padrão
     */
    getDefaultReviewContent(unitId) {
        const unitData = this.getUnitData(unitId);
        return `
            <div class="review-content unit-${unitId}">
                <h2>📚 Revisão - ${unitData.title}</h2>
                <p>Conteúdo de revisão em desenvolvimento...</p>
                <div class="review-placeholder">
                    <img src="assets/stitch/Unidade${unitId}.png" alt="Stitch" class="stitch-review">
                    <p>"Em breve teremos todo o conteúdo de revisão aqui!"</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Inicia questões da unidade
     */
    startQuestions(unitId) {
        if (window.questionsSystem) {
            window.questionsSystem.startQuestions(unitId);
        } else {
            console.error('Sistema de questões não carregado');
        }
    }
    
    /**
     * Obtém dados da unidade
     */
    getUnitData(unitId) {
        const units = {
            1: {
                title: 'Unidade 1 - Demografia',
                subtitle: 'O Estudo da População',
                color: '#4A90E2'
            },
            2: {
                title: 'Unidade 2 - Formação do Território Brasileiro',
                subtitle: 'Uma Análise Geográfica',
                color: '#7ED321'
            },
            3: {
                title: 'Unidade 3 - O Trabalho e as Transformações Espaciais',
                subtitle: 'Como o trabalho modifica o espaço',
                color: '#F5A623'
            },
            4: {
                title: 'Unidade 4 - Espaço Urbano',
                subtitle: 'Urbanização e Crescimento das Cidades',
                color: '#9013FE'
            },
            5: {
                title: 'Unidade 5 - Mobilidade e Redes',
                subtitle: 'Transporte e Comunicação no Brasil',
                color: '#50E3C2'
            },
            6: {
                title: 'Unidade 6 - Matriz Energética Brasileira',
                subtitle: 'Fontes Renováveis e Não Renováveis',
                color: '#417505'
            }
        };
        
        return units[unitId] || units[1];
    }
    
    /**
     * Atualiza Stitch do header
     */
    updateHeaderStitch(unitId) {
        const headerStitch = document.querySelector('.header-stitch-img');
        if (headerStitch) {
            headerStitch.src = `assets/stitch/Unidade${unitId}.png`;
        }
    }
    
    /**
     * Fala do Stitch no header
     */
    stitchSpeak() {
        const messages = [
            "Oi! Tudo bem? Vamos estudar?",
            "Geografia é demais! Vem comigo!",
            "Você está indo muito bem!",
            "Que tal explorar uma nova unidade?",
            "A Tia Roberta ficaria orgulhosa!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showStitchMessage(randomMessage);
    }
    
    /**
     * Boas-vindas aleatórias do Stitch
     */
    randomStitchWelcome() {
        const welcomeMessages = [
            "Oi! Eu sou o Stitch. Vamos estudar Geografia de um jeito divertido?",
            "Olá! Pronto para uma aventura geográfica?",
            "Oba! Vamos descobrir o mundo juntos?",
            "Ei! Que tal aprender Geografia brincando?",
            "Aloha! Vamos explorar o Brasil?"
        ];
        
        const speechBubble = document.getElementById('stitch-speech');
        if (speechBubble) {
            const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            speechBubble.textContent = `"${randomMessage}"`;
        }
    }
    
    /**
     * Fala de boas-vindas do Stitch
     */
    stitchWelcome() {
        this.randomStitchWelcome();
    }
    
    /**
     * Explicação do Stitch por unidade
     */
    stitchExplain(unitId) {
        const explanations = {
            1: "Demografia é contar quem vive num lugar. Tipo a galera da turma 502 no Recreio!",
            2: "Território é o nosso pedacinho do mundo! O Brasil é gigante, né?",
            3: "Trabalho é tudo que as pessoas fazem para viver melhor. Igual a Tia Roberta ensinando!",
            4: "Urbanização é quando a cidade cresce! Igual quando começaram a construir um monte de prédios no bairro!",
            5: "Mobilidade é como a gente se move! De ônibus, carro, bicicleta... até nave espacial!",
            6: "Energia solar vem do sol e não acaba nunca! É limpa, do jeitinho que a Tia Roberta explicou!"
        };
        
        const explanation = explanations[unitId] || "Vamos estudar juntos!";
        this.showStitchMessage(explanation);
    }
    
    /**
     * Mostra mensagem do Stitch
     */
    showStitchMessage(message) {
        // Implementar modal do Stitch se necessário
        console.log('Stitch diz:', message);
    }
    
    /**
     * Toggle da sidebar
     */
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (this.sidebarOpen) {
            this.closeSidebar();
        } else {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            this.sidebarOpen = true;
        }
    }
    
    /**
     * Fecha sidebar
     */
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        this.sidebarOpen = false;
    }
    
    /**
     * Fecha overlays
     */
    closeOverlays() {
        this.closeSidebar();
        // Fechar outros modais se necessário
    }
    
    /**
     * Reinicia unidade
     */
    resetUnit(unitId, event) {
        event.stopPropagation();
        
        if (confirm('Tem certeza que deseja recomeçar esta unidade? Todo o progresso será perdido.')) {
            // Limpar progresso da unidade
            const progress = JSON.parse(localStorage.getItem('alfareview_progress') || '{}');
            delete progress[`unidade_${unitId}`];
            localStorage.setItem('alfareview_progress', JSON.stringify(progress));
            
            // Atualizar display
            this.updateProgressDisplay();
            
            // Mostrar mensagem
            this.showStitchMessage("Pronto! Vamos começar de novo essa unidade!");
        }
    }
    
    /**
     * Atualiza display de progresso
     */
    updateProgressDisplay() {
        const progress = JSON.parse(localStorage.getItem('alfareview_progress') || '{}');
        let totalPoints = 0;
        let totalMedals = 0;
        
        for (let unitId = 1; unitId <= 6; unitId++) {
            const unitProgress = progress[`unidade_${unitId}`];
            
            if (unitProgress) {
                totalPoints += unitProgress.score || 0;
                if (unitProgress.accuracy >= 50) totalMedals++;
                
                // Atualizar barra de progresso
                const progressBar = document.getElementById(`progress-${unitId}`);
                if (progressBar) {
                    progressBar.style.width = '100%';
                }
                
                // Atualizar estrelas
                const starsElement = document.getElementById(`stars-${unitId}`);
                if (starsElement) {
                    const stars = this.calculateStars(unitProgress.accuracy);
                    starsElement.textContent = '⭐'.repeat(stars);
                }
                
                // Atualizar medalha
                const medalElement = document.getElementById(`medal-${unitId}`);
                if (medalElement) {
                    const medal = this.calculateMedal(unitProgress.accuracy);
                    medalElement.textContent = medal.emoji;
                }
            }
        }
        
        // Atualizar estatísticas gerais
        const totalPointsElement = document.getElementById('total-points');
        const totalMedalsElement = document.getElementById('total-medals');
        
        if (totalPointsElement) totalPointsElement.textContent = totalPoints;
        if (totalMedalsElement) totalMedalsElement.textContent = totalMedals;
    }
    
    /**
     * Calcula estrelas baseado na porcentagem
     */
    calculateStars(percentage) {
        if (percentage >= 80) return 3;
        if (percentage >= 50) return 2;
        return 1;
    }
    
    /**
     * Calcula medalha baseada na porcentagem
     */
    calculateMedal(percentage) {
        if (percentage >= 90) {
            return { emoji: '🥇', name: 'Ouro' };
        } else if (percentage >= 80) {
            return { emoji: '🥈', name: 'Prata' };
        } else if (percentage >= 50) {
            return { emoji: '🥉', name: 'Bronze' };
        } else {
            return { emoji: '—', name: 'Nenhuma' };
        }
    }
    
    /**
     * Carrega estatísticas do jogo
     */
    loadGameStats() {
        return JSON.parse(localStorage.getItem('alfareview_stats') || '{}');
    }
    
    /**
     * Salva estatísticas do jogo
     */
    saveGameStats() {
        localStorage.setItem('alfareview_stats', JSON.stringify(this.gameStats));
    }
}

// Inicializar aplicação
const app = new AlfaReviewApp();

// Exportar para uso global
window.app = app;

