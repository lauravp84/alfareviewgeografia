/**
 * Aplicação Principal - AlfaReview Geografia
 * Gerencia navegação, interface e coordenação entre módulos
 */

class AlfaReviewApp {
    constructor() {
        this.currentScreen = 'welcome';
        this.currentPage = 'home';
        this.currentUnit = null;
        this.sidebarOpen = false;
        this.reviewPanelOpen = false;
        
        // Elementos DOM principais
        this.elements = {
            welcomeScreen: null,
            mainScreen: null,
            sidebar: null,
            overlay: null,
            pages: {},
            studentNameInput: null,
            studentDisplayElements: []
        };
        
        this.init();
    }
    
    /**
     * Inicializa a aplicação
     */
    init() {
        // Aguarda DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initApp());
        } else {
            this.initApp();
        }
    }
    
    /**
     * Inicializa aplicação após DOM pronto
     */
    initApp() {
        this.cacheElements();
        this.bindEvents();
        this.checkExistingStudent();
        this.setupResponsiveNavigation();
    }
    
    /**
     * Cache elementos DOM importantes
     */
    cacheElements() {
        this.elements.welcomeScreen = document.getElementById('welcome-screen');
        this.elements.mainScreen = document.getElementById('main-screen');
        this.elements.sidebar = document.getElementById('sidebar');
        this.elements.overlay = document.getElementById('overlay');
        this.elements.studentNameInput = document.getElementById('student-name');
        
        // Cache páginas
        this.elements.pages = {
            home: document.getElementById('home-page'),
            progress: document.getElementById('progress-page'),
            unit: document.getElementById('unit-page')
        };
        
        // Cache elementos de exibição do nome do aluno
        this.elements.studentDisplayElements = [
            document.getElementById('student-display-name'),
            document.getElementById('student-name-display')
        ];
    }
    
    /**
     * Vincula eventos da interface
     */
    bindEvents() {
        // Botão de começar
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.handleStudentNameSubmit());
        }
        
        // Enter no campo de nome
        if (this.elements.studentNameInput) {
            this.elements.studentNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleStudentNameSubmit();
                }
            });
        }
        
        // Navegação da sidebar
        this.bindSidebarNavigation();
        
        // Botões de unidade
        this.bindUnitButtons();
        
        // Botões de ação
        this.bindActionButtons();
        
        // Toggle da sidebar (mobile)
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Clique no overlay
        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', () => this.closeOverlays());
        }
        
        // Redimensionamento da janela
        window.addEventListener('resize', () => this.handleResize());
    }
    
    /**
     * Vincula navegação da sidebar
     */
    bindSidebarNavigation() {
        // Botão Home
        const homeBtn = document.getElementById('home-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('home');
                this.updateNavigation('home-btn');
            });
        }
        
        // Botão Progresso
        const progressBtn = document.getElementById('progress-btn');
        if (progressBtn) {
            progressBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('progress');
                this.updateNavigation('progress-btn');
                this.updateProgressPage();
            });
        }
        
        // Navegação das unidades
        const unitNavs = document.querySelectorAll('.unit-nav');
        unitNavs.forEach(nav => {
            nav.addEventListener('click', (e) => {
                e.preventDefault();
                const unitId = parseInt(nav.dataset.unit);
                this.openUnit(unitId);
                this.updateNavigation(nav);
            });
        });
    }
    
    /**
     * Vincula botões das unidades na página inicial
     */
    bindUnitButtons() {
        const unitCards = document.querySelectorAll('.unit-card');
        unitCards.forEach(card => {
            const button = card.querySelector('.btn-unit');
            if (button) {
                button.addEventListener('click', () => {
                    const unitId = parseInt(card.dataset.unit);
                    this.openUnit(unitId);
                });
            }
        });
    }
    
    /**
     * Vincula botões de ação
     */
    bindActionButtons() {
        // Botão voltar
        const backBtn = document.getElementById('back-to-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPage('home');
                this.updateNavigation('home-btn');
            });
        }
        
        // Botão revisar conteúdo
        const reviewBtn = document.getElementById('review-content');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => this.toggleReviewPanel());
        }
        
        // Fechar painel de revisão
        const closeReviewBtn = document.getElementById('close-review');
        if (closeReviewBtn) {
            closeReviewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeReviewPanel();
            });
        }
        
        // Exportar progresso
        const exportBtn = document.getElementById('export-progress');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportProgress());
        }
        
        // Importar progresso
        const importBtn = document.getElementById('import-progress');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.showImportModal());
        }
    }
    
    /**
     * Verifica se já existe um aluno cadastrado
     */
    checkExistingStudent() {
        const studentName = window.storageManager.getStudentName();
        if (studentName) {
            this.setStudentName(studentName);
            this.showMainScreen();
        } else {
            this.showWelcomeScreen();
        }
    }
    
    /**
     * Manipula submissão do nome do aluno
     */
    handleStudentNameSubmit() {
        const name = this.elements.studentNameInput.value.trim();
        
        if (name.length < 2) {
            this.showError('Por favor, digite um nome com pelo menos 2 caracteres.');
            this.elements.studentNameInput.classList.add('shake');
            setTimeout(() => {
                this.elements.studentNameInput.classList.remove('shake');
            }, 500);
            return;
        }
        
        if (window.storageManager.setStudentName(name)) {
            this.setStudentName(name);
            this.showMainScreen();
            
            // Mensagem de boas-vindas do Stitch
            setTimeout(() => {
                window.stitchManager.showWelcomeMessage(name);
            }, 1000);
        } else {
            this.showError('Erro ao salvar nome. Tente novamente.');
        }
    }
    
    /**
     * Define nome do aluno na interface
     */
    setStudentName(name) {
        this.elements.studentDisplayElements.forEach(element => {
            if (element) {
                element.textContent = name;
            }
        });
    }
    
    /**
     * Mostra tela de boas-vindas
     */
    showWelcomeScreen() {
        this.currentScreen = 'welcome';
        this.elements.welcomeScreen.classList.add('active');
        this.elements.mainScreen.classList.remove('active');
        
        // Foco no campo de nome
        setTimeout(() => {
            if (this.elements.studentNameInput) {
                this.elements.studentNameInput.focus();
            }
        }, 500);
    }
    
    /**
     * Mostra tela principal
     */
    showMainScreen() {
        this.currentScreen = 'main';
        this.elements.welcomeScreen.classList.remove('active');
        this.elements.mainScreen.classList.add('active');
        
        // Carrega dados iniciais
        this.updateProgressDisplay();
        this.showPage('home');
    }
    
    /**
     * Mostra página específica
     */
    showPage(pageId) {
        // Remove classe active de todas as páginas
        Object.values(this.elements.pages).forEach(page => {
            if (page) page.classList.remove('active');
        });
        
        // Ativa página solicitada
        const targetPage = this.elements.pages[pageId];
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.classList.add('page-enter');
            
            // Remove classe de animação após completar
            setTimeout(() => {
                targetPage.classList.remove('page-enter');
            }, 500);
        }
        
        this.currentPage = pageId;
        
        // Fecha sidebar em mobile
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
    }
    
    /**
     * Abre unidade específica
     */
    openUnit(unitId) {
        this.currentUnit = unitId;
        
        // Atualiza Stitch para a unidade
        window.stitchManager.updateStitchForUnit(unitId);
        
        // Atualiza título da unidade
        const unitTitle = document.getElementById('unit-title');
        if (unitTitle) {
            const unitNames = {
                1: 'Unidade 1 - Demografia',
                2: 'Unidade 2 - Formação do Território Brasileiro',
                3: 'Unidade 3 - O Trabalho e as Transformações Espaciais',
                4: 'Unidade 4 - Espaço Urbano: Urbanização e Crescimento das Cidades',
                5: 'Unidade 5 - Mobilidade e Redes de Transporte e Comunicação',
                6: 'Unidade 6 - Matriz Energética Brasileira'
            };
            unitTitle.textContent = unitNames[unitId] || `Unidade ${unitId}`;
        }
        
        // Carrega conteúdo da unidade
        this.loadUnitContent(unitId);
        
        // Mostra página da unidade
        this.showPage('unit');
        this.updateNavigation(`[data-unit="${unitId}"]`);
    }
    
    /**
     * Carrega conteúdo da unidade
     */
    loadUnitContent(unitId) {
        const contentContainer = document.getElementById('unit-content');
        
        if (contentContainer) {
            // Integra conteúdo usando o ContentManager
            window.contentManager.integrateUnitContent(unitId, contentContainer);
            
            // Atualiza informações da unidade
            this.updateUnitInfo(unitId);
        }
    }
    
    /**
     * Carrega questões da unidade (placeholder)
     */
    loadUnitQuestions(unitId) {
        const questionsContainer = document.getElementById('questions-container');
        if (questionsContainer) {
            // Inicia sistema de questões
            window.questionsManager.startUnit(unitId);
        }
    }
    
    /**
     * Atualiza navegação ativa
     */
    updateNavigation(activeSelector) {
        // Remove classe active de todos os itens
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        // Adiciona classe active ao item selecionado
        let activeElement;
        if (typeof activeSelector === 'string') {
            if (activeSelector.startsWith('[')) {
                activeElement = document.querySelector(`.nav-item${activeSelector}`);
            } else {
                activeElement = document.getElementById(activeSelector);
            }
        } else {
            activeElement = activeSelector;
        }
        
        if (activeElement) {
            activeElement.classList.add('active');
        }
    }
    
    /**
     * Atualiza exibição de progresso
     */
    updateProgressDisplay() {
        const progress = window.storageManager.getOverallProgress();
        
        // Atualiza cards de unidade
        for (let unitId = 1; unitId <= 6; unitId++) {
            const unitProgress = window.storageManager.getUnitProgress(unitId);
            const unitCard = document.querySelector(`[data-unit="${unitId}"]`);
            
            if (unitCard) {
                // Atualiza barra de progresso
                const progressFill = unitCard.querySelector('.progress-fill');
                if (progressFill) {
                    progressFill.style.width = `${unitProgress.progress}%`;
                    progressFill.dataset.progress = unitProgress.progress;
                }
                
                // Atualiza estrelas
                const starsElement = unitCard.querySelector('.stars');
                if (starsElement) {
                    const stars = '⭐'.repeat(unitProgress.stars) + '☆'.repeat(3 - unitProgress.stars);
                    starsElement.textContent = stars;
                }
                
                // Atualiza medalha
                const medalElement = unitCard.querySelector('.medal');
                if (medalElement && unitProgress.medal) {
                    medalElement.textContent = unitProgress.medal;
                }
            }
        }
    }
    
    /**
     * Atualiza página de progresso
     */
    updateProgressPage() {
        const progress = window.storageManager.getOverallProgress();
        
        // Atualiza estatísticas totais
        const totalPointsElement = document.getElementById('total-points');
        if (totalPointsElement) {
            totalPointsElement.textContent = progress.totalPoints;
        }
        
        const totalMedalsElement = document.getElementById('total-medals');
        if (totalMedalsElement) {
            totalMedalsElement.textContent = progress.totalMedals;
        }
        
        const completedUnitsElement = document.getElementById('completed-units');
        if (completedUnitsElement) {
            completedUnitsElement.textContent = `${progress.completedUnits}/${progress.totalUnits}`;
        }
    }
    
    /**
     * Toggle sidebar (mobile)
     */
    toggleSidebar() {
        if (this.sidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
    
    /**
     * Abre sidebar
     */
    openSidebar() {
        this.sidebarOpen = true;
        this.elements.sidebar.classList.add('active');
        this.elements.overlay.classList.add('active');
    }
    
    /**
     * Fecha sidebar
     */
    closeSidebar() {
        this.sidebarOpen = false;
        this.elements.sidebar.classList.remove('active');
        this.elements.overlay.classList.remove('active');
    }
    
    /**
     * Toggle painel de revisão
     */
    toggleReviewPanel() {
        if (this.reviewPanelOpen) {
            this.closeReviewPanel();
        } else {
            this.openReviewPanel();
        }
    }
    
    /**
     * Abre painel de revisão
     */
    openReviewPanel() {
        if (!this.currentUnit) return;
        
        this.reviewPanelOpen = true;
        const reviewPanel = document.getElementById('review-panel');
        if (reviewPanel) {
            reviewPanel.classList.add('active');
            
            // Carrega mapa mental da unidade
            const mindmapImg = document.getElementById('review-mindmap');
            if (mindmapImg) {
                mindmapImg.src = `assets/mindmaps/MindmapUnidade${this.currentUnit}.png`;
                mindmapImg.alt = `Mapa Mental Unidade ${this.currentUnit}`;
            }
            
            // Carrega conteúdo de revisão (será implementado na próxima fase)
            this.loadReviewContent(this.currentUnit);
        }
        
        this.elements.overlay.classList.add('active');
    }
    
    /**
     * Fecha painel de revisão
     */
    closeReviewPanel() {
        this.reviewPanelOpen = false;
        const reviewPanel = document.getElementById('review-panel');
        if (reviewPanel) {
            reviewPanel.classList.remove('active');
        }
        
        // Remove overlay apenas se não há outros painéis abertos
        if (!this.sidebarOpen) {
            this.elements.overlay.classList.remove('active');
        }
    }
    
    /**
     * Carrega conteúdo de revisão (placeholder)
     */
    loadReviewContent(unitId) {
        const reviewTextElement = document.getElementById('review-text-content');
        if (reviewTextElement) {
            reviewTextElement.innerHTML = `
                <h4>Conteúdo de Revisão - Unidade ${unitId}</h4>
                <p>O conteúdo de revisão desta unidade será carregado em breve...</p>
                <p>Por enquanto, você pode consultar o mapa mental acima!</p>
            `;
        }
    }
    
    /**
     * Fecha overlays (sidebar, painéis, etc.)
     */
    closeOverlays() {
        if (this.sidebarOpen) {
            this.closeSidebar();
        }
        if (this.reviewPanelOpen) {
            this.closeReviewPanel();
        }
        this.closeModals();
    }
    
    /**
     * Fecha modais
     */
    closeModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.remove('active'));
    }
    
    /**
     * Exporta progresso
     */
    exportProgress() {
        try {
            window.storageManager.exportData();
            this.showSuccess('Progresso exportado com sucesso!');
        } catch (error) {
            this.showError('Erro ao exportar progresso: ' + error.message);
        }
    }
    
    /**
     * Mostra modal de importação
     */
    showImportModal() {
        const modal = document.getElementById('import-modal');
        if (modal) {
            modal.classList.add('active');
            this.elements.overlay.classList.add('active');
            
            // Vincula eventos do modal
            this.bindImportModalEvents();
        }
    }
    
    /**
     * Vincula eventos do modal de importação
     */
    bindImportModalEvents() {
        const cancelBtn = document.getElementById('cancel-import');
        const confirmBtn = document.getElementById('confirm-import');
        const fileInput = document.getElementById('import-file');
        
        if (cancelBtn) {
            cancelBtn.onclick = () => this.closeModals();
        }
        
        if (confirmBtn && fileInput) {
            confirmBtn.onclick = () => this.handleImport(fileInput);
        }
    }
    
    /**
     * Manipula importação de arquivo
     */
    async handleImport(fileInput) {
        const file = fileInput.files[0];
        if (!file) {
            this.showError('Por favor, selecione um arquivo.');
            return;
        }
        
        try {
            await window.storageManager.importData(file);
            this.showSuccess('Progresso importado com sucesso!');
            this.closeModals();
            
            // Atualiza interface
            this.checkExistingStudent();
            this.updateProgressDisplay();
        } catch (error) {
            this.showError('Erro ao importar: ' + error.message);
        }
    }
    
    /**
     * Manipula redimensionamento da janela
     */
    handleResize() {
        // Fecha sidebar automaticamente em desktop
        if (window.innerWidth > 768 && this.sidebarOpen) {
            this.closeSidebar();
        }
    }
    
    /**
     * Configura navegação responsiva
     */
    setupResponsiveNavigation() {
        // Adiciona listener para clique no ícone de menu (mobile)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-header') || 
                e.target.closest('.page-header')) {
                const header = e.target.closest('.page-header') || e.target;
                const rect = header.getBoundingClientRect();
                
                // Se clicou na área do menu (canto esquerdo)
                if (e.clientX - rect.left < 50 && window.innerWidth <= 768) {
                    this.toggleSidebar();
                }
            }
        });
    }
    
    /**
     * Mostra mensagem de erro
     */
    showError(message) {
        // Implementação simples com alert (pode ser melhorada com toast)
        alert('Erro: ' + message);
    }
    
    /**
     * Mostra mensagem de sucesso
     */
    showSuccess(message) {
        // Implementação simples com alert (pode ser melhorada com toast)
        alert('Sucesso: ' + message);
    }
    
    /**
     * Obtém estado atual da aplicação
     */
    getState() {
        return {
            currentScreen: this.currentScreen,
            currentPage: this.currentPage,
            currentUnit: this.currentUnit,
            sidebarOpen: this.sidebarOpen,
            reviewPanelOpen: this.reviewPanelOpen
        };
    }
    
    /**
     * Reseta aplicação
     */
    reset() {
        this.currentScreen = 'welcome';
        this.currentPage = 'home';
        this.currentUnit = null;
        this.sidebarOpen = false;
        this.reviewPanelOpen = false;
        
        this.closeOverlays();
        window.storageManager.clearData();
        window.stitchManager.reset();
        
        this.showWelcomeScreen();
    }
}

// Inicializa aplicação quando DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.alfaReviewApp = new AlfaReviewApp();
    });
} else {
    // DOM já está carregado
    window.alfaReviewApp = new AlfaReviewApp();
}

// Exporta para uso global
window.AlfaReviewApp = AlfaReviewApp;

