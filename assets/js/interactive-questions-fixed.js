/**
 * Sistema de Questões Interativas CORRIGIDO - AlfaReview Geografia
 * Implementa feedback correto/incorreto, gabarito e explicações do Stitch
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
        
        // Carregar TODAS as questões da unidade
        this.questions = await this.loadAllQuestionsForUnit(unitId);
        
        if (this.questions.length === 0) {
            this.showMessage('Questões não encontradas para esta unidade.');
            return;
        }
        
        console.log(`Carregadas ${this.questions.length} questões para a Unidade ${unitId}`);
        this.showQuestion();
    }
    
    /**
     * Carrega TODAS as questões de uma unidade
     */
    async loadAllQuestionsForUnit(unitId) {
        try {
            const response = await fetch(`data/questoes_unidade_${unitId}.txt`);
            const textData = await response.text();
            const questions = this.parseQuestionsFromText(textData);
            
            console.log(`Unidade ${unitId}: ${questions.length} questões carregadas`);
            return questions;
        } catch (error) {
            console.error(`Erro ao carregar questões da unidade ${unitId}:`, error);
            return [];
        }
    }
    
    /**
     * Converte questões do formato texto para JavaScript
     */
    parseQuestionsFromText(textData) {
        const lines = textData.split('\n');
        const questions = [];
        let currentQuestion = null;
        let questionNumber = 1;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detectar início de questão (número seguido de ponto)
            if (/^\d+\./.test(line)) {
                if (currentQuestion) {
                    questions.push(currentQuestion);
                }
                
                currentQuestion = {
                    id: questionNumber++,
                    question: line,
                    type: 'true_false',
                    options: [],
                    answer: '',
                    explanation: '',
                    points: 10
                };
            }
            // Detectar opções de múltipla escolha
            else if (/^[a-d]\)/.test(line) && currentQuestion) {
                if (currentQuestion.options.length === 0) {
                    currentQuestion.type = 'multiple_choice';
                    currentQuestion.points = 10;
                }
                currentQuestion.options.push(line);
            }
            // Detectar gabarito
            else if (line.startsWith('Gabarito:') && currentQuestion) {
                currentQuestion.answer = line.replace('Gabarito:', '').trim();
            }
            // Detectar múltiplas assertivas
            else if (line.includes('marque V para verdadeiro') && currentQuestion) {
                currentQuestion.type = 'multiple_assertions';
                currentQuestion.points = 15;
            }
        }
        
        if (currentQuestion) {
            questions.push(currentQuestion);
        }
        
        return questions;
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
     * Submete a resposta e mostra feedback IMEDIATO
     */
    submitAnswer() {
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.getUserAnswer();
        const isCorrect = this.checkAnswer(userAnswer, question.answer);
        
        // Calcular pontos
        const timeBonus = this.calculateTimeBonus();
        const points = isCorrect ? question.points + timeBonus : 0;
        
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
        
        // Mostrar feedback IMEDIATO com gabarito e explicação
        this.showImmediateFeedback(isCorrect, points, question, userAnswer);
    }
    
    /**
     * Mostra feedback IMEDIATO com gabarito e explicação
     */
    showImmediateFeedback(isCorrect, points, question, userAnswer) {
        // Frases específicas do Stitch
        const stitchFeedback = isCorrect 
            ? this.getCorrectStitchMessage()
            : this.getIncorrectStitchMessage();
        
        // Explicação educativa quando erra
        let explanation = '';
        if (!isCorrect) {
            explanation = this.getEducationalExplanation(question);
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
                
                <div class="answer-section">
                    <div class="user-answer">
                        <strong>Sua resposta:</strong> ${this.formatAnswer(userAnswer)}
                    </div>
                    <div class="correct-answer">
                        <strong>Gabarito:</strong> ${this.formatAnswer(question.answer)}
                    </div>
                </div>
                
                <div class="stitch-feedback">
                    <img src="assets/stitch/Unidade${this.currentUnit}.png" 
                         alt="Stitch" class="stitch-avatar">
                    <div class="stitch-speech">
                        <p><strong>"${stitchFeedback}"</strong></p>
                        ${explanation ? `<p class="explanation">${explanation}</p>` : ''}
                    </div>
                </div>
                
                <div class="feedback-actions">
                    <button class="btn btn-primary" onclick="questionsSystem.nextQuestion()">
                        ${this.currentQuestionIndex + 1 < this.questions.length ? 'Próxima Questão' : 'Ver Resultados'}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => modal.classList.add('show'), 100);
    }
    
    /**
     * Obtém mensagem do Stitch quando acerta
     */
    getCorrectStitchMessage() {
        const messages = [
            "Oba! Acertei junto com você!",
            "Tia Roberta vai ficar orgulhosa!",
            "Você tá virando um craque da Geografia!",
            "Isso aí! Mandou muito bem!",
            "Perfeito! Continue assim!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    /**
     * Obtém mensagem do Stitch quando erra
     */
    getIncorrectStitchMessage() {
        const messages = [
            "Ai ai ai… a Tia Roberta ia pedir pra revisar!",
            "Ops! Não foi dessa vez, mas vamos aprender juntos!",
            "Calma! Todo mundo erra às vezes. Vamos revisar?",
            "Quase lá! Vamos ver a explicação?",
            "Não desanima! Agora você vai lembrar para sempre!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    /**
     * Obtém explicação educativa específica
     */
    getEducationalExplanation(question) {
        const text = question.question.toLowerCase();
        
        // Explicações específicas por conceito
        if (text.includes('demografia') || text.includes('população')) {
            return "Lembra que a Tia Roberta explicou? Demografia é contar quem vive num lugar. Tipo a galera da turma 502 no Recreio!";
        }
        if (text.includes('densidade')) {
            return "Densidade demográfica é quantas pessoas vivem por quilômetro quadrado. É como contar quantos alunos cabem numa sala!";
        }
        if (text.includes('êxodo') || text.includes('exodo')) {
            return "Lembre-se: o êxodo rural é a saída das pessoas do campo para a cidade. Igual aconteceu no Recreio quando os sítios viraram prédios!";
        }
        if (text.includes('urbanização') || text.includes('urbanizacao')) {
            return "Urbanização é quando a cidade cresce! Igual quando começaram a construir um monte de prédios no bairro!";
        }
        if (text.includes('energia solar')) {
            return "Energia solar vem do sol e não acaba nunca! É limpa, do jeitinho que a Tia Roberta explicou!";
        }
        if (text.includes('território') || text.includes('territorio')) {
            return "Território é o espaço que pertence a um país, como o Brasil. É nossa casa grande!";
        }
        if (text.includes('trabalho')) {
            return "O trabalho transforma os lugares. Quando as pessoas trabalham, elas mudam o espaço ao redor!";
        }
        if (text.includes('transporte')) {
            return "Os transportes conectam as pessoas e os lugares. É como as veias do nosso corpo!";
        }
        if (text.includes('energia')) {
            return "A energia move tudo! Sem ela, não temos luz, não funciona a TV, nem o celular!";
        }
        
        return "Lembre-se de revisar o conteúdo da unidade para entender melhor esse conceito!";
    }
    
    /**
     * Formata resposta para exibição
     */
    formatAnswer(answer) {
        if (typeof answer === 'object') {
            return JSON.stringify(answer);
        }
        return answer;
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
        const medal = this.calculateMedal(percentage);
        const unitMedal = this.getUnitMedal(this.currentUnit);
        
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
                    <img src="assets/stitch/Unidade${this.currentUnit}.png" 
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
        
        // Verificar acessórios desbloqueados
        if (window.gamificationSystem) {
            window.gamificationSystem.updateGamificationDisplay();
        }
    }
    
    /**
     * Obtém medalha da unidade
     */
    getUnitMedal(unitId) {
        const medals = {
            1: { name: 'Detetive Demográfico', icon: '🕵️' },
            2: { name: 'Explorador Histórico', icon: '🧭' },
            3: { name: 'Trabalhador Curioso', icon: '⚒️' },
            4: { name: 'Urbanista Mirim', icon: '🌆' },
            5: { name: 'Viajante das Redes', icon: '🚀' },
            6: { name: 'Guardião da Amazônia', icon: '🌳' }
        };
        return medals[unitId] || medals[1];
    }
    
    /**
     * Calcula medalha baseada na porcentagem
     */
    calculateMedal(percentage) {
        if (percentage >= 90) {
            return { stars: 3, medal: 'gold', emoji: '🥇' };
        } else if (percentage >= 80) {
            return { stars: 3, medal: 'silver', emoji: '🥈' };
        } else if (percentage >= 50) {
            return { stars: 2, medal: 'bronze', emoji: '🥉' };
        } else {
            return { stars: 1, medal: null, emoji: '⭐' };
        }
    }
    
    /**
     * Obtém mensagem de parabéns
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
                    <img src="assets/mindmaps/mapa-unidade-${this.currentUnit}.png" 
                         alt="Mapa Mental Unidade ${this.currentUnit}" class="mindmap-image">
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        setTimeout(() => panel.classList.add('show'), 100);
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
            totalQuestions: this.questions.length,
            correctAnswers: this.correctAnswers,
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
        alert(message);
    }
}

// Inicializar sistema
const questionsSystem = new InteractiveQuestionsSystem();

// Exportar para uso global
window.questionsSystem = questionsSystem;

