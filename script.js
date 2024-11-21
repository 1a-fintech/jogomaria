// script.js

// Variáveis Globais
let rodadaAtual = 1;
const totalRodadas = 4;
let populacao = 50;
let economia = 50;
let reputacaoInternacional = 50;
let reputacaoMidia = 50;
let vontadeGeral = 50;
let score = 0;
let perguntasUsadas = {
    "Cidadão Pobre": [],
    "Cidadão Rico": [],
    "Mídia": [],
    "Economista": []
};
const personagens = ["Presidente", "Cidadão Pobre", "Cidadão Rico", "Mídia", "Economista"];
let jogadores = [];
let presidentIndex = null;
let selectedQuestions = [];
let difficulty = 'medium';
let eventIntervalId = null;
let currentQuestionPlayerIndex = 0;

// Seletores de Elementos
const playerSelection = document.querySelector('.player-selection');
const startGameButton = document.getElementById('startGameButton');
const tutorialButton = document.getElementById('tutorialButton');
const roleAssignment = document.querySelector('.role-assignment');
const rolesDisplay = document.getElementById('rolesDisplay');
const proceedToGameButton = document.getElementById('proceedToGameButton');
const gameArea = document.querySelector('.game-area');
const endGameArea = document.querySelector('.end-game');
const endMessage = document.getElementById('endMessage');
const restartButton = document.getElementById('restartButton');
const currentRoundSpan = document.getElementById('currentRound');
const currentPlayerSpan = document.getElementById('currentPlayer');
const questionList = document.getElementById('questionList');
const decisionSection = document.getElementById('decisionSection');
const decisionsContainer = document.getElementById('decisionsContainer');

const populacaoBar = document.getElementById('populacao');
const economiaBar = document.getElementById('economia');
const reputacaoInternacionalBar = document.getElementById('reputacaoInternacional');
const reputacaoMidiaBar = document.getElementById('reputacaoMidia');
const vontadeGeralBar = document.getElementById('vontadeGeral');

const populacaoValue = document.getElementById('populacaoValue');
const economiaValue = document.getElementById('economiaValue');
const reputacaoInternacionalValue = document.getElementById('reputacaoInternacionalValue');
const reputacaoMidiaValue = document.getElementById('reputacaoMidiaValue');
const vontadeGeralValue = document.getElementById('vontadeGeralValue');

const feedbackSection = document.getElementById('feedback');
const feedbackMessage = document.getElementById('feedbackMessage');
const popChange = document.getElementById('popChange');
const econChange = document.getElementById('econChange');
const repInternacionalChange = document.getElementById('repInternacionalChange');
const repMidiaChange = document.getElementById('repMidiaChange');
const repLocalChange = document.getElementById('repLocalChange'); // Renomeado para vontadeGeralChange

const scoreDisplay = document.getElementById('score');

const historyList = document.getElementById('historyList');
const eventHistoryList = document.getElementById('eventHistoryList');

const eventModal = document.getElementById('eventModal');
const closeEventModalButton = document.getElementById('closeEventModal');
const eventDescription = document.getElementById('eventDescription');
const eventAcceptButton = document.getElementById('eventAcceptButton');
const eventTitle = document.getElementById('eventTitle');

const evolutionChartCanvas = document.getElementById('evolutionChart');
let evolutionChart = null;

// Modais
const difficultyInfoButton = document.getElementById('difficultyInfoButton');
const difficultyModal = document.getElementById('difficultyModal');
const closeDifficultyModalButton = document.getElementById('closeDifficultyModal');

const tutorialModal = document.getElementById('tutorialModal');
const closeTutorialModalButton = document.getElementById('closeTutorialModal');

const roleDescriptionModal = document.getElementById('roleDescriptionModal');
const closeRoleDescriptionModalButton = document.getElementById('closeRoleDescriptionModal');
const roleDescriptionContent = document.getElementById('roleDescriptionContent');
const roleDescriptionTitle = document.getElementById('roleDescriptionTitle');

// Funções Auxiliares

// Atribuição de Funções
function atribuirFuncoes(nomes) {
    const shuffled = nomes.sort(() => 0.5 - Math.random());
    const atribuicoes = [];
    for (let i = 0; i < shuffled.length; i++) {
        atribuicoes.push({ nome: shuffled[i], personagem: personagens[i] });
    }
    // Reordenar para que o presidente seja o primeiro
    atribuicoes.sort((a, b) => {
        if (a.personagem === "Presidente") return -1;
        if (b.personagem === "Presidente") return 1;
        return 0;
    });
    console.log("Funções atribuídas:", atribuicoes);
    return atribuicoes;
}

// Obter Classe CSS para o Papel
function getRoleClass(funcao) {
    switch (funcao) {
        case "Presidente":
            return "presidente";
        case "Cidadão Pobre":
            return "jogador1";
        case "Cidadão Rico":
            return "jogador2";
        case "Mídia":
            return "midia";
        case "Economista":
            return "economista";
        default:
            return "";
    }
}

// Obter Cor para o Papel
function getRoleColor(funcao) {
    switch (funcao) {
        case "Presidente":
            return "#FFD700"; // Dourado
        case "Cidadão Pobre":
            return "#1E90FF"; // Azul
        case "Cidadão Rico":
            return "#32CD32"; // Verde
        case "Mídia":
            return "#FF4500"; // Laranja
        case "Economista":
            return "#8A2BE2"; // Roxo
        default:
            return "#E0E0E0"; // Cinza claro
    }
}

