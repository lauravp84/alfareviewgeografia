/**
 * Sistema de Questões - AlfaReview Geografia
 * Gerencia questões interativas, tipos e validação
 */

class QuestionsManager {
    constructor() {
        this.currentUnit = null;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.userAnswers = [];
        this.startTime = null;
        this.questionStartTime = null;
        
        // Tipos de questões suportados
        this.questionTypes = {
            'multiple_choice': 'Múltipla Escolha',
            'true_false': 'Verdadeiro ou Falso',
            'multiple_assertions': 'Múltiplas Assertivas',
            'fact_consequence': 'Fato e Consequência'
        };
        
        this.init();
    }
    
    /**
     * Inicializa sistema de questões
     */
    init() {
        this.loadQuestionsData();
        this.bindEvents();
    }
    
    /**
     * Carrega dados das questões (placeholder)
     */
    loadQuestionsData() {
        // Por enquanto, dados de exemplo
        // Na implementação final, carregará dos arquivos DOCX processados
        this.questionsDatabase = {
            1: [ // Demografia
                {
                    id: 1,
                    type: 'multiple_choice',
                    question: 'O que é demografia?',
                    options: [
                        'Estudo das populações',
                        'Estudo do clima',
                        'Estudo das plantas',
                        'Estudo dos animais'
                    ],
                    correct: 0,
                    explanation: 'Demografia é o estudo das populações humanas, incluindo seu tamanho, distribuição e características.'
                },
                {
                    id: 2,
                    type: 'true_false',
                    question: 'O êxodo rural é a migração das pessoas do campo para a cidade.',
                    correct: true,
                    explanation: 'O êxodo rural é quando as pessoas saem do campo e vão morar na cidade em busca de melhores oportunidades.'
                }
            ],
            2: [ // Formação do Território
                {
                    id: 3,
                    type: 'multiple_choice',
                    question: 'Como o território brasileiro foi formado?',
                    options: [
                        'De uma só vez',
                        'Aos poucos, ao longo da história',
                        'Apenas pelos portugueses',
                        'Apenas pelos indígenas'
                    ],
                    correct: 1,
                    explanation: 'O território brasileiro foi se formando aos poucos, com a participação de diferentes povos ao longo da história.'
                }
            ],
            3: [ // Trabalho e Transformações
                {
                    id: 4,
                    type: 'multiple_choice',
                    question: 'Como o trabalho transforma os espaços?',
                    options: [
                        'Não transforma',
                        'Criando construções e modificando a paisagem',
                        'Apenas destruindo',
                        'Apenas preservando'
                    ],
                    correct: 1,
                    explanation: 'O trabalho humano transforma os espaços através de construções, agricultura, indústrias e outras atividades.'
                }
            ],
            4: [ // Espaço Urbano
                {
                    id: 5,
                    type: 'true_false',
                    question: 'Urbanização é o crescimento das cidades.',
                    correct: true,
                    explanation: 'Urbanização é o processo de crescimento das cidades e aumento da população urbana.'
                }
            ],
            5: [ // Mobilidade e Redes
                {
                    id: 6,
                    type: 'multiple_choice',
                    question: 'O que são redes de transporte?',
                    options: [
                        'Apenas estradas',
                        'Sistemas que conectam diferentes lugares',
                        'Apenas aviões',
                        'Apenas trens'
                    ],
                    correct: 1,
                    explanation: 'Redes de transporte são sistemas que conectam diferentes lugares através de estradas, ferrovias, aeroportos, portos, etc.'
                }
            ],
            6: [ // Matriz Energética
                {
                    id: 7,
                    type: 'true_false',
                    question: 'A energia solar é uma fonte renovável.',
                    correct: true,
                    explanation: 'A energia solar é renovável porque vem do sol, que é uma fonte inesgotável de energia.'
                }
            ]
        };
    }
    
    /**
     * Vincula eventos do sistema de questões
     */
    bindEvents() {
        // Eventos serão vinculados dinamicamente quando as questões forem carregadas
    }
    
    /**
     * Inicia questões de uma unidade
     */
    startUnit(unitId) {
        this.currentUnit = unitId;
        this.currentQuestionIndex = 0;
        this.questions = this.questionsDatabase[unitId] || [];
        this.userAnswers = [];
        this.startTime = Date.now();
        
        if (this.questions.length > 0) {
            this.renderQuestionsInterface();
            this.showQuestion(0);
        } else {
            this.showNoQuestionsMessage();
        }
    }
    
