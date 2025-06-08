// Sistema de Revisão Visual com Cores por Unidade
const UNIT_COLORS = {
    1: {
        primary: '#4A90E2',    // Azul - Demografia
        secondary: '#357ABD',
        accent: '#FFE066'
    },
    2: {
        primary: '#7ED321',    // Verde - Território
        secondary: '#6BB91A', 
        accent: '#FFF176'
    },
    3: {
        primary: '#F5A623',    // Laranja - Trabalho
        secondary: '#E8940F',
        accent: '#FFE082'
    },
    4: {
        primary: '#9013FE',    // Roxo - Urbano
        secondary: '#7B1FA2',
        accent: '#E1BEE7'
    },
    5: {
        primary: '#50E3C2',    // Ciano - Mobilidade
        secondary: '#26C6DA',
        accent: '#B2EBF2'
    },
    6: {
        primary: '#417505',    // Verde escuro - Energia
        secondary: '#2E5D04',
        accent: '#C8E6C9'
    }
};

const VISUAL_REVIEW_DATA = {
    1: [
        {
            conceito: "População absoluta",
            definicao: "É o número total de pessoas que vivem em um lugar.",
            cotidiano: "A Escola AlfaCem tem mais de 400 alunos nas turmas da manhã e da tarde. Esse número representa a população absoluta da escola.",
            icon: "👥"
        },
        {
            conceito: "Densidade demográfica", 
            definicao: "É a quantidade de pessoas por espaço ocupado.",
            cotidiano: "A turma 502 da tarde e a 501 da manhã têm o mesmo número de alunos. Mas a sala da 502 é menor, então parece mais cheia. Isso é densidade demográfica — mais pessoas em menos espaço.",
            icon: "📊"
        },
        {
            conceito: "País populoso e povoado",
            definicao: "Um país populoso tem muita gente. Um país povoado tem essa população bem distribuída no território.",
            cotidiano: "O Brasil tem muita gente (populoso), mas tem regiões vazias (pouco povoado). Na AlfaCem, mesmo com muitos alunos, como estão bem distribuídos, a escola funciona bem.",
            icon: "🏘️"
        },
        {
            conceito: "Distribuição populacional",
            definicao: "É a forma como as pessoas estão espalhadas em um território.",
            cotidiano: "Na Escola AlfaCem, muitos alunos moram perto do Recreio, onde há serviços e transporte. No Brasil, o litoral é mais populoso que o interior, pelo mesmo motivo.",
            icon: "🗺️"
        },
        {
            conceito: "Crescimento populacional",
            definicao: "É o aumento no número de habitantes de um lugar.",
            cotidiano: "Na turma da 502 da tarde, novos colegas chegaram este ano. Isso mostra como uma turma ou uma cidade pode crescer quando mais pessoas entram.",
            icon: "📈"
        },
        {
            conceito: "Migração",
            definicao: "É o movimento de pessoas de um lugar para outro. Pode ser de cidade, estado ou país.",
            cotidiano: "A Maite veio de Salvador e agora estuda no Recreio. Ela fez uma migração interna. A mamãe Laura veio da Colombia, ela fez uma migração internacional.",
            icon: "✈️"
        }
    ],
    2: [
        {
            conceito: "Território",
            definicao: "É uma área de terra com limites definidos, onde um país ou estado tem poder e controle.",
            cotidiano: "O Brasil é nosso território nacional. É como a Escola AlfaCem ter seu terreno com portões e limites definidos.",
            icon: "🗺️"
        },
        {
            conceito: "Fronteira",
            definicao: "É a linha que separa um país do outro, podendo ser natural (rios, montanhas) ou artificial (muros, cercas).",
            cotidiano: "O Rio de Janeiro faz fronteira com Minas Gerais. É como a cerca que separa a AlfaCem da escola vizinha.",
            icon: "🚧"
        },
        {
            conceito: "Colonização",
            definicao: "É quando um país mais forte domina e explora outro território e seu povo.",
            cotidiano: "Os portugueses colonizaram o Brasil há 500 anos. É como se alguém chegasse na AlfaCem e quisesse mandar em tudo.",
            icon: "⛵"
        },
        {
            conceito: "Tratado de Tordesilhas",
            definicao: "Foi um acordo entre Portugal e Espanha para dividir as terras da América do Sul.",
            cotidiano: "É como quando a turma 502 divide o pátio na hora do recreio - cada grupo fica com sua parte.",
            icon: "📜"
        }
    ],
    3: [
        {
            conceito: "Trabalho",
            definicao: "É toda atividade feita para resolver necessidades, com ou sem pagamento.",
            cotidiano: "A mãe da Maju trabalha como cabeleireira e recebe por isso. Já o avô do Matheus planta verduras no quintal para comer em casa.",
            icon: "⚒️"
        },
        {
            conceito: "Setor Primário",
            definicao: "Atividades que retiram recursos da natureza, como agricultura, pecuária e mineração.",
            cotidiano: "O pai do João trabalha numa fazenda cuidando do gado. Isso é setor primário porque trabalha direto com a natureza.",
            icon: "🌾"
        },
        {
            conceito: "Setor Secundário",
            definicao: "Atividades que transformam matérias-primas em produtos, como indústrias e fábricas.",
            cotidiano: "A fábrica de biscoitos perto da escola pega o trigo e transforma em biscoito. Isso é setor secundário.",
            icon: "🏭"
        },
        {
            conceito: "Setor Terciário",
            definicao: "Atividades de prestação de serviços, como comércio, educação e saúde.",
            cotidiano: "A professora Roberta, o médico do posto e o dono da padaria trabalham no setor terciário - prestam serviços.",
            icon: "🏪"
        }
    ],
    4: [
        {
            conceito: "Urbanização",
            definicao: "É o processo de crescimento das cidades e aumento da população urbana.",
            cotidiano: "O Recreio cresceu muito nos últimos anos. Onde antes tinha poucos prédios, hoje tem shopping, escolas e hospitais.",
            icon: "🏙️"
        },
        {
            conceito: "Êxodo Rural",
            definicao: "É quando pessoas saem do campo para morar na cidade em busca de melhores condições.",
            cotidiano: "O avô da Maju veio do interior para o Rio procurando trabalho e escola para os filhos. Isso é êxodo rural.",
            icon: "🚜➡️🏢"
        },
        {
            conceito: "Espaço Urbano",
            definicao: "São as áreas das cidades com prédios, ruas, comércio e muitas pessoas.",
            cotidiano: "O centro do Recreio é um espaço urbano: tem lojas, bancos, ônibus e muita gente circulando.",
            icon: "🌆"
        },
        {
            conceito: "Espaço Rural",
            definicao: "São áreas do campo com plantações, criação de animais e poucas pessoas.",
            cotidiano: "Quando a turma foi ao sítio do tio do Pedro, viram plantações e animais. Aquilo era espaço rural.",
            icon: "🌾"
        }
    ]
};

