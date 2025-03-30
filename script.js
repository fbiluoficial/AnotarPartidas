// Variáveis globais
let notes = [];

// Função para aplicar filtros
function applyFilters() {
    const teamFilter = document.getElementById('filterTeam').value.toLowerCase();
    const predictionFilter = document.getElementById('filterPrediction').value;
    
    let notasParaFiltrar = notes.filter(note => {
        const teamMatch = note.teamName.toLowerCase().includes(teamFilter);
        const predictionMatch = predictionFilter === '' || note.prediction === predictionFilter;
        return teamMatch && predictionMatch;
    });
    
    // Manter a ordenação por data nas notas filtradas
    notasParaFiltrar = sortNotesByDate(notasParaFiltrar);
    
    renderNotes(notasParaFiltrar);
    updateCounters(); // Atualizar contadores após aplicar filtros

    // Opcional: Fechar o menu de filtros após aplicar
    const filterMenu = document.getElementById('filterMenuContainer');
    if (filterMenu && filterMenu.classList.contains('visible')) {
        filterMenu.classList.remove('visible');
    }
}

// Função para mostrar o modal de exportação
function showExportModal() {
    document.getElementById('exportOverlay').classList.add('active');
}

// Função para esconder o modal de exportação
function hideExportModal() {
    document.getElementById('exportOverlay').classList.remove('active');
}

// Função para realizar a exportação
function performExport() {
    const exportOption = document.querySelector('input[name="exportOption"]:checked').value;
    const filename = document.getElementById('filename').value || 'Anotacoes_Jogo';
    
    const dataToExport = exportOption === 'all' ? notes : filteredNotes;
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Anotacoes');
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    hideExportModal();
}

// Função para mostrar o modal de IA
function showIAModal() {
    document.getElementById('iaOverlay').classList.add('active');
}

// Função para esconder o modal de IA
function hideIAModal() {
    document.getElementById('iaOverlay').classList.remove('active');
}

// Função para gerar relatório de IA
function generateAIReport() {
    const reportLoading = document.getElementById('reportLoading');
    const aiReport = document.getElementById('aiReport');
    
    reportLoading.style.display = 'block';
    aiReport.innerHTML = '';
    
    setTimeout(() => {
        // Simulação de geração de relatório
        const reportContent = `
            Relatório de Análise Inteligente:
            - Total de Partidas: ${notes.length}
            - Total de Vitórias: ${notes.filter(note => note.prediction === 'Vitória').length}
            - Total de Empates: ${notes.filter(note => note.prediction === 'Empate').length}
            - Total de Derrotas: ${notes.filter(note => note.prediction === 'Derrota').length}
        `;
        
        aiReport.innerHTML = reportContent;
        reportLoading.style.display = 'none';
    }, 2000);
}

// Função para gerar gráfico
function generateChart() {
    const chartType = document.getElementById('chartType').value;
    const chartLoading = document.getElementById('chartLoading');
    const iaChart = document.getElementById('iaChart');
    
    chartLoading.style.display = 'block';
    iaChart.style.display = 'none';
    
    setTimeout(() => {
        let chartConfig;
        
        switch (chartType) {
            case 'prediction':
                chartConfig = generatePredictionChart();
                break;
            case 'firstGoal':
                chartConfig = generateFirstGoalChart();
                break;
            case 'scoreAnalysis':
                chartConfig = generateScoreAnalysisChart();
                break;
            case 'predictionAccuracy':
                chartConfig = generatePredictionAccuracyChart();
                break;
            case 'timeScoring':
                chartConfig = generateTimeScoringChart();
                break;
            case 'teamComparison':
                chartConfig = generateTeamComparisonChart();
                break;
            case 'combinedAnalysis':
                chartConfig = generateCombinedAnalysisChart();
                break;
            default:
                chartConfig = generatePredictionChart();
        }
        
        new Chart(iaChart, chartConfig);
        
        chartLoading.style.display = 'none';
        iaChart.style.display = 'block';
    }, 2000);
}

// Função para adicionar ou atualizar uma anotação
function addOrUpdateNote() {
    const teamNameA = document.getElementById('teamNameA').value;
    const teamNameB = document.getElementById('teamNameB').value;
    const prediction = document.getElementById('prediction').value;
    const ftScoreHome = document.getElementById('ftScoreHome').textContent;
    const ftScoreAway = document.getElementById('ftScoreAway').textContent;
    const htScoreHome = document.getElementById('htScoreHome').textContent;
    const htScoreAway = document.getElementById('htScoreAway').textContent;
    const firstGoalTime = document.getElementById('firstGoalTime').value;
    const firstGoalTeam = document.getElementById('firstGoalTeam').value;
    const datetime = document.getElementById('datetime').value;
    
    // Validação dos campos obrigatórios
    if (!teamNameA || !teamNameB || !prediction || !datetime) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    const gameData = {
        teamName: `${teamNameA} vs ${teamNameB}`,
        prediction,
        ftScore: ftScoreHome && ftScoreAway ? `${ftScoreHome}-${ftScoreAway}` : 'Aguardando',
        htScore: htScoreHome && htScoreAway ? `${htScoreHome}-${htScoreAway}` : 'Aguardando',
        firstGoal: firstGoalTime && firstGoalTeam ? `${firstGoalTime} | ${firstGoalTeam}` : 'Não iniciado',
        datetime,
        status: 'active'
    };
    
    if (editingNoteIndex >= 0) {
        // Atualizar nota existente
        notes[editingNoteIndex] = gameData;
        editingNoteIndex = -1;
        document.querySelector('.add-button').textContent = 'Adicionar';
    } else {
        // Adicionar nova nota
        notes.push(gameData);
    }
    
    // Ordenar notas por data após adicionar/atualizar
    notes = sortNotesByDate(notes);
    
    saveNotesToStorage();
    renderNotes(notes);
    updateCounters();
    
    // Limpar formulário e estados
    resetForm();
}

