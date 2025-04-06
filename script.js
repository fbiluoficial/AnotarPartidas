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
    // Ativar a aba de exportação por padrão
    switchModalTab('export');
}

// Função para esconder o modal de exportação
function hideExportModal() {
    document.getElementById('exportOverlay').classList.remove('active');
    // Limpar status de importação ao fechar
    document.getElementById('importStatus').innerHTML = '';
    document.getElementById('importFile').value = '';
}

// Função para alternar entre as abas do modal
function switchModalTab(tabName) {
    // Remover classe active de todas as abas e conteúdos
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.modal-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ativar a aba selecionada
    const selectedTab = document.querySelector(`.modal-tab[onclick="switchModalTab('${tabName}')"]`);
    const selectedContent = document.getElementById(`${tabName}Tab`);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
    }
}

// Função para lidar com o botão de importação
function handleImportButton() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        document.getElementById('importStatus').innerHTML = `
            <div class="import-error">
                <h3>Erro</h3>
                <p>Por favor, selecione um arquivo Excel (.xlsx) para importar.</p>
            </div>
        `;
        return;
    }
    
    if (!file.name.endsWith('.xlsx')) {
        document.getElementById('importStatus').innerHTML = `
            <div class="import-error">
                <h3>Erro</h3>
                <p>O arquivo deve ser no formato Excel (.xlsx).</p>
            </div>
        `;
        return;
    }
    
    performImport(file);
}

