document.addEventListener('DOMContentLoaded', () => {
    // Elementos das Telas
    const screens = {
        start: document.getElementById('start-screen'),
        quiz: document.getElementById('quiz-screen'),
        gameOver: document.getElementById('game-over-screen'),
        ranking: document.getElementById('ranking-screen')
    };

    // Elementos do Jogo
    const characterOptions = document.querySelectorAll('.character-option');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');
    const finalScoreEl = document.getElementById('final-score');
    const playerNameInput = document.getElementById('player-name-input');
    const saveScoreBtn = document.getElementById('save-score-btn');
    const rankingList = document.getElementById('ranking-list');
    const playAgainBtn = document.getElementById('play-again-btn');

    // Elementos do HUD
    const hudCharImg = document.getElementById('hud-char-img');
    const hudCharName = document.getElementById('hud-char-name');
    
    // Elementos do Vilão
    const villainTip = document.getElementById('villain-tip');
    const villainImg = document.getElementById('villain-img');
    const villainText = document.getElementById('villain-text');

    // Estado do Jogo
    let state = {
        character: null,
        characterImg: null,
        score: 0,
        lives: 2,
        currentQuestionIndex: 0,
        ranking: JSON.parse(localStorage.getItem('superAleloRanking')) || []
    };

    // Banco de Perguntas (Expandido)
    const questions = [
        {
            question: "Qual o prazo para o primeiro contato com clientes Varejo?",
            options: ["Até 2 dias úteis", "No mesmo dia do recebimento", "Uma semana", "Quando o cliente ligar"],
            answer: "No mesmo dia do recebimento",
            villainTip: { name: "Goomba", text: "Acho que é em 2 dias...", img: "https://www.pngkey.com/png/full/2-23348_goomba-super-mario-odyssey.png" }
        },
        {
            question: "O que o menu 'Visualizar Contratos' permite ao interlocutor?",
            options: ["Apenas ver o saldo", "Verificar as informações do contrato assinado", "Cancelar o contrato", "Fazer um novo pedido"],
            answer: "Verificar as informações do contrato assinado",
            villainTip: { name: "Bowser", text: "Hahaha! É para cancelar, claro!", img: "https://ssb.wiki.gallery/images/thumb/a/a8/Bowser_SSBU.png/1200px-Bowser_SSBU.png" }
        },
        {
            question: "Qual cartão é emitido para benefícios de Alimentação e Refeição?",
            options: ["Alelo POD Verde", "Alelo POD Roxo", "Qualquer um", "Nenhum dos dois"],
            answer: "Alelo POD Roxo",
            villainTip: { name: "Koopa", text: "Tenho certeza que é o Verde!", img: "https://mario.wiki.gallery/images/thumb/c/c4/KoopaTroopa_8BS.png/220px-KoopaTroopa_8BS.png" }
        },
        {
            question: "Qual perfil de usuário tem poder para conceder e liberar acesso ao Sistema de Pedidos?",
            options: ["Operação", "Financeiro", "Decisão", "Gerenciamento"],
            answer: "Decisão",
            villainTip: { name: "Bowser Jr.", text: "Meu papai disse que é o perfil 'Operação'!", img: "https://mario.wiki.gallery/images/thumb/0/02/BowserJr_8BS.png/220px-BowserJr_8BS.png" }
        },
        {
            question: "Para que serve a funcionalidade 'Conta Empresa'?",
            options: ["Pagar contas pessoais", "Adicionar saldo diretamente no sistema de forma rápida", "Ver relatórios de vendas", "Contratar novos funcionários"],
            answer: "Adicionar saldo diretamente no sistema de forma rápida",
        },
        {
            question: "Qual o valor mínimo de pedido por colaborador para gerar cartões ou habilitar transferência?",
            options: ["R$ 10,00", "R$ 0,01", "R$ 1,02", "R$ 5,00"],
            answer: "R$ 1,02",
            villainTip: { name: "Goomba", text: "Qualquer valor serve, até 1 centavo!", img: "https://www.pngkey.com/png/full/2-23348_goomba-super-mario-odyssey.png" }
        },
        {
            question: "O que acontece se um pedido com Ali/Ref + Outros benefícios for feito?",
            options: ["O pedido é cancelado", "Apenas um boleto é gerado", "São gerados 2 boletos e 2 vias de cartão", "O cliente recebe um desconto"],
            answer: "São gerados 2 boletos e 2 vias de cartão",
        },
        {
            question: "Onde o interlocutor pode cadastrar um novo colaborador em lote?",
            options: ["Via Tela (Adicionar Novo Colaborador )", "Via Planilha (Importar Colaboradores)", "Ligando para a CAE", "Pelo aplicativo Meu Alelo"],
            answer: "Via Planilha (Importar Colaboradores)",
            villainTip: { name: "King Boo", text: "Buu! Você precisa ligar, não tem outro jeito!", img: "https://mario.wiki.gallery/images/thumb/7/71/KingBoo_MP10.png/250px-KingBoo_MP10.png" }
        },
        {
            question: "Qual benefício do Alelo POD Verde permite uso em qualquer estabelecimento na função crédito?",
            options: ["Home Office", "Mobilidade", "Saldo Livre", "Educação"],
            answer: "Saldo Livre",
        },
        {
            question: "Quantas vidas um jogador possui no início do jogo?",
            options: ["Uma", "Duas", "Três", "Infinitas"],
            answer: "Duas",
            villainTip: { name: "Bowser", text: "Nenhuma! Eu já venci! Hahaha!", img: "https://ssb.wiki.gallery/images/thumb/a/a8/Bowser_SSBU.png/1200px-Bowser_SSBU.png" }
        }
    ];
    
    const rewardItems = [
        { name: "Moeda Yoshi", img: "https://www.mariowiki.com/images/thumb/9/99/YoshiCoin_SMW.png/128px-YoshiCoin_SMW.png" },
        { name: "Super Cogumelo", img: "https://www.mariowiki.com/images/thumb/a/a3/Super_Mushroom_Artwork_-_Super_Mario_3D_World.png/200px-Super_Mushroom_Artwork_-_Super_Mario_3D_World.png" },
        { name: "Flor de Fogo", img: "https://www.mariowiki.com/images/thumb/4/44/Fire_Flower_Artwork_-_Super_Mario_3D_World.png/200px-Fire_Flower_Artwork_-_Super_Mario_3D_World.png" },
        { name: "Estrela", img: "https://www.mariowiki.com/images/thumb/9/99/Star_SMW.png/200px-Star_SMW.png" }
    ];

    // Funções
    const switchScreen = (screenName ) => {
        for (let key in screens) {
            screens[key].classList.remove('active');
        }
        screens[screenName].classList.add('active');
    };

    const startGame = (character, imgSrc) => {
        state.character = character;
        state.characterImg = imgSrc;
        state.score = 0;
        state.lives = 2;
        state.currentQuestionIndex = 0;
        
        hudCharImg.src = state.characterImg;
        hudCharName.textContent = state.character;
        updateHUD();
        
        loadQuestion();
        switchScreen('quiz');
    };

    const updateHUD = () => {
        scoreEl.textContent = state.score;
        livesEl.textContent = state.lives;
    };
    
    const updateMapBackground = () => {
        const quizScreen = screens.quiz;
        quizScreen.classList.remove('map-yoshi-island', 'map-donut-plains', 'map-vanilla-dome');
        
        if (state.currentQuestionIndex < 3) {
            quizScreen.classList.add('map-yoshi-island');
        } else if (state.currentQuestionIndex < 6) {
            quizScreen.classList.add('map-donut-plains');
        } else {
            quizScreen.classList.add('map-vanilla-dome');
        }
    };

    const loadQuestion = () => {
        optionsContainer.innerHTML = '';
        villainTip.classList.add('hidden');

        if (state.currentQuestionIndex >= questions.length) {
            endGame();
            return;
        }
        
        updateMapBackground();

        const q = questions[state.currentQuestionIndex];
        questionText.textContent = q.question;

        q.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => selectAnswer(option));
            optionsContainer.appendChild(button);
        });
        
        if (Math.random() < 0.6 && q.villainTip) { // Aumentei a chance da dica aparecer
            showVillainTip(q.villainTip);
        }
    };
    
    const showVillainTip = (tip) => {
        villainImg.src = tip.img;
        villainText.textContent = `${tip.name} diz: "${tip.text}"`;
        villainTip.classList.remove('hidden');
    };
    
    const showReward = () => {
        const item = rewardItems[Math.floor(Math.random() * rewardItems.length)];
        // Cria um elemento temporário para a recompensa
        const rewardEl = document.createElement('div');
        rewardEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0,0,0,0.8);
            padding: 20px;
            border-radius: 15px;
            z-index: 100;
            text-align: center;
        `;
        rewardEl.innerHTML = `<img src="${item.img}" width="80"><p>Você ganhou: ${item.name}!</p>`;
        document.body.appendChild(rewardEl);
        
        setTimeout(() => {
            document.body.removeChild(rewardEl);
        }, 1500); // A recompensa some após 1.5 segundos
    };

    const selectAnswer = (selectedOption) => {
        const q = questions[state.currentQuestionIndex];
        if (selectedOption === q.answer) {
            state.score += 100;
            showReward();
        } else {
            state.lives -= 1;
        }

        updateHUD();

        if (state.lives <= 0) {
            setTimeout(endGame, 1000); // Pequeno delay antes de ir para a tela de game over
        } else {
            state.currentQuestionIndex++;
            setTimeout(loadQuestion, 1000); // Delay para o jogador ver a recompensa
        }
    };

    const endGame = () => {
        finalScoreEl.textContent = state.score;
        switchScreen('gameOver');
    };

    const saveScore = () => {
        const playerName = playerNameInput.value.trim();
        if (!playerName) {
            alert("Por favor, insira um nome.");
            return;
        }

        state.ranking.push({ name: playerName, score: state.score });
        state.ranking.sort((a, b) => b.score - a.score);
        state.ranking = state.ranking.slice(0, 10);

        localStorage.setItem('superAleloRanking', JSON.stringify(state.ranking));
        
        showRanking();
    };

    const showRanking = () => {
        rankingList.innerHTML = '';
        state.ranking.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name} - ${entry.score} Pontos`;
            rankingList.appendChild(li);
        });
        switchScreen('ranking');
    };

    // Event Listeners
    characterOptions.forEach(option => {
        option.addEventListener('click', () => {
            const charName = option.dataset.char;
            const charImgSrc = option.querySelector('img').src;
            startGame(charName, charImgSrc);
        });
    });

    saveScoreBtn.addEventListener('click', saveScore);
    playAgainBtn.addEventListener('click', () => {
        // Reseta o estado para um novo jogo
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.lives = 2;
        switchScreen('start');
    });

    // Iniciar
    switchScreen('start');
});