// Função auxiliar para resetar o formulário
function resetForm() {
    // Limpar campos de input e select
    document.getElementById('teamNameA').value = '';
    document.getElementById('teamNameB').value = '';
    document.getElementById('prediction').value = 'BTTS'; // Ou o valor padrão desejado
    document.getElementById('datetime').value = new Date().toISOString().slice(0, 16); // Resetar para data/hora atual

    // Resetar placares para '0'
    document.getElementById('ftScoreHome').textContent = '0';
    document.getElementById('ftScoreAway').textContent = '0';
    document.getElementById('htScoreHome').textContent = '0';
    document.getElementById('htScoreAway').textContent = '0';

    // Limpar seleção de primeiro gol (inputs hidden e botões)
    document.getElementById('firstGoalTime').value = '';
    document.getElementById('firstGoalTeam').value = '';
    document.querySelectorAll('.time-button, .team-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Resetar estado de edição
    editingNoteIndex = -1;
    document.querySelector('.add-button').textContent = 'Adicionar';
}

// Função para renderizar as anotações
function renderNotes(filteredNotes = notes) {
    console.log('Iniciando renderização de notas');
    const notesList = document.getElementById('notesList');

    if (!notesList) {
        console.error('Elemento notesList não encontrado');
        return;
    }

    // Verifica se há notas para renderizar
    if (!filteredNotes || filteredNotes.length === 0) {
        console.log('Nenhuma nota para renderizar');
        notesList.innerHTML = '<div class="no-notes">Nenhuma partida registrada</div>';
        return;
    }

    console.log(`Renderizando ${filteredNotes.length} notas`);
    notesList.innerHTML = '';
    
    // Renderizar todas as notas
    filteredNotes.forEach((note, index) => {
        try {
            const gameData = {
                match: note.teamName,
                btts: note.prediction,
                ft: note.ftScore,
                ht: note.htScore,
                firstGoalMinute: note.firstGoal.split('|')[1].trim(),
                dateTime: note.datetime
            };
            
            const card = createGameCard(gameData);
            notesList.appendChild(card);
        } catch (error) {
            console.error(`Erro ao renderizar nota ${index}:`, error);
        }
    });

    console.log('Renderização de notas concluída');
}

// Função para salvar anotações no armazenamento local
function saveNotesToStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Função para ordenar notas por data (mais recente primeiro)
function sortNotesByDate(notesArray) {
    return notesArray.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
}

// Função para carregar anotações do armazenamento local
function loadNotesFromStorage() {
    console.log('Iniciando carregamento de notas do localStorage');
    const storedNotes = localStorage.getItem('notes');
    
    try {
        if (storedNotes) {
            notes = JSON.parse(storedNotes);
            console.log(`${notes.length} notas carregadas do localStorage`);
            
            // Ordenar notas por data
            notes = sortNotesByDate(notes);

            // Atualizar contadores
            updateCounters();
        } else {
            console.log('Nenhuma nota encontrada no localStorage');
            notes = [];
            localStorage.setItem('notes', '[]');
        }
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
        notes = [];
        localStorage.setItem('notes', '[]');
    }
}

// Função para calcular estatísticas
function calcularEstatisticas() {
    const total = notes.length;
    if (total === 0) return {
        vitoriasCasaFT: '0/0 (0%)',
        vitoriasForaFT: '0/0 (0%)',
        vitoriasCasaHT: '0/0 (0%)',
        vitoriasForaHT: '0/0 (0%)',
        acertosGolsFT: '0/0 (0%)'
    };

    // Contadores FT
    let vitoriasCasaFT = 0;
    let vitoriasForaFT = 0;
    
    // Contadores HT
    let vitoriasCasaHT = 0;
    let vitoriasForaHT = 0;
    
    // Contadores de gols
    let jogosComGols = 0;
    let totalJogosComGols = 0;

    notes.forEach(note => {
        // Análise FT (Tempo Final)
        if (note.ftScore && note.ftScore.includes('-')) {
            const [golsCasaFT, golsForaFT] = note.ftScore.split('-').map(Number);
            
            // Contagem de vitórias FT
            if (golsCasaFT > golsForaFT) vitoriasCasaFT++;
            if (golsForaFT > golsCasaFT) vitoriasForaFT++;

            // Verificação de gols na partida
            totalJogosComGols++;
            if (golsCasaFT + golsForaFT > 0) jogosComGols++;
        }

        // Análise HT (Primeiro Tempo)
        if (note.htScore && note.htScore.includes('-')) {
            const [golsCasaHT, golsForaHT] = note.htScore.split('-').map(Number);
            
            // Contagem de vitórias HT
            if (golsCasaHT > golsForaHT) vitoriasCasaHT++;
            if (golsForaHT > golsCasaHT) vitoriasForaHT++;
        }
    });

    // Cálculo das porcentagens
    const percentCasaFT = ((vitoriasCasaFT / total) * 100).toFixed(1);
    const percentForaFT = ((vitoriasForaFT / total) * 100).toFixed(1);
    const percentCasaHT = ((vitoriasCasaHT / total) * 100).toFixed(1);
    const percentForaHT = ((vitoriasForaHT / total) * 100).toFixed(1);
    const percentGols = ((jogosComGols / totalJogosComGols) * 100).toFixed(1);

    // Calcular total de vitórias FT
    const totalVitoriasFT = vitoriasCasaFT + vitoriasForaFT;
    const percentTotalVitoriasFT = ((totalVitoriasFT / total) * 100).toFixed(1);

    // Contadores BTTS
    let bttsSim = 0;
    let bttsTotal = 0;

    notes.forEach(note => {
        if (note.ftScore && note.ftScore !== 'Aguardando') {
            bttsTotal++;
            if (checkBTTS(note.ftScore)) {
                bttsSim++;
            }
        }
    });

    const percentBTTSSim = bttsTotal > 0 ? ((bttsSim / bttsTotal) * 100).toFixed(1) : 0;
    const percentBTTSNao = bttsTotal > 0 ? (((bttsTotal - bttsSim) / bttsTotal) * 100).toFixed(1) : 0;

    return {
        vitoriasCasaFT: `${vitoriasCasaFT}/${total} (${percentCasaFT}%)`,
        vitoriasForaFT: `${vitoriasForaFT}/${total} (${percentForaFT}%)`,
        vitoriasCasaHT: `${vitoriasCasaHT}/${total} (${percentCasaHT}%)`,
        vitoriasForaHT: `${vitoriasForaHT}/${total} (${percentForaHT}%)`,
        acertosGolsFT: `${jogosComGols}/${totalJogosComGols} (${percentGols}%)`,
        totalVitoriasFT: `${totalVitoriasFT}/${total} (${percentTotalVitoriasFT}%)`,
        bttsSim: `${bttsSim}/${bttsTotal} (${percentBTTSSim}%)`,
        bttsNao: `${bttsTotal - bttsSim}/${bttsTotal} (${percentBTTSNao}%)`
    };
}

// Função para extrair porcentagem de uma string estatística
function extrairPorcentagem(estatistica) {
    const match = estatistica.match(/\((\d+\.?\d*)%\)/);
    return match ? parseFloat(match[1]) : 0;
}

// Função para atualizar contadores
function updateCounters() {
    const totalCount = document.getElementById('totalCount');
    const total = notes.length;
    totalCount.textContent = total;

    // Atualizar estatísticas adicionais
    const stats = calcularEstatisticas();

    // Calcular score de performance para cada card
    const statsCards = Array.from(document.querySelectorAll('.stats-card'));
    const cardScores = statsCards.map(card => {
        const progressBars = card.querySelectorAll('.stats-progress-fill');
        let totalScore = 0;
        let totalMetrics = 0;

        progressBars.forEach(bar => {
            const width = parseFloat(bar.style.width) || 0;
            if (width > 0) {
                totalScore += width;
                totalMetrics++;
            }
        });

        return {
            card,
            score: totalMetrics > 0 ? totalScore / totalMetrics : 0
        };
    });

    // Ordenar cards por score
    cardScores.sort((a, b) => b.score - a.score);

    // Reorganizar cards no DOM com animação
    const statsGrid = document.querySelector('.stats-grid');
    
    // Adicionar classe de animação
    statsCards.forEach(card => card.classList.add('reordering'));
    
    // Pequeno delay para a animação ser visível
    setTimeout(() => {
        // Reordenar os cards
        cardScores.forEach(({ card }) => {
            statsGrid.appendChild(card);
        });
        
        // Remover classe de animação após um breve delay
        setTimeout(() => {
            statsCards.forEach(card => card.classList.remove('reordering'));
        }, 300);
    }, 50);
    
    // Função auxiliar para atualizar elemento e barra de progresso
    const atualizarElementoComProgresso = (elementId, valor) => {
        const elemento = document.getElementById(elementId);
        if (!elemento) return;

        // Atualizar texto
        elemento.textContent = valor;
        
        // Atualizar barra de progresso
        const container = elemento.closest('.stats-item');
        if (container) {
            const progressBar = container.querySelector('.stats-progress-fill');
            if (progressBar) {
                const porcentagem = extrairPorcentagem(valor);
                progressBar.style.width = `${porcentagem}%`;
                
                // Atualizar cores baseadas na porcentagem
                if (porcentagem >= 90) {
                    elemento.style.color = '#06f03c';
                    progressBar.style.background = 'linear-gradient(90deg, #06f03c, #00ff44)';
                } else if (porcentagem >= 70) {
                    elemento.style.color = '#ffd700';
                    progressBar.style.background = 'linear-gradient(90deg, #ffd700, #ffc800)';
                } else {
                    elemento.style.color = '#ffffff';
                    progressBar.style.background = 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))';
                }
            }
        }
    };

    // Atualizar cada estatística com barra de progresso
    atualizarElementoComProgresso('vitoriasCasaFT', stats.vitoriasCasaFT);
    atualizarElementoComProgresso('vitoriasForaFT', stats.vitoriasForaFT);
    atualizarElementoComProgresso('vitoriasCasaHT', stats.vitoriasCasaHT);
    atualizarElementoComProgresso('vitoriasForaHT', stats.vitoriasForaHT);
    atualizarElementoComProgresso('acertosGolsFT', stats.acertosGolsFT);
    atualizarElementoComProgresso('totalVitoriasFT', stats.totalVitoriasFT);
    atualizarElementoComProgresso('bttsSim', stats.bttsSim);
    atualizarElementoComProgresso('bttsNao', stats.bttsNao);
}

