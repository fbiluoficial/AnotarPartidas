// Função para alternar o tema
function toggleTheme() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
}

// Função para aplicar filtros
function applyFilters() {
    const teamFilter = document.getElementById('filterTeam').value.toLowerCase();
    const predictionFilter = document.getElementById('filterPrediction').value;
    
    const filteredNotes = notes.filter(note => {
        const teamMatch = note.teamName.toLowerCase().includes(teamFilter);
        const predictionMatch = predictionFilter === '' || note.prediction === predictionFilter;
        return teamMatch && predictionMatch;
    });
    
    renderNotes(filteredNotes);
    updateCounters(); // Atualizar contadores após aplicar filtros
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
    const ftScoreHome = document.getElementById('ftScoreHome').value;
    const ftScoreAway = document.getElementById('ftScoreAway').value;
    const htScoreHome = document.getElementById('htScoreHome').value;
    const htScoreAway = document.getElementById('htScoreAway').value;
    const firstGoalTime = document.getElementById('firstGoalTime').value;
    const firstGoalTeam = document.getElementById('firstGoalTeam').value;
    const datetime = document.getElementById('datetime').value;
    
    const note = {
        teamName: `${teamNameA} vs ${teamNameB}`,
        prediction,
        ftScore: `${ftScoreHome}-${ftScoreAway}`,
        htScore: `${htScoreHome}-${htScoreAway}`,
        firstGoal: `${firstGoalTime} | ${firstGoalTeam}`,
        datetime
    };
    
    if (editingNoteIndex >= 0) {
        // Atualizar nota existente
        notes[editingNoteIndex] = note;
        editingNoteIndex = -1;
        document.querySelector('.add-button').textContent = 'Adicionar';
    } else {
        // Adicionar nova nota
        notes.push(note);
    }
    
    saveNotesToStorage();
    renderNotes();
    updateCounters();
    
    // Remover classes ativas dos botões
    document.querySelectorAll('.time-button, .team-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Limpar campos do formulário
    document.getElementById('teamNameA').value = '';
    document.getElementById('teamNameB').value = '';
    document.getElementById('prediction').value = '';
    document.getElementById('ftScoreHome').value = '';
    document.getElementById('ftScoreAway').value = '';
    document.getElementById('htScoreHome').value = '';
    document.getElementById('htScoreAway').value = '';
    document.getElementById('firstGoalTime').value = '';
    document.getElementById('firstGoalTeam').value = '';
    document.getElementById('datetime').value = '';
}

// Função para renderizar as anotações
function renderNotes(filteredNotes = notes) {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    
    filteredNotes.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        
        noteItem.innerHTML = `
            <span>${note.teamName}</span>
            <span>${note.prediction}</span>
            <span>${note.ftScore}</span>
            <span>${note.htScore}</span>
            <span>${note.firstGoal}</span>
            <span>${note.datetime}</span>
            <span class="action-buttons-container">
                <button class="edit-btn" onclick="editNote(${index})">Editar</button>
                <button class="delete-btn" onclick="deleteNote(${index})">Excluir</button>
            </span>
        `;
        
        notesList.appendChild(noteItem);
    });
}

// Função para salvar anotações no armazenamento local
function saveNotesToStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Função para carregar anotações do armazenamento local
function loadNotesFromStorage() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
        updateCounters(); // Atualizar contadores após carregar notas
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

    return {
        vitoriasCasaFT: `${vitoriasCasaFT}/${total} (${percentCasaFT}%)`,
        vitoriasForaFT: `${vitoriasForaFT}/${total} (${percentForaFT}%)`,
        vitoriasCasaHT: `${vitoriasCasaHT}/${total} (${percentCasaHT}%)`,
        vitoriasForaHT: `${vitoriasForaHT}/${total} (${percentForaHT}%)`,
        acertosGolsFT: `${jogosComGols}/${totalJogosComGols} (${percentGols}%)`
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
    const acertosCount = document.getElementById('acertosCount');
    const acertosPercent = document.getElementById('acertosPercent');
    
    const total = notes.length;
    const acertos = notes.filter(note => note.prediction === 'Vitória').length;
    const percent = total > 0 ? ((acertos / total) * 100).toFixed(1) : 0;
    
    totalCount.textContent = total;
    acertosCount.textContent = acertos;
    acertosPercent.textContent = `${percent}%`;

    // Atualizar estatísticas adicionais
    const stats = calcularEstatisticas();
    
    // Função auxiliar para atualizar elemento com cor baseada na porcentagem
    const atualizarElementoComCor = (elementId, valor) => {
        const elemento = document.getElementById(elementId);
        elemento.textContent = valor;
        const porcentagem = extrairPorcentagem(valor);
        elemento.style.color = porcentagem >= 90 ? '#06f03c' : '#ffffff';
    };

    // Atualizar cada estatística com a cor apropriada
    atualizarElementoComCor('vitoriasCasaFT', stats.vitoriasCasaFT);
    atualizarElementoComCor('vitoriasForaFT', stats.vitoriasForaFT);
    atualizarElementoComCor('vitoriasCasaHT', stats.vitoriasCasaHT);
    atualizarElementoComCor('vitoriasForaHT', stats.vitoriasForaHT);
    atualizarElementoComCor('acertosGolsFT', stats.acertosGolsFT);
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

// Função para adicionar nova opção de palpite
function addPredictionOption() {
    const newPrediction = document.getElementById('newPrediction').value;
    if (newPrediction) {
        predictionOptions.push(newPrediction);
        updatePredictionSelect();
        savePredictionOptionsToStorage();
        document.getElementById('newPrediction').value = '';
    }
}

// Função para atualizar o select de palpites
function updatePredictionSelect() {
    const predictionSelect = document.getElementById('prediction');
    predictionSelect.innerHTML = '<option value="">Selecione o palpite</option>';
    
    // Garantir que BTTS esteja nas opções
    if (!predictionOptions.includes('BTTS')) {
        predictionOptions.push('BTTS');
    }
    
    predictionOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        // Selecionar BTTS por padrão em novos registros
        if (option === 'BTTS') {
            optionElement.selected = true;
        }
        predictionSelect.appendChild(optionElement);
    });
}

// Função para salvar opções de palpites no armazenamento local
function savePredictionOptionsToStorage() {
    localStorage.setItem('predictionOptions', JSON.stringify(predictionOptions));
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
    
    document.getElementById('ftScoreHome').value = ftScoreHome;
    document.getElementById('ftScoreAway').value = ftScoreAway;
    document.getElementById('htScoreHome').value = htScoreHome;
    document.getElementById('htScoreAway').value = htScoreAway;
    
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
    
    // Rolar até o formulário
    document.querySelector('.form-row').scrollIntoView({ behavior: 'smooth' });
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

// Navegação entre tabs do modal de IA
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Inicialização
    // Definir a data atual no campo de data/hora
    document.getElementById('datetime').value = new Date().toISOString().slice(0, 16);
    
    // Carregar anotações do armazenamento
    loadNotesFromStorage();
    
    // Carregar opções de palpites do armazenamento
    const storedOptions = localStorage.getItem('predictionOptions');
    if (storedOptions) {
        predictionOptions = JSON.parse(storedOptions);
        updatePredictionSelect();
    }
    
    // Carregar dados de demonstração se não houver dados
    loadDemoData();
    
    // Renderizar as anotações iniciais
    renderNotes();
    
    // Atualizar o filtro de palpites também
    updateFilterPredictionOptions();
    
    // Inicializar paginação
    updatePagination();
    
    // Atualizar contadores
    updateCounters();
    
    // Load theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.dataset.theme = 'dark';
    }
});
