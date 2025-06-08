/**
 * Sistema de Gamificação Completo - AlfaReview Geografia
 * Medalhas, estrelas, acessórios e recompensas
 */

class GamificationSystem {
    constructor() {
        this.accessories = this.loadAccessories();
        this.achievements = this.loadAchievements();
        
        this.init();
    }
    
    init() {
        this.setupAccessorySystem();
        this.updateGamificationDisplay();
    }
    
    /**
     * Calcula medalha e estrelas baseado na porcentagem de acertos
     */
    calculateRewards(percentage, unitId) {
        let stars = 1;
        let medal = null;
        let medalEmoji = '';
        
        if (percentage >= 90) {
            stars = 3;
            medal = 'gold';
            medalEmoji = '🥇';
        } else if (percentage >= 80) {
            stars = 3;
            medal = 'silver';
            medalEmoji = '🥈';
        } else if (percentage >= 50) {
            stars = 2;
            medal = 'bronze';
            medalEmoji = '🥉';
        }
        
        const unitMedal = this.getUnitMedal(unitId);
        
        return {
            stars,
            medal,
            medalEmoji,
            unitMedal,
            percentage
        };
    }
    
    /**
     * Obtém medalha temática da unidade
     */
    getUnitMedal(unitId) {
        const medals = {
            1: { name: 'Detetive Demográfico', icon: '🕵️', description: 'Expert em população e demografia' },
            2: { name: 'Explorador Histórico', icon: '🧭', description: 'Conhecedor da formação territorial' },
            3: { name: 'Trabalhador Curioso', icon: '⚒️', description: 'Especialista em transformações do trabalho' },
            4: { name: 'Urbanista Mirim', icon: '🌆', description: 'Mestre do espaço urbano' },
            5: { name: 'Viajante das Redes', icon: '🚀', description: 'Navegador de transportes e comunicação' },
            6: { name: 'Guardião da Amazônia', icon: '🌳', description: 'Protetor da matriz energética' }
        };
        
        return medals[unitId] || medals[1];
    }
    
    /**
     * Calcula pontos por tipo de questão
     */
    calculateQuestionPoints(questionType, isCorrect, timeBonus = 0) {
        if (!isCorrect) return 0;
        
        const basePoints = {
            'true_false': 10,
            'multiple_choice': 10,
            'multiple_assertions': 15,
            'fact_consequence': 15,
            'mini_game': 20
        };
        
        const points = basePoints[questionType] || 10;
        return points + timeBonus;
    }
    
    /**
     * Calcula bônus por tempo (máximo 5 pontos)
     */
    calculateTimeBonus(timeSpent) {
        if (timeSpent <= 10) return 5;
        if (timeSpent <= 20) return 3;
        if (timeSpent <= 30) return 1;
        return 0;
    }
    
    /**
     * Verifica se desbloqueou novo acessório
     */
    checkAccessoryUnlock(totalPoints) {
        const accessoryThresholds = [
            { points: 100, id: 'hat', name: 'Chapéu de Explorador', emoji: '🎩' },
            { points: 250, id: 'glasses', name: 'Óculos Espaciais', emoji: '🕶️' },
            { points: 400, id: 'backpack', name: 'Mochila de Campo', emoji: '🎒' },
            { points: 600, id: 'compass', name: 'Bússola Dourada', emoji: '🧭' },
            { points: 800, id: 'medal_special', name: 'Medalha Especial', emoji: '🏆' },
            { points: 1000, id: 'crown', name: 'Coroa de Geografia', emoji: '👑' }
        ];
        
        const unlockedAccessories = [];
        
        accessoryThresholds.forEach(accessory => {
            if (totalPoints >= accessory.points && !this.accessories.includes(accessory.id)) {
                unlockedAccessories.push(accessory);
                this.accessories.push(accessory.id);
            }
        });
        
        if (unlockedAccessories.length > 0) {
            this.saveAccessories();
            return unlockedAccessories;
        }
        
        return [];
    }
    
    /**
     * Mostra modal de novo acessório desbloqueado
     */
    showAccessoryUnlock(accessories) {
        accessories.forEach(accessory => {
            this.showAccessoryModal(accessory);
        });
    }
    