// Função para criar um card de jogo
function checkBTTS(ftScore) {
    if (!ftScore || !ftScore.includes('-') || ftScore === 'Aguardando') return false;
    const [homeGoals, awayGoals] = ftScore.split('-').map(Number);
    return homeGoals > 0 && awayGoals > 0;
}

function createGameCard(gameData) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    const hasBTTS = checkBTTS(gameData.ft);
    const bttsClass = hasBTTS ? 'btts-green' : 'btts-red';
    const bttsText = hasBTTS ? 'GREEN' : 'RED';
    
    card.innerHTML = `
        <div class="game-card-header">
            <h2 class="game-title">${gameData.match}</h2>
        </div>
        <div class="game-card-body">
            <div class="game-info-grid">
                <div class="game-info-item">
                    <span class="info-label">BTTS:</span>
                    <span class="info-value btts-result ${bttsClass}">${bttsText}</span>
                </div>
                <div class="game-info-item">
                    <span class="info-label">FT:</span>
                    <span class="info-value">${gameData.ft}</span>
                </div>
                <div class="game-info-item">
                    <span class="info-label">HT:</span>
                    <span class="info-value">${gameData.ht}</span>
                </div>
                <div class="game-info-item">
                    <span class="info-label">1º GOL MIN:</span>
                    <span class="info-value">${gameData.firstGoalMinute}</span>
                </div>
                <div class="game-info-item date-time">
                    <span class="info-label">Data/Hora:</span>
                    <span class="info-value">${formatDateTime(gameData.dateTime)}</span>
                </div>
            </div>
        </div>
        <div class="game-card-footer">
            <button class="edit-btn" onclick="handleEditGameCard(this)">Editar</button>
            <button class="delete-btn" onclick="handleDeleteGameCard(this)">Excluir</button>
        </div>
    `;
    
    return card;
}

