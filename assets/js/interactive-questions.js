/**
 * Sistema de Questões Interativas - AlfaReview Geografia
 * Implementa feedback correto/incorreto, pontuação e medalhas
 */

class InteractiveQuestionsSystem {
    constructor() {
        this.currentUnit = null;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.userAnswers = [];
        this.score = 0;
        this.correctAnswers = 0;
        this.startTime = null;
        this.questionStartTime = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadGameState();
    }
    
    /**
     * Inicia questões para uma unidade específica
     */
    async startQuestions(unitId) {
        this.currentUnit = unitId;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.correctAnswers = 0;
        this.startTime = Date.now();
        
        // Carregar questões da unidade
        this.questions = await getQuestionsForUnit(unitId);
        
        if (this.questions.length === 0) {
            this.showMessage('Questões não encontradas para esta unidade.');
            return;
        }
        
        this.showQuestion();
    }
    
    /**
     * Exibe a questão atual
     */
    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        this.questionStartTime = Date.now();
        
        const container = document.getElementById('questions-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="question-card unit-${this.currentUnit}">
                <div class="question-header">
                    <h3>Questão ${this.currentQuestionIndex + 1} de ${this.questions.length}</h3>
                    <div class="question-type">${this.getQuestionTypeLabel(question.type)}</div>
                    <div class="current-score">Pontos: ${this.score}</div>
                </div>
                
                <div class="question-content">
                    <p class="question-text">${question.question}</p>
                    
                    <div class="question-options">
                        ${this.renderQuestionOptions(question)}
                    </div>
                </div>
                
                <div class="question-actions">
                    <button class="btn btn-secondary" onclick="questionsSystem.showReviewPanel()">
                        🔄 Revisar Conteúdo
                    </button>
                    <button class="btn btn-primary" id="submit-answer" onclick="questionsSystem.submitAnswer()" disabled>
                        Responder
                    </button>
                </div>
            </div>
        `;
        
        this.bindQuestionEvents();
    }
    
    /**
     * Renderiza opções da questão baseado no tipo
     */
    renderQuestionOptions(question) {
        switch (question.type) {
            case 'true_false':
                return `
                    <div class="true-false-options">
                        <label class="option-label">
                            <input type="radio" name="answer" value="Verdadeiro">
                            <span class="option-text">✅ Verdadeiro</span>
                        </label>
                        <label class="option-label">
                            <input type="radio" name="answer" value="Falso">
                            <span class="option-text">❌ Falso</span>
                        </label>
                    </div>
                `;
                
            case 'multiple_choice':
                return question.options.map((option, index) => `
                    <label class="option-label">
                        <input type="radio" name="answer" value="${String.fromCharCode(97 + index)}">
                        <span class="option-text">${option}</span>
                    </label>
                `).join('');
                
            case 'multiple_assertions':
                return `
                    <div class="multiple-assertions">
                        <p>Marque V para Verdadeiro e F para Falso:</p>
                        ${question.options.map((option, index) => `
                            <div class="assertion-item">
                                <span class="assertion-text">${option}</span>
                                <div class="vf-options">
                                    <label><input type="radio" name="assertion_${index}" value="V"> V</label>
                                    <label><input type="radio" name="assertion_${index}" value="F"> F</label>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                
            default:
                return '<p>Tipo de questão não suportado.</p>';
        }
    }
    
    /**
     * Vincula eventos da questão atual
     */
    bindQuestionEvents() {
        const inputs = document.querySelectorAll('input[name="answer"], input[name^="assertion_"]');
        const submitBtn = document.getElementById('submit-answer');
        
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                const hasAnswer = this.checkIfAnswered();
                submitBtn.disabled = !hasAnswer;
            });
        });
    }
    
    /**
     * Verifica se a questão foi respondida
     */
    checkIfAnswered() {
        const question = this.questions[this.currentQuestionIndex];
        
        if (question.type === 'multiple_assertions') {
            const assertions = document.querySelectorAll('input[name^="assertion_"]');
            const groups = {};
            
            assertions.forEach(input => {
                const groupName = input.name;
                if (!groups[groupName]) groups[groupName] = false;
                if (input.checked) groups[groupName] = true;
            });
            
            return Object.values(groups).every(answered => answered);
        } else {
            return document.querySelector('input[name="answer"]:checked') !== null;
        }
    }
    
    /**
     * Submete a resposta e mostra feedback
     */
    submitAnswer() {
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.getUserAnswer();
        const isCorrect = this.checkAnswer(userAnswer, question.answer);
        
        // Calcular pontos
        const basePoints = QUESTION_POINTS[question.type] || 10;
        const timeBonus = this.calculateTimeBonus();
        const points = isCorrect ? basePoints + timeBonus : 0;
        
        if (isCorrect) {
            this.correctAnswers++;
            this.score += points;
        }
        
        // Salvar resposta
        this.userAnswers.push({
            question: question.question,
            userAnswer,
            correctAnswer: question.answer,
            isCorrect,
            points
        });
        
        // Mostrar feedback
        this.showFeedback(isCorrect, points, question);
    }
    
    /**
     * Obtém a resposta do usuário
     */
    getUserAnswer() {
        const question = this.questions[this.currentQuestionIndex];
        
        if (question.type === 'multiple_assertions') {
            const assertions = {};
            document.querySelectorAll('input[name^="assertion_"]:checked').forEach(input => {
                assertions[input.name] = input.value;
            });
            return assertions;
        } else {
            const selected = document.querySelector('input[name="answer"]:checked');
            return selected ? selected.value : '';
        }
    }
    
    /**
     * Verifica se a resposta está correta
     */
    checkAnswer(userAnswer, correctAnswer) {
        if (typeof userAnswer === 'object') {
            // Múltiplas assertivas
            return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
        }
        return userAnswer === correctAnswer;
    }
    
    /**
     * Calcula bônus por tempo (máximo 5 pontos)
     */
    calculateTimeBonus() {
        const timeSpent = (Date.now() - this.questionStartTime) / 1000;
        if (timeSpent <= 10) return 5;
        if (timeSpent <= 20) return 3;
        if (timeSpent <= 30) return 1;
        return 0;
    }
    
    /**
     * Mostra feedback da resposta
     */
    showFeedback(isCorrect, points, question) {
        const stitchFeedback = isCorrect 
            ? STITCH_FEEDBACK.correct[Math.floor(Math.random() * STITCH_FEEDBACK.correct.length)]
            : STITCH_FEEDBACK.incorrect[Math.floor(Math.random() * STITCH_FEEDBACK.incorrect.length)];
        
        let explanation = '';
        if (!isCorrect) {
            explanation = this.getExplanationForQuestion(question);
        }
        
        const modal = document.createElement('div');
        modal.className = 'feedback-modal';
        modal.innerHTML = `
            <div class="feedback-content unit-${this.currentUnit}">
                <div class="feedback-header">
                    <div class="feedback-result ${isCorrect ? 'correct' : 'incorrect'}">
                        ${isCorrect ? '✅ CORRETO!' : '❌ INCORRETO'}
                    </div>
                    ${points > 0 ? `<div class="points-earned">+${points} pontos!</div>` : ''}
                </div>
                
                <div class="stitch-feedback">
                    <img src="/alfareview-geografia/assets/images/stitch-unidade-${this.currentUnit}.png" 
                         alt="Stitch" class="stitch-avatar">
                    <div class="stitch-speech">
                        <p>"${stitchFeedback}"</p>
                        ${explanation ? `<p class="explanation">${explanation}</p>` : ''}
                    </div>
                </div>
                
                <div class="feedback-actions">
                    <button class="btn btn-primary" onclick="questionsSystem.nextQuestion()">
                        Próxima Questão
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => modal.classList.add('show'), 100);
    }
    
    /**
     * Obtém explicação educativa para a questão
     */
    getExplanationForQuestion(question) {
        const text = question.question.toLowerCase();
        
        if (text.includes('demografia')) return EDUCATIONAL_EXPLANATIONS.demografia;
        if (text.includes('densidade')) return EDUCATIONAL_EXPLANATIONS.densidade_demografica;
        if (text.includes('êxodo') || text.includes('exodo')) return EDUCATIONAL_EXPLANATIONS.exodo_rural;
        if (text.includes('urbanização') || text.includes('urbanizacao')) return EDUCATIONAL_EXPLANATIONS.urbanizacao;
        if (text.includes('energia solar')) return EDUCATIONAL_EXPLANATIONS.energia_solar;
        if (text.includes('território') || text.includes('territorio')) return EDUCATIONAL_EXPLANATIONS.territorio;
        if (text.includes('trabalho')) return EDUCATIONAL_EXPLANATIONS.trabalho;
        if (text.includes('transporte')) return EDUCATIONAL_EXPLANATIONS.transporte;
        if (text.includes('energia')) return EDUCATIONAL_EXPLANATIONS.energia;
        
        return "Lembre-se de revisar o conteúdo da unidade para entender melhor esse conceito!";
    }
    
    /**
     * Avança para próxima questão
     */
    nextQuestion() {
        // Remover modal de feedback
        const modal = document.querySelector('.feedback-modal');
        if (modal) modal.remove();
        
        this.currentQuestionIndex++;
        this.showQuestion();
    }
    
    /**
     * Mostra resultados finais
     */
    showResults() {
        const percentage = Math.round((this.correctAnswers / this.questions.length) * 100);
        const medal = calculateMedal(percentage);
        const unitMedal = UNIT_MEDALS[this.currentUnit];
        
        const container = document.getElementById('questions-container');
        container.innerHTML = `
            <div class="results-card unit-${this.currentUnit}">
                <div class="results-header">
                    <h2>🎉 Parabéns!</h2>
                    <div class="final-score">
                        <div class="score-value">${this.score} pontos</div>
                        <div class="accuracy">${this.correctAnswers}/${this.questions.length} acertos (${percentage}%)</div>
                    </div>
                </div>
                
                <div class="medal-section">
                    <div class="stars">
                        ${'⭐'.repeat(medal.stars)}
                    </div>
                    
                    ${medal.medal ? `
                        <div class="medal-earned">
                            <div class="medal-icon">${medal.emoji}</div>
                            <div class="medal-info">
                                <div class="medal-type">Medalha de ${medal.medal === 'gold' ? 'Ouro' : medal.medal === 'silver' ? 'Prata' : 'Bronze'}</div>
                                <div class="medal-name">${unitMedal.icon} ${unitMedal.name}</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="stitch-congratulations">
                    <img src="/alfareview-geografia/assets/images/stitch-unidade-${this.currentUnit}.png" 
                         alt="Stitch" class="stitch-avatar">
                    <div class="stitch-speech">
                        <p>"${this.getCongratulatoryMessage(percentage)}"</p>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-secondary" onclick="questionsSystem.restartUnit()">
                        🔄 Recomeçar Unidade
                    </button>
                    <button class="btn btn-primary" onclick="app.showHome()">
                        🏠 Voltar ao Início
                    </button>
                </div>
            </div>
        `;
        
        // Salvar progresso
        this.saveProgress();
    }
    
    /**
     * Obtém mensagem de parabéns baseada na performance
     */
    getCongratulatoryMessage(percentage) {
        if (percentage >= 90) {
            return "Uau! Você é um verdadeiro expert em Geografia! Tia Roberta ficaria super orgulhosa!";
        } else if (percentage >= 80) {
            return "Muito bem! Você mandou muito bem nessa unidade! Continue assim!";
        } else if (percentage >= 50) {
            return "Bom trabalho! Você está no caminho certo. Que tal revisar um pouquinho mais?";
        } else {
            return "Não desanime! Todo mundo aprende no seu tempo. Vamos revisar juntos?";
        }
    }
    
    /**
     * Mostra painel de revisão lateral
     */
    showReviewPanel() {
        const panel = document.createElement('div');
        panel.className = 'review-panel';
        panel.innerHTML = `
            <div class="review-content">
                <div class="review-header">
                    <h3>📚 Revisão - Unidade ${this.currentUnit}</h3>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                
                <div class="review-tabs">
                    <button class="tab-btn active" onclick="questionsSystem.showReviewTab('mindmap')">
                        🗺️ Mapa Mental
                    </button>
                    <button class="tab-btn" onclick="questionsSystem.showReviewTab('content')">
                        📖 Conteúdo
                    </button>
                </div>
                
                <div class="review-body" id="review-body">
                    <img src="/alfareview-geografia/assets/mindmaps/mapa-unidade-${this.currentUnit}.png" 
                         alt="Mapa Mental Unidade ${this.currentUnit}" class="mindmap-image">
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        setTimeout(() => panel.classList.add('show'), 100);
    }
    
    /**
     * Mostra aba específica do painel de revisão
     */
    showReviewTab(tab) {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
        const body = document.getElementById('review-body');
        
        if (tab === 'mindmap') {
            body.innerHTML = `
                <img src="/alfareview-geografia/assets/mindmaps/mapa-unidade-${this.currentUnit}.png" 
                     alt="Mapa Mental Unidade ${this.currentUnit}" class="mindmap-image">
            `;
        } else if (tab === 'content') {
            // Carregar conteúdo de revisão visual
            this.loadVisualReview(body);
        }
    }
    
    /**
     * Carrega revisão visual da unidade
     */
    async loadVisualReview(container) {
        try {
            const response = await fetch(`/alfareview-geografia/data/revisao_visual_unidade_${this.currentUnit}.txt`);
            const content = await response.text();
            container.innerHTML = content;
        } catch (error) {
            container.innerHTML = '<p>Conteúdo de revisão não encontrado.</p>';
        }
    }
    
    /**
     * Reinicia a unidade atual
     */
    restartUnit() {
        this.startQuestions(this.currentUnit);
    }
    
    /**
     * Salva progresso no localStorage
     */
    saveProgress() {
        const progress = JSON.parse(localStorage.getItem('alfareview_progress') || '{}');
        
        progress[`unidade_${this.currentUnit}`] = {
            completed: true,
            score: this.score,
            accuracy: Math.round((this.correctAnswers / this.questions.length) * 100),
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('alfareview_progress', JSON.stringify(progress));
    }
    
    /**
     * Carrega estado do jogo
     */
    loadGameState() {
        const progress = JSON.parse(localStorage.getItem('alfareview_progress') || '{}');
        return progress;
    }
    
    /**
     * Obtém label do tipo de questão
     */
    getQuestionTypeLabel(type) {
        const labels = {
            'true_false': 'Verdadeiro ou Falso',
            'multiple_choice': 'Múltipla Escolha',
            'multiple_assertions': 'Múltiplas Assertivas',
            'fact_consequence': 'Fato e Consequência'
        };
        return labels[type] || 'Questão';
    }
    
    /**
     * Vincula eventos globais
     */
    bindEvents() {
        // Eventos serão vinculados conforme necessário
    }
    
    /**
     * Mostra mensagem
     */
    showMessage(message) {
        console.log(message);
        // Implementar modal de mensagem se necessário
    }
}

// Inicializar sistema
const questionsSystem = new InteractiveQuestionsSystem();

// Exportar para uso global
window.questionsSystem = questionsSystem;

