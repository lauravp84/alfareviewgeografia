/**
 * Sistema de Mapas Mentais e Conteúdo de Revisão - AlfaReview Geografia
 * Gerencia exibição de mapas mentais e conteúdo educativo
 */

class ContentManager {
    constructor() {
        this.mindmaps = {
            1: {
                title: 'Demografia',
                image: 'assets/mindmaps/MindmapUnidade1-Demografia.png',
                description: 'Estudo das populações humanas, incluindo crescimento, distribuição e características demográficas.'
            },
            2: {
                title: 'Formação do Território Brasileiro',
                image: 'assets/mindmaps/MindmapUnidade2-FormaçãodoTerritórioBrasileiro_UmaAnáliseGeográfica.png',
                description: 'Processo histórico de formação do território brasileiro e suas transformações.'
            },
            3: {
                title: 'Trabalho e Transformações Espaciais',
                image: 'assets/mindmaps/MindmapUnidade3-Otrabalhoeastransofrmaçõesespaciais.png',
                description: 'Como o trabalho humano transforma os espaços geográficos.'
            },
            4: {
                title: 'Espaço Urbano',
                image: 'assets/mindmaps/MindmapUnidade4EspaçoUrbano_UrbanizaçãoeCrescimentodasCidades.png',
                description: 'Urbanização e crescimento das cidades no Brasil.'
            },
            5: {
                title: 'Mobilidade e Redes de Transporte',
                image: 'assets/mindmaps/MindmapUnidade5-MobilidadeeRedesdeTransporteeComunicaçãonoBrasil.png',
                description: 'Sistemas de transporte e comunicação no território brasileiro.'
            },
            6: {
                title: 'Matriz Energética Brasileira',
                image: 'assets/mindmaps/MindmapUnidade6-MatrizEnergéticaBrasileira_FontesRenováveiseNãoRenováveis.png',
                description: 'Fontes de energia renováveis e não renováveis no Brasil.'
            }
        };
        
        this.reviewContent = {
            1: {
                title: 'Demografia - Conteúdo de Revisão',
                topics: [
                    'O que é Demografia',
                    'População Brasileira',
                    'Crescimento Populacional',
                    'Distribuição da População',
                    'Migração e Êxodo Rural',
                    'Densidade Demográfica'
                ]
            },
            2: {
                title: 'Formação do Território - Conteúdo de Revisão',
                topics: [
                    'Colonização Portuguesa',
                    'Expansão Territorial',
                    'Tratados e Fronteiras',
                    'Ocupação do Interior',
                    'Formação das Regiões',
                    'Diversidade Cultural'
                ]
            },
            3: {
                title: 'Trabalho e Transformações - Conteúdo de Revisão',
                topics: [
                    'Tipos de Trabalho',
                    'Transformação da Paisagem',
                    'Agricultura e Pecuária',
                    'Indústria e Serviços',
                    'Impactos Ambientais',
                    'Desenvolvimento Sustentável'
                ]
            },
            4: {
                title: 'Espaço Urbano - Conteúdo de Revisão',
                topics: [
                    'O que é Urbanização',
                    'Crescimento das Cidades',
                    'Problemas Urbanos',
                    'Planejamento Urbano',
                    'Qualidade de Vida',
                    'Cidades Sustentáveis'
                ]
            },
            5: {
                title: 'Mobilidade e Redes - Conteúdo de Revisão',
                topics: [
                    'Meios de Transporte',
                    'Redes de Comunicação',
                    'Infraestrutura',
                    'Conectividade',
                    'Impactos Sociais',
                    'Tecnologia e Mobilidade'
                ]
            },
            6: {
                title: 'Matriz Energética - Conteúdo de Revisão',
                topics: [
                    'Fontes de Energia',
                    'Energia Renovável',
                    'Energia Não Renovável',
                    'Hidrelétricas',
                    'Energia Solar e Eólica',
                    'Sustentabilidade Energética'
                ]
            }
        };
        
        this.init();
    }
    
    /**
     * Inicializa sistema de conteúdo
     */
    init() {
        this.bindEvents();
    }
    
    /**
     * Vincula eventos do sistema de conteúdo
     */
    bindEvents() {
        // Eventos serão vinculados quando necessário
    }
    
