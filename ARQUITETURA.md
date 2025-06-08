# AlfaReview Geografia - Arquitetura da Plataforma

## Visão Geral
Plataforma educacional gamificada para alunos do 5º ano do Ensino Fundamental, focada no ensino de Geografia através de questões interativas, mapas mentais e mascote Stitch.

## Requisitos Técnicos
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Compatibilidade**: GitHub Pages (100% offline)
- **Responsividade**: Desktop, tablet e mobile
- **Armazenamento**: localStorage para progresso do aluno
- **Formato de dados**: JSON para exportar/importar progresso

## Estrutura de Pastas
```
alfareview-geografia/
├── index.html                 # Página principal
├── assets/
│   ├── css/
│   │   ├── main.css          # Estilos principais
│   │   ├── responsive.css    # Media queries
│   │   └── animations.css    # Animações e transições
│   ├── js/
│   │   ├── app.js           # Aplicação principal
│   │   ├── gamification.js  # Sistema de gamificação
│   │   ├── questions.js     # Sistema de questões
│   │   ├── storage.js       # localStorage e dados
│   │   └── stitch.js        # Mascote interativo
│   ├── stitch/
│   │   ├── Unidade1.png     # Demografia
│   │   ├── Unidade2.png     # Formação do Território
│   │   ├── Unidade3.png     # Trabalho e Transformações
│   │   ├── Unidade4.png     # Espaço Urbano
│   │   ├── Unidade5.png     # Mobilidade e Redes
│   │   └── Unidade6.png     # Matriz Energética
│   └── mindmaps/
│       ├── *.pdf            # Mapas mentais originais
│       └── *.png            # Mapas convertidos
├── content/
│   ├── questoes/
│   │   └── *.docx           # Questões por unidade
│   └── revisao/
│       └── *.docx           # Conteúdo de revisão
└── data/
    ├── units.json           # Dados das unidades
    ├── questions.json       # Questões processadas
    └── content.json         # Conteúdo de revisão
```

## Funcionalidades Principais

### 1. Sistema de Identificação
- Tela inicial para inserir nome do aluno
- Persistência via localStorage
- Personalização das mensagens

### 2. Navegação
- Barra lateral fixa com 6 unidades
- Página inicial com cartões clicáveis
- Botão "Início" sempre visível

### 3. Mascote Stitch Interativo
- Imagem temática por unidade
- Falas contextualizadas e educativas
- Feedback em português brasileiro
- Explicações ao clicar no mascote

### 4. Sistema de Questões
- Múltipla escolha (+10 pontos)
- Verdadeiro/Falso (+10 pontos)
- Múltiplas assertivas (+15 pontos)
- Fato e consequência (+15 pontos)
- Feedback explicativo em caso de erro

### 5. Gamificação
- Sistema de pontuação
- Medalhas temáticas por unidade
- Estrelas baseadas em percentual de acertos
- Customização de acessórios do Stitch
- Desafios coletivos por turma

### 6. Conteúdo de Revisão
- Botão "Revisar Conteúdo" durante questões
- Painel lateral com mapa mental
- Texto de revisão baseado nos arquivos DOCX

### 7. Armazenamento Offline
- Progresso salvo em localStorage
- Exportar/importar dados em JSON
- Funcionalidade 100% offline

## Dados das Unidades

### Unidade 1 - Demografia
- **Medalha**: 🥇 Detetive Demográfico
- **Stitch**: Com lupa e mapa (investigação populacional)
- **Conceito**: "Demografia é contar quem vive num lugar. Tipo a galera da turma 502 no Recreio!"

### Unidade 2 - Formação do Território Brasileiro
- **Medalha**: 🧭 Explorador Histórico
- **Stitch**: Com bandeira do Brasil e mapa
- **Conceito**: Formação histórica e geográfica do território

### Unidade 3 - O Trabalho e as Transformações Espaciais
- **Medalha**: ⚒️ Trabalhador Curioso
- **Stitch**: Com capacete de obra e ferramentas
- **Conceito**: Como o trabalho transforma os espaços

### Unidade 4 - Espaço Urbano: Urbanização e Crescimento das Cidades
- **Medalha**: 🌆 Urbanista Mirim
- **Stitch**: Observando a cidade
- **Conceito**: "Urbanização é quando a cidade cresce! Igual quando começaram a construir um monte de prédios no bairro!"

### Unidade 5 - Mobilidade e Redes de Transporte e Comunicação
- **Medalha**: 🚀 Viajante das Redes
- **Stitch**: Dirigindo veículo de transporte
- **Conceito**: Sistemas de transporte e comunicação

### Unidade 6 - Matriz Energética Brasileira
- **Medalha**: 🌳 Guardião da Amazônia
- **Stitch**: Com painel solar e raio
- **Conceito**: "Energia solar vem do sol e não acaba nunca! É limpa, do jeitinho que a Tia Roberta explicou!"

## Sistema de Medalhas e Estrelas

### Critérios de Avaliação
- **< 50%**: ⭐ (sem medalha)
- **50-79%**: ⭐⭐ + 🥉 Bronze
- **80-89%**: ⭐⭐⭐ + 🥈 Prata
- **90% ou +**: ⭐⭐⭐ + 🥇 Ouro

### Acessórios Desbloqueáveis
- Chapéu de explorador
- Óculos espaciais
- Mochila de campo
- Boné de campo

## Fluxo de Uso
1. Aluno insere nome na tela inicial
2. Escolhe uma unidade na página principal
3. Responde questões com feedback do Stitch
4. Pode revisar conteúdo a qualquer momento
5. Recebe pontuação e medalhas
6. Progresso é salvo automaticamente

## Considerações de UX
- Interface colorida e amigável para crianças
- Botões grandes para facilitar toque
- Feedback visual imediato
- Linguagem simples e carinhosa
- Comparações com o cotidiano dos alunos