    /**
     * Renderiza interface das questões
     */
    renderQuestionsInterface() {
        const container = document.getElementById('questions-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="questions-header">
                <div class="progress-info">
                    <span id="question-counter">1 de ${this.questions.length}</span>
                    <div class="question-progress-bar">
                        <div id="question-progress-fill" class="progress-fill"></div>
                    </div>
                </div>
                <div class="points-display">
                    <span id="current-points">0 pontos</span>
                </div>
            </div>
            
            <div id="question-content" class="question-content">
                <!-- Questão será carregada aqui -->
            </div>
            
            <div class="question-actions">
                <button id="prev-question" class="btn-secondary" disabled>← Anterior</button>
                <button id="next-question" class="btn-primary" disabled>Próxima →</button>
                <button id="finish-unit" class="btn-primary" style="display: none;">Finalizar Unidade</button>
            </div>
            
            <div id="feedback-area" class="feedback-area" style="display: none;">
                <!-- Feedback será mostrado aqui -->
            </div>
        `;
        
        this.bindQuestionEvents();
    }
    
    /**
     * Vincula eventos específicos das questões
     */
    bindQuestionEvents() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const finishBtn = document.getElementById('finish-unit');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (finishBtn) {
            finishBtn.addEventListener('click', () => this.finishUnit());
        }
    }
    
    /**
     * Mostra questão específica
     */
    showQuestion(index) {
        if (index < 0 || index >= this.questions.length) return;
        
        this.currentQuestionIndex = index;
        this.questionStartTime = Date.now();
        
        const question = this.questions[index];
        const content = document.getElementById('question-content');
        
        if (!content) return;
        
        // Atualiza contador e progresso
        this.updateQuestionProgress();
        
        // Renderiza questão baseada no tipo
        switch (question.type) {
            case 'multiple_choice':
                this.renderMultipleChoice(question);
                break;
            case 'true_false':
                this.renderTrueFalse(question);
                break;
            case 'multiple_assertions':
                this.renderMultipleAssertions(question);
                break;
            case 'fact_consequence':
                this.renderFactConsequence(question);
                break;
            default:
                this.renderGenericQuestion(question);
        }
        
        // Atualiza botões de navegação
        this.updateNavigationButtons();
    }
    
    /**
     * Renderiza questão de múltipla escolha
     */
    renderMultipleChoice(question) {
        const content = document.getElementById('question-content');
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        
        content.innerHTML = `
            <div class="question-header">
                <span class="question-type">Múltipla Escolha</span>
                <h3>${question.question}</h3>
            </div>
            
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <label class="option-label ${userAnswer === index ? 'selected' : ''}" data-index="${index}">
                        <input type="radio" name="question-${question.id}" value="${index}" 
                               ${userAnswer === index ? 'checked' : ''}>
                        <span class="option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
        
        // Vincula eventos das opções
        const options = content.querySelectorAll('.option-label');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const index = parseInt(option.dataset.index);
                this.selectAnswer(index);
            });
        });
    }
    
    /**
     * Renderiza questão verdadeiro/falso
     */
    renderTrueFalse(question) {
        const content = document.getElementById('question-content');
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        
        content.innerHTML = `
            <div class="question-header">
                <span class="question-type">Verdadeiro ou Falso</span>
                <h3>${question.question}</h3>
            </div>
            
            <div class="true-false-container">
                <label class="tf-option ${userAnswer === true ? 'selected' : ''}" data-value="true">
                    <input type="radio" name="question-${question.id}" value="true" 
                           ${userAnswer === true ? 'checked' : ''}>
                    <span class="tf-text">✓ Verdadeiro</span>
                </label>
                
                <label class="tf-option ${userAnswer === false ? 'selected' : ''}" data-value="false">
                    <input type="radio" name="question-${question.id}" value="false" 
                           ${userAnswer === false ? 'checked' : ''}>
                    <span class="tf-text">✗ Falso</span>
                </label>
            </div>
        `;
        
        // Vincula eventos
        const options = content.querySelectorAll('.tf-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const value = option.dataset.value === 'true';
                this.selectAnswer(value);
            });
        });
    }
    
    /**
     * Renderiza questão genérica (placeholder)
     */
    renderGenericQuestion(question) {
        const content = document.getElementById('question-content');
        content.innerHTML = `
            <div class="question-header">
                <span class="question-type">${this.questionTypes[question.type] || 'Questão'}</span>
                <h3>${question.question}</h3>
            </div>
            
            <div class="generic-question">
                <p>Este tipo de questão será implementado em breve!</p>
                <button class="btn-primary" onclick="window.questionsManager.selectAnswer(true)">
                    Continuar
                </button>
            </div>
        `;
    }
    
    /**
     * Renderiza múltiplas assertivas (placeholder)
     */
    renderMultipleAssertions(question) {
        this.renderGenericQuestion(question);
    }
    
    /**
     * Renderiza fato e consequência (placeholder)
     */
    renderFactConsequence(question) {
        this.renderGenericQuestion(question);
    }
    
    /**
     * Seleciona resposta
     */
    selectAnswer(answer) {
        this.userAnswers[this.currentQuestionIndex] = answer;
        
        // Atualiza interface visual
        this.updateSelectedOption(answer);
        
        // Habilita botão próxima
        const nextBtn = document.getElementById('next-question');
        const finishBtn = document.getElementById('finish-unit');
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            if (finishBtn) finishBtn.disabled = false;
        } else {
            if (nextBtn) nextBtn.disabled = false;
        }
        
        // Processa resposta
        this.processAnswer(answer);
    }
    
    /**
     * Atualiza opção selecionada visualmente
     */
    updateSelectedOption(answer) {
        const options = document.querySelectorAll('.option-label, .tf-option');
        options.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Marca opção selecionada
        const selectedOption = document.querySelector(`[data-index="${answer}"], [data-value="${answer}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    /**
     * Processa resposta da questão
     */
    processAnswer(userAnswer) {
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.checkAnswer(question, userAnswer);
        const timeSpent = Date.now() - this.questionStartTime;
        
        // Processa através do sistema de gamificação
        const result = window.gamificationManager.processAnswer(
            this.currentUnit, 
            question.type, 
            isCorrect, 
            timeSpent
        );
        
        // Mostra feedback
        this.showFeedback(isCorrect, question.explanation, result.points);
        
        // Atualiza pontos na interface
        this.updatePointsDisplay();
        
        return result;
    }
    
    /**
     * Verifica se resposta está correta
     */
    checkAnswer(question, userAnswer) {
        if (question.type === 'multiple_choice') {
            return userAnswer === question.correct;
        } else if (question.type === 'true_false') {
            return userAnswer === question.correct;
        }
        // Outros tipos serão implementados
        return false;
    }
    
    /**
     * Mostra feedback da resposta
     */
    showFeedback(isCorrect, explanation, points) {
        const feedbackArea = document.getElementById('feedback-area');
        if (!feedbackArea) return;
        
        feedbackArea.style.display = 'block';
        feedbackArea.className = `feedback-area ${isCorrect ? 'correct' : 'incorrect'}`;
        
        feedbackArea.innerHTML = `
            <div class="feedback-content">
                <div class="feedback-icon">
                    ${isCorrect ? '✅' : '❌'}
                </div>
                <div class="feedback-text">
                    <h4>${isCorrect ? 'Correto!' : 'Ops!'}</h4>
                    <p>${explanation}</p>
                    ${points > 0 ? `<div class="points-earned">+${points} pontos!</div>` : ''}
                </div>
            </div>
        `;
        
        // Feedback do Stitch
        if (isCorrect) {
            window.stitchManager.showCorrectFeedback();
        } else {
            window.stitchManager.showIncorrectFeedback(explanation);
        }
        
        // Esconde feedback após alguns segundos
        setTimeout(() => {
            feedbackArea.style.display = 'none';
        }, 3000);
    }
    
    /**
     * Atualiza exibição de pontos
     */
    updatePointsDisplay() {
        const pointsElement = document.getElementById('current-points');
        if (pointsElement) {
            const unitProgress = window.storageManager.getUnitProgress(this.currentUnit);
            pointsElement.textContent = `${unitProgress.points} pontos`;
        }
    }
    
    /**
     * Atualiza progresso das questões
     */
    updateQuestionProgress() {
        const counter = document.getElementById('question-counter');
        const progressFill = document.getElementById('question-progress-fill');
        
        if (counter) {
            counter.textContent = `${this.currentQuestionIndex + 1} de ${this.questions.length}`;
        }
        
        if (progressFill) {
            const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }
    
    /**
     * Atualiza botões de navegação
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const finishBtn = document.getElementById('finish-unit');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestionIndex === 0;
        }
        
        if (nextBtn) {
            const hasAnswer = this.userAnswers[this.currentQuestionIndex] !== undefined;
            const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
            
            nextBtn.disabled = !hasAnswer || isLastQuestion;
            nextBtn.style.display = isLastQuestion ? 'none' : 'inline-block';
        }
        
        if (finishBtn) {
            const hasAnswer = this.userAnswers[this.currentQuestionIndex] !== undefined;
            const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
            
            finishBtn.disabled = !hasAnswer || !isLastQuestion;
            finishBtn.style.display = isLastQuestion ? 'inline-block' : 'none';
        }
    }
    
    /**
     * Vai para questão anterior
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.showQuestion(this.currentQuestionIndex - 1);
        }
    }
    
    /**
     * Vai para próxima questão
     */
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.showQuestion(this.currentQuestionIndex + 1);
        }
    }
    
    /**
     * Finaliza unidade
     */
    finishUnit() {
        const result = window.gamificationManager.completeUnit(this.currentUnit);
        
        // Mostra resultado final
        this.showUnitResults(result);
        
        // Feedback do Stitch
        const contextualSpeech = window.stitchManager.getContextualSpeech('unit_complete', {
            unitId: this.currentUnit
        });
        window.stitchManager.showSpeech(contextualSpeech);
    }
    
    /**
     * Mostra resultados da unidade
     */
    showUnitResults(result) {
        const container = document.getElementById('questions-container');
        if (!container) return;
        
        const correctAnswers = this.userAnswers.filter((answer, index) => {
            const question = this.questions[index];
            return this.checkAnswer(question, answer);
        }).length;
        
        const accuracy = Math.round((correctAnswers / this.questions.length) * 100);
        
        container.innerHTML = `
            <div class="unit-results">
                <div class="results-header">
                    <h2>🎉 Unidade Concluída!</h2>
                </div>
                
                <div class="results-stats">
                    <div class="stat-item">
                        <span class="stat-label">Questões Corretas</span>
                        <span class="stat-value">${correctAnswers}/${this.questions.length}</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-label">Precisão</span>
                        <span class="stat-value">${accuracy}%</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-label">Pontos Ganhos</span>
                        <span class="stat-value">${result.totalPoints}</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-label">Estrelas</span>
                        <span class="stat-value">${'⭐'.repeat(result.stars)}${'☆'.repeat(3 - result.stars)}</span>
                    </div>
                    
                    ${result.medal ? `
                        <div class="stat-item medal-earned">
                            <span class="stat-label">Medalha Conquistada</span>
                            <span class="stat-value">${result.medal.name}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="results-actions">
                    <button class="btn-primary" onclick="window.alfaReviewApp.showPage('home')">
                        Voltar ao Início
                    </button>
                    <button class="btn-secondary" onclick="window.questionsManager.restartUnit()">
                        Refazer Unidade
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Reinicia unidade
     */
    restartUnit() {
        if (this.currentUnit) {
            this.startUnit(this.currentUnit);
        }
    }
    
    /**
     * Mostra mensagem quando não há questões
     */
    showNoQuestionsMessage() {
        const container = document.getElementById('questions-container');
        if (container) {
            container.innerHTML = `
                <div class="no-questions">
                    <h3>Em breve!</h3>
                    <p>As questões desta unidade estão sendo preparadas.</p>
                    <p>Por enquanto, você pode explorar o conteúdo de revisão!</p>
                    <button class="btn-primary" onclick="window.alfaReviewApp.showPage('home')">
                        Voltar ao Início
                    </button>
                </div>
            `;
        }
    }
    
    /**
     * Obtém estatísticas da sessão atual
     */
    getSessionStats() {
        if (!this.questions.length) return null;
        
        const correctAnswers = this.userAnswers.filter((answer, index) => {
            const question = this.questions[index];
            return this.checkAnswer(question, answer);
        }).length;
        
        return {
            unit: this.currentUnit,
            totalQuestions: this.questions.length,
            answeredQuestions: this.userAnswers.length,
            correctAnswers,
            accuracy: this.userAnswers.length > 0 ? 
                Math.round((correctAnswers / this.userAnswers.length) * 100) : 0,
            timeSpent: this.startTime ? Date.now() - this.startTime : 0
        };
    }
}

// Instância global do gerenciador de questões
window.questionsManager = new QuestionsManager();

