/**
 * Sistema do Mascote Stitch - AlfaReview Geografia
 * Gerencia interações, falas e comportamentos do Stitch
 */

class StitchManager {
    constructor() {
        this.currentUnit = 1;
        this.stitchElement = null;
        this.speechElement = null;
        this.isAnimating = false;
        
        // Falas por contexto
        this.speeches = {
            welcome: [
                "Oi! Eu sou o Stitch. Vamos estudar Geografia de um jeito divertido?",
                "Olá! Que bom te ver aqui! Preparado para uma aventura geográfica?",
                "Aloha! Sou o Stitch e vou te ajudar a descobrir os segredos da Geografia!"
            ],
            
            encouragement: [
                "Oba! Acertei junto com você!",
                "Você tá virando um craque da Geografia!",
                "Tia Roberta vai ficar orgulhosa!",
                "Isso aí! Continue assim!",
                "Perfeito! Você entendeu direitinho!"
            ],
            
            correction: [
                "Ai ai ai… a Tia Roberta ia pedir pra revisar!",
                "Ops! Vamos tentar de novo?",
                "Não foi dessa vez, mas você vai conseguir!",
                "Calma! Todo mundo erra às vezes. O importante é aprender!",
                "Que tal dar uma olhadinha no conteúdo de revisão?"
            ],
            
            unitExplanations: {
                1: [
                    "Demografia é contar quem vive num lugar. Tipo a galera da turma 502 no Recreio!",
                    "Sabe quando a professora conta quantos alunos tem na sala? Isso é demografia!",
                    "Demografia estuda as pessoas: quantas são, onde moram, como vivem!"
                ],
                2: [
                    "O Brasil foi se formando aos pouquinhos, como um quebra-cabeça gigante!",
                    "Nosso território tem uma história incrível de como foi crescendo!",
                    "Imagina o Brasil como uma casa que foi sendo construída ao longo dos anos!"
                ],
                3: [
                    "O trabalho das pessoas muda os lugares! Como quando constroem uma escola nova!",
                    "Cada profissão transforma o espaço de um jeito diferente!",
                    "O trabalho é como uma varinha mágica que muda as cidades!"
                ],
                4: [
                    "Urbanização é quando a cidade cresce! Igual quando começaram a construir um monte de prédios no bairro!",
                    "As cidades são como formigueiros que crescem cada vez mais!",
                    "Urbanização é quando mais gente vai morar na cidade!"
                ],
                5: [
                    "Transporte é como as pessoas e coisas viajam de um lugar pro outro!",
                    "Comunicação é como a gente conversa mesmo estando longe!",
                    "Redes de transporte são como as veias do corpo humano, levando tudo pra onde precisa!"
                ],
                6: [
                    "Energia solar vem do sol e não acaba nunca! É limpa, do jeitinho que a Tia Roberta explicou!",
                    "O Brasil tem muitos tipos de energia: do sol, do vento, da água!",
                    "Energia renovável é aquela que a natureza renova sozinha!"
                ]
            },
            
            achievements: [
                "Parabéns! Você desbloqueou um boné de campo para o Stitch!",
                "Incrível! Agora o Stitch ganhou óculos espaciais!",
                "Que demais! O Stitch ganhou uma mochila de explorador!",
                "Fantástico! Você desbloqueou um chapéu de aventureiro!"
            ],
            
            medals: {
                bronze: [
                    "Boa! Você ganhou uma medalha de bronze!",
                    "Parabéns pela medalha de bronze! Continue assim!",
                    "Bronze conquistado! Você está no caminho certo!"
                ],
                silver: [
                    "Uau! Medalha de prata! Você está indo muito bem!",
                    "Prata! Que orgulho! Continue estudando!",
                    "Medalha de prata conquistada! Você é demais!"
                ],
                gold: [
                    "INCRÍVEL! Medalha de ouro! Você é um verdadeiro geógrafo!",
                    "OURO! Que conquista fantástica!",
                    "Medalha de ouro! A Tia Roberta ficaria super orgulhosa!"
                ]
            }
        };
        
        // Configurações de animação
        this.animationDuration = 2000;
        this.speechDuration = 4000;
        
        this.init();
    }
    
