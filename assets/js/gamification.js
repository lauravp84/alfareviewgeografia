/**
 * Sistema de Gamificação - AlfaReview Geografia
 * Gerencia pontuação, medalhas, estrelas e conquistas
 */

class GamificationManager {
    constructor() {
        this.pointsPerQuestion = {
            'multiple_choice': 10,
            'true_false': 10,
            'multiple_assertions': 15,
            'fact_consequence': 15,
            'mini_game': 20
        };
        
        this.timeBonus = 5;
        
        this.medals = {
            1: { name: '🥇 Detetive Demográfico', description: 'Especialista em Demografia' },
            2: { name: '🧭 Explorador Histórico', description: 'Conhecedor da Formação do Território' },
            3: { name: '⚒️ Trabalhador Curioso', description: 'Expert em Trabalho e Transformações' },
            4: { name: '🌆 Urbanista Mirim', description: 'Mestre do Espaço Urbano' },
            5: { name: '🚀 Viajante das Redes', description: 'Especialista em Mobilidade' },
            6: { name: '🌳 Guardião da Amazônia', description: 'Defensor da Matriz Energética' }
        };
        
        this.accessories = [
            { id: 'explorer_hat', name: 'Chapéu de Explorador', cost: 50, icon: '🎩' },
            { id: 'space_glasses', name: 'Óculos Espaciais', cost: 75, icon: '🕶️' },
            { id: 'field_backpack', name: 'Mochila de Campo', cost: 100, icon: '🎒' },
            { id: 'field_cap', name: 'Boné de Campo', cost: 30, icon: '🧢' }
        ];
        
        this.achievements = [];
        this.init();
    }
    
    /**
     * Inicializa sistema de gamificação
     */
    init() {
        this.loadAchievements();
        this.bindEvents();
    }
    
    /**
     * Carrega conquistas salvas
     */
    loadAchievements() {
        const data = window.storageManager.loadData();
        this.achievements = data.achievements.unlockedAccessories || [];
    }
    
    /**
     * Vincula eventos de gamificação
     */
    bindEvents() {
        // Eventos serão vinculados quando o sistema de questões for implementado
    }
    
    /**
     * Calcula pontos para uma resposta
     */
    calculatePoints(questionType, timeSpent = 0, isCorrect = true) {
        if (!isCorrect) return 0;
        
        let points = this.pointsPerQuestion[questionType] || 10;
        
        // Bônus por tempo (se respondeu em menos de 10 segundos)
        if (timeSpent > 0 && timeSpent < 10000) {
            points += this.timeBonus;
        }
        
        return points;
    }
    
    /**
     * Processa resposta de questão
     */
    processAnswer(unitId, questionType, isCorrect, timeSpent = 0) {
        const points = this.calculatePoints(questionType, timeSpent, isCorrect);
        
        if (isCorrect && points > 0) {
            // Adiciona pontos
            window.storageManager.addPoints(unitId, points);
            
            // Atualiza estatísticas da unidade
            const unitProgress = window.storageManager.getUnitProgress(unitId);
            const newCorrectAnswers = unitProgress.correctAnswers + 1;
            const newQuestionsAnswered = unitProgress.questionsAnswered + 1;
            
            window.storageManager.updateUnitProgress(unitId, {
                correctAnswers: newCorrectAnswers,
                questionsAnswered: newQuestionsAnswered
            });
            
            // Verifica conquistas
            this.checkAchievements(unitId, points);
            
            // Feedback visual
            this.showPointsAnimation(points);
            
            return { points, achievements: this.checkNewAchievements(unitId) };
        } else {
            // Atualiza apenas questões respondidas
            const unitProgress = window.storageManager.getUnitProgress(unitId);
            const newQuestionsAnswered = unitProgress.questionsAnswered + 1;
            
            window.storageManager.updateUnitProgress(unitId, {
                questionsAnswered: newQuestionsAnswered
            });
            
            return { points: 0, achievements: [] };
        }
    }
    
