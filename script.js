/* Estilos para o container de cards */
.cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
    position: relative;
    transition: all 0.3s ease;
}

/* Estilos para o botão de toggle */
.toggle-notes-btn {
    position: absolute;
    top: -40px;
    right: 0;
    background: transparent;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 0.9em;
    transition: all 0.3s ease;
}

#toggleIcon {
    transition: transform 0.3s ease;
  }
  
  :root {
    /* Dark Theme Variables (Originalmente em [data-theme="dark"]) */
    --bg-color: #121212;
    --text-color: #e0e0e0;
    --primary-color: #5C9CE6;
    --primary-color-rgb: 92, 156, 230; /* Ajustado para corresponder a #5C9CE6 */
    --header-bg: linear-gradient(135deg, #5C9CE6, #4882c2);
    --secondary-color: #64D2A8;
    --secondary-color-rgb: 100, 210, 168; /* Ajustado para corresponder a #64D2A8 */
    --warning-color: #FFA94D;
    --danger-color: #FF6B6B;
    --border-color: rgba(255, 255, 255, 0.05);
    --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    --form-bg: rgba(18, 18, 18, 0.95);
}

/* Estilos do Grid de Estatísticas */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
    padding: 15px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
    padding: 15px;
    transition: 0.3s ease;
}

.stats-card {
    background: var(--bg-color);
    border-radius: 16px;
    border: 1px solid var(--border-color);
    overflow: hidden;
    transition: all 0.5s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    opacity: 1;
}

.stats-card.reordering {
    transform: scale(0.98);
    opacity: 0.8;
}

.stats-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(var(--primary-color-rgb), 0.2);
}

/* ====== PLACAR FT/HT CUSTOM ====== */
.score-blocks-container {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 18px;
    padding-left: 8px;
    padding-right: 8px;
}
.score-block {
    background: #14181f;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    padding: 12px 0 18px 0;
    border: none;
    max-width: 420px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
}
.score-progress-bar {
    height: 6px;
    background: #222c44;
    border-radius: 4px;
    overflow: hidden;
    margin: 0 12px 0 12px;
}
.score-progress-bar > div {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg,#06f03c,#00ff44);
    transition: width 0.5s cubic-bezier(.4,2.3,.3,1);
}

@media (max-width: 500px) {
    .score-blocks-container {
        padding-left: 0;
        padding-right: 0;
        gap: 14px;
    }
    .score-block {
        max-width: 100vw;
        border-radius: 0;
        margin: 0;
        padding-left: 0;
        padding-right: 0;
    }
    .score-block-header {
        border-radius: 0;
        font-size: 1.03rem;
        padding: 9px 0 8px 0;
    }
    .score-block-row {
        flex-direction: column;
        gap: 10px;
        padding: 0 0 0 0;
    }
    .score-block-team {
        min-width: unset;
        width: 100%;
        justify-content: center;
        padding: 10px 0;
        border-radius: 0;
        font-size: 1em;
    }
    .score-btn {
        width: 38px;
        height: 38px;
        font-size: 1.2em;
        margin: 0 6px;
    }
    .score-value {
        font-size: 1.1em;
        padding: 2px 12px;
        min-width: 22px;
    }
}

.score-block-header {
    background: #00cfff;
    color: #222c44;
    font-weight: bold;
    font-size: 1.15rem;
    border-radius: 12px 12px 0 0;
    text-align: center;
    padding: 8px 0 7px 0;
    letter-spacing: 1px;
    margin-bottom: 12px;
}
.score-block-row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 32px;
}
.score-block-team {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #1a2336;
    padding: 10px 18px;
    border-radius: 8px;
    min-width: 130px;
    justify-content: center;
    box-shadow: 0 1px 5px rgba(0,0,0,0.06);
}
.score-block-label {
    font-weight: 600;
    color: #fff;
    margin: 0 5px 0 2px;
    font-size: 1.1em;
}
.score-btn {
    background: #222c44;
    color: #00cfff;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 1.35em;
    font-weight: bold;
    margin: 0 7px;
    transition: background 0.2s, color 0.2s, transform 0.1s;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.10);
    display: flex;
    align-items: center;
    justify-content: center;
}
.score-btn:hover {
    background: #00cfff;
    color: #14213d;
    transform: scale(1.09);
}
.score-value {
    background: #fff;
    color: #222c44;
    border-radius: 7px;
    padding: 2px 14px;
    font-size: 1.25em;
    font-weight: bold;
    min-width: 26px;
    text-align: center;
    margin: 0 2px;
    display: inline-block;
}
.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 4px;
}
.dot-casa {
    background: #00cfff;
}
.dot-fora {
    background: #ff2d7a;
}
/* ====== FIM PLACAR CUSTOM ====== */