// Obter Descrição da Função
function getDescricaoFuncao(funcao) {
    switch (funcao) {
        case "Presidente":
            return `
            <strong>Presidente</strong><br>
            Como Presidente, você é o líder máximo do país e tem a responsabilidade de governar seguindo os ideais de Jean-Jacques Rousseau, especialmente o conceito de "vontade geral", que prioriza o bem comum acima dos interesses individuais. Seu objetivo principal é alcançar um equilíbrio entre os diferentes setores da sociedade, mantendo indicadores como população, economia e segurança em níveis positivos. Para vencer, você deve fazer com que pelo menos um dos indicadores atinja 100% ou concluir o jogo sem sofrer impeachment, assegurando que todos os indicadores permaneçam acima de níveis críticos.
            `;
        case "Cidadão Pobre":
            return `
            <strong>Cidadão Pobre</strong><br>
            No papel de Cidadão Pobre, você representa as classes mais baixas da sociedade, focando na ampliação dos direitos públicos e na obtenção de incentivos que melhorem a qualidade de vida da população menos favorecida. Seu objetivo é influenciar o Presidente a implementar políticas sociais que beneficiem sua classe, como programas de assistência social, investimentos em educação e saúde pública, e medidas que promovam a igualdade social.
            `;
        case "Cidadão Rico":
            return `
            <strong>Cidadão Rico</strong><br>
            Assumindo o papel de Cidadão Rico, você representa a nobreza e a elite econômica do país, com o objetivo de preservar a propriedade privada e manter os privilégios da sua classe. Seu foco é garantir que o Presidente adote políticas que favoreçam a estabilidade econômica dos ricos, proteja os investimentos e evite medidas que possam ameaçar os interesses da elite, como altas taxas de impostos ou reformas agrárias.
            `;
        case "Mídia":
            return `
            <strong>Mídia</strong><br>
            Quando a Mídia está apoiando o Presidente, seu principal objetivo é fortalecer a imagem do líder perante a população, aumentando sua popularidade e legitimidade. Para isso, a Mídia deve formular perguntas que permitam ao Presidente destacar suas conquistas e planos futuros de maneira positiva. As perguntas podem abordar realizações recentes, políticas bem-sucedidas ou iniciativas que beneficiem amplamente a sociedade.
            `;
        case "Economista":
            return `
            <strong>Economista</strong><br>
            No papel de Economista, seu objetivo é promover o crescimento econômico do país, concentrando-se na redução da inflação, no aumento dos investimentos estrangeiros e na estabilidade financeira geral. Você tem a função de orientar o Presidente em questões econômicas, incentivando a adoção de políticas fiscais e monetárias que impulsionem o desenvolvimento econômico.
            `;
        default:
            return "";
    }
}

// Abrir Modal de Descrição da Função
function abrirDescricao(funcao) {
    roleDescriptionTitle.innerHTML = `Descrição de ${funcao}`;
    roleDescriptionContent.innerHTML = getDescricaoFuncao(funcao);
    roleDescriptionModal.style.display = 'block';
    console.log(`Abrindo descrição para: ${funcao}`);
}

// Fechar Modal de Descrição da Função
closeRoleDescriptionModalButton.addEventListener('click', () => {
    roleDescriptionModal.style.display = 'none';
    console.log("Fechando descrição da função.");
});

// Iniciar Jogo
startGameButton.addEventListener('click', () => {
    const playerNames = [];

    for (let i = 1; i <= 5; i++) {
        const nome = document.getElementById(`player${i}Name`).value.trim();
        if (nome === "") {
            alert("Por favor, insira os nomes para todos os jogadores.");
            console.log(`Jogador ${i} não inseriu nome.`);
            return;
        }
        playerNames.push(nome);
    }

    const selectedDifficulty = document.getElementById('difficultyLevel').value;
    if (selectedDifficulty === "") {
        alert("Por favor, selecione a dificuldade do jogo.");
        console.log("Dificuldade não selecionada.");
        return;
    }
    difficulty = selectedDifficulty;
    console.log(`Dificuldade selecionada: ${difficulty}`);

    jogadores = atribuirFuncoes(playerNames);

    presidentIndex = jogadores.findIndex(jogador => jogador.personagem === "Presidente");
    console.log("Índice do Presidente:", presidentIndex);

    playerSelection.style.display = 'none';
    roleAssignment.style.display = 'block';

    rolesDisplay.innerHTML = '';
    jogadores.forEach((jogador, index) => {
        const div = document.createElement('div');
        div.classList.add('role-item', 'hidden');
        div.classList.add(getRoleClass(jogador.personagem));
        div.style.setProperty('--role-color', getRoleColor(jogador.personagem));
        let iconHTML = '';
        switch (jogador.personagem) {
            case "Presidente":
                iconHTML = '<i class="fas fa-crown role-icon"></i>';
                break;
            case "Cidadão Pobre":
            case "Cidadão Rico":
                iconHTML = '<i class="fas fa-user role-icon"></i>';
                break;
            case "Mídia":
                iconHTML = '<i class="fas fa-newspaper role-icon"></i>';
                break;
            case "Economista":
                iconHTML = '<i class="fas fa-chart-line role-icon"></i>';
                break;
        }
        div.innerHTML = `${iconHTML}<br><strong class="role-name">${jogador.personagem}</strong><br><span class="player-name">${jogador.nome}</span>`;
        
        // Botão de Descrição
        const descricaoButton = document.createElement('button');
        descricaoButton.classList.add('descricao-button');
        descricaoButton.innerHTML = '<i class="fas fa-info-circle"></i>';
        descricaoButton.addEventListener('click', () => {
            abrirDescricao(jogador.personagem);
        });
        div.appendChild(descricaoButton);

        rolesDisplay.appendChild(div);
    });

    const roleItems = document.querySelectorAll('.role-item');
    roleItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
            if (index === roleItems.length - 1) {
                proceedToGameButton.style.display = 'block';
                console.log("Todas as funções foram exibidas.");
            }
        }, index * 500);
    });
});