// Função para controlar a visibilidade da lista de notas
function toggleNotesList() {
    console.log('Alternando visibilidade da lista de notas');
    const notesList = document.getElementById('notesList');
    const toggleBtn = document.getElementById('toggleNotes');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = toggleBtn.querySelector('span:last-child');

    if (!notesList) {
        console.error('Elemento notesList não encontrado');
        return;
    }

    const isMinimized = notesList.classList.toggle('minimized');
    console.log('Estado minimizado:', isMinimized);
    
    // Atualiza o ícone e texto do botão com animação
    toggleIcon.style.transform = isMinimized ? 'rotate(-90deg)' : 'rotate(0deg)';
    toggleText.textContent = isMinimized ? 'Maximizar' : 'Minimizar';
    
    // Força re-renderização das notas se estiver maximizando
    if (!isMinimized) {
        console.log('Re-renderizando notas após maximizar');
        renderNotes(notes);
    }
    
    // Salva o estado no localStorage
    localStorage.setItem('notesListMinimized', isMinimized);
    console.log('Estado salvo no localStorage:', isMinimized);
}

// Função para restaurar o estado da lista de notas
function restoreNotesListState() {
    console.log('Restaurando estado da lista de notas');
    const isMinimized = localStorage.getItem('notesListMinimized') === 'true';
    const notesList = document.getElementById('notesList');
    const toggleBtn = document.getElementById('toggleNotes');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = toggleBtn.querySelector('span:last-child');
    
    if (!notesList || !toggleBtn || !toggleIcon || !toggleText) {
        console.error('Elementos necessários não encontrados');
        return;
    }

    console.log('Estado minimizado anterior:', isMinimized);
    
    if (isMinimized) {
        notesList.classList.add('minimized');
        toggleIcon.style.transform = 'rotate(-90deg)';
        toggleText.textContent = 'Maximizar';
    } else {
        notesList.classList.remove('minimized');
        toggleIcon.style.transform = 'rotate(0deg)';
        toggleText.textContent = 'Minimizar';
        // Garante que as notas sejam renderizadas se não estiver minimizado
        renderNotes(notes);
    }
}

// Função para formatar data e hora
function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Função para adicionar um novo card
function addGameCard(gameData) {
    const notesList = document.getElementById('notesList');
    const card = createGameCard(gameData);
    notesList.appendChild(card);
    
    // Adiciona aos dados existentes
    notes.push(gameData);
    saveNotesToStorage();
    updateCounters();
}

// Função para editar um card
function handleEditGameCard(button) {
    const card = button.closest('.game-card');
    const index = Array.from(card.parentElement.children).indexOf(card);
    const gameData = notes[index];
    
    // Preenche o formulário com os dados atuais
    document.getElementById('teamNameA').value = gameData.match.split(' vs ')[0];
    document.getElementById('teamNameB').value = gameData.match.split(' vs ')[1];
    document.getElementById('prediction').value = gameData.btts;
    document.getElementById('ftScoreHome').value = gameData.ft.split('-')[0];
    document.getElementById('ftScoreAway').value = gameData.ft.split('-')[1];
    document.getElementById('htScoreHome').value = gameData.ht.split('-')[0];
    document.getElementById('htScoreAway').value = gameData.ht.split('-')[1];
    document.getElementById('firstGoalTime').value = gameData.firstGoalMinute;
    document.getElementById('datetime').value = gameData.dateTime;
    
    // Marca o índice para atualização
    editingNoteIndex = index;
    document.querySelector('.add-button').textContent = 'Atualizar';
}