/* Estilos para títulos de seção */
/* Estilo Futurista para o Título */
.cyber-title {
    position: relative;
    padding: 0.8em;
    margin: 1em auto;
    background: linear-gradient(
        135deg,
        rgba(var(--primary-color-rgb), 0.05) 0%,
        rgba(var(--secondary-color-rgb), 0.1) 100%
    );
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(var(--primary-color-rgb), 0.1);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    text-align: center;
    max-width: max-content;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cyber-title::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg,
        var(--primary-color),
        var(--secondary-color),
        #00ff8c,
        var(--primary-color)
    );
    border-radius: 14px;
    z-index: -1;
    animation: borderGlow 3s linear infinite;
    opacity: 0.5;
}

.cyber-title__text {
    font-size: clamp(1.2rem, 2.5vw, 1.6rem);
    font-weight: 600;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(var(--primary-color-rgb), 0.5);
    margin-right: 1em;
}

.cyber-title__tag {
    display: inline-flex;
    align-items: center;
    background: linear-gradient(
        90deg,
        rgba(var(--primary-color-rgb), 0.2),
        rgba(var(--secondary-color-rgb), 0.2)
    );
    padding: 0.3em 0.8em;
    border-radius: 20px;
    margin-left: 1em;
    box-shadow: 0 0 15px rgba(var(--primary-color-rgb), 0.2);
}

.cyber-title__count {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--secondary-color);
    margin-right: 0.3em;
    text-shadow: 0 0 8px rgba(var(--secondary-color-rgb), 0.6);
}

.cyber-title__label {
    font-size: 0.8em;
    color: var(--text-color);
    opacity: 0.8;
    letter-spacing: 1px;
}

.cyber-title__glitch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        45deg,
        transparent 0%,
        rgba(var(--primary-color-rgb), 0.1) 50%,
        transparent 100%
    );
    transform: translateX(-100%);
    animation: glitch 3s infinite;
}

@keyframes borderGlow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes glitch {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* Media Queries */
@media (max-width: 768px) {
    .cyber-title {
        padding: 0.6em;
        flex-direction: column;
        gap: 0.5em;
    }

    .cyber-title__text {
        margin-right: 0;
        margin-bottom: 0.5em;
    }

    .cyber-title__tag {
        margin-left: 0;
    }
}

@media (max-width: 480px) {
    .cyber-title {
        width: 90%;
        padding: 0.5em;
    }

    .cyber-title__text {
        font-size: clamp(1rem, 4vw, 1.2rem);
    }
}

.stats-card-header {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    padding: 15px;
    border-bottom: 1px solid var(--border-color);
}

.stats-card-header h3 {
    color: white;
    margin: 0;
    font-size: 1.1em;
    text-align: center;
}

.stats-card-content {
    padding: 20px;
    background: rgba(var(--primary-color-rgb), 0.05);
}

.stats-grid-inner {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.stats-item {
    background: var(--bg-color);
    padding: 15px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

.stats-value-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.stats-label {
    color: var(--text-color);
    font-weight: 600;
    font-size: 0.9em;
}

.stats-value {
    color: #06f03c;
    font-weight: bold;
}

.stats-progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(var(--primary-color-rgb), 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.stats-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    border-radius: 3px;
    transition: width 0.3s ease;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
        padding: 10px;
    }
    
    .stats-grid-inner {
        grid-template-columns: 1fr;
    }
    
    .stats-card {
        margin-bottom: 15px;
    }
    
    .stats-value-container {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 5px;
    }
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: all 0.3s ease;
}

.container {
    width: 95vw;
    margin: 0 auto;
    background: var(--bg-color);
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--card-shadow);
}

h1 {
    text-align: center;
    margin-bottom: 30px;
    color: var(--primary-color);
}

.filters {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    align-items: center;
}

.filters-title {
    width: 100%;
    margin-bottom: 10px;
    font-weight: bold;
}

.filters input, .filters select {
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    flex: 1;
    min-width: 180px;
    background-color: var(--bg-color);
    color: var(--text-color);
}

.action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.action-button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    color: white;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba(var(--primary-color-rgb), 0.25);
}