// Prosseguir para o Jogo
proceedToGameButton.addEventListener('click', () => {
    roleAssignment.style.display = 'none';
    gameArea.style.display = 'block';
    iniciarRodada();
    iniciarEventosAleatorios();
    iniciarGraficos();
    console.log("Iniciando a primeira rodada.");
});

// Modal de Tutorial
tutorialButton.addEventListener('click', () => {
    tutorialModal.style.display = 'block';
    console.log("Abrindo tutorial.");
});

closeTutorialModalButton.addEventListener('click', () => {
    tutorialModal.style.display = 'none';
    console.log("Fechando tutorial.");
});

// Event Listener para Abrir o Modal de Dificuldade
difficultyInfoButton.addEventListener('click', () => {
    difficultyModal.style.display = 'block';
    console.log("Abrindo modal de dificuldade.");
});

// Event Listener para Fechar o Modal de Dificuldade
closeDifficultyModalButton.addEventListener('click', () => {
    difficultyModal.style.display = 'none';
    console.log("Fechando modal de dificuldade.");
});

// Fechar o Modal de Dificuldade ao Clicar Fora do Conteúdo
window.addEventListener('click', (event) => {
    if (event.target == difficultyModal) {
        difficultyModal.style.display = 'none';
        console.log("Fechando modal de dificuldade ao clicar fora.");
    }
});

// Iniciar Rodada
function iniciarRodada() {
    if (rodadaAtual > totalRodadas) {
        finalizarJogo();
        return;
    }

    currentRoundSpan.textContent = rodadaAtual;
    selectedQuestions = [];
    currentQuestionPlayerIndex = 0;
    iniciarSelecaoDePerguntas();
    atualizarTurno();
    console.log(`Iniciando rodada ${rodadaAtual}.`);
}

// Iniciar Seleção de Perguntas
function iniciarSelecaoDePerguntas() {
    questionList.innerHTML = '';
    decisionSection.style.display = 'none';
    document.querySelector('.question-section').style.display = 'block';
    document.getElementById('confirmSelectionButton').style.display = 'none';
    console.log("Iniciando seleção de perguntas.");

    if (currentQuestionPlayerIndex >= jogadores.length) {
        permitirDecisaoDoPresidente();
        return;
    }

    if (currentQuestionPlayerIndex === presidentIndex) {
        currentQuestionPlayerIndex++;
        iniciarSelecaoDePerguntas();
        return;
    }

    const jogador = jogadores[currentQuestionPlayerIndex];
    gerarListaPerguntas(jogador);
}

// Gerar Lista de Perguntas
function gerarListaPerguntas(jogador) {
    console.log(`Gerando perguntas para ${jogador.nome} (${jogador.personagem})`);
    questionList.innerHTML = '';
    const perguntasDisponiveis = perguntas[jogador.personagem].filter((_, index) => !perguntasUsadas[jogador.personagem].includes(index));

    if (perguntasDisponiveis.length < 3) {
        perguntasUsadas[jogador.personagem] = [];
        gerarListaPerguntas(jogador);
        return;
    }

    const selecionadas = [];
    while (selecionadas.length < 3) {
        const pergunta = perguntasDisponiveis[Math.floor(Math.random() * perguntasDisponiveis.length)];
        if (!selecionadas.includes(pergunta)) {
            selecionadas.push(pergunta);
        }
    }

    selecionadas.forEach(pergunta => {
        const card = document.createElement('div');
        card.classList.add('tarot-card');
        card.addEventListener('click', () => {
            selecionarCarta(card, jogador, pergunta);
        });

        const cardContent = document.createElement('div');
        cardContent.classList.add('tarot-card-content');
        cardContent.textContent = pergunta.texto;

        card.appendChild(cardContent);
        questionList.appendChild(card);
    });

    currentPlayerSpan.innerHTML = `<span style="color: ${getRoleColor(jogador.personagem)};">${jogador.nome} (${jogador.personagem})</span>`;
    console.log(`Perguntas geradas para ${jogador.nome}.`);
}

let selectedCard = null;

// Selecionar Carta
function selecionarCarta(card, jogador, pergunta) {
    console.log(`Carta selecionada por ${jogador.nome}: ${pergunta.texto}`);
    if (selectedCard && selectedCard !== card) {
        // Desseleciona a carta anterior
        selectedCard.classList.remove('selected');
        selectedCard.querySelector('.tarot-card-content').style.display = 'none';
    }

    if (selectedCard === card) {
        // Desseleciona a mesma carta
        selectedCard.classList.remove('selected');
        selectedCard.querySelector('.tarot-card-content').style.display = 'none';
        selectedCard = null;
        document.getElementById('confirmSelectionButton').style.display = 'none';
        console.log("Carta desmarcada.");
    } else {
        // Seleciona a nova carta
        card.classList.add('selected');
        card.querySelector('.tarot-card-content').style.display = 'flex';
        selectedCard = card;
        document.getElementById('confirmSelectionButton').style.display = 'block';
        console.log("Carta marcada.");
    }
}