    /**
     * Renderiza mapa mental da unidade
     */
    renderMindmap(unitId) {
        const mindmap = this.mindmaps[unitId];
        if (!mindmap) return '';
        
        return `
            <div class="mindmap-container">
                <div class="mindmap-header">
                    <h3>🧠 Mapa Mental: ${mindmap.title}</h3>
                    <p>${mindmap.description}</p>
                </div>
                
                <div class="mindmap-image-container">
                    <img src="${mindmap.image}" 
                         alt="Mapa Mental - ${mindmap.title}"
                         class="mindmap-image"
                         onclick="window.contentManager.openMindmapModal(${unitId})">
                    <div class="mindmap-overlay">
                        <span class="zoom-hint">🔍 Clique para ampliar</span>
                    </div>
                </div>
                
                <div class="mindmap-actions">
                    <button class="btn-secondary" onclick="window.contentManager.downloadMindmap(${unitId})">
                        📥 Baixar Mapa Mental
                    </button>
                    <button class="btn-primary" onclick="window.contentManager.openMindmapModal(${unitId})">
                        🔍 Ver em Tela Cheia
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza conteúdo de revisão da unidade
     */
    renderReviewContent(unitId) {
        const content = this.reviewContent[unitId];
        if (!content) return '';
        
        return `
            <div class="review-content-container">
                <div class="review-header">
                    <h3>📖 ${content.title}</h3>
                </div>
                
                <div class="review-topics">
                    <h4>Principais Tópicos:</h4>
                    <ul class="topics-list">
                        ${content.topics.map(topic => `
                            <li class="topic-item">
                                <span class="topic-icon">📍</span>
                                <span class="topic-text">${topic}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="review-actions">
                    <button class="btn-primary" onclick="window.contentManager.loadDetailedContent(${unitId})">
                        📚 Ver Conteúdo Completo
                    </button>
                    <button class="btn-secondary" onclick="window.contentManager.generateSummary(${unitId})">
                        📝 Gerar Resumo
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza painel lateral de revisão
     */
    renderReviewPanel(unitId) {
        const mindmapHtml = this.renderMindmap(unitId);
        const reviewHtml = this.renderReviewContent(unitId);
        
        return `
            <div class="review-panel">
                <div class="review-panel-header">
                    <h2>📚 Material de Estudo</h2>
                    <button class="close-panel" onclick="window.contentManager.closeReviewPanel()">
                        ✕
                    </button>
                </div>
                
                <div class="review-panel-content">
                    ${mindmapHtml}
                    
                    <div class="content-divider"></div>
                    
                    ${reviewHtml}
                </div>
            </div>
        `;
    }
    
    /**
     * Abre modal do mapa mental
     */
    openMindmapModal(unitId) {
        const mindmap = this.mindmaps[unitId];
        if (!mindmap) return;
        
        const modal = document.createElement('div');
        modal.className = 'mindmap-modal';
        modal.innerHTML = `
            <div class="mindmap-modal-content">
                <div class="mindmap-modal-header">
                    <h3>${mindmap.title}</h3>
                    <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">
                        ✕
                    </button>
                </div>
                
                <div class="mindmap-modal-body">
                    <img src="${mindmap.image}" 
                         alt="Mapa Mental - ${mindmap.title}"
                         class="mindmap-modal-image">
                </div>
                
                <div class="mindmap-modal-footer">
                    <button class="btn-secondary" onclick="window.contentManager.downloadMindmap(${unitId})">
                        📥 Baixar
                    </button>
                    <button class="btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Fechar
                    </button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;
        
        document.body.appendChild(modal);
        
        // Fecha modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    /**
     * Baixa mapa mental
     */
    downloadMindmap(unitId) {
        const mindmap = this.mindmaps[unitId];
        if (!mindmap) return;
        
        const link = document.createElement('a');
        link.href = mindmap.image;
        link.download = `Mapa_Mental_Unidade_${unitId}_${mindmap.title.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Feedback do Stitch
        window.stitchManager.showSpeech('Mapa mental baixado! Agora você pode estudar offline! 📚');
    }
    
    /**
     * Carrega conteúdo detalhado (placeholder)
     */
    loadDetailedContent(unitId) {
        // Por enquanto, mostra mensagem
        window.stitchManager.showSpeech('O conteúdo detalhado está sendo preparado! Em breve você terá acesso completo! 🚀');
        
        // Futuramente, carregará conteúdo dos arquivos DOCX
        this.showContentModal(unitId);
    }
    
    /**
     * Mostra modal de conteúdo detalhado
     */
    showContentModal(unitId) {
        const content = this.reviewContent[unitId];
        if (!content) return;
        
        const modal = document.createElement('div');
        modal.className = 'content-modal';
        modal.innerHTML = `
            <div class="content-modal-content">
                <div class="content-modal-header">
                    <h3>📚 ${content.title}</h3>
                    <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">
                        ✕
                    </button>
                </div>
                
                <div class="content-modal-body">
                    <div class="content-placeholder">
                        <h4>Conteúdo em Desenvolvimento</h4>
                        <p>O conteúdo detalhado desta unidade está sendo preparado com base nos materiais fornecidos.</p>
                        
                        <div class="topics-preview">
                            <h5>Tópicos que serão abordados:</h5>
                            <ul>
                                ${content.topics.map(topic => `<li>${topic}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="coming-soon">
                            <span class="stitch-icon">🧑‍🚀</span>
                            <p>Em breve, Stitch trará todo o conteúdo interativo!</p>
                        </div>
                    </div>
                </div>
                
                <div class="content-modal-footer">
                    <button class="btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Entendi
                    </button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;
        
        document.body.appendChild(modal);
        
        // Fecha modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    /**
     * Gera resumo da unidade
     */
    generateSummary(unitId) {
        const content = this.reviewContent[unitId];
        if (!content) return;
        
        const summary = `
            📝 **Resumo da ${content.title}**
            
            Principais conceitos:
            ${content.topics.map((topic, index) => `${index + 1}. ${topic}`).join('\n')}
            
            💡 Dica do Stitch: Revise estes tópicos antes de fazer as questões!
        `;
        
        window.stitchManager.showSpeech(summary);
    }
    
    /**
     * Fecha painel de revisão
     */
    closeReviewPanel() {
        const panel = document.querySelector('.review-panel');
        if (panel) {
            panel.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (panel.parentNode) {
                    panel.parentNode.removeChild(panel);
                }
            }, 300);
        }
    }
    
    /**
     * Abre painel de revisão
     */
    openReviewPanel(unitId) {
        // Remove painel existente se houver
        this.closeReviewPanel();
        
        // Cria novo painel
        const panelHtml = this.renderReviewPanel(unitId);
        const panelContainer = document.createElement('div');
        panelContainer.innerHTML = panelHtml;
        
        const panel = panelContainer.firstElementChild;
        panel.style.transform = 'translateX(100%)';
        
        document.body.appendChild(panel);
        
        // Anima entrada
        setTimeout(() => {
            panel.style.transform = 'translateX(0)';
        }, 50);
        
        // Feedback do Stitch
        const unitTitle = this.mindmaps[unitId]?.title || `Unidade ${unitId}`;
        window.stitchManager.showSpeech(`Aqui está o material de estudo da ${unitTitle}! 📚`);
    }
    
    /**
     * Integra conteúdo na página da unidade
     */
    integrateUnitContent(unitId, container) {
        if (!container) return;
        
        const mindmapHtml = this.renderMindmap(unitId);
        const reviewHtml = this.renderReviewContent(unitId);
        
        const contentHtml = `
            <div class="unit-content-tabs">
                <div class="tab-buttons">
                    <button class="tab-btn active" data-tab="mindmap">🧠 Mapa Mental</button>
                    <button class="tab-btn" data-tab="review">📖 Revisão</button>
                    <button class="tab-btn" data-tab="questions">❓ Questões</button>
                </div>
                
                <div class="tab-content">
                    <div class="tab-panel active" id="mindmap-panel">
                        ${mindmapHtml}
                    </div>
                    
                    <div class="tab-panel" id="review-panel">
                        ${reviewHtml}
                    </div>
                    
                    <div class="tab-panel" id="questions-panel">
                        <div id="questions-container">
                            <!-- Questões serão carregadas aqui -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = contentHtml;
        
        // Vincula eventos das abas
        this.bindTabEvents();
    }
    
    /**
     * Vincula eventos das abas
     */
    bindTabEvents() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Remove classe ativa de todos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Adiciona classe ativa ao selecionado
                button.classList.add('active');
                const targetPanel = document.getElementById(`${tabId}-panel`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                // Se for aba de questões, carrega questões
                if (tabId === 'questions') {
                    const unitId = window.alfaReviewApp?.currentUnit;
                    if (unitId) {
                        window.questionsManager.startUnit(unitId);
                    }
                }
            });
        });
    }
    
    /**
     * Obtém estatísticas de uso do conteúdo
     */
    getContentStats() {
        // Placeholder para estatísticas futuras
        return {
            mindmapsViewed: 0,
            contentAccessed: 0,
            downloadsCount: 0
        };
    }
}

// Instância global do gerenciador de conteúdo
window.contentManager = new ContentManager();