    /**
     * Calcula estrelas baseado na porcentagem de acertos
     */
    calculateStars(correctAnswers, totalQuestions) {
        if (totalQuestions === 0) return 0;
        
        const percentage = (correctAnswers / totalQuestions) * 100;
        
        if (percentage >= 90) return 3;
        if (percentage >= 80) return 2;
        if (percentage >= 50) return 1;
        return 0;
    }
    
    /**
     * Calcula medalha baseado na porcentagem de acertos
     */
    calculateMedal(correctAnswers, totalQuestions) {
        if (totalQuestions === 0) return null;
        
        const percentage = (correctAnswers / totalQuestions) * 100;
        
        if (percentage >= 90) return 'gold';
        if (percentage >= 80) return 'silver';
        if (percentage >= 50) return 'bronze';
        return null;
    }
    
    /**
     * Finaliza unidade e calcula recompensas
     */
    completeUnit(unitId) {
        const unitProgress = window.storageManager.getUnitProgress(unitId);
        const { correctAnswers, questionsAnswered } = unitProgress;
        
        // Calcula estrelas e medalha
        const stars = this.calculateStars(correctAnswers, questionsAnswered);
        const medalType = this.calculateMedal(correctAnswers, questionsAnswered);
        
        // Atualiza progresso
        window.storageManager.updateUnitProgress(unitId, {
            completed: true,
            progress: 100,
            stars: stars
        });
        
        // Define medalha se conquistada
        if (medalType) {
            const medalInfo = this.medals[unitId];
            window.storageManager.setUnitMedal(unitId, medalInfo.name);
            
            // Feedback do Stitch
            window.stitchManager.showMedalFeedback(medalType, medalInfo.name);
        }
        
        // Verifica se desbloqueou acessórios
        const newAccessories = this.checkAccessoryUnlock(unitProgress.points);
        
        // Atualiza interface
        window.alfaReviewApp.updateProgressDisplay();
        
        return {
            stars,
            medal: medalType ? this.medals[unitId] : null,
            newAccessories,
            totalPoints: window.storageManager.getOverallProgress().totalPoints
        };
    }
    
    /**
     * Verifica conquistas gerais
     */
    checkAchievements(unitId, points) {
        const overallProgress = window.storageManager.getOverallProgress();
        const achievements = [];
        
        // Primeira medalha
        if (overallProgress.totalMedals === 1) {
            achievements.push('first_medal');
        }
        
        // Marcos de pontuação
        if (overallProgress.totalPoints >= 100 && overallProgress.totalPoints - points < 100) {
            achievements.push('100_points');
        }
        
        if (overallProgress.totalPoints >= 500 && overallProgress.totalPoints - points < 500) {
            achievements.push('500_points');
        }
        
        // Todas as unidades completas
        if (overallProgress.completedUnits === 6) {
            achievements.push('all_units_complete');
        }
        
        return achievements;
    }
    
    /**
     * Verifica novos acessórios desbloqueados
     */
    checkAccessoryUnlock(totalPoints) {
        const newAccessories = [];
        
        this.accessories.forEach(accessory => {
            if (totalPoints >= accessory.cost && !this.achievements.includes(accessory.id)) {
                newAccessories.push(accessory);
                this.achievements.push(accessory.id);
                window.storageManager.unlockAccessory(accessory.id);
                
                // Feedback do Stitch
                window.stitchManager.showAccessoryFeedback(accessory.name);
            }
        });
        
        return newAccessories;
    }
    
    /**
     * Verifica novas conquistas
     */
    checkNewAchievements(unitId) {
        // Implementação futura para conquistas especiais
        return [];
    }
    