    /**
     * Mostra modal de acessório
     */
    showAccessoryModal(accessory) {
        const modal = document.createElement('div');
        modal.className = 'accessory-modal';
        modal.innerHTML = `
            <div class="accessory-content">
                <div class="accessory-header">
                    <h2>🎉 Novo Acessório Desbloqueado!</h2>
                </div>
                
                <div class="accessory-showcase">
                    <div class="accessory-icon">${accessory.emoji}</div>
                    <div class="accessory-info">
                        <h3>${accessory.name}</h3>
                        <p>Parabéns! Você desbloqueou um novo acessório para o Stitch!</p>
                    </div>
                </div>
                
                <div class="stitch-celebration">
                    <img src="assets/stitch/Unidade1.png" alt="Stitch" class="stitch-happy">
                    <div class="stitch-speech">
                        <p>"Oba! Agora eu tenho um ${accessory.name}! Obrigado por estudar tanto!"</p>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Continuar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => modal.classList.add('show'), 100);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 5000);
    }
    
    /**
     * Atualiza display de gamificação na página inicial
     */
    updateGamificationDisplay() {
        const progress = JSON.parse(localStorage.getItem('alfareview_progress') || '{}');
        let totalPoints = 0;
        let totalMedals = 0;
        let completedUnits = 0;
        
        // Calcular estatísticas
        for (let unitId = 1; unitId <= 6; unitId++) {
            const unitProgress = progress[`unidade_${unitId}`];
            
            if (unitProgress) {
                totalPoints += unitProgress.score || 0;
                completedUnits++;
                
                if (unitProgress.accuracy >= 50) {
                    totalMedals++;
                }
                
                // Atualizar display da unidade
                this.updateUnitDisplay(unitId, unitProgress);
            }
        }
        
        // Atualizar estatísticas gerais
        this.updateOverallStats(totalPoints, totalMedals, completedUnits);
        
        // Verificar novos acessórios
        const newAccessories = this.checkAccessoryUnlock(totalPoints);
        if (newAccessories.length > 0) {
            setTimeout(() => this.showAccessoryUnlock(newAccessories), 1000);
        }
    }
    
    /**
     * Atualiza display de uma unidade específica
     */
    updateUnitDisplay(unitId, unitProgress) {
        const rewards = this.calculateRewards(unitProgress.accuracy, unitId);
        
        // Atualizar barra de progresso
        const progressBar = document.getElementById(`progress-${unitId}`);
        if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.classList.add('completed');
        }
        
        // Atualizar estrelas
        const starsElement = document.getElementById(`stars-${unitId}`);
        if (starsElement) {
            const starDisplay = '⭐'.repeat(rewards.stars) + '☆'.repeat(3 - rewards.stars);
            starsElement.textContent = starDisplay;
            starsElement.classList.add('earned');
        }
        
        // Atualizar medalha
        const medalElement = document.getElementById(`medal-${unitId}`);
        if (medalElement) {
            if (rewards.medal) {
                medalElement.textContent = rewards.medalEmoji;
                medalElement.title = `${rewards.unitMedal.name} - ${rewards.medal}`;
                medalElement.classList.add('earned');
            } else {
                medalElement.textContent = '—';
                medalElement.classList.remove('earned');
            }
        }
    }
    
    /**
     * Atualiza estatísticas gerais
     */
    updateOverallStats(totalPoints, totalMedals, completedUnits) {
        // Pontos totais
        const totalPointsElement = document.getElementById('total-points');
        if (totalPointsElement) {
            this.animateNumber(totalPointsElement, totalPoints);
        }
        
        // Total de medalhas
        const totalMedalsElement = document.getElementById('total-medals');
        if (totalMedalsElement) {
            this.animateNumber(totalMedalsElement, totalMedals);
        }
        
        // Total de acessórios
        const totalAccessoriesElement = document.getElementById('total-accessories');
        if (totalAccessoriesElement) {
            this.animateNumber(totalAccessoriesElement, this.accessories.length);
        }
        
        // Atualizar progresso geral
        const overallProgress = Math.round((completedUnits / 6) * 100);
        const overallProgressElement = document.getElementById('overall-progress');
        if (overallProgressElement) {
            overallProgressElement.style.width = `${overallProgress}%`;
        }
    }
    
    /**
     * Anima números com efeito de contagem
     */
    animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const increment = Math.ceil((targetValue - currentValue) / 20);
        
        if (currentValue < targetValue) {
            element.textContent = Math.min(currentValue + increment, targetValue);
            setTimeout(() => this.animateNumber(element, targetValue), 50);
        }
    }
    
    /**
     * Configura sistema de acessórios
     */
    setupAccessorySystem() {
        // Criar galeria de acessórios se não existir
        this.createAccessoryGallery();
    }
    
    /**
     * Cria galeria de acessórios
     */
    createAccessoryGallery() {
        const existingGallery = document.getElementById('accessory-gallery');
        if (existingGallery) return;
        
        const progressPanel = document.querySelector('.progress-panel');
        if (!progressPanel) return;
        
        const gallery = document.createElement('div');
        gallery.id = 'accessory-gallery';
        gallery.className = 'accessory-gallery';
        gallery.innerHTML = `
            <h3>🎁 Acessórios do Stitch</h3>
            <div class="accessories-grid">
                <div class="accessory-item ${this.accessories.includes('hat') ? 'unlocked' : 'locked'}">
                    <span class="accessory-emoji">🎩</span>
                    <span class="accessory-name">Chapéu</span>
                </div>
                <div class="accessory-item ${this.accessories.includes('glasses') ? 'unlocked' : 'locked'}">
                    <span class="accessory-emoji">🕶️</span>
                    <span class="accessory-name">Óculos</span>
                </div>
                <div class="accessory-item ${this.accessories.includes('backpack') ? 'unlocked' : 'locked'}">
                    <span class="accessory-emoji">🎒</span>
                    <span class="accessory-name">Mochila</span>
                </div>
                <div class="accessory-item ${this.accessories.includes('compass') ? 'unlocked' : 'locked'}">
                    <span class="accessory-emoji">🧭</span>
                    <span class="accessory-name">Bússola</span>
                </div>
                <div class="accessory-item ${this.accessories.includes('medal_special') ? 'unlocked' : 'locked'}">
                    <span class="accessory-emoji">🏆</span>
                    <span class="accessory-name">Troféu</span>
                </div>
                <div class="accessory-item ${this.accessories.includes('crown') ? 'unlocked' : 'locked'}">
                    <span class="accessory-emoji">👑</span>
                    <span class="accessory-name">Coroa</span>
                </div>
            </div>
        `;
        
        progressPanel.appendChild(gallery);
    }
    
    /**
     * Salva progresso de acessórios
     */
    saveAccessories() {
        localStorage.setItem('alfareview_accessories', JSON.stringify(this.accessories));
    }
    
    /**
     * Carrega acessórios salvos
     */
    loadAccessories() {
        return JSON.parse(localStorage.getItem('alfareview_accessories') || '[]');
    }
    
    /**
     * Salva conquistas
     */
    saveAchievements() {
        localStorage.setItem('alfareview_achievements', JSON.stringify(this.achievements));
    }
    
    /**
     * Carrega conquistas salvas
     */
    loadAchievements() {
        return JSON.parse(localStorage.getItem('alfareview_achievements') || '[]');
    }
    
    /**
     * Verifica conquistas especiais
     */
    checkSpecialAchievements(progress) {
        const newAchievements = [];
        
        // Primeira unidade completa
        if (!this.achievements.includes('first_unit') && Object.keys(progress).length >= 1) {
            newAchievements.push({
                id: 'first_unit',
                name: 'Primeiro Passo',
                description: 'Completou sua primeira unidade!',
                emoji: '🎯'
            });
        }
        
        // Todas as unidades completas
        if (!this.achievements.includes('all_units') && Object.keys(progress).length >= 6) {
            newAchievements.push({
                id: 'all_units',
                name: 'Mestre da Geografia',
                description: 'Completou todas as unidades!',
                emoji: '🌍'
            });
        }
        
        // Perfeccionista (90% ou mais em todas)
        const allPerfect = Object.values(progress).every(unit => unit.accuracy >= 90);
        if (!this.achievements.includes('perfectionist') && allPerfect && Object.keys(progress).length >= 6) {
            newAchievements.push({
                id: 'perfectionist',
                name: 'Perfeccionista',
                description: 'Obteve 90% ou mais em todas as unidades!',
                emoji: '💎'
            });
        }
        
        // Salvar novas conquistas
        newAchievements.forEach(achievement => {
            this.achievements.push(achievement.id);
        });
        
        if (newAchievements.length > 0) {
            this.saveAchievements();
        }
        
        return newAchievements;
    }
    
    /**
     * Reseta todo o progresso de gamificação
     */
    resetAllProgress() {
        localStorage.removeItem('alfareview_progress');
        localStorage.removeItem('alfareview_accessories');
        localStorage.removeItem('alfareview_achievements');
        
        this.accessories = [];
        this.achievements = [];
        
        this.updateGamificationDisplay();
    }
}

// Inicializar sistema de gamificação
const gamificationSystem = new GamificationSystem();

// Exportar para uso global
window.gamificationSystem = gamificationSystem;