// Confirmar Seleção de Pergunta
document.getElementById('confirmSelectionButton').addEventListener('click', () => {
    if (selectedCard) {
        const jogador = jogadores[currentQuestionPlayerIndex];
        const perguntaTexto = selectedCard.querySelector('.tarot-card-content').textContent;
        const pergunta = perguntas[jogador.personagem].find(p => p.texto === perguntaTexto);
        console.log(`Confirmando pergunta de ${jogador.nome}: ${pergunta.texto}`);
        selecionarPergunta(jogador, pergunta);
    }
});

// Selecionar Pergunta
function selecionarPergunta(jogador, pergunta) {
    selectedQuestions.push({ jogador, texto: pergunta.texto, efeitos: pergunta.efeitos, peso: pergunta.peso });
    console.log(`Pergunta selecionada: ${pergunta.texto}`);

    const perguntaIndex = perguntas[jogador.personagem].findIndex(p => p.texto === pergunta.texto);
    perguntasUsadas[jogador.personagem].push(perguntaIndex);
    console.log(`Pergunta marcada como usada para ${jogador.personagem}: Índice ${perguntaIndex}`);

    adicionarAoHistorico(jogador, pergunta.texto);

    selectedCard = null;
    document.getElementById('confirmSelectionButton').style.display = 'none';
    currentQuestionPlayerIndex++;
    setTimeout(() => {
        iniciarSelecaoDePerguntas();
    }, 1000);
}

// Permitir Decisão do Presidente
function permitirDecisaoDoPresidente() {
    console.log("Permitir decisão do Presidente.");
    decisionSection.style.display = 'block';
    document.querySelector('.question-section').style.display = 'none';

    decisionsContainer.innerHTML = '';

    const presidente = jogadores[presidentIndex];
    currentPlayerSpan.innerHTML = `<span style="color: ${getRoleColor(presidente.personagem)};">${presidente.nome} (${presidente.personagem})</span>`;
    console.log(`Vez do Presidente: ${presidente.nome}.`);

    processarDecisoes();
}

// Processar Decisões do Presidente
function processarDecisoes() {
    if (selectedQuestions.length === 0) {
        rodadaAtual++;
        iniciarRodada();
        return;
    }

    const pergunta = selectedQuestions.shift();
    console.log(`Processando decisão para pergunta: ${pergunta.texto}`);

    const decisionDiv = document.createElement('div');
    decisionDiv.classList.add('decisao-item');
    decisionDiv.style.setProperty('--role-color', getRoleColor(pergunta.jogador.personagem));

    const questionHeader = document.createElement('div');
    questionHeader.classList.add('question-header');
    questionHeader.innerHTML = `<span>${pergunta.jogador.nome} (${pergunta.jogador.personagem})</span>`;
    decisionDiv.appendChild(questionHeader);

    const perguntaTexto = document.createElement('p');
    perguntaTexto.classList.add('question-text');
    perguntaTexto.textContent = `${pergunta.texto}`;
    decisionDiv.appendChild(perguntaTexto);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('decisao-buttons');

    const simButtonPergunta = document.createElement('button');
    simButtonPergunta.innerHTML = '<i class="fas fa-check"></i> Sim';
    simButtonPergunta.classList.add('decisao-sim');
    simButtonPergunta.addEventListener('click', () => {
        console.log(`Decisão "Sim" para pergunta: ${pergunta.texto}`);
        aplicarEfeitos(pergunta.efeitos, pergunta, "Sim", pergunta.peso);
        decisionDiv.remove();
        processarDecisoes();
    });
    buttonsDiv.appendChild(simButtonPergunta);

    const naoButtonPergunta = document.createElement('button');
    naoButtonPergunta.innerHTML = '<i class="fas fa-times"></i> Não';
    naoButtonPergunta.classList.add('decisao-no');
    naoButtonPergunta.addEventListener('click', () => {
        console.log(`Decisão "Não" para pergunta: ${pergunta.texto}`);
        const efeitosNegados = getEfeitosNegadosPresidente(pergunta);
        aplicarEfeitos(efeitosNegados, pergunta, "Não", pergunta.peso);
        decisionDiv.remove();
        processarDecisoes();
    });
    buttonsDiv.appendChild(naoButtonPergunta);

    decisionDiv.appendChild(buttonsDiv);
    decisionsContainer.appendChild(decisionDiv);
}

// Obter Efeitos Negados pelo Presidente
function getEfeitosNegadosPresidente(pergunta) {
    let efeitosNao = {};
    for (let chave in pergunta.efeitos) {
        efeitosNao[chave] = -Math.floor(pergunta.efeitos[chave] * 0.5);
    }
    console.log("Efeitos negados pelo Presidente:", efeitosNao);
    return efeitosNao;
}

// Atualizar Barras de Status
function atualizarBarras() {
    populacaoBar.value = populacao;
    economiaBar.value = economia;
    reputacaoInternacionalBar.value = reputacaoInternacional;
    reputacaoMidiaBar.value = reputacaoMidia;
    vontadeGeralBar.value = vontadeGeral;

    populacaoValue.textContent = populacao;
    economiaValue.textContent = economia;
    reputacaoInternacionalValue.textContent = reputacaoInternacional;
    reputacaoMidiaValue.textContent = reputacaoMidia;
    vontadeGeralValue.textContent = vontadeGeral;
    console.log("Barras de status atualizadas:", { populacao, economia, reputacaoInternacional, reputacaoMidia, vontadeGeral });
}