// Função para excluir um card
// Função para atualizar o placar
function updateScore(elementId, delta) {
    const el = document.getElementById(elementId);
    let val = parseInt(el.textContent || '0');
    val = Math.max(0, val + delta);
    el.textContent = val.toString();
}

function handleDeleteGameCard(button) {
    const card = button.closest('.game-card');
    const index = Array.from(card.parentElement.children).indexOf(card);
    
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        notes.splice(index, 1);
        saveNotesToStorage();
        renderNotes(notes);
        updateCounters();
    }
}

// Função para carregar dados de demonstração
function loadDemoData() {
    if (notes.length === 0) {
        notes = [
            {
                teamName: 'Time A vs Time B',
                prediction: 'Vitória',
                ftScore: '2-1',
                htScore: '1-0',
                firstGoal: 'HT | Casa',
                datetime: '2023-01-01T12:00'
            },
            {
                teamName: 'Time C vs Time D',
                prediction: 'Empate',
                ftScore: '1-1',
                htScore: '0-0',
                firstGoal: 'FT | Fora',
                datetime: '2023-01-02T15:00'
            },
            {
                teamName: 'Time E vs Time F',
                prediction: 'BTTS',
                ftScore: '2-1',
                htScore: '1-1',
                firstGoal: 'HT | Casa',
                datetime: '2023-01-03T16:30'
            }
        ];
        saveNotesToStorage();
        renderNotes(); // Renderizar as notas
        updateCounters(); // Atualizar contadores e estatísticas
    }
}

// Função para atualizar opções de palpites no filtro
function updateFilterPredictionOptions() {
    const filterPrediction = document.getElementById('filterPrediction');
    filterPrediction.innerHTML = `
        <option value="">Todos os Palpites</option>
        <option value="Vitória">Vitória</option>
        <option value="Empate">Empate</option>
        <option value="Derrota">Derrota</option>
        <option value="BTTS">BTTS</option>
    `;
}

// Função para verificar o resultado do palpite
function checkPredictionResult(prediction, ftScore) {
    if (!ftScore || !ftScore.includes('-')) return 'Gray';
    
    const [home, away] = ftScore.split('-').map(Number);
    
    if (prediction === 'BTTS') {
        return (home > 0 && away > 0) ? 'Green' : 'Red';
    }
    
    if (prediction === 'Vitória' && home > away) return 'Green';
    if (prediction === 'Empate' && home === away) return 'Green';
    if (prediction === 'Derrota' && home < away) return 'Green';
    
    return 'Red';
}