    /**
     * Inicializa o sistema do Stitch
     */
    init() {
        this.bindEvents();
        this.updateStitchForUnit(1);
    }
    
    /**
     * Vincula eventos de clique no Stitch
     */
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('clickable') && 
                (e.target.id === 'main-stitch' || e.target.id === 'unit-stitch')) {
                this.handleStitchClick(e.target);
            }
        });
    }
    
    /**
     * Manipula clique no Stitch
     */
    handleStitchClick(element) {
        if (this.isAnimating) return;
        
        this.stitchElement = element;
        this.speechElement = element.parentElement.querySelector('.speech-bubble');
        
        // Determina contexto baseado na página atual
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            if (currentPage.id === 'home-page') {
                this.showRandomSpeech('welcome');
            } else if (currentPage.id === 'unit-page') {
                this.explainCurrentUnit();
            }
        }
        
        this.animateStitch();
    }
    
    /**
     * Mostra fala aleatória de uma categoria
     */
    showRandomSpeech(category) {
        const speeches = this.speeches[category];
        if (speeches && speeches.length > 0) {
            const randomSpeech = speeches[Math.floor(Math.random() * speeches.length)];
            this.showSpeech(randomSpeech);
        }
    }
    
    /**
     * Explica a unidade atual
     */
    explainCurrentUnit() {
        const explanations = this.speeches.unitExplanations[this.currentUnit];
        if (explanations && explanations.length > 0) {
            const randomExplanation = explanations[Math.floor(Math.random() * explanations.length)];
            this.showSpeech(randomExplanation);
        }
    }
    
    /**
     * Exibe fala do Stitch
     */
    showSpeech(text) {
        if (!this.speechElement) return;
        
        const textElement = this.speechElement.querySelector('p');
        if (textElement) {
            // Efeito de digitação
            textElement.textContent = '';
            this.speechElement.classList.add('fade-in');
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    textElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            typeWriter();
        }
    }
    
    /**
     * Anima o Stitch
     */
    animateStitch() {
        if (!this.stitchElement || this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Adiciona animação de bounce
        this.stitchElement.classList.add('bounce');
        
        // Remove animação após duração
        setTimeout(() => {
            this.stitchElement.classList.remove('bounce');
            this.isAnimating = false;
        }, this.animationDuration);
    }
    
    /**
     * Atualiza Stitch para unidade específica
     */
    updateStitchForUnit(unitId) {
        this.currentUnit = unitId;
        
        // Atualiza imagem do Stitch
        const stitchImages = document.querySelectorAll('#main-stitch, #unit-stitch');
        stitchImages.forEach(img => {
            img.src = `assets/stitch/Unidade${unitId}.png`;
            img.alt = `Stitch Unidade ${unitId}`;
        });
        
        // Atualiza fala inicial da unidade
        const unitSpeechElement = document.querySelector('#unit-stitch-speech p');
        if (unitSpeechElement) {
            const explanations = this.speeches.unitExplanations[unitId];
            if (explanations && explanations.length > 0) {
                unitSpeechElement.textContent = explanations[0];
            }
        }
    }
    
    /**
     * Mostra feedback para resposta correta
     */
    showCorrectFeedback() {
        this.showRandomSpeech('encouragement');
        this.animateStitch();
        
        // Adiciona efeito visual de sucesso
        if (this.stitchElement) {
            this.stitchElement.classList.add('glow');
            setTimeout(() => {
                this.stitchElement.classList.remove('glow');
            }, 2000);
        }
    }
    
    /**
     * Mostra feedback para resposta incorreta
     */
    showIncorrectFeedback(explanation = '') {
        let speech = '';
        
        if (explanation) {
            speech = `Lembre-se: ${explanation}`;
        } else {
            const corrections = this.speeches.correction;
            speech = corrections[Math.floor(Math.random() * corrections.length)];
        }
        
        this.showSpeech(speech);
        
        // Adiciona animação de shake
        if (this.stitchElement) {
            this.stitchElement.classList.add('shake');
            setTimeout(() => {
                this.stitchElement.classList.remove('shake');
            }, 500);
        }
    }
    
    /**
     * Mostra feedback de medalha conquistada
     */
    showMedalFeedback(medalType, unitName) {
        let speech = '';
        
        const medalSpeeches = this.speeches.medals[medalType];
        if (medalSpeeches) {
            speech = medalSpeeches[Math.floor(Math.random() * medalSpeeches.length)];
        }
        
        this.showSpeech(speech);
        this.animateStitch();
        
        // Efeito especial para medalha de ouro
        if (medalType === 'gold' && this.stitchElement) {
            this.stitchElement.classList.add('star-twinkle');
            setTimeout(() => {
                this.stitchElement.classList.remove('star-twinkle');
            }, 3000);
        }
    }
    
    /**
     * Mostra feedback de acessório desbloqueado
     */
    showAccessoryFeedback(accessoryName) {
        const achievements = this.speeches.achievements;
        let speech = achievements[Math.floor(Math.random() * achievements.length)];
        
        // Personaliza a fala com o nome do acessório
        speech = speech.replace('boné de campo', accessoryName)
                      .replace('óculos espaciais', accessoryName)
                      .replace('mochila de explorador', accessoryName)
                      .replace('chapéu de aventureiro', accessoryName);
        
        this.showSpeech(speech);
        this.animateStitch();
    }
    
    /**
     * Mostra fala de boas-vindas personalizada
     */
    showWelcomeMessage(studentName) {
        const welcomeMessages = [
            `Oi ${studentName}! Que bom te ver aqui! Vamos estudar Geografia juntos?`,
            `Olá ${studentName}! Sou o Stitch e vou te ajudar a descobrir os segredos da Geografia!`,
            `Aloha ${studentName}! Preparado para uma aventura geográfica incrível?`
        ];
        
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        this.showSpeech(randomMessage);
    }
    
    /**
     * Mostra fala de incentivo durante questões
     */
    showEncouragementDuringQuestions() {
        const encouragements = [
            "Você consegue! Pense com calma!",
            "Lembre-se do que a Tia Roberta ensinou!",
            "Que tal dar uma olhadinha no mapa mental?",
            "Não desista! Você está indo muito bem!"
        ];
        
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.showSpeech(randomEncouragement);
    }
    
    /**
     * Aplica customização visual ao Stitch
     */
    applyCustomization(customization) {
        // Esta função seria expandida para aplicar acessórios visuais
        // Por enquanto, apenas registra a customização
        console.log('Aplicando customização ao Stitch:', customization);
        
        // Futura implementação: sobrepor imagens de acessórios
        // ou usar CSS para adicionar elementos visuais
    }
    
    /**
     * Reseta estado do Stitch
     */
    reset() {
        this.currentUnit = 1;
        this.isAnimating = false;
        
        // Remove todas as classes de animação
        const stitchElements = document.querySelectorAll('#main-stitch, #unit-stitch');
        stitchElements.forEach(element => {
            element.className = element.className.replace(/\b(bounce|shake|glow|star-twinkle)\b/g, '').trim();
            element.classList.add('clickable');
        });
        
        this.updateStitchForUnit(1);
    }
    
    /**
     * Obtém fala contextual baseada no progresso
     */
    getContextualSpeech(context, data = {}) {
        switch (context) {
            case 'unit_start':
                return `Vamos começar a Unidade ${data.unitId}! Você vai adorar!`;
            
            case 'unit_complete':
                return `Parabéns! Você completou a Unidade ${data.unitId}! Que orgulho!`;
            
            case 'progress_milestone':
                if (data.totalPoints >= 100) {
                    return "Uau! Você já tem mais de 100 pontos! Incrível!";
                } else if (data.totalPoints >= 50) {
                    return "Que legal! Você já tem 50 pontos! Continue assim!";
                }
                return "Você está indo muito bem! Continue estudando!";
            
            case 'first_medal':
                return "Sua primeira medalha! Que conquista especial!";
            
            case 'all_units_complete':
                return "INCRÍVEL! Você completou todas as unidades! Você é um verdadeiro geógrafo!";
            
            default:
                return this.speeches.welcome[0];
        }
    }
}

// Instância global do gerenciador do Stitch
window.stitchManager = new StitchManager();