// Atualizar Pontuação
function atualizarScore() {
    scoreDisplay.textContent = score;
    console.log(`Pontuação atual: ${score}`);
}

// Aplicar Efeitos das Decisões
function aplicarEfeitos(effects, pergunta, resposta, peso) {
    console.log(`Aplicando efeitos para ${resposta} na pergunta: ${pergunta.texto}`);
    const efeitosAplicados = {
        Populacao: effects.Populacao || 0,
        Economia: effects.Economia || 0,
        ReputacaoInternacional: effects.ReputacaoInternacional || 0,
        ReputacaoMidia: effects.ReputacaoMidia || 0,
        VontadeGeral: effects.VontadeGeral || 0
    };

    populacao += efeitosAplicados.Populacao;
    economia += efeitosAplicados.Economia;
    reputacaoInternacional += efeitosAplicados.ReputacaoInternacional;
    reputacaoMidia += efeitosAplicados.ReputacaoMidia;
    vontadeGeral += efeitosAplicados.VontadeGeral;

    // Limitar os valores entre 0 e 100
    populacao = Math.max(0, Math.min(100, populacao));
    economia = Math.max(0, Math.min(100, economia));
    reputacaoInternacional = Math.max(0, Math.min(100, reputacaoInternacional));
    reputacaoMidia = Math.max(0, Math.min(100, reputacaoMidia));
    vontadeGeral = Math.max(0, Math.min(100, vontadeGeral));

    atualizarBarras();
    atualizarPontuacao(efeitosAplicados, peso);
    mostrarFeedback(efeitosAplicados);
    atualizarHistorico(pergunta, resposta, efeitosAplicados);
    atualizarGraficos(efeitosAplicados);
    verificarImpeachment();
}

// Atualizar Pontuação com Efeitos e Peso
function atualizarPontuacao(efeitos, peso) {
    let roundScore = 0;

    // Somar ou subtrair a pontuação com base nos efeitos
    for (let chave in efeitos) {
        roundScore += efeitos[chave] * peso;
    }

    // Penalidade por desbalanceamento (opcional)
    const balancePenalty = Math.abs(populacao - economia) + Math.abs(populacao - reputacaoInternacional) + Math.abs(populacao - reputacaoMidia) +
                            Math.abs(populacao - vontadeGeral) + Math.abs(economia - reputacaoInternacional) + Math.abs(economia - reputacaoMidia) +
                            Math.abs(economia - vontadeGeral) + Math.abs(reputacaoInternacional - reputacaoMidia) +
                            Math.abs(reputacaoInternacional - vontadeGeral) + Math.abs(reputacaoMidia - vontadeGeral);
    const maxBalancePenalty = 1000;
    const balanceBonus = Math.floor(((maxBalancePenalty - balancePenalty) / maxBalancePenalty) * 20);
    roundScore += balanceBonus;

    score += roundScore;
    atualizarScore();
    console.log(`Efeitos aplicados: ${JSON.stringify(efeitos)}, Peso: ${peso}, Pontuação da rodada: ${roundScore}, Pontuação total: ${score}`);
}

// Mostrar Feedback das Decisões
function mostrarFeedback(effects) {
    let mensagem = "Decisão do Presidente impactou o governo de várias maneiras:";
    feedbackMessage.textContent = mensagem;

    popChange.textContent = `${effects.Populacao >=0 ? '+' : ''}${effects.Populacao}`;
    econChange.textContent = `${effects.Economia >=0 ? '+' : ''}${effects.Economia}`;
    repInternacionalChange.textContent = `${effects.ReputacaoInternacional >=0 ? '+' : ''}${effects.ReputacaoInternacional}`;
    repMidiaChange.textContent = `${effects.ReputacaoMidia >=0 ? '+' : ''}${effects.ReputacaoMidia}`;
    repLocalChange.textContent = `${effects.VontadeGeral >=0 ? '+' : ''}${effects.VontadeGeral}`;

    popChange.classList.remove('positive', 'negative');
    econChange.classList.remove('positive', 'negative');
    repInternacionalChange.classList.remove('positive', 'negative');
    repMidiaChange.classList.remove('positive', 'negative');
    repLocalChange.classList.remove('positive', 'negative');

    popChange.classList.add(effects.Populacao >= 0 ? 'positive' : 'negative');
    econChange.classList.add(effects.Economia >= 0 ? 'positive' : 'negative');
    repInternacionalChange.classList.add(effects.ReputacaoInternacional >= 0 ? 'positive' : 'negative');
    repMidiaChange.classList.add(effects.ReputacaoMidia >= 0 ? 'positive' : 'negative');
    repLocalChange.classList.add(effects.VontadeGeral >= 0 ? 'positive' : 'negative');

    feedbackSection.style.display = 'block';
    console.log("Feedback exibido:", effects);
}

// Adicionar Pergunta ao Histórico
function adicionarAoHistorico(jogador, pergunta) {
    const li = document.createElement('li');
    li.innerHTML = `<div class="decision">Pergunta de ${jogador.nome} (${jogador.personagem})</div>
                    <div class="question-text">${pergunta}</div>`;
    historyList.prepend(li);
    console.log(`Pergunta adicionada ao histórico: ${pergunta}`);
}