// Função para gerar gráfico de distribuição de palpites
function generatePredictionChart() {
    const predictionCounts = {
        'Vitória': 0,
        'Empate': 0,
        'Derrota': 0
    };
    
    notes.forEach(note => {
        if (note.prediction) {
            predictionCounts[note.prediction]++;
        }
    });
    
    return {
        type: 'pie',
        data: {
            labels: ['Vitória', 'Empate', 'Derrota'],
            datasets: [{
                data: [
                    predictionCounts['Vitória'],
                    predictionCounts['Empate'],
                    predictionCounts['Derrota']
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribuição de Palpites'
                }
            }
        }
    };
}

// Função para gerar gráfico de análise do primeiro gol
function generateFirstGoalChart() {
    // Contar ocorrências de cada equipe que marcou o primeiro gol
    const firstGoalData = {
        'Casa': 0,
        'Fora': 0,
        'Nenhum': 0,
        'HT': 0,
        'FT': 0
    };
    
    notes.forEach(note => {
        if (!note.firstGoal) return;
        
        const parts = note.firstGoal.split('|').map(p => p.trim());
        if (parts.length >= 2) {
            const time = parts[0];
            const team = parts[1];
            
            firstGoalData[time] = (firstGoalData[time] || 0) + 1;
            firstGoalData[team] = (firstGoalData[team] || 0) + 1;
        }
    });
    
    // Criar dois conjuntos de dados para o gráfico
    return {
        type: 'bar',
        data: {
            labels: ['Casa', 'Fora', 'Nenhum', 'HT', 'FT'],
            datasets: [{
                label: 'Frequência',
                data: [
                    firstGoalData['Casa'] || 0,
                    firstGoalData['Fora'] || 0, 
                    firstGoalData['Nenhum'] || 0,
                    firstGoalData['HT'] || 0,
                    firstGoalData['FT'] || 0
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Análise do Primeiro Gol'
                }
            }
        }
    };
}

// Função para gerar gráfico de análise de placar
function generateScoreAnalysisChart() {
    // Contar ocorrências de cada tipo de resultado
    const results = {
        'Vitória Casa': 0,
        'Empate': 0,
        'Vitória Fora': 0
    };
    
    // Contar gols totais por tempo
    const goals = {
        'HT Casa': 0,
        'HT Fora': 0,
        'FT Casa': 0,
        'FT Fora': 0
    };
    
    notes.forEach(note => {
        // Processar placar final
        if (note.ftScore && note.ftScore.includes('-')) {
            const [home, away] = note.ftScore.split('-').map(Number);
            goals['FT Casa'] += home;
            goals['FT Fora'] += away;
            
            // Determinar resultado
            if (home > away) results['Vitória Casa']++;
            else if (home < away) results['Vitória Fora']++;
            else results['Empate']++;
        }
        
        // Processar placar do primeiro tempo
        if (note.htScore && note.htScore.includes('-')) {
            const [home, away] = note.htScore.split('-').map(Number);
            goals['HT Casa'] += home;
            goals['HT Fora'] += away;
        }
    });
    
    return {
        type: 'bar',
        data: {
            labels: ['Vitória Casa', 'Empate', 'Vitória Fora', 'Gols HT Casa', 'Gols HT Fora', 'Gols FT Casa', 'Gols FT Fora'],
            datasets: [{
                label: 'Contagem',
                data: [
                    results['Vitória Casa'],
                    results['Empate'],
                    results['Vitória Fora'],
                    goals['HT Casa'],
                    goals['HT Fora'],
                    goals['FT Casa'],
                    goals['FT Fora']
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Análise de Resultados e Gols'
                }
            }
        }
    };
}

// Função auxiliar para gerar cores para os gráficos
function generateChartColors(count) {
    const baseColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(255, 99, 255, 0.7)',
        'rgba(255, 159, 182, 0.7)'
    ];
    
    // Se temos cores suficientes na base, use-as
    if (count <= baseColors.length) {
        return baseColors.slice(0, count);
    }
    
    // Caso contrário, gere cores adicionais de forma aleatória
    const colors = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    return colors;
}

// Função para gerar gráfico de taxa de acerto de palpites
function generatePredictionAccuracyChart() {
    // Contador para acertos e erros de palpites
    let acertos = 0;
    let erros = 0;
    let semResultado = 0;
    
    // Calcular por palpite
    const palpitesData = {};
    
    notes.forEach(note => {
        const status = checkPredictionResult(note.prediction, note.ftScore);
        
        // Incrementar contadores gerais
        if (status === 'Green') acertos++;
        else if (status === 'Red') erros++;
        else semResultado++;
        
        // Incrementar contadores por tipo de palpite
        if (!palpitesData[note.prediction]) {
            palpitesData[note.prediction] = { total: 0, acertos: 0, erros: 0 };
        }
        
        palpitesData[note.prediction].total++;
        if (status === 'Green') palpitesData[note.prediction].acertos++;
        else if (status === 'Red') palpitesData[note.prediction].erros++;
    });
    
    // Preparar dados para o gráfico
    const palpites = Object.keys(palpitesData);
    const acertosPorPalpite = palpites.map(p => palpitesData[p].acertos);
    const errosPorPalpite = palpites.map(p => palpitesData[p].erros);
    
    return {
        type: 'bar',
        data: {
            labels: ['Taxa de Acerto Geral', ...palpites],
            datasets: [
                {
                    label: 'Acertos',
                    data: [acertos, ...acertosPorPalpite],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Erros',
                    data: [erros, ...errosPorPalpite],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Taxa de Acerto de Palpites'
                },
                tooltip: {
                    callbacks: {
                        footer: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const label = tooltipItems[0].label;
                            
                            if (index === 0) { // Taxa geral
                                const total = acertos + erros;
                                const taxa = total > 0 ? ((acertos / total) * 100).toFixed(1) : 0;
                                return `Taxa de acerto: ${taxa}%`;
                            } else {
                                const palpite = label;
                                const total = palpitesData[palpite].total;
                                const txAcerto = total > 0 ? ((palpitesData[palpite].acertos / total) * 100).toFixed(1) : 0;
                                return `Taxa de acerto: ${txAcerto}%`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Palpites'
                    }
                }
            }
        }
    };
}

// Função para gerar gráfico de gols por tempo de jogo
function generateTimeScoringChart() {
    // Contagem de gols por tempo (HT vs FT)
    const golsHT = { casa: 0, fora: 0 };
    const golsFT = { casa: 0, fora: 0 };
    
    notes.forEach(note => {
        // Gols no primeiro tempo (HT)
        if (note.htScore && note.htScore.includes('-')) {
            const [home, away] = note.htScore.split('-').map(Number);
            golsHT.casa += home;
            golsHT.fora += away;
        }
        
        // Gols no jogo inteiro (FT)
        if (note.ftScore && note.ftScore.includes('-')) {
            const [home, away] = note.ftScore.split('-').map(Number);
            golsFT.casa += home;
            golsFT.fora += away;
        }
    });
    
    // Calcular gols no segundo tempo (FT - HT)
    const golsST = { 
        casa: golsFT.casa - golsHT.casa, 
        fora: golsFT.fora - golsHT.fora 
    };
    
    return {
        type: 'radar',
        data: {
            labels: ['Gols Casa 1º Tempo', 'Gols Fora 1º Tempo', 'Gols Casa 2º Tempo', 'Gols Fora 2º Tempo'],
            datasets: [
                {
                    label: 'Distribuição de Gols',
                    data: [golsHT.casa, golsHT.fora, golsST.casa, golsST.fora],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                }
            ]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição de Gols por Tempo de Jogo'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}`;
                        }
                    }
                }
            }
        }
    };
}