.action-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(var(--primary-color-rgb), 0.35);
    background: linear-gradient(45deg, var(--secondary-color), var(--primary-color));
}

.btn-filter {
    background-color: var(--primary-color);
    color: white;
}

.btn-export {
    background-color: var(--secondary-color);
    color: white;
}

.btn-export:hover, .btn-filter:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Removido .form-row e estilos associados */

.input-container { /* Mantido para compatibilidade, mas pode ser removido se não usado em outro lugar */
    width: 100%;
    background: rgba(var(--primary-color-rgb), 0.05);
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Removido .score-section antigo */

/* Removido .form-row:hover */

/* Removido .form-title antigo */

.form-group { /* Mantido para compatibilidade, mas pode ser removido se não usado em outro lugar */
    flex: 1;
    min-width: 280px;
    margin-bottom: 25px;
    position: relative;
    transition: transform 0.3s ease;
}

.form-group:hover { /* Mantido para compatibilidade */
    transform: translateY(-2px);
}

.form-label { /* Mantido para compatibilidade, mas sobrescrito por .form-section .form-label */
    display: block;
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 0.95em;
    color: var(--text-color);
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    opacity: 0.9;
}

/* Removido .form-row input, .form-row select e seus :focus */

/* Removido .score-section antigo */

.score-group { /* Mantido para compatibilidade, mas pode ser removido se não usado em outro lugar */
    padding: 15px;
    background: rgba(var(--primary-color-rgb), 0.03);
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
    width: 100%;
}

.score-inputs { /* Mantido para compatibilidade, mas pode ser removido se não usado em outro lugar */
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 15px;
    background: var(--bg-color);
    padding: 15px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}


.header-row {
    display: grid;
    grid-template-columns: 2fr 1fr 0.8fr 0.8fr 1fr 1.2fr 1fr;
    gap: 10px;
    padding: 10px;
    background-color: var(--header-bg);
    color: white;
    border-radius: 4px;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 0.95em;
}

.notes-list {
    margin-top: 15px;
    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
    max-height: 2000px;
    opacity: 1;
    overflow-y: auto; /* Alterado para permitir rolagem vertical */
    scrollbar-width: thin; /* Para Firefox */
    -ms-overflow-style: -ms-autohiding-scrollbar; /* Para IE e Edge */
}

.notes-list.minimized {
    max-height: 0;
    opacity: 0;
}
/* Estilos da barra de rolagem (WebKit - Chrome, Safari) */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 20px;
}

::-webkit-scrollbar-thumb {
    background: #6b7280;
    border-radius: 20px;
    border: 2px solid #1f2937;
}

::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

.toggle-notes-btn {
    transition: transform 0.3s ease;
    color: var(--warning-color) !important;
}

.toggle-notes-btn.minimized #toggleIcon {
    transform: rotate(-90deg);
}

.note-item {
    display: grid;
    grid-template-columns: 2fr 1fr 0.8fr 0.8fr 1fr 1.2fr 1fr;
    gap: 10px;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    align-items: center;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
    font-size: 0.9em;
}

/* Alinhamento de texto para cada coluna */
.header-row > span:nth-child(1),
.note-item > span:nth-child(1) {
    text-align: left;
}

.header-row > span:nth-child(2),
.note-item > span:nth-child(2) {
    text-align: center;
}

.header-row > span:nth-child(3),
.header-row > span:nth-child(4),
.note-item > span:nth-child(3),
.note-item > span:nth-child(4) {
    text-align: center;
    font-family: 'Consolas', monospace;
}

.header-row > span:nth-child(5),
.note-item > span:nth-child(5) {
    text-align: center;
}

.header-row > span:nth-child(6),
.note-item > span:nth-child(6) {
    text-align: center;
    font-size: 0.85em;
}

.note-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons-container {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
}

.delete-btn, .edit-btn, .duplicate-btn {
    padding: 6px 8px;
    cursor: pointer;
    border: none;
    border-radius: 3px;
    color: white;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 0.85em;
    min-width: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.delete-btn {
    background-color: var(--danger-color);
}

/* Estilos para o Card de Resultado do Jogo */
.game-card {
    width: 100%;
    max-width: 420px;
    margin: 15px auto;
    background: var(--bg-color);
    border-radius: 12px;
    padding: 20px;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--border-color);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(var(--primary-color-rgb), 0.15);
}