// Atualizar Histórico com Impacto das Decisões
function atualizarHistorico(pergunta, resposta, efeitos) {
    const items = historyList.querySelectorAll('li');
    for (let item of items) {
        if (item.textContent.includes(pergunta.texto)) {
            const impactoTexto = `
                População <span class="${efeitos.Populacao >= 0 ? 'positive' : 'negative'}">${efeitos.Populacao >=0 ? '+' : ''}${efeitos.Populacao}</span>, 
                Economia <span class="${efeitos.Economia >= 0 ? 'positive' : 'negative'}">${efeitos.Economia >=0 ? '+' : ''}${efeitos.Economia}</span>, 
                Internacional <span class="${efeitos.ReputacaoInternacional >= 0 ? 'positive' : 'negative'}">${efeitos.ReputacaoInternacional >=0 ? '+' : ''}${efeitos.ReputacaoInternacional}</span>, 
                Reputação (Mídia) <span class="${efeitos.ReputacaoMidia >= 0 ? 'positive' : 'negative'}">${efeitos.ReputacaoMidia >=0 ? '+' : ''}${efeitos.ReputacaoMidia}</span>, 
                Vontade Geral <span class="${efeitos.VontadeGeral >= 0 ? 'positive' : 'negative'}">${efeitos.VontadeGeral >=0 ? '+' : ''}${efeitos.VontadeGeral}</span>`;
            item.innerHTML += `<div class="impact">${impactoTexto}</div>`;
            console.log(`Impacto atualizado no histórico para a pergunta: ${pergunta.texto}`);
            break;
        }
    }
}