    /**
     * Mostra animação de pontos ganhos
     */
    showPointsAnimation(points) {
        // Cria elemento de animação
        const pointsElement = document.createElement('div');
        pointsElement.className = 'points-animation';
        pointsElement.textContent = `+${points}`;
        pointsElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            font-weight: bold;
            color: #7ED321;
            z-index: 9999;
            pointer-events: none;
            animation: pointsFloat 2s ease-out forwards;
        `;
        
        // Adiciona CSS da animação se não existir
        if (!document.getElementById('points-animation-style')) {
            const style = document.createElement('style');
            style.id = 'points-animation-style';
            style.textContent = `
                @keyframes pointsFloat {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: translate(-50%, -70px) scale(1.2);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -100px) scale(0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(pointsElement);
        
        // Remove elemento após animação
        setTimeout(() => {
            if (pointsElement.parentNode) {
                pointsElement.parentNode.removeChild(pointsElement);
            }
        }, 2000);
    }
    
    /**
     * Mostra modal de conquista
     */
    showAchievementModal(achievement) {
        const modal = document.createElement('div');
        modal.className = 'achievement-modal';
        modal.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <h3>Parabéns!</h3>
                <p>Você desbloqueou: <strong>${achievement.name}</strong></p>
                <button onclick="this.parentElement.parentElement.remove()">Continuar</button>
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
        `;
        
        document.body.appendChild(modal);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 5000);
    }
    
    /**
     * Obtém progresso detalhado de gamificação
     */
    getGamificationProgress() {
        const overallProgress = window.storageManager.getOverallProgress();
        const unitsProgress = {};
        
        for (let unitId = 1; unitId <= 6; unitId++) {
            const unitProgress = window.storageManager.getUnitProgress(unitId);
            unitsProgress[unitId] = {
                ...unitProgress,
                accuracy: unitProgress.questionsAnswered > 0 ? 
                    Math.round((unitProgress.correctAnswers / unitProgress.questionsAnswered) * 100) : 0,
                medal: this.medals[unitId]
            };
        }
        
        return {
            overall: overallProgress,
            units: unitsProgress,
            accessories: this.accessories.filter(acc => this.achievements.includes(acc.id)),
            availableAccessories: this.accessories.filter(acc => !this.achievements.includes(acc.id))
        };
    }
    
    /**
     * Reseta progresso de gamificação
     */
    reset() {
        this.achievements = [];
        // O reset completo é feito pelo StorageManager
    }
    
    /**
     * Calcula próxima recompensa
     */
    getNextReward() {
        const totalPoints = window.storageManager.getOverallProgress().totalPoints;
        
        const nextAccessory = this.accessories.find(acc => 
            !this.achievements.includes(acc.id) && totalPoints < acc.cost
        );
        
        if (nextAccessory) {
            return {
                type: 'accessory',
                item: nextAccessory,
                pointsNeeded: nextAccessory.cost - totalPoints
            };
        }
        
        return null;
    }
    
    /**
     * Obtém estatísticas de desempenho
     */
    getPerformanceStats() {
        const stats = {
            totalQuestions: 0,
            totalCorrect: 0,
            averageAccuracy: 0,
            bestUnit: null,
            worstUnit: null,
            totalTimeSpent: 0
        };
        
        let bestAccuracy = 0;
        let worstAccuracy = 100;
        
        for (let unitId = 1; unitId <= 6; unitId++) {
            const unitProgress = window.storageManager.getUnitProgress(unitId);
            stats.totalQuestions += unitProgress.questionsAnswered;
            stats.totalCorrect += unitProgress.correctAnswers;
            
            if (unitProgress.questionsAnswered > 0) {
                const accuracy = (unitProgress.correctAnswers / unitProgress.questionsAnswered) * 100;
                
                if (accuracy > bestAccuracy) {
                    bestAccuracy = accuracy;
                    stats.bestUnit = unitId;
                }
                
                if (accuracy < worstAccuracy) {
                    worstAccuracy = accuracy;
                    stats.worstUnit = unitId;
                }
            }
        }
        
        stats.averageAccuracy = stats.totalQuestions > 0 ? 
            Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;
        
        return stats;
    }
}

// Instância global do gerenciador de gamificação
window.gamificationManager = new GamificationManager();