function createVisualReviewCard(item, unitId) {
    const colors = UNIT_COLORS[unitId];
    
    return `
        <div class="visual-review-card unit-${unitId}" style="border-left: 4px solid ${colors.primary};">
            <div class="concept-section" style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);">
                <div class="concept-header">
                    <span class="concept-icon">${item.icon || '🔷'}</span>
                    <h4>O que é?</h4>
                </div>
                <h3 class="concept-title" style="color: ${colors.accent};">${item.conceito}</h3>
                <p class="concept-definition">${item.definicao}</p>
            </div>
            <div class="cotidiano-section">
                <div class="cotidiano-header">
                    <span class="cotidiano-icon">🏫</span>
                    <h4>Na nossa vida</h4>
                </div>
                <p class="cotidiano-example">${item.cotidiano}</p>
            </div>
        </div>
    `;
}

function loadVisualReview(unitId) {
    const reviewData = VISUAL_REVIEW_DATA[unitId] || [];
    const colors = UNIT_COLORS[unitId];
    
    const reviewHtml = `
        <div class="visual-review-container unit-${unitId}">
            <h3 class="review-title" style="color: ${colors.primary};">
                📖 Revisão Visual - Unidade ${unitId}
            </h3>
            <div class="review-cards">
                ${reviewData.map(item => createVisualReviewCard(item, unitId)).join('')}
            </div>
        </div>
    `;
    
    return reviewHtml;
}


    5: [
        {
            conceito: "Mobilidade e conectividade global",
            definicao: "Hoje o mundo é muito conectado: podemos nos deslocar rapidamente e falar com qualquer pessoa pela internet em segundos.",
            cotidiano: "A Bianca mandou uma mensagem de voz para a Maite que viajou para Curitiba. Elas se falaram na hora, mesmo estando longe.",
            icon: "🌐"
        },
        {
            conceito: "Meios de transporte",
            definicao: "São veículos e sistemas que levam pessoas e cargas de um lugar para outro.",
            cotidiano: "Para chegar na AlfaCem, os alunos usam ônibus, carro, metrô ou vão andando. Cada um é um meio de transporte diferente.",
            icon: "🚌"
        },
        {
            conceito: "Transporte público",
            definicao: "São meios de transporte que servem toda a população, como ônibus, metrô e trem.",
            cotidiano: "Muitos alunos da AlfaCem vêm de ônibus ou metrô. Esses transportes são públicos porque qualquer pessoa pode usar.",
            icon: "🚇"
        },
        {
            conceito: "Transporte individual",
            definicao: "São veículos particulares, como carros e motos, que pertencem a uma pessoa ou família.",
            cotidiano: "O pai da Sofia traz ela de carro para a escola. Esse carro é só da família dela, por isso é transporte individual.",
            icon: "🚗"
        },
        {
            conceito: "Redes de comunicação",
            definicao: "São sistemas que permitem trocar informações à distância, como internet, telefone e rádio.",
            cotidiano: "Quando a escola manda recado pelo WhatsApp dos pais ou quando assistimos TV, estamos usando redes de comunicação.",
            icon: "📡"
        },
        {
            conceito: "Tecnologia e mobilidade",
            definicao: "A tecnologia facilita nossos deslocamentos e comunicação, tornando tudo mais rápido e eficiente.",
            cotidiano: "O GPS do celular ajuda os pais a encontrarem o caminho mais rápido para a AlfaCem, evitando trânsito.",
            icon: "📱"
        }
    ],