// Iniciar Gráficos de Evolução
function iniciarGraficos() {
    const evolutionCtx = evolutionChartCanvas.getContext('2d');
    evolutionChart = new Chart(evolutionCtx, {
        type: 'line',
        data: {
            labels: [`Rodada ${rodadaAtual}`],
            datasets: [
                {
                    label: 'População',
                    data: [populacao],
                    borderColor: '#e74c3c',
                    fill: false
                },
                {
                    label: 'Economia',
                    data: [economia],
                    borderColor: '#2ecc71',
                    fill: false
                },
                {
                    label: 'Internacional',
                    data: [reputacaoInternacional],
                    borderColor: '#3498db',
                    fill: false
                },
                {
                    label: 'Reputação (Mídia)',
                    data: [reputacaoMidia],
                    borderColor: '#f1c40f',
                    fill: false
                },
                {
                    label: 'Vontade Geral',
                    data: [vontadeGeral],
                    borderColor: '#e67e22',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
    console.log("Gráficos de evolução iniciados.");
}

// Atualizar Gráficos com Novos Dados
function atualizarGraficos(effects) {
    if (rodadaAtual <= totalRodadas) {
        evolutionChart.data.labels.push(`Rodada ${rodadaAtual}`);
        evolutionChart.data.datasets.forEach(dataset => {
            switch(dataset.label) {
                case 'População':
                    dataset.data.push(populacao);
                    break;
                case 'Economia':
                    dataset.data.push(economia);
                    break;
                case 'Internacional':
                    dataset.data.push(reputacaoInternacional);
                    break;
                case 'Reputação (Mídia)':
                    dataset.data.push(reputacaoMidia);
                    break;
                case 'Vontade Geral':
                    dataset.data.push(vontadeGeral);
                    break;
            }
        });
        evolutionChart.update();
        console.log("Gráficos atualizados.");
    }
}

// Finalizar Jogo
function finalizarJogo(impeach = false) {
    console.log(`Finalizando jogo. Impeachment: ${impeach}`);
    gameArea.style.display = 'none';
    feedbackSection.style.display = 'none';
    decisionSection.style.display = 'none';

    eventModal.style.display = 'none';
    roleDescriptionModal.style.display = 'none';
    tutorialModal.style.display = 'none';
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    document.body.style.overflow = 'auto';

    endGameArea.style.display = 'block';
    endGameArea.classList.remove('end-estabilidade', 'end-heroe', 'end-impeachment');

    if (impeach) {
        endMessage.innerHTML = `<p>O governo entrou em colapso! O presidente foi <strong>impeachado</strong>.</p>`;
        endGameArea.classList.add('end-impeachment');
        clearInterval(eventIntervalId); // Parar eventos
        console.log("Jogo finalizado por impeachment.");
        return;
    }

    if (rodadaAtual > totalRodadas) {
        const maxValor = Math.max(populacao, economia, reputacaoInternacional, reputacaoMidia, vontadeGeral);
        const resultados = [];
        if (populacao === maxValor) resultados.push("População no topo");
        if (economia === maxValor) resultados.push("Economia no topo");
        if (reputacaoInternacional === maxValor) resultados.push("Internacional no topo");
        if (reputacaoMidia === maxValor) resultados.push("Reputação Mídia no topo");
        if (vontadeGeral === maxValor) resultados.push("Vontade Geral no topo");

        let mensagem = "";
        let finalClass = "";
        let imagemFinal = "";

        if (resultados.length === 1) {
            switch (resultados[0]) {
                case "População no topo":
                    mensagem = "O presidente é reconhecido como um verdadeiro defensor do povo. A qualidade de vida melhorou significativamente, mas a economia está sob pressão e precisa de ajustes.";
                    imagemFinal = "imagens/heroe.png";
                    finalClass = "end-heroe";
                    break;
                case "Economia no topo":
                    mensagem = "O presidente é celebrado por garantir uma economia forte e estável, atraindo investidores e promovendo o crescimento. No entanto, algumas desigualdades sociais ainda precisam ser resolvidas.";
                    imagemFinal = "imagens/estavel.png";
                    finalClass = "end-estabilidade";
                    break;
                case "Internacional no topo":
                    mensagem = "As relações internacionais estão fortalecidas, elevando a reputação global do governo. No entanto, desafios internos ainda persistem.";
                    imagemFinal = "imagens/estavel.png";
                    finalClass = "end-estabilidade";
                    break;
                case "Reputação Mídia no topo":
                    mensagem = "A transparência e a liberdade de imprensa estão no auge, tornando o governo muito popular entre jornalistas e a opinião pública. No entanto, o crescimento econômico e os serviços públicos sofrem com falta de recursos.";
                    imagemFinal = "imagens/estavel.png";
                    finalClass = "end-estabilidade";
                    break;
                case "Vontade Geral no topo":
                    mensagem = "O presidente seguiu os ideais de Rousseau com maestria, priorizando o bem comum e a vontade geral. A sociedade está harmoniosa e os indicadores refletem um governo equilibrado.";
                    imagemFinal = "imagens/estavel.png";
                    finalClass = "end-estabilidade";
                    break;
            }
        } else {
            mensagem = "O governo terminou seu mandato com um equilíbrio razoável entre População, Economia, Internacional, Reputação Mídia e Vontade Geral, resultando em um <strong>Governo Estável</strong>.";
            imagemFinal = "imagens/estavel.png";
            finalClass = "end-estabilidade";
        }

        // Verificar equilíbrio total
        if (Math.abs(populacao - economia) <= 10 && Math.abs(populacao - reputacaoInternacional) <= 10 &&
            Math.abs(populacao - reputacaoMidia) <= 10 && Math.abs(populacao - vontadeGeral) <= 10 &&
            Math.abs(economia - reputacaoInternacional) <= 10 && Math.abs(economia - reputacaoMidia) <= 10 &&
            Math.abs(economia - vontadeGeral) <= 10 && Math.abs(reputacaoInternacional - reputacaoMidia) <= 10 &&
            Math.abs(reputacaoInternacional - vontadeGeral) <= 10 && Math.abs(reputacaoMidia - vontadeGeral) <= 10) {
            mensagem = "O presidente conseguiu terminar seu mandato com todas as barras em equilíbrio, garantindo um <strong>Governo Estável</strong> e equilibrado. Não houve grandes conquistas, mas o país permaneceu em paz e sem crises.";
            imagemFinal = "/imagens/estavel.png";
            finalClass = "end-estabilidade";
        }

        endMessage.innerHTML = `<p>${mensagem}</p><p>Sua pontuação final foi: <strong>${score}</strong></p><img src="${imagemFinal}" alt="Final do Jogo" class="end-image">`;
        endGameArea.classList.add(finalClass);
        clearInterval(eventIntervalId); // Parar eventos
        console.log("Jogo finalizado.");
    }
}

// Atualizar Turno do Jogador Atual
function atualizarTurno() {
    const jogadorAtual = jogadores[currentQuestionPlayerIndex];
    currentPlayerSpan.innerHTML = `<span style="color: ${getRoleColor(jogadorAtual.personagem)};">${jogadorAtual.nome} (${jogadorAtual.personagem})</span>`;
    console.log(`Vez de: ${jogadorAtual.nome} (${jogadorAtual.personagem})`);
}

// Exibir Evento Aleatório
function exibirEvento(evento) {
    console.log(`Evento ocorrido: ${evento.descricao}`);
    eventDescription.textContent = evento.descricao;

    const impactoTotal = Object.values(evento.efeitos).reduce((acc, val) => acc + val, 0);

    if (impactoTotal >= 0) {
        eventAcceptButton.classList.remove('event-decline');
        eventAcceptButton.classList.add('event-accept');
        eventAcceptButton.textContent = "Aceitar";
        eventTitle.style.color = '#2ecc71';
    } else {
        eventAcceptButton.classList.remove('event-accept');
        eventAcceptButton.classList.add('event-decline');
        eventAcceptButton.textContent = "Aceitar";
        eventTitle.style.color = '#e74c3c';
    }

    eventModal.style.display = 'block';
}

// Fechar Modal de Evento
closeEventModalButton.addEventListener('click', () => {
    eventModal.style.display = 'none';
    console.log("Fechando modal de evento.");
});

// Aceitar Evento
eventAcceptButton.addEventListener('click', () => {
    const evento = eventos.find(e => e.descricao === eventDescription.textContent);
    if (evento) {
        console.log(`Aceitando evento: ${evento.descricao}`);
        aplicarEfeitos(evento.efeitos, evento, "Aceitar", 2);
        adicionarEventoAoHistorico(evento, evento.efeitos);
    }
    eventModal.style.display = 'none';
});

// Iniciar Eventos Aleatórios com Base na Dificuldade
function iniciarEventosAleatorios() {
    let eventoInterval;

    switch (difficulty) {
        case 'easy':
            eventoInterval = 90000; // 1.5 minutos
            break;
        case 'medium':
            eventoInterval = 60000; // 1 minuto
            break;
        case 'hard':
            eventoInterval = 30000; // 30 segundos
            break;
        default:
            eventoInterval = 60000;
    }

    eventIntervalId = setInterval(() => {
        const evento = eventos[Math.floor(Math.random() * eventos.length)];
        exibirEvento(evento);
    }, eventoInterval);
    console.log(`Eventos aleatórios iniciados com intervalo de ${eventoInterval / 1000} segundos.`);
}

// Verificar Se Há Motivos para Impeachment
function verificarImpeachment() {
    // Verificar se dois ou mais indicadores estão críticos para iniciar impeachment
    const indicadoresCriticos = ['populacao', 'economia', 'reputacaoInternacional', 'reputacaoMidia', 'vontadeGeral'].filter(indicador => {
        return window[indicador] <= 20;
    });

    if (indicadoresCriticos.length >= 2) {
        console.log("Indicadores críticos detectados:", indicadoresCriticos);
        // Encontrar quais jogadores podem propor impeachment
        const jogadoresProponente = jogadores.filter((jogador, index) => {
            if (jogador.personagem === "Presidente") return false;
            // Implementar lógica para determinar se o jogador apoia o impeachment
            // Por enquanto, assumiremos que todos podem propor
            return true;
        });

        console.log("Jogadores proponentes de impeachment:", jogadoresProponente);

        if (jogadoresProponente.length >= 2) {
            console.log("Impeachment iniciado.");
            finalizarJogo(true);
        }
    }
}

// Adicionar Evento ao Histórico
function adicionarEventoAoHistorico(evento, efeitos) {
    const impactoTexto = `
        População <span class="${efeitos.Populacao >= 0 ? 'positive' : 'negative'}">${efeitos.Populacao >=0 ? '+' : ''}${efeitos.Populacao}</span>, 
        Economia <span class="${efeitos.Economia >= 0 ? 'positive' : 'negative'}">${efeitos.Economia >=0 ? '+' : ''}${efeitos.Economia}</span>, 
        Internacional <span class="${efeitos.ReputacaoInternacional >= 0 ? 'positive' : 'negative'}">${efeitos.ReputacaoInternacional >=0 ? '+' : ''}${efeitos.ReputacaoInternacional}</span>, 
        Reputação (Mídia) <span class="${efeitos.ReputacaoMidia >= 0 ? 'positive' : 'negative'}">${efeitos.ReputacaoMidia >=0 ? '+' : ''}${efeitos.ReputacaoMidia}</span>, 
        Vontade Geral <span class="${efeitos.VontadeGeral >= 0 ? 'positive' : 'negative'}">${efeitos.VontadeGeral >=0 ? '+' : ''}${efeitos.VontadeGeral}</span>`;
    const li = document.createElement('li');
    li.innerHTML = `<div class="decision">${evento.descricao}</div><div class="impact">${impactoTexto}</div>`;
    eventHistoryList.prepend(li);
    console.log(`Evento adicionado ao histórico: ${evento.descricao}`);
}

// Reiniciar Jogo
restartButton.addEventListener('click', () => {
    console.log("Reiniciando jogo.");
    rodadaAtual = 1;
    populacao = 50;
    economia = 50;
    reputacaoInternacional = 50;
    reputacaoMidia = 50;
    vontadeGeral = 50;
    score = 0;
    perguntasUsadas = {
        "Cidadão Pobre": [],
        "Cidadão Rico": [],
        "Mídia": [],
        "Economista": []
    };
    jogadores = [];
    presidentIndex = null;
    selectedQuestions = [];
    difficulty = 'medium';

    historyList.innerHTML = '';
    eventHistoryList.innerHTML = '';
    scoreDisplay.textContent = score;
    popChange.textContent = "+0";
    econChange.textContent = "+0";
    repInternacionalChange.textContent = "+0";
    repMidiaChange.textContent = "+0";
    repLocalChange.textContent = "+0"; // Renomeado para vontadeGeralChange

    endGameArea.classList.remove('end-estabilidade', 'end-heroe', 'end-impeachment');

    feedbackSection.style.display = 'none';
    decisionSection.style.display = 'none';
    questionList.innerHTML = '';

    playerSelection.style.display = 'block';
    gameArea.style.display = 'none';
    endGameArea.style.display = 'none';

    clearInterval(eventIntervalId);

    if (evolutionChart) {
        evolutionChart.destroy();
        evolutionChart = null;
        console.log("Gráficos destruídos.");
    }

    console.log("Jogo reiniciado.");
});

// Inicialização no Carregamento da Página
window.addEventListener('load', () => {
    atualizarBarras();
    atualizarScore();

    decisionSection.style.display = 'none';
    feedbackSection.style.display = 'none';
    roleDescriptionModal.style.display = 'none';
    tutorialModal.style.display = 'none';
    console.log("Página carregada e inicializada.");
});

// Seletores para os botões de histórico
const showDecisionHistoryButton = document.getElementById('showDecisionHistory');
const showEventHistoryButton = document.getElementById('showEventHistory');
const decisionHistory = document.getElementById('decisionHistory');
const eventHistory = document.getElementById('eventHistory');

// Função para exibir o histórico de decisões
showDecisionHistoryButton.addEventListener('click', () => {
    decisionHistory.style.display = 'block';
    eventHistory.style.display = 'none';
    decisionHistory.classList.add('active');
    eventHistory.classList.remove('active');
    console.log("Exibindo Histórico de Decisões.");
});

// Função para exibir o histórico de eventos
showEventHistoryButton.addEventListener('click', () => {
    decisionHistory.style.display = 'none';
    eventHistory.style.display = 'block';
    eventHistory.classList.add('active');
    decisionHistory.classList.remove('active');
    console.log("Exibindo Histórico de Eventos.");
});