// Função para realizar a exportação
function performExport() {
    const exportOption = document.querySelector('input[name="exportOption"]:checked').value;
    const filename = document.getElementById('filename').value || 'Anotacoes_Jogo';
    
    const dataToExport = exportOption === 'all' ? notes : filteredNotes;

    // Garantir que o ID seja a primeira coluna no Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport, {
        header: ['id', 'teamName', 'prediction', 'ftScore', 'htScore', 'firstGoal', 'firstGoalFTTime', 'datetime', 'status']
    });

    // Adicionar aviso sobre a coluna ID
    XLSX.utils.sheet_add_aoa(worksheet, [
        ['ATENÇÃO: NÃO MODIFIQUE A COLUNA ID!'],
        ['Esta coluna é usada para identificação interna dos registros.']
    ], { origin: -1 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Anotacoes');
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    hideExportModal();
}

// Função para realizar a importação
function performImport(file) {
    const reader = new FileReader();
    const statusDiv = document.getElementById('importStatus');
    
    reader.onload = function(e) {
        try {
            statusDiv.innerHTML = 'Processando arquivo...';
            
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const importedNotes = XLSX.utils.sheet_to_json(worksheet);

            // Criar mapa das notas atuais
            const currentNotesMap = new Map(notes.map(note => [note.id, note]));
            const importedIds = new Set();
            const mergedNotes = [];
            let updatedCount = 0;
            let newCount = 0;
            let skippedCount = 0;
            let invalidCount = 0;
            let deletedCount = 0;

            // Processar notas importadas
            importedNotes.forEach(importedNote => {
                // Pular linhas de aviso
                if (importedNote.id === 'ATENÇÃO: NÃO MODIFIQUE A COLUNA ID!') {
                    return;
                }

                // Validar nota importada
                if (!importedNote.id || !importedNote.teamName || !importedNote.datetime) {
                    console.warn('Nota inválida encontrada:', importedNote);
                    invalidCount++;
                    return;
                }

                importedIds.add(importedNote.id);

                // Verificar se a nota está marcada como excluída
                if (importedNote.status === 'deleted') {
                    if (currentNotesMap.has(importedNote.id)) {
                        deletedCount++;
                        currentNotesMap.delete(importedNote.id);
                    }
                    return;
                }

                if (currentNotesMap.has(importedNote.id)) {
                    // Atualizar nota existente
                    Object.assign(currentNotesMap.get(importedNote.id), importedNote);
                    updatedCount++;
                } else {
                    // Adicionar nova nota
                    mergedNotes.push(importedNote);
                    newCount++;
                }
            });

            // Manter notas que não foram importadas
            notes.forEach(note => {
                if (!importedIds.has(note.id)) {
                    mergedNotes.push(note);
                    skippedCount++;
                } else if (currentNotesMap.has(note.id)) {
                    mergedNotes.push(currentNotesMap.get(note.id));
                }
            });

            // Atualizar notas
            notes = sortNotesByDate(mergedNotes);
            saveNotesToStorage();
            renderNotes();
            updateCounters();

            // Exibir relatório
            statusDiv.innerHTML = `
                <div class="import-report">
                    <h3>Importação Concluída</h3>
                    <p>✅ ${updatedCount} notas atualizadas</p>
                    <p>➕ ${newCount} notas novas adicionadas</p>
                    <p>📝 ${skippedCount} notas mantidas sem alteração</p>
                    ${deletedCount > 0 ? `<p>🗑️ ${deletedCount} notas excluídas sincronizadas</p>` : ''}
                    ${invalidCount > 0 ? `<p>⚠️ ${invalidCount} notas inválidas ignoradas</p>` : ''}
                    <p>Total: ${mergedNotes.length} notas após importação</p>
                </div>
            `;
        } catch (error) {
            console.error('Erro na importação:', error);
            statusDiv.innerHTML = `
                <div class="import-error">
                    <h3>Erro na Importação</h3>
                    <p>❌ ${error.message}</p>
                    <p>Por favor, verifique se o arquivo está no formato correto.</p>
                </div>
            `;
        }
    };

    reader.onerror = function() {
        statusDiv.innerHTML = `
            <div class="import-error">
                <h3>Erro na Leitura do Arquivo</h3>
                <p>❌ Não foi possível ler o arquivo.</p>
            </div>
        `;
    };

    statusDiv.innerHTML = 'Lendo arquivo...';
    reader.readAsArrayBuffer(file);
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

// Função para selecionar o momento do primeiro gol FT
function selectFirstGoalFTTime(button) {
    // Remove active class somente dos botões do grupo específico do Momento do 1º Gol FT
    button.closest('.first-goal-section').querySelectorAll('.time-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona active class ao botão selecionado
    button.classList.add('active');
    
    // Atualiza o valor do input hidden
    document.getElementById('firstGoalFTTime').value = button.dataset.value;
}

// Função para adicionar ou atualizar uma anotação
function addOrUpdateNote() {
    const teamNameA = document.getElementById('teamNameA').value.trim();
    const teamNameB = document.getElementById('teamNameB').value.trim();
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

    // Determinar o valor de firstGoal
    let firstGoalValue;
    if (firstGoalTeam === 'Nenhum') {
        firstGoalValue = 'N/A | Nenhum';
    } else if (firstGoalTime && firstGoalTeam) {
        firstGoalValue = `${firstGoalTime} | ${firstGoalTeam}`;
    } else {
        firstGoalValue = 'Aguardando';
    }

    const gameData = {
        teamName: `${teamNameA} vs ${teamNameB}`,
        prediction,
        ftScore: `${ftScoreHome}-${ftScoreAway}`,
        htScore: `${htScoreHome}-${htScoreAway}`,
        firstGoal: firstGoalValue,
        firstGoalFTTime: document.getElementById('firstGoalTeam').value === 'Nenhum' ? '' : document.getElementById('firstGoalFTTime').value,
        datetime,
        status: 'active'
    };

    if (editingNoteIndex >= 0 && editingNoteIndex < notes.length) {
        // Atualizar nota existente - Manter o ID original
        gameData.id = notes[editingNoteIndex].id;
        notes[editingNoteIndex] = gameData;
        console.log('Atualizando nota:', gameData);
    } else {
        // Adicionar nova nota - Gerar novo ID
        gameData.id = crypto.randomUUID();
        notes.push(gameData);
        console.log('Adicionando nova nota:', gameData);
    }

    // Ordenar notas por data após adicionar/atualizar
    notes = sortNotesByDate(notes);
    
    saveNotesToStorage();
    renderNotes(notes);
    updateCounters();
    
    // Limpar formulário e estados
    resetForm();
    editingNoteIndex = -1;
    document.querySelector('.add-button').textContent = 'Adicionar';
    
    // Rolar até o card atualizado depois de um breve delay
    setTimeout(() => {
        const cards = document.querySelectorAll('.game-card');
        if (cards.length > 0) {
            cards[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
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
    document.getElementById('firstGoalFTTime').value = '';

    // Limpar seleção dos botões do primeiro gol (HT/FT)
    document.querySelectorAll('.first-goal-group:first-child .time-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Limpar seleção dos botões de time
    document.querySelectorAll('.team-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Limpar seleção dos botões do Momento do 1º Gol FT
    document.querySelectorAll('.first-goal-section:nth-of-type(2) .time-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Remover a classe disabled-section de todas as seções
    const timeButtons = document.querySelector('.first-goal-group:first-child');
    const firstGoalFTSection = document.querySelector('.first-goal-section:nth-of-type(2)');
    timeButtons.classList.remove('disabled-section');
    firstGoalFTSection.classList.remove('disabled-section');

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
            // Extrair informação do primeiro gol de forma segura
            let displayValue = '-';
            if (note.firstGoal === 'Aguardando') {
                displayValue = 'Aguardando';
            } else if (note.firstGoal && note.firstGoal.includes('|')) {
                const parts = note.firstGoal.split('|');
                displayValue = parts.length > 1 ? parts[1].trim() : '-';
            }

            const gameData = {
                match: note.teamName,
                prediction: note.prediction,
                ft: note.ftScore,
                ht: note.htScore,
                firstGoalMinute: displayValue,
                firstGoalFTTime: note.firstGoalFTTime,
                dateTime: note.datetime
            };
            
            const card = createGameCard(gameData);
            if (!card.classList.contains('game-card')) {
                console.error('O elemento criado não possui a classe "game-card". Verifique a função createGameCard.');
            }
            notesList.appendChild(card);
        } catch (error) {
            console.error(`Erro ao renderizar nota ${index}:`, error, note);
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
            
            // Verificar e adicionar IDs para notas que não possuem
            let needsSave = false;
            notes = notes.map(note => {
                if (!note.id) {
                    note.id = crypto.randomUUID();
                    needsSave = true;
                }
                return note;
            });

            if (needsSave) {
                console.log('Adicionando IDs únicos para notas existentes');
                localStorage.setItem('notes', JSON.stringify(notes));
            }
            
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
        acertosGolsFT: '0/0 (0%)',
        predicaoOver05HTOver15FT: '0/0 (0%)',
        predicaoHT2FT05: '0/0 (0%)',
        firstGoalBefore75: '0/0 (0%)',
        firstGoalAfter75: '0/0 (0%)'
    };

    // Contadores FT
    let vitoriasCasaFT = 0;
    let vitoriasForaFT = 0;
    
    // Contadores HT
    let vitoriasCasaHT = 0;
    let vitoriasForaHT = 0;
    let over05HT_over15FT_total = 0;
    let over05HT_over15FT_sucesso = 0;
    let empatesHT = 0; // Contador para empates HT
    let ht2ft05_total = 0; // Contador para HT 2+ -> FT 0.5+
    let ht2ft05_sucesso = 0;
    // Contadores de gols e momentos
    let golsAntes75 = 0;
    let golsApos75 = 0;
    let totalGolsFTMomento = 0;
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

            // Análise para Over 0.5 HT -> Over 1.5 FT
            if (note.htScore && note.htScore.includes('-')) {
                const [golsCasaHT, golsForaHT] = note.htScore.split('-').map(Number);
                const totalGolsHT = golsCasaHT + golsForaHT;
                const totalGolsFT = golsCasaFT + golsForaFT;
                const golsSegundoTempo = totalGolsFT - totalGolsHT;

                // Análise Over 0.5 HT -> Over 1.5 FT
                if (totalGolsHT > 0) {
                    over05HT_over15FT_total++;
                    if (totalGolsFT > 1) {
                        over05HT_over15FT_sucesso++;
                    }
                }

                // Análise HT 2+ -> FT 0.5+
                if (totalGolsHT >= 2) {
                    ht2ft05_total++;
                    if (golsSegundoTempo >= 1) {
                        ht2ft05_sucesso++;
                    }
                }
            }
        }

        // Análise HT (Primeiro Tempo)
        if (note.htScore && note.htScore.includes('-')) {
            const [golsCasaHT, golsForaHT] = note.htScore.split('-').map(Number);
            
            // Contagem de vitórias HT
            if (golsCasaHT > golsForaHT) vitoriasCasaHT++;
            if (golsForaHT > golsCasaHT) vitoriasForaHT++;
            if (golsCasaHT === golsForaHT) empatesHT++; // Incrementa em caso de empate HT
        }
    });

    // Cálculo das porcentagens
    const percentCasaFT = ((vitoriasCasaFT / total) * 100).toFixed(1);
    const percentForaFT = ((vitoriasForaFT / total) * 100).toFixed(1);
    const percentCasaHT = ((vitoriasCasaHT / total) * 100).toFixed(1);
    const percentForaHT = ((vitoriasForaHT / total) * 100).toFixed(1);
    const percentEmpatesHT = ((empatesHT / total) * 100).toFixed(1); // Calcula porcentagem de empates HT
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

    // Contar gols antes/depois do minuto 75
    notes.forEach(note => {
        if (note.firstGoalTeam !== 'Nenhum' && note.firstGoalFTTime) {
            totalGolsFTMomento++;
            if (note.firstGoalFTTime === 'before75') {
                golsAntes75++;
            } else if (note.firstGoalFTTime === 'after75') {
                golsApos75++;
            }
        }
    });

    // Calcular porcentagens dos momentos dos gols
    const percentAntes75 = totalGolsFTMomento > 0 ? ((golsAntes75 / totalGolsFTMomento) * 100).toFixed(1) : 0;
    const percentApos75 = totalGolsFTMomento > 0 ? ((golsApos75 / totalGolsFTMomento) * 100).toFixed(1) : 0;

    return {
        vitoriasCasaFT: `${vitoriasCasaFT}/${total} (${percentCasaFT}%)`,
        vitoriasForaFT: `${vitoriasForaFT}/${total} (${percentForaFT}%)`,
        vitoriasCasaHT: `${vitoriasCasaHT}/${total} (${percentCasaHT}%)`,
        vitoriasForaHT: `${vitoriasForaHT}/${total} (${percentForaHT}%)`,
        empatesHT: `${empatesHT}/${total} (${percentEmpatesHT}%)`,
        acertosGolsFT: `${jogosComGols}/${totalJogosComGols} (${percentGols}%)`,
        totalVitoriasFT: `${totalVitoriasFT}/${total} (${percentTotalVitoriasFT}%)`,
        bttsSim: `${bttsSim}/${bttsTotal} (${percentBTTSSim}%)`,
        bttsNao: `${bttsTotal - bttsSim}/${bttsTotal} (${percentBTTSNao}%)`,
        predicaoOver05HTOver15FT: `${over05HT_over15FT_sucesso}/${over05HT_over15FT_total} (${over05HT_over15FT_total > 0 ? ((over05HT_over15FT_sucesso/over05HT_over15FT_total) * 100).toFixed(1) : 0}%)`,
        predicaoHT2FT05: `${ht2ft05_sucesso}/${ht2ft05_total} (${ht2ft05_total > 0 ? ((ht2ft05_sucesso/ht2ft05_total) * 100).toFixed(1) : 0}%)`,
        firstGoalBefore75: `${golsAntes75}/${totalGolsFTMomento} (${percentAntes75}%)`,
        firstGoalAfter75: `${golsApos75}/${totalGolsFTMomento} (${percentApos75}%)`
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

    // Atualizar estatísticas
    const stats = calcularEstatisticas();

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

    // Atualizar todas as estatísticas
    atualizarElementoComProgresso('vitoriasCasaFT', stats.vitoriasCasaFT);
    atualizarElementoComProgresso('vitoriasForaFT', stats.vitoriasForaFT);
    atualizarElementoComProgresso('vitoriasCasaHT', stats.vitoriasCasaHT);
    atualizarElementoComProgresso('vitoriasForaHT', stats.vitoriasForaHT);
    atualizarElementoComProgresso('empatesHT', stats.empatesHT);
    atualizarElementoComProgresso('acertosGolsFT', stats.acertosGolsFT);
    atualizarElementoComProgresso('totalVitoriasFT', stats.totalVitoriasFT);
    atualizarElementoComProgresso('bttsSim', stats.bttsSim);
    atualizarElementoComProgresso('bttsNao', stats.bttsNao);
    atualizarElementoComProgresso('predicaoOver05HTOver15FT', stats.predicaoOver05HTOver15FT);
    atualizarElementoComProgresso('predicaoHT2FT05', stats.predicaoHT2FT05);
    atualizarElementoComProgresso('firstGoalBefore75', stats.firstGoalBefore75);
    atualizarElementoComProgresso('firstGoalAfter75', stats.firstGoalAfter75);

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

    // Ordenar e reorganizar cards
    cardScores.sort((a, b) => b.score - a.score);
    const statsGrid = document.querySelector('.stats-grid');
    statsCards.forEach(card => card.classList.add('reordering'));
    
    setTimeout(() => {
        cardScores.forEach(({ card }) => {
            statsGrid.appendChild(card);
        });
        
        setTimeout(() => {
            statsCards.forEach(card => card.classList.remove('reordering'));
        }, 300);
    }, 50);
}

// Função para criar um card de jogo
function checkBTTS(ftScore) {
    if (!ftScore || !ftScore.includes('-') || ftScore === 'Aguardando') return false;
    const [homeGoals, awayGoals] = ftScore.split('-').map(Number);
    return homeGoals > 0 && awayGoals > 0;
}

function createGameCard(gameData) {
    const card = document.createElement('div');
    card.className = 'bg-card-bg rounded-lg shadow-md p-3 game-card';

    const hasBTTS = checkBTTS(gameData.ft);
    const bttsClass = hasBTTS ? 'btts-green-badge' : 'btts-red-text';
    const bttsText = hasBTTS ? 'GREEN' : 'RED';

    const formattedDate = formatDateTime(gameData.dateTime).split(' ')[0];

    let firstGoalDisplay = 'N/A';
    if (gameData.firstGoalMinute && gameData.firstGoalMinute !== 'Nenhum' && gameData.firstGoalMinute !== 'Aguardando') {
        const parts = gameData.firstGoalMinute.split('|');
        firstGoalDisplay = parts.length > 1 ? parts[1].trim() : gameData.firstGoalMinute.trim();
    } else if (gameData.firstGoalMinute === 'Aguardando') {
        firstGoalDisplay = 'Aguardando';
    }

    // Calcula a predição de HT usando a nova função
    const htPrediction = checkOverHalfTimePrediction(gameData.ht);
    
    // Formatar texto do momento do primeiro gol FT
    let firstGoalFTDisplay = '';
    if (gameData.firstGoalFTTime === 'before75') {
        firstGoalFTDisplay = 'Antes do 75\'';
    } else if (gameData.firstGoalFTTime === 'after75') {
        firstGoalFTDisplay = 'Após o 75\'';
    }

    card.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-base font-semibold">${gameData.match}</h2>
            <span class="text-xs text-gray-400">${formattedDate}</span>
        </div>
        <div class="grid grid-cols-2 gap-1 stat-grid text-xs mb-2">
            <div class="bg-stat-box-bg p-1.5 rounded text-center">
                <span class="text-[0.6rem]">BTTS</span>
                <span class="${bttsClass}">${bttsText}</span>
            </div>
            <div class="bg-stat-box-bg p-1.5 rounded text-center">
                <span class="text-[0.6rem]">FT</span>
                <span class="font-semibold">${gameData.ft}</span>
            </div>
            <div class="bg-stat-box-bg p-1.5 rounded text-center">
                <span class="text-[0.6rem]">HT</span>
                <span class="font-semibold">${gameData.ht}</span>
            </div>
            <div class="bg-stat-box-bg p-1.5 rounded text-center">
                <span class="text-[0.6rem]">HT Pred.</span>
                <span class="font-semibold">${htPrediction}</span>
            </div>
            <div class="bg-stat-box-bg p-1.5 rounded text-center">
                <span class="text-[0.6rem]">1º GOL</span>
                <span class="font-semibold">${firstGoalDisplay}</span>
            </div>
            <div class="bg-stat-box-bg p-1.5 rounded text-center">
                <span class="text-[0.6rem]">Momento 1º Gol FT</span>
                <span class="font-semibold">${firstGoalFTDisplay}</span>
            </div>
        </div>
        <div class="buttons-container">
            <button class="card-button edit-button" onclick="handleEditGameCard(this)">
                Editar
            </button>
            <button class="card-button delete-button" onclick="handleDeleteGameCard(this)">
                Excluir
            </button>
        </div>
    `;
    return card;
}

function checkOverHalfTimePrediction(htScore) {
    if (typeof htScore !== 'string' || !htScore || htScore === 'Aguardando') {
        return '-';
    }

    if (!htScore.includes('-')) {
        return '-';
    }

    const scores = htScore.split('-');
    if (scores.length !== 2) {
        return '-';
    }

    const homeGoals = parseInt(scores[0]);
    const awayGoals = parseInt(scores[1]);

    if (isNaN(homeGoals) || isNaN(awayGoals) || homeGoals < 0 || awayGoals < 0) {
        return '-';
    }

    const totalGoalsHT = homeGoals + awayGoals;

    if (totalGoalsHT > 0) {
        return 'Chance Over 1.5 FT';
    } else {
        return '-';
    }
}
// Chave extra removida

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
    if (!card) {
        console.error('Card não encontrado para edição.');
        return;
    }
    
    const notesList = document.getElementById('notesList');
    const index = Array.from(notesList.children).indexOf(card);
    const gameData = notes[index];
    
    if (!gameData) {
        console.error('Dados do jogo não encontrados para o índice:', index);
        return;
    }
    
    // Preenche o formulário com os dados atuais
    const teamNames = gameData.teamName.split(' vs ');
    document.getElementById('teamNameA').value = teamNames[0] || '';
    document.getElementById('teamNameB').value = teamNames[1] || '';
    document.getElementById('prediction').value = gameData.prediction || 'BTTS';
    
    // Atualiza os placares (usando textContent para spans)
    const ftScores = gameData.ftScore.split('-');
    const htScores = gameData.htScore.split('-');
    
    document.getElementById('ftScoreHome').textContent = ftScores[0] || '0';
    document.getElementById('ftScoreAway').textContent = ftScores[1] || '0';
    document.getElementById('htScoreHome').textContent = htScores[0] || '0';
    document.getElementById('htScoreAway').textContent = htScores[1] || '0';
    
    // Processa primeiro gol
    const firstGoalParts = gameData.firstGoal ? gameData.firstGoal.split(' | ') : ['', ''];
    const firstGoalTime = firstGoalParts[0] || '';
    const firstGoalTeam = firstGoalParts[1] || '';
    
    // Atualiza os botões de primeiro gol
    document.querySelectorAll('.time-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-value') === firstGoalTime) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.team-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-value') === firstGoalTeam) {
            btn.classList.add('active');
        }
    });
    
    // Atualiza os campos hidden
    document.getElementById('firstGoalTime').value = firstGoalTime;
    document.getElementById('firstGoalTeam').value = firstGoalTeam;
    
    // Atualiza a data
    document.getElementById('datetime').value = gameData.datetime;
    
    // Marca o índice para atualização
    editingNoteIndex = index;
    document.querySelector('.add-button').textContent = 'Atualizar';
    
    // Rola a página até o formulário
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Função para excluir um card
// Função para verificar placares e atualizar estado da seção de tempo
function checkScoresAndUpdateTimeSection() {
    const ftHome = document.getElementById('ftScoreHome').textContent;
    const ftAway = document.getElementById('ftScoreAway').textContent;
    const htHome = document.getElementById('htScoreHome').textContent;
    const htAway = document.getElementById('htScoreAway').textContent;
    const selectedTeam = document.getElementById('firstGoalTeam').value;

    const isZeroZero = ftHome === '0' && ftAway === '0' && htHome === '0' && htAway === '0';
    const timeButtons = document.querySelector('.first-goal-group:first-child');

    if (selectedTeam === 'Nenhum' && isZeroZero) {
        timeButtons.classList.add('disabled-section');
        document.querySelectorAll('.time-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById('firstGoalTime').value = '';
    } else if (selectedTeam === 'Nenhum') {
        timeButtons.classList.remove('disabled-section');
    }
}

// Função para atualizar o placar
function updateScore(elementId, delta) {
    const el = document.getElementById(elementId);
    let val = parseInt(el.textContent || '0');
    val = Math.max(0, val + delta);
    el.textContent = val.toString();

    // Verifica os placares após cada atualização
    checkScoresAndUpdateTimeSection();
}

function handleDeleteGameCard(button) {
    const card = button.closest('.game-card');
    if (!card) {
        console.error('Card não encontrado para exclusão.');
        return;
    }
    const index = Array.from(card.parentElement.children).indexOf(card);
    
    if (index < 0 || index >= notes.length) {
        console.error('Índice inválido para exclusão:', index);
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        // Marcar a nota como excluída em vez de removê-la
        notes[index].status = 'deleted';
        // Remover da visualização
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
                firstGoalFTTime: 'before75',
                datetime: '2023-01-01T12:00'
            },
            {
                teamName: 'Time C vs Time D',
                prediction: 'Empate',
                ftScore: '1-1',
                htScore: '0-0',
                firstGoal: 'FT | Fora',
                firstGoalFTTime: 'after75',
                datetime: '2023-01-02T15:00'
            },
            {
                teamName: 'Time E vs Time F',
                prediction: 'BTTS',
                ftScore: '2-1',
                htScore: '1-1',
                firstGoal: 'HT | Casa',
                firstGoalFTTime: 'before75',
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
    const selectedTeam = button.getAttribute('data-value');
    document.getElementById('firstGoalTeam').value = selectedTeam;

    // Verifica se é "Nenhum" e os placares são 0-0
    const ftHome = document.getElementById('ftScoreHome').textContent;
    const ftAway = document.getElementById('ftScoreAway').textContent;
    const htHome = document.getElementById('htScoreHome').textContent;
    const htAway = document.getElementById('htScoreAway').textContent;

    const isZeroZero = ftHome === '0' && ftAway === '0' && htHome === '0' && htAway === '0';
    const timeButtons = document.querySelector('.first-goal-group:first-child');
    const firstGoalFTSection = document.querySelector('.first-goal-section:nth-of-type(2)');

    if (selectedTeam === 'Nenhum') {
        // Desabilita a seção de tempo do primeiro gol e do momento do gol FT
        timeButtons.classList.add('disabled-section');
        firstGoalFTSection.classList.add('disabled-section');
        
        // Limpa as seleções
        document.querySelectorAll('.time-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById('firstGoalTime').value = '';
        document.getElementById('firstGoalFTTime').value = '';
    } else {
        // Habilita ambas as seções
        timeButtons.classList.remove('disabled-section');
        firstGoalFTSection.classList.remove('disabled-section');
    }
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
    
    // Atualizar os botões de primeiro gol HT/FT
    document.querySelectorAll('.first-goal-group:first-child .time-button').forEach(btn => {
        if (btn.getAttribute('data-value') === firstGoalTime) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Atualizar os botões de time
    document.querySelectorAll('.team-button').forEach(btn => {
        if (btn.getAttribute('data-value') === firstGoalTeam) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Atualizar os botões do Momento do 1º Gol FT
    document.querySelectorAll('.first-goal-section:nth-of-type(2) .time-button').forEach(btn => {
        if (btn.getAttribute('data-value') === note.firstGoalFTTime) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    document.getElementById('firstGoalFTTime').value = note.firstGoalFTTime || '';

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

    // Setup do input de arquivo de importação
    const importFileInput = document.getElementById('importFile');
    const importFileLabel = document.querySelector('.import-file-label');
    
    if (importFileInput && importFileLabel) {
        importFileInput.addEventListener('change', function() {
            const fileName = this.files[0]?.name || 'Nenhum arquivo selecionado';
            importFileLabel.textContent = fileName;
            // Limpar status anterior
            document.getElementById('importStatus').innerHTML = '';
        });
    }
});
