// Todas as questões extraídas dos arquivos Word
const ALL_QUESTIONS_DATA = {
    unidade_1: [
        {
            question: "1. População absoluta é o número total de habitantes de uma área, como um país ou cidade.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "2. Densidade demográfica é a mesma coisa que população absoluta.",
            type: "true_false", 
            answer: "Falso"
        },
        {
            question: "3. Um país pode ser considerado populoso mesmo tendo baixa densidade demográfica.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "4. A densidade demográfica é calculada dividindo-se a população absoluta pela área territorial.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "5. Áreas próximas aos polos costumam ser muito povoadas por causa do clima favorável.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "6. A densidade demográfica mostra se um local é muito ou pouco ocupado por pessoas.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "7. Um local povoado é aquele que possui muitos habitantes por área, mesmo que a população absoluta seja pequena.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "8. Um local populoso é sempre muito povoado.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "9. As áreas mais próximas ao litoral brasileiro tendem a ser mais densamente povoadas que o interior.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "10. O Brasil é um país populoso e também muito povoado.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "11. Vazios demográficos são áreas com baixa densidade populacional.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "12. O censo demográfico é realizado a cada 10 anos no Brasil.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "13. O primeiro censo demográfico brasileiro foi realizado em 1872.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "14. O crescimento da população mundial foi maior a partir do século XX.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "15. O Brasil possui a sexta maior população do mundo, segundo o IBGE de 2023.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "16. A densidade demográfica do Brasil em 2022 era de aproximadamente 23,86 hab/km².",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "17. O crescimento da população brasileira foi mais acelerado após 1950 devido ao crescimento das cidades e avanços industriais.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "18. A taxa de natalidade indica o número de nascimentos em um determinado período.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "19. A taxa de mortalidade indica o número de óbitos em um determinado período.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "20. O crescimento vegetativo é calculado subtraindo a taxa de mortalidade da taxa de natalidade.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "21. O crescimento natural considera apenas nascimentos e mortes.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "22. O que é população absoluta?",
            type: "multiple_choice",
            options: [
                "a) O número de habitantes por quilômetro quadrado",
                "b) O número total de habitantes de uma área",
                "c) O número de cidades de um país",
                "d) O número de habitantes acima de 50 milhões"
            ],
            answer: "b"
        },
        {
            question: "23. Como se calcula a densidade demográfica?",
            type: "multiple_choice",
            options: [
                "a) População absoluta × área territorial",
                "b) População absoluta ÷ área territorial",
                "c) Área territorial ÷ população absoluta",
                "d) População absoluta + área territorial"
            ],
            answer: "b"
        },
        {
            question: "24. Qual é a diferença entre populoso e povoado?",
            type: "multiple_choice",
            options: [
                "a) Populoso se refere à população total, povoado à densidade",
                "b) Populoso se refere à densidade, povoado à população total",
                "c) São sinônimos",
                "d) Populoso é para cidades, povoado para países"
            ],
            answer: "a"
        },
        {
            question: "25. O que são vazios demográficos?",
            type: "multiple_choice",
            options: [
                "a) Áreas com alta densidade populacional",
                "b) Áreas com baixa densidade populacional",
                "c) Áreas sem população",
                "d) Áreas urbanas"
            ],
            answer: "b"
        }
        // Continuarei adicionando mais questões...
    ],
    unidade_2: [
        {
            question: "1. O Tratado de Tordesilhas dividiu as terras americanas entre Portugal e Espanha.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "2. A colonização portuguesa no Brasil começou imediatamente após o descobrimento.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "3. As bandeiras foram expedições que ajudaram a expandir o território brasileiro.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "4. O ouro encontrado em Minas Gerais atraiu muitos colonos para o interior.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "5. As fronteiras atuais do Brasil foram definidas apenas pelo Tratado de Tordesilhas.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "6. A pecuária foi importante para a ocupação do interior brasileiro.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "7. O que foi o Tratado de Tordesilhas?",
            type: "multiple_choice",
            options: [
                "a) Um acordo de paz entre índios e portugueses",
                "b) Um tratado que dividiu as terras americanas entre Portugal e Espanha",
                "c) Um acordo comercial",
                "d) Um tratado de independência"
            ],
            answer: "b"
        },
        {
            question: "8. O que eram as bandeiras?",
            type: "multiple_choice",
            options: [
                "a) Símbolos nacionais",
                "b) Expedições para capturar índios e buscar ouro",
                "c) Fortalezas militares",
                "d) Plantações de cana-de-açúcar"
            ],
            answer: "b"
        }
        // Mais questões da Unidade 2...
    ],
    unidade_3: [
        {
            question: "1. O setor primário inclui atividades como agricultura e mineração.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "2. As indústrias fazem parte do setor terciário da economia.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "3. O setor terciário é o que mais emprega pessoas no Brasil atualmente.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "4. A tecnologia não influencia nas transformações do espaço geográfico.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "5. A agricultura familiar é importante para a produção de alimentos no Brasil.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "6. O agronegócio utiliza apenas técnicas tradicionais de cultivo.",
            type: "true_false",
            answer: "Falso"
        }
        // Mais questões da Unidade 3...
    ],
    unidade_4: [
        {
            question: "1. Urbanização é o processo de crescimento das cidades.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "2. A migração rural-urbana contribuiu para o crescimento das cidades brasileiras.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "3. Todas as cidades brasileiras têm a mesma infraestrutura.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "4. As metrópoles são cidades pequenas com poucos habitantes.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "5. O planejamento urbano é importante para organizar o crescimento das cidades.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "6. Os problemas urbanos afetam apenas as cidades grandes.",
            type: "true_false",
            answer: "Falso"
        }
        // Mais questões da Unidade 4...
    ],
    unidade_5: [
        {
            question: "1. Mobilidade é a facilidade de se mover de um lugar para outro.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "2. O transporte público é mais sustentável que o transporte individual.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "3. As redes de comunicação conectam pessoas e lugares.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "4. A internet não faz parte das redes de comunicação.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "5. O transporte ferroviário é importante para o transporte de cargas no Brasil.",
            type: "true_false",
            answer: "Verdadeiro"
        }
        // Mais questões da Unidade 5...
    ],
    unidade_6: [
        {
            question: "1. Fontes renováveis de energia são aquelas que podem se renovar naturalmente.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "2. O petróleo é uma fonte de energia renovável.",
            type: "true_false",
            answer: "Falso"
        },
        {
            question: "3. A energia solar vem do sol e é considerada limpa.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "4. O Brasil possui uma das maiores hidrelétricas do mundo.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "5. A energia eólica é gerada pelo vento.",
            type: "true_false",
            answer: "Verdadeiro"
        },
        {
            question: "6. O carvão mineral é uma fonte de energia limpa.",
            type: "true_false",
            answer: "Falso"
        }
        // Mais questões da Unidade 6...
    ]
};

// Função para obter questões de uma unidade
function getQuestionsForUnit(unitId) {
    return ALL_QUESTIONS_DATA[`unidade_${unitId}`] || [];
}

// Função para obter uma questão aleatória de uma unidade
function getRandomQuestion(unitId) {
    const questions = getQuestionsForUnit(unitId);
    if (questions.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

// Função para obter múltiplas questões de uma unidade
function getMultipleQuestions(unitId, count = 10) {
    const questions = getQuestionsForUnit(unitId);
    if (questions.length === 0) return [];
    
    // Embaralhar questões e pegar as primeiras 'count'
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
}

