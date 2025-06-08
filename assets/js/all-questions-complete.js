/**
 * Sistema Completo de Questões - AlfaReview Geografia
 * Todas as 303 questões extraídas dos arquivos Word
 */

// Função para converter questões do formato texto para JavaScript
function parseQuestionsFromText(textData) {
    const lines = textData.split('\n');
    const questions = [];
    let currentQuestion = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detectar início de questão (número seguido de ponto)
        if (/^\d+\./.test(line)) {
            if (currentQuestion) {
                questions.push(currentQuestion);
            }
            
            currentQuestion = {
                id: questions.length + 1,
                question: line,
                type: 'true_false',
                options: [],
                answer: '',
                explanation: ''
            };
        }
        // Detectar opções de múltipla escolha
        else if (/^[a-d]\)/.test(line) && currentQuestion) {
            if (currentQuestion.options.length === 0) {
                currentQuestion.type = 'multiple_choice';
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
        }
    }
    
    if (currentQuestion) {
        questions.push(currentQuestion);
    }
    
    return questions;
}

// Banco completo de questões por unidade
const COMPLETE_QUESTIONS_DATABASE = {
    1: [], // Será preenchido dinamicamente
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
};

// Função para carregar questões de uma unidade específica
async function loadQuestionsForUnit(unitId) {
    try {
        const response = await fetch(`/alfareview-geografia/data/questoes_unidade_${unitId}.txt`);
        const textData = await response.text();
        const questions = parseQuestionsFromText(textData);
        COMPLETE_QUESTIONS_DATABASE[unitId] = questions;
        return questions;
    } catch (error) {
        console.error(`Erro ao carregar questões da unidade ${unitId}:`, error);
        return [];
    }
}

// Função para obter questões de uma unidade
function getQuestionsForUnit(unitId, count = null) {
    const questions = COMPLETE_QUESTIONS_DATABASE[unitId] || [];
    
    if (count === null) {
        return questions; // Retorna todas
    }
    
    // Embaralhar e retornar quantidade específica
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
}

// Função para obter estatísticas das questões
function getQuestionsStats() {
    const stats = {};
    let total = 0;
    
    for (let unitId = 1; unitId <= 6; unitId++) {
        const count = COMPLETE_QUESTIONS_DATABASE[unitId]?.length || 0;
        stats[`unidade_${unitId}`] = count;
        total += count;
    }
    
    stats.total = total;
    return stats;
}

// Sistema de pontuação por tipo de questão
const QUESTION_POINTS = {
    'multiple_choice': 10,
    'true_false': 10,
    'multiple_assertions': 15,
    'fact_consequence': 15,
    'mini_game': 20
};

// Sistema de medalhas por unidade
const UNIT_MEDALS = {
    1: { name: 'Detetive Demográfico', icon: '🥇' },
    2: { name: 'Explorador Histórico', icon: '🧭' },
    3: { name: 'Trabalhador Curioso', icon: '⚒️' },
    4: { name: 'Urbanista Mirim', icon: '🌆' },
    5: { name: 'Viajante das Redes', icon: '🚀' },
    6: { name: 'Guardião da Amazônia', icon: '🌳' }
};

// Função para calcular medalha baseada na porcentagem de acertos
function calculateMedal(percentage) {
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

// Frases do Stitch para feedback
const STITCH_FEEDBACK = {
    correct: [
        "Oba! Acertei junto com você!",
        "Isso aí! Mandou bem!",
        "Tia Roberta vai ficar orgulhosa!",
        "Você tá virando um craque da Geografia!"
    ],
    incorrect: [
        "Ai ai ai… a Tia Roberta ia pedir pra revisar!",
        "Ops! Vamos tentar de novo?",
        "Quase lá! Vamos revisar esse conceito?",
        "Não desista! Todo mundo erra às vezes!"
    ]
};

// Explicações educativas por conceito (para quando errar)
const EDUCATIONAL_EXPLANATIONS = {
    demografia: "Demografia é contar quem vive num lugar. Tipo a galera da turma 502 no Recreio!",
    densidade_demografica: "Densidade demográfica é quantas pessoas vivem por quilômetro quadrado. É como contar quantos alunos cabem numa sala!",
    exodo_rural: "Lembra que a Tia Roberta explicou? O êxodo rural é quando as pessoas saem do campo e vão morar na cidade. Igual aconteceu no Recreio quando os sítios viraram prédios!",
    urbanizacao: "Urbanização é quando a cidade cresce! Igual quando começaram a construir um monte de prédios no bairro!",
    energia_solar: "Energia solar vem do sol e não acaba nunca! É limpa, do jeitinho que a Tia Roberta explicou!",
    territorio: "Território é o espaço que pertence a um país, como o Brasil. É nossa casa grande!",
    trabalho: "O trabalho transforma os lugares. Quando as pessoas trabalham, elas mudam o espaço ao redor!",
    transporte: "Os transportes conectam as pessoas e os lugares. É como as veias do nosso corpo!",
    energia: "A energia move tudo! Sem ela, não temos luz, não funciona a TV, nem o celular!"
};

// Inicializar carregamento das questões
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Carregando questões completas...');
    
    // Carregar questões de todas as unidades
    for (let unitId = 1; unitId <= 6; unitId++) {
        await loadQuestionsForUnit(unitId);
    }
    
    const stats = getQuestionsStats();
    console.log('Questões carregadas:', stats);
});

// Exportar para uso global
window.COMPLETE_QUESTIONS_DATABASE = COMPLETE_QUESTIONS_DATABASE;
window.getQuestionsForUnit = getQuestionsForUnit;
window.QUESTION_POINTS = QUESTION_POINTS;
window.UNIT_MEDALS = UNIT_MEDALS;
window.calculateMedal = calculateMedal;
window.STITCH_FEEDBACK = STITCH_FEEDBACK;
window.EDUCATIONAL_EXPLANATIONS = EDUCATIONAL_EXPLANATIONS;