.game-card-header {
    text-align: center;
    margin-bottom: 20px;
}

.game-title {
    font-size: 1.5em;
    font-weight: bold;
    color: var(--text-color);
    margin: 0;
}

.game-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.game-info-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: rgba(var(--primary-color-rgb), 0.05);
    border-radius: 8px;
}

.game-info-item .info-label {
    font-weight: 600;
    color: var(--text-color);
    opacity: 0.8;
    margin-right: 8px;
}

.game-info-item .info-value {
    color: var(--text-color);
}

.btts-result {
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
}

.btts-green {
    background-color: #06f03c;
    color: white;
}

.btts-red {
    background-color: #FC5C65;
    color: white;
}

.game-info-item.date-time {
    grid-column: 1 / -1;
    justify-content: center;
}

.game-card-footer {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    margin-top: 15px;
}

.game-card-footer button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.game-card-footer .edit-btn {
    background: var(--warning-color);
    color: var(--bg-color);
}

.game-card-footer .delete-btn {
    background: var(--danger-color);
    color: var(--bg-color);
}

.game-card-footer button:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
}

.game-card-footer button:active {
    transform: translateY(0);
}

.edit-btn {
    background-color: var(--warning-color);
    color: #000;
}

.duplicate-btn {
    background-color: var(--secondary-color);
    color: white;
}

.delete-btn:hover, .edit-btn:hover, .duplicate-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.export-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease;
}

.export-overlay.active {
    visibility: visible;
    opacity: 1;
}

.export-modal {
    background-color: var(--bg-color);
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.export-modal h2 {
    margin-top: 0;
    color: var(--primary-color);
}

.export-options {
    margin: 20px 0;
}

.export-option {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.export-option input {
    margin-right: 10px;
}

.export-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
}

.export-filename {
    width: 100%;
    padding: 10px;
    margin: 15px 0;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--bg-color);
    color: var(--text-color);
}

.export-confirm-btn {
    background-color: var(--secondary-color);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.export-cancel-btn {
    background-color: var(--danger-color);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.export-progress {
    margin-top: 15px;
    display: none;
}

.export-progress-bar {
    height: 10px;
    background-color: #e9ecef;
    border-radius: 5px;
    overflow: hidden;
}

.export-progress-fill {
    height: 100%;
    background-color: var(--secondary-color);
    width: 0%;
    transition: width 0.3s ease;
}

.export-status {
    text-align: center;
    margin-top: 8px;
    font-weight: bold;
}

.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 25px;
    background-color: var(--secondary-color);
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
}

.notification.show {
    transform: translateY(0);
    opacity: 1;
}

/* Estilos para o modal de IA */
.ia-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease;
}

.ia-overlay.active {
    visibility: visible;
    opacity: 1;
}

.ia-modal {
    background-color: var(--bg-color);
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.ia-modal h2 {
    margin-top: 0;
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 10px;
}

.ia-modal h2 svg {
    width: 24px;
    height: 24px;
}

.ia-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 20px;
}

.ia-tab {
    padding: 10px 20px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    font-weight: bold;
}

.ia-tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
}

.ia-tab-content {
    display: none;
}

.ia-tab-content.active {
    display: block;
}

.ia-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.ia-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
}

.ia-button-primary {
    background-color: var(--primary-color);
    color: white;
}

.ia-button-cancel {
    background-color: var(--danger-color);
    color: white;
}

.ia-loading {
    text-align: center;
    padding: 20px;
    display: none;
}

.ia-loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left: 4px solid var(--primary-color);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.ia-report {
    background-color: rgba(0, 0, 0, 0.03);
    padding: 20px;
    border-radius: 4px;
    margin-top: 20px;
    white-space: pre-line;
    line-height: 1.5;
}

.ia-charts-container {
    width: 100%;
    min-height: 300px;
    margin-top: 20px;
}

.ai-btn {
    background-color: #8e44ad;
    color: white;
}

.ai-btn:hover {
    background-color: #7d3c98;
}