// Função para gerar gráfico de comparação de times
function generateTeamComparisonChart() {
    // Coletar estatísticas por time
    const teams = {};
    const allTeams = [];
    
    // Extrair todos os times únicos e inicializar suas estatísticas
    notes.forEach(note => {
        if (!note.teamName || !note.teamName.includes('vs')) return;
        
        const [teamA, teamB] = note.teamName.split(' vs ');
        
        if (!allTeams.includes(teamA)) allTeams.push(teamA);
        if (!allTeams.includes(teamB)) allTeams.push(teamB);
        
        // Inicializar estatísticas se ainda não existirem
        if (!teams[teamA]) {
            teams[teamA] = { jogos: 0, vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0 };
        }
        
        if (!teams[teamB]) {
            teams[teamB] = { jogos: 0, vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0 };
        }
        
        // Contar estatísticas para cada jogo
        if (note.ftScore && note.ftScore.includes('-')) {
            const [homeGoals, awayGoals] = note.ftScore.split('-').map(Number);
            
            // Contabilizar para o time A (casa)
            teams[teamA].jogos++;
            teams[teamA].golsPro += homeGoals;
            teams[teamA].golsContra += awayGoals;
            
            if (homeGoals > awayGoals) teams[teamA].vitorias++;
            else if (homeGoals < awayGoals) teams[teamA].derrotas++;
            else teams[teamA].empates++;
            
            // Contabilizar para o time B (fora)
            teams[teamB].jogos++;
            teams[teamB].golsPro += awayGoals;
            teams[teamB].golsContra += homeGoals;
            
            if (homeGoals < awayGoals) teams[teamB].vitorias++;
            else if (homeGoals > awayGoals) teams[teamB].derrotas++;
            else teams[teamB].empates++;
        }
    });
    
    // Limitar para os 5 times com mais jogos para não sobrecarregar o gráfico
    const topTeams = allTeams
        .sort((a, b) => (teams[b]?.jogos || 0) - (teams[a]?.jogos || 0))
        .slice(0, 5);
    
    // Preparar dados para o gráfico
    const datasets = [
        {
            label: 'Vitórias',
            data: topTeams.map(team => teams[team].vitorias),
            backgroundColor: 'rgba(75, 192, 192, 0.7)'
        },
        {
            label: 'Empates',
            data: topTeams.map(team => teams[team].empates),
            backgroundColor: 'rgba(153, 102, 255, 0.7)'
        },
        {
            label: 'Derrotas',
            data: topTeams.map(team => teams[team].derrotas),
            backgroundColor: 'rgba(255, 99, 132, 0.7)'
        },
        {
            label: 'Gols Pró',
            data: topTeams.map(team => teams[team].golsPro),
            backgroundColor: 'rgba(54, 162, 235, 0.7)'
        }
    ];
    
    return {
        type: 'bar',
        data: {
            labels: topTeams,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Comparação de Desempenho por Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Times'
                    }
                }
            }
        }
    };
}

// Função para gerar gráfico de análise combinada
function generateCombinedAnalysisChart() {
    // Combinação de várias métricas em um gráfico único
    // Acertos de palpites por resultado de jogo
    
    const data = {
        'Vitória Casa': { acertos: 0, erros: 0 },
        'Empate': { acertos: 0, erros: 0 },
        'Vitória Fora': { acertos: 0, erros: 0 }
    };
    
    const golsMarcados = {
        'HT': 0,
        'FT': 0,
        'Total': 0
    };
    
    notes.forEach(note => {
        if (!note.ftScore || !note.ftScore.includes('-')) return;
        
        // Determinar resultado da partida
        const [home, away] = note.ftScore.split('-').map(Number);
        let resultado;
        
        if (home > away) resultado = 'Vitória Casa';
        else if (home < away) resultado = 'Vitória Fora';
        else resultado = 'Empate';
        
        // Verificar acerto do palpite
        const status = checkPredictionResult(note.prediction, note.ftScore);
        
        // Incrementar contadores
        if (status === 'Green') data[resultado].acertos++;
        else if (status === 'Red') data[resultado].erros++;
        
        // Contar gols
        golsMarcados.Total += home + away;
        
        // Contar gols HT se disponível
        if (note.htScore && note.htScore.includes('-')) {
            const [htHome, htAway] = note.htScore.split('-').map(Number);
            golsMarcados.HT += htHome + htAway;
        }
    });
    
    // Calcular gols do segundo tempo
    golsMarcados.FT = golsMarcados.Total - golsMarcados.HT;
    
    return {
        type: 'polarArea',
        data: {
            labels: [
                'Acertos Casa', 'Erros Casa', 
                'Acertos Empate', 'Erros Empate',
                'Acertos Fora', 'Erros Fora',
                'Gols 1º Tempo', 'Gols 2º Tempo'
            ],
            datasets: [{
                data: [
                    data['Vitória Casa'].acertos,
                    data['Vitória Casa'].erros,
                    data['Empate'].acertos,
                    data['Empate'].erros,
                    data['Vitória Fora'].acertos,
                    data['Vitória Fora'].erros,
                    golsMarcados.HT,
                    golsMarcados.FT
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Análise Combinada'
                }
            }
        }
    };
}

// Funções para selecionar o primeiro gol com botões
function selectFirstGoalTime(button) {
    // Remove a classe ativa de todos os botões de tempo
    document.querySelectorAll('.time-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona classe ativa ao botão clicado
    button.classList.add('active');
    
    // Atualiza o valor no campo hidden
    document.getElementById('firstGoalTime').value = button.getAttribute('data-value');
}

function selectFirstGoalTeam(button) {
    // Remove a classe ativa de todos os botões de equipe
    document.querySelectorAll('.team-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona classe ativa ao botão clicado
    button.classList.add('active');
    
    // Atualiza o valor no campo hidden
    document.getElementById('firstGoalTeam').value = button.getAttribute('data-value');
}

// Variável global para armazenar o índice da nota sendo editada
let editingNoteIndex = -1;

// Função para editar uma nota
function editNote(index) {
    const note = notes[index];
    editingNoteIndex = index;

    // Separar os nomes dos times
    const [teamA, teamB] = note.teamName.split(' vs ');
    
    // Preencher os campos do formulário
    document.getElementById('teamNameA').value = teamA;
    document.getElementById('teamNameB').value = teamB;
    document.getElementById('prediction').value = note.prediction;
    
    // Separar os placares
    const [ftScoreHome, ftScoreAway] = note.ftScore.split('-');
    const [htScoreHome, htScoreAway] = note.htScore.split('-');

    // Corrigido para usar textContent para os spans de placar
    document.getElementById('ftScoreHome').textContent = ftScoreHome;
    document.getElementById('ftScoreAway').textContent = ftScoreAway;
    document.getElementById('htScoreHome').textContent = htScoreHome;
    document.getElementById('htScoreAway').textContent = htScoreAway;

    // Separar informações do primeiro gol
    const [firstGoalTime, firstGoalTeam] = note.firstGoal.split(' | ');
    
    // Atualizar os botões de primeiro gol
    document.querySelectorAll('.time-button').forEach(btn => {
        if (btn.getAttribute('data-value') === firstGoalTime) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.team-button').forEach(btn => {
        if (btn.getAttribute('data-value') === firstGoalTeam) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    document.getElementById('firstGoalTime').value = firstGoalTime;
    document.getElementById('firstGoalTeam').value = firstGoalTeam;
    
    // Atualizar a data
    document.getElementById('datetime').value = note.datetime;
    
    // Mudar o texto do botão de adicionar
    const addButton = document.querySelector('.add-button');
    addButton.textContent = 'Atualizar';

    // Rolar até o formulário (corrigido para .form-container)
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Função para deletar uma nota
function deleteNote(index) {
    if (confirm('Tem certeza que deseja excluir esta anotação?')) {
        notes.splice(index, 1);
        saveNotesToStorage();
        renderNotes();
        updateCounters();
    }
}

// Função para inicializar o select de prediction
function initializePredictionSelect() {
    const predictionSelect = document.getElementById('prediction');
    predictionSelect.innerHTML = `
        <option value="BTTS">BTTS</option>
        <option value="Vitória">Vitória</option>
        <option value="Empate">Empate</option>
        <option value="Derrota">Derrota</option>
    `;
    predictionSelect.value = 'BTTS';
}

// Função para controlar a visibilidade do menu de filtros
function toggleFilterMenu() {
    const filterMenu = document.getElementById('filterMenuContainer');
    if (filterMenu) {
        filterMenu.classList.toggle('visible');
    }
}

// Navegação entre tabs do modal de IA e Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Remover qualquer elemento de paginação existente
    const paginationElement = document.querySelector('.pagination');
    if (paginationElement) {
        paginationElement.remove();
    }
    
    // Setup das abas da IA
    const tabs = document.querySelectorAll('.ia-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to current tab
            this.classList.add('active');
            
            // Hide all tab contents
            document.querySelectorAll('.ia-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });
    
    // Expandir as opções de tipos de gráficos
    const chartTypeSelect = document.getElementById('chartType');
    if (chartTypeSelect) {
        chartTypeSelect.innerHTML = `
            <option value="prediction">Distribuição de Palpites</option>
            <option value="firstGoal">Análise do Primeiro Gol</option>
            <option value="scoreAnalysis">Análise de Placar</option>
            <option value="predictionAccuracy">Taxa de Acerto de Palpites</option>
            <option value="timeScoring">Gols por Tempo de Jogo</option>
            <option value="teamComparison">Comparação de Desempenho</option>
            <option value="combinedAnalysis">Análise Combinada</option>
        `;
    }
    
    // Definir a data atual no campo de data/hora
    document.getElementById('datetime').value = new Date().toISOString().slice(0, 16);
    
    // Carregar anotações do armazenamento
    loadNotesFromStorage();
    
    // Inicializar select de prediction com BTTS como padrão
    initializePredictionSelect();
    
    // Carregar dados de demonstração se não houver dados
    loadDemoData();
    
    // Renderizar as anotações iniciais
    renderNotes();

    // Observar mudanças no DOM para remover paginação se for recriada
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // Verifica se o nó adicionado é um elemento e tem a classe 'pagination'
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('pagination')) {
                    console.log('Elemento de paginação detectado e removido dinamicamente.');
                    node.remove();
                }
            });
        });
    });

    // Observa o body e seus descendentes
    observer.observe(document.body, {
        childList: true, // Observa adição/remoção de filhos diretos
        subtree: true    // Observa todos os descendentes
    });
    
    // Atualizar o filtro de palpites também
    updateFilterPredictionOptions();
    
    // Atualizar contadores
    updateCounters();
    
    // Restaurar estado da lista de notas
    restoreNotesListState();
    
    // Load theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.dataset.theme = 'dark';
    }

    // Adicionar event listener para o botão do menu de filtros
    const toggleFilterBtn = document.getElementById('toggleFilterMenuBtn');
    if (toggleFilterBtn) {
        toggleFilterBtn.addEventListener('click', toggleFilterMenu);
    }
});