/* Responsividade */
@media (max-width: 768px) {
    .container {
        padding: 10px;
        margin: 10px;
        width: auto;
        border-radius: 4px;
    }

    .header-row {
        display: none;
    }
    
    .note-item {
        grid-template-columns: 1fr;
        padding: 15px;
    }
    
    .note-item span {
        padding: 5px 0;
        display: flex;
        justify-content: space-between;
    }
    
    .note-item span::before {
        content: attr(data-label);
        font-weight: bold;
        margin-right: 10px;
    }
    
    /* Ajustes para o novo formulário em telas menores */
    .form-container {
        max-width: 95%;
        padding: 15px;
    }

    .form-container input[type="text"],
    .form-container input[type="datetime-local"],
    .form-container select {
        padding: 10px;
        font-size: 0.9em;
    }

    .score-controls {
        flex-direction: column; /* Empilhar controles de placar */
        align-items: stretch;
    }

    .score-team {
        width: 100%;
    }

    .score-separator {
        display: none; /* Ocultar 'X' em telas pequenas */
    }

    .first-goal-controls {
        align-items: stretch;
    }

    .button-group {
        flex-wrap: wrap; /* Permitir que botões quebrem linha */
    }

    .time-button, .team-button {
        font-size: 0.85em;
        padding: 8px;
    }

    .add-button {
        padding: 12px 20px;
        font-size: 1em;
    }
    
    .filters {
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    
    .filters input, .filters select {
        min-width: 100%;
    }
    
    .action-buttons {
        justify-content: center;
    }
    
    .action-button {
        flex: 1;
    }
    
    .theme-toggle {
        top: 10px;
        right: 10px;
        padding: 8px 16px;
        font-size: 14px;
    }
    
    .export-modal {
        width: 95%;
        padding: 20px;
    }

    .ia-modal {
        width: 95%;
        padding: 15px;
    }
    
    .ia-tabs {
        flex-wrap: wrap;
    }
    
    .ia-tab {
        flex: 1;
        text-align: center;
        padding: 10px;
    }
    
    .ia-actions {
        flex-direction: column;
    }
    
    .ia-button {
        width: 100%;
    }
}

/* --- Estilos para o Formulário Reestruturado --- */

.form-container {
    background: var(--form-bg, rgba(18, 18, 18, 0.95)); /* Fundo escuro como na imagem */
    padding: 25px;
    border-radius: 12px;
    box-shadow: var(--card-shadow, 0 8px 32px rgba(0, 0, 0, 0.2));
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
    max-width: 450px; /* Largura similar à imagem */
    margin: 30px auto; /* Centralizar */
    color: var(--text-color, #e0e0e0); /* Cor do texto padrão */
}

.form-container .form-title {
    text-align: center;
    color: var(--text-color, #e0e0e0); /* Título branco/claro */
    font-size: 1.5em; /* Tamanho ajustado */
    margin-bottom: 25px;
    font-weight: bold;
}

.form-section {
    margin-bottom: 20px;
}

.form-section .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 0.9em;
    color: var(--text-color, #e0e0e0);
}

.form-container input[type="text"],
.form-container input[type="datetime-local"],
.form-container select {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.05); /* Fundo do input levemente transparente */
    color: var(--text-color, #e0e0e0);
    font-size: 1em;
    box-sizing: border-box; /* Para incluir padding/border na largura */
}

.form-container input[type="text"]::placeholder {
    color: rgba(224, 224, 224, 0.6); /* Placeholder mais claro */
}

/* Estilos específicos para Palpite */
.form-section-palpite .palpite-input-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-section-palpite select {
    flex-grow: 1; /* Select ocupa o espaço restante */
}

.btn-manage-predictions {
    padding: 8px 12px;
    background-color: #ff9800; /* Laranja como na imagem */
    color: #1a1a1a; /* Texto escuro para contraste */
    border: none;
    border-radius: 50%; /* Botão redondo */
    cursor: pointer;
    font-weight: bold;
    font-size: 1.1em;
    line-height: 1;
    width: 30px; /* Tamanho fixo */
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Estilos para Seções de Placar (FT e HT) */
.score-section {
    background-color: #1a2a45; /* Azul escuro */
    border-radius: 10px;
    padding: 0;
    margin-bottom: 20px;
    overflow: hidden;
}

.score-header {
    background-color: #00bcd4; /* Azul claro */
    color: #1a1a1a;
    text-align: center;
    padding: 8px;
    border-radius: 0;
    font-weight: bold;
    margin-bottom: 0;
    font-size: 0.9em;
    text-transform: uppercase;
}

.score-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 20px;
}

.score-team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.team-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.dot-casa {
    background-color: #00bcd4; /* Azul */
}

.dot-fora {
    background-color: #e91e63; /* Rosa */
}

.score-team label {
    font-size: 0.9em;
    font-weight: bold;
    text-transform: uppercase;
    color: white;
    letter-spacing: 0.5px;
}

.score-input {
    display: flex;
    align-items: center;
    gap: 8px;
}

.score-btn {
    background-color: #424242;
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 1.4em;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transition: all 0.2s ease;
}

.score-btn:hover {
    background-color: #616161;
    transform: translateY(-1px);
}

.score-value {
    background-color: #424242;
    color: white;
    font-size: 1.4em;
    font-weight: bold;
    min-width: 40px;
    padding: 4px 8px;
    text-align: center;
    border-radius: 4px;
}

.score-separator {
    font-size: 1.5em;
    font-weight: bold;
    color: var(--text-color, #e0e0e0);
}

/* Estilos para Seção Primeiro Gol */
.first-goal-section {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
}

.first-goal-header {
    background-color: #00bcd4; /* Mesmo azul ciano */
    color: #1a1a1a;
    text-align: center;
    padding: 8px;
    border-radius: 6px;
    font-weight: bold;
    margin-bottom: 15px;
    font-size: 0.9em;
    text-transform: uppercase;
}

.first-goal-controls {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.first-goal-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Estilos para form-group.mt-2 similar ao first-goal-group */
.form-group.mt-2 {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group.mt-2 label {
    font-size: 0.8em;
    font-weight: bold;
    color: var(--text-color, #e0e0e0);
}

.first-goal-group label {
    font-size: 0.8em;
    font-weight: bold;
    color: var(--text-color, #e0e0e0);
}

.button-group {
    display: flex;
    gap: 10px;
}

.time-button, .team-button {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-color, #e0e0e0);
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    text-align: center;
    transition: all 0.2s ease;
    font-size: 0.9em;
}

.time-button:hover, .team-button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.time-button.active, .team-button.active {
    background-color: var(--primary-color, #5C9CE6) !important; /* Cor primária quando ativo */
    color: white !important;
    border-color: var(--primary-color, #5C9CE6) !important;
}

/* Estilos para Data e Hora */
.form-container input[type="datetime-local"] {
    /* Estilos específicos se necessário, mas herda os gerais */
}

/* Estilos para Botão Adicionar */
.add-button-container {
    text-align: center;
    margin-top: 25px;
}

.add-button {
    background-color: #00bcd4; /* Azul ciano */
    color: #1a1a1a; /* Texto escuro */
    padding: 12px 30px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.1em;
    text-transform: uppercase;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

.add-button:hover {
    background-color: #00acc1; /* Tom mais escuro no hover */
    transform: translateY(-2px);
}

.add-button:active {
    transform: translateY(0);
}

/* --- Fim dos Estilos para o Formulário Reestruturado --- */

/* --- Estilos para o Menu de Filtros --- */

#toggleFilterMenuBtn {
    /* Pode herdar de .action-button, mas podemos adicionar algo específico se necessário */
    /* Exemplo: background-color: var(--warning-color); */
}

.filter-menu {
    display: none; /* Começa oculto */
    position: absolute; /* Ou relative, dependendo do contexto */
    top: 100%; /* Posiciona abaixo do botão (ajustar conforme necessário) */
    left: 0; /* Alinha com a esquerda do container pai (ajustar) */
    background-color: var(--form-bg, rgba(25, 25, 25, 0.98)); /* Fundo similar ao form */
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--card-shadow);
    z-index: 10; /* Garante que fique acima de outros elementos */
    min-width: 300px; /* Largura mínima */
    margin-top: 5px; /* Espaço entre o botão e o menu */
}

.filter-menu.visible {
    display: block; /* Mostra o menu */
}

/* Ajustes para os filtros dentro do menu */
.filter-menu .filters {
    flex-direction: column; /* Empilha os filtros verticalmente */
    align-items: stretch; /* Faz os itens ocuparem a largura total */
    margin-bottom: 0; /* Remove margem inferior padrão */
}

.filter-menu .filters-title {
    margin-bottom: 15px; /* Ajusta espaço do título */
    text-align: center;
}

.filter-menu .filters input,
.filter-menu .filters select {
    min-width: 100%; /* Ocupa toda a largura */
    margin-bottom: 10px; /* Espaço entre os filtros */
}

.filter-menu .btn-filter {
    margin-top: 15px; /* Espaço acima do botão Aplicar Filtros */
    width: 100%; /* Botão ocupa largura total */
}

/* --- Fim dos Estilos para o Menu de Filtros --- */

/* Estilo para seção desabilitada */
.disabled-section {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
    filter: grayscale(100%);
    transition: all 0.3s ease;
}

/* --- Estilos das Abas do Modal de Exportação/Importação --- */
.modal-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 10px;
}

.modal-tab {
    padding: 8px 16px;
    border: none;
    background: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: 1em;
    position: relative;
    transition: all 0.3s ease;
}

.modal-tab.active {
    color: var(--primary-color);
}

.modal-tab.active::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
}

/* Conteúdo das abas */
.modal-content {
    display: none;
}

.modal-content.active {
    display: block;
}

/* Estilos específicos para importação */
.import-instructions {
    margin-bottom: 20px;
    padding: 15px;
    background-color: rgba(var(--primary-color-rgb), 0.05);
    border-radius: 5px;
}

.import-instructions .warning {
    color: var(--warning-color);
    margin-top: 10px;
    font-weight: bold;
}

.import-form {
    margin: 20px 0;
}

.import-file-input {
    display: none;
}

.import-file-label {
    display: inline-block;
    padding: 10px 20px;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    width: 100%;
}

.import-file-label:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(var(--primary-color-rgb), 0.3);
}

.import-status {
    margin-top: 15px;
    padding: 10px;
    border-radius: 5px;
}

.import-report {
    background-color: rgba(var(--primary-color-rgb), 0.05);
    padding: 15px;
    border-radius: 5px;
    margin-top: 15px;
}

.import-report h3 {
    color: var(--primary-color);
    margin-bottom: 10px;
}

.import-report p {
    margin: 5px 0;
    padding: 5px 0;
    border-bottom: 1px solid var(--border-color);
}

.import-error {
    background-color: rgba(255, 0, 0, 0.1);
    color: #ff5252;
    padding: 15px;
    border-radius: 5px;
    margin-top: 15px;
}

.import-error h3 {
    color: #ff5252;
    margin-bottom: 10px;
}

/* Responsividade para o modal de importação/exportação */
@media (max-width: 768px) {
    .modal-tabs {
        flex-direction: column;
        gap: 5px;
    }

    .modal-tab {
        width: 100%;
        text-align: center;
    }

    .modal-tab.active::after {
        bottom: -2px;
    }

    .import-file-label {
        padding: 15px;
        font-size: 0.9em;
    }

    .import-report, .import-error {
        padding: 10px;
        font-size: 0.9em;
    }
}
/* ======================================== */
/* Estilos para o Novo Card Compacto        */
/* ======================================== */

/* Variáveis de Cor (Baseadas no Tailwind Config do HTML original) */
:root {
  --card-bg: #1f2937;
  --stat-box-bg: #374151;
  --edit-btn-bg: #f97316;
  --edit-btn-hover-bg: #ea580c;
  --delete-btn-bg: #ef4444;
  --delete-btn-hover-bg: #dc2626;
  --btts-green-color: #22c55e;
  --btts-red-color: #ef4444;
  --text-gray-400: #9ca3af; /* Cor padrão do Tailwind gray-400 */
  --text-white: #ffffff;
}

/* Estilos base do card (sobrescrevem/complementam .game-card existente se necessário) */
/* Usamos alta especificidade para garantir que estes estilos se apliquem */
.notes-list > .game-card {
  background-color: var(--card-bg) !important; /* Garante a sobreposição */
  border-radius: 0.5rem !important; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; /* shadow-md */
  padding: 0.75rem !important; /* p-3 */
  color: var(--text-color) !important; /* Usa a cor de texto padrão definida no :root */
  border: none !important; /* Remove borda padrão se houver */
  margin-bottom: 0.75rem !important; /* Adiciona um espaçamento entre cards */
  display: block !important; /* Garante que não seja grid item se .game-card for usado em grid */
  /* Resetar flex/grid properties do estilo antigo se necessário */
  display: block;
}

/* Cabeçalho do Card */
.game-card .flex.justify-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem; /* mb-2 */
}

.game-card h2.text-base {
  font-size: 1rem; /* text-base */
  line-height: 1.5rem;
  font-weight: 600; /* font-semibold */
  color: var(--text-white); /* Garante branco no título */
  margin: 0; /* Reset de margem */
}

.game-card span.text-xs {
  font-size: 0.75rem; /* text-xs */
  line-height: 1rem;
}

.game-card span.text-gray-400 {
  color: var(--text-gray-400);
}

/* Grid de Estatísticas dentro do Card */
.game-card .stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)); /* grid-cols-2 */
  gap: 0.25rem; /* gap-1 */
  font-size: 0.75rem; /* text-xs */
  margin-bottom: 0.5rem; /* mb-2 */
}

.game-card .bg-stat-box-bg {
  background-color: var(--stat-box-bg);
  padding: 0.375rem; /* p-1.5 */
  border-radius: 0.25rem; /* rounded */
  text-align: center; /* text-center */
}

.game-card .text-\[0\.6rem\] { /* text-[0.6rem] */
  font-size: 0.6rem;
  display: block; /* Para garantir espaçamento */
  margin-bottom: 0.125rem;
  color: var(--text-gray-400); /* Cor mais suave para o label */
}

.game-card .font-semibold {
  font-weight: 600; /* font-semibold */
  color: var(--text-white); /* Garante branco no valor */
}

/* Estilos BTTS */
.game-card .btts-green-badge {
  background-color: var(--btts-green-color);
  color: var(--text-white);
  padding: 0.125rem 0.5rem;
  border-radius: 0.125rem;
  font-size: 0.625rem;
  margin-left: 0.25rem;
  display: inline-block; /* Para o padding funcionar corretamente */
  line-height: 1; /* Ajuste fino */
  vertical-align: middle; /* Alinhamento */
  font-weight: normal; /* Resetar font-weight se herdado */
}

.game-card .btts-red-text {
  color: var(--btts-red-color);
  font-size: 0.75rem; /* text-xs */
  font-weight: 600; /* Adiciona um pouco de peso */
}

/* Rodapé com Botões */
.buttons-container {
   display: flex;
   gap: 0.5rem;
   margin-top: 0.5rem;
}

.card-button {
   flex: 1 1 0%;
   color: var(--text-white);
   font-size: 0.65rem;
   padding: 0.25rem 0.5rem;
   border-radius: 0.25rem;
   border: none;
   cursor: pointer;
   transition: all 0.3s ease;
}

.edit-button {
   background-color: var(--edit-btn-bg);
}

.edit-button:hover {
   background-color: var(--edit-btn-hover-bg);
   transform: translateY(-1px);
}

.delete-button {
   background-color: var(--delete-btn-bg);
}

.delete-button:hover {
   background-color: var(--delete-btn-hover-bg);
   transform: translateY(-1px);
}

/* Estilo base para os botões DENTRO do novo card */
.game-card button.flex-1 {
  color: var(--text-white);
  font-size: 0.65rem; /* text-[0.65rem] */
  padding-top: 0.25rem; /* py-1 */
  padding-bottom: 0.25rem; /* py-1 */
  padding-left: 0.5rem; /* px-2 */
  padding-right: 0.5rem; /* px-2 */
  border-radius: 0.25rem; /* rounded */
  transition: background-color 0.2s ease-in-out; /* transition */
  border: none; /* Remove borda padrão */
  cursor: pointer;
  text-align: center;
  line-height: normal; /* Reset line-height */
  font-weight: normal; /* Reset font-weight */
}

.game-card button.bg-edit-btn {
  background-color: var(--edit-btn-bg);
}

.game-card button.bg-edit-btn:hover {
  background-color: var(--edit-btn-hover-bg);
}

.game-card button.bg-delete-btn {
  background-color: var(--delete-btn-bg);
}

.game-card button.bg-delete-btn:hover {
  background-color: var(--delete-btn-hover-bg);
}

/* Limpar/Sobrescrever estilos antigos conflitantes do .game-card */
/* Estas regras garantem que os estilos antigos não interfiram */
.game-card .game-card-header,
.game-card .game-card-body,
.game-card .game-card-footer,
.game-card .game-info-grid,
.game-card .game-info-item,
.game-card .info-label,
.game-card .info-value {
  display: none !important; /* Esconde elementos da estrutura antiga */
}

/* Resetar estilos dos botões antigos se ainda existirem no DOM por algum motivo */
.game-card .edit-btn,
.game-card .delete-btn {
   /* Se estes botões ainda estiverem sendo gerados pela função antiga (o que não deveria acontecer), escondê-los */
   /* display: none !important; */
   /* Ou resetar estilos para não conflitarem com os novos botões */
   background: none !important;
   padding: 0 !important;
   border: none !important;
   color: inherit !important;
   font-size: inherit !important;
}
