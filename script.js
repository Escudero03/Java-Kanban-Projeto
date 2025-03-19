// Modelo de dados
let boards = JSON.parse(localStorage.getItem('kanban-boards')) || [];
let currentBoard = null;

// Elementos do DOM
const boardSelector = document.getElementById('board-selector');
const boardContainer = document.getElementById('board');
const welcomeMessage = document.getElementById('welcome-message');
const boardTitle = document.getElementById('board-title');
const columnsContainer = document.getElementById('columns-container');
const newBoardBtn = document.getElementById('new-board-btn');
const addColumnBtn = document.getElementById('add-column-btn');
const exportHtmlBtn = document.getElementById('export-html-btn');
const generateReportBtn = document.getElementById('generate-report-btn');
const exampleBoardBtn = document.getElementById('example-board-btn');

// Modais
const boardModal = document.getElementById('board-modal');
const columnModal = document.getElementById('column-modal');
const cardModal = document.getElementById('card-modal');
const blockModal = document.getElementById('block-modal');
const reportModal = document.getElementById('report-modal');

// Formulários
const boardForm = document.getElementById('board-form');
const columnForm = document.getElementById('column-form');
const cardForm = document.getElementById('card-form');
const blockForm = document.getElementById('block-form');

// Campos de formulário
const boardNameInput = document.getElementById('board-name');
const columnNameInput = document.getElementById('column-name');
const columnOrderInput = document.getElementById('column-order');
const columnTypeInput = document.getElementById('column-type');
const cardTitleInput = document.getElementById('card-title');
const cardDescriptionInput = document.getElementById('card-description');
const cardColumnInput = document.getElementById('card-column');
const blockReasonInput = document.getElementById('block-reason');
const blockModalTitle = document.getElementById('block-modal-title');
const reportContent = document.getElementById('report-content');

// Tipos de coluna
const COLUMN_TYPES = {
    INICIAL: 'INICIAL',
    PENDENTE: 'PENDENTE',
    FINAL: 'FINAL',
    CANCELAMENTO: 'CANCELAMENTO'
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Configurar listeners
    setupEventListeners();
    
    // Carregar boards salvos
    loadBoards();
    
    // Mostrar página inicial
    showWelcomeMessage();
});

// Configurar listeners de eventos
function setupEventListeners() {
    // Botões principais
    newBoardBtn.addEventListener('click', openNewBoardModal);
    addColumnBtn.addEventListener('click', openNewColumnModal);
    exportHtmlBtn.addEventListener('click', exportBoardToHtml);
    generateReportBtn.addEventListener('click', generateReport);
    exampleBoardBtn.addEventListener('click', createExampleBoard);
    
    // Seletor de board
    boardSelector.addEventListener('change', handleBoardSelection);
    
    // Formulários
    boardForm.addEventListener('submit', handleBoardFormSubmit);
    columnForm.addEventListener('submit', handleColumnFormSubmit);
    cardForm.addEventListener('submit', handleCardFormSubmit);
    blockForm.addEventListener('submit', handleBlockFormSubmit);
    
    // Fechar modais
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Carregar boards do localStorage
function loadBoards() {
    boardSelector.innerHTML = '<option value="">Selecionar Board</option>';
    
    boards.forEach((board, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = board.name;
        boardSelector.appendChild(option);
    });
}

// Mostrar mensagem de boas-vindas
function showWelcomeMessage() {
    welcomeMessage.classList.remove('hidden');
    boardContainer.classList.add('hidden');
}

// Abrir modal para novo board
function openNewBoardModal() {
    boardForm.reset();
    boardModal.style.display = 'block';
}

// Abrir modal para nova coluna
function openNewColumnModal() {
    columnForm.reset();
    
    // Definir ordem padrão
    const nextOrder = currentBoard.columns.length + 1;
    columnOrderInput.value = nextOrder;
    
    columnModal.style.display = 'block';
}

// Abrir modal para novo card
function openNewCardModal(columnId) {
    cardForm.reset();
    
    // Limpar e preencher o select de colunas
    cardColumnInput.innerHTML = '';
    currentBoard.columns.forEach(column => {
        const option = document.createElement('option');
        option.value = column.id;
        option.textContent = column.name;
        cardColumnInput.appendChild(option);
        
        // Selecionar a coluna onde o botão foi clicado
        if (column.id === columnId) {
            option.selected = true;
        }
    });
    
    // Armazenar ID temporário para o card
    cardForm.dataset.tempId = generateId();
    
    cardModal.style.display = 'block';
}

// Abrir modal para bloquear/desbloquear card
function openBlockModal(cardId, isBlocked) {
    blockForm.reset();
    blockForm.dataset.cardId = cardId;
    
    if (isBlocked) {
        blockModalTitle.textContent = 'Desbloquear Card';
        blockReasonInput.placeholder = 'Motivo do desbloqueio...';
    } else {
        blockModalTitle.textContent = 'Bloquear Card';
        blockReasonInput.placeholder = 'Motivo do bloqueio...';
    }
    
    blockModal.style.display = 'block';
}

// Manipular seleção de board
function handleBoardSelection(event) {
    const boardIndex = event.target.value;
    
    if (boardIndex === '') {
        showWelcomeMessage();
        return;
    }
    
    loadBoard(parseInt(boardIndex));
}

// Carregar um board específico
function loadBoard(boardIndex) {
    currentBoard = boards[boardIndex];
    
    // Atualizar título
    boardTitle.textContent = currentBoard.name;
    
    // Mostrar container do board
    welcomeMessage.classList.add('hidden');
    boardContainer.classList.remove('hidden');
    
    // Renderizar colunas
    renderColumns();
}

// Renderizar colunas do board atual
function renderColumns() {
    columnsContainer.innerHTML = '';
    
    // Ordenar colunas por ordem
    const sortedColumns = [...currentBoard.columns].sort((a, b) => a.order - b.order);
    
    sortedColumns.forEach(column => {
        const columnElement = createColumnElement(column);
        columnsContainer.appendChild(columnElement);
    });
}

// Criar elemento HTML para uma coluna
function createColumnElement(column) {
    const columnElement = document.createElement('div');
    columnElement.className = 'column';
    columnElement.dataset.id = column.id;
    
    // Cabeçalho da coluna
    const columnHeader = document.createElement('div');
    columnHeader.className = 'column-header';
    
    const columnTitle = document.createElement('div');
    columnTitle.className = 'column-title';
    columnTitle.textContent = column.name;
    
    const columnType = document.createElement('div');
    columnType.className = `column-type ${column.type.toLowerCase()}`;
    columnType.textContent = column.type;
    
    columnHeader.appendChild(columnTitle);
    columnHeader.appendChild(columnType);
    
    // Conteúdo da coluna (cards)
    const columnContent = document.createElement('div');
    columnContent.className = 'column-content';
    
    // Ordenar cards por data de criação (mais recentes por último)
    const sortedCards = column.cards.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    sortedCards.forEach(card => {
        const cardElement = createCardElement(card, column.id);
        columnContent.appendChild(cardElement);
    });
    
    // Botão para adicionar card
    const addCardBtn = document.createElement('button');
    addCardBtn.className = 'add-card-btn';
    addCardBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar Card';
    addCardBtn.addEventListener('click', () => openNewCardModal(column.id));
    
    // Montar coluna
    columnElement.appendChild(columnHeader);
    columnElement.appendChild(columnContent);
    columnElement.appendChild(addCardBtn);
    
    return columnElement;
}

// Criar elemento HTML para um card
function createCardElement(card, columnId) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.id = card.id;
    
    if (card.blocked) {
        cardElement.classList.add('blocked');
    }
    
    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-title';
    cardTitle.textContent = card.title;
    
    const cardDescription = document.createElement('div');
    cardDescription.className = 'card-description';
    cardDescription.textContent = card.description;
    
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';
    
    const cardDate = document.createElement('div');
    cardDate.className = 'card-date';
    cardDate.textContent = formatDate(card.createdAt);
    
    const cardActions = document.createElement('div');
    cardActions.className = 'card-actions';
    
    // Botão de mover
    const moveButton = document.createElement('button');
    moveButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
    moveButton.title = 'Mover para próxima coluna';
    moveButton.addEventListener('click', () => moveCard(card.id, columnId));
    
    // Botão de bloquear/desbloquear
    const blockButton = document.createElement('button');
    if (card.blocked) {
        blockButton.innerHTML = '<i class="fas fa-unlock"></i>';
        blockButton.title = 'Desbloquear card';
    } else {
        blockButton.innerHTML = '<i class="fas fa-lock"></i>';
        blockButton.title = 'Bloquear card';
    }
    blockButton.addEventListener('click', () => openBlockModal(card.id, card.blocked));
    
    // Botão de cancelar
    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = '<i class="fas fa-ban"></i>';
    cancelButton.title = 'Mover para cancelamento';
    cancelButton.addEventListener('click', () => moveCardToCancellation(card.id, columnId));
    
    cardActions.appendChild(moveButton);
    cardActions.appendChild(blockButton);
    cardActions.appendChild(cancelButton);
    
    cardFooter.appendChild(cardDate);
    cardFooter.appendChild(cardActions);
    
    cardElement.appendChild(cardTitle);
    cardElement.appendChild(cardDescription);
    cardElement.appendChild(cardFooter);
    
    return cardElement;
}

// Mover um card para a próxima coluna
function moveCard(cardId, columnId) {
    // Encontrar coluna atual e próxima
    const currentColumnIndex = currentBoard.columns.findIndex(col => col.id === columnId);
    const currentColumn = currentBoard.columns[currentColumnIndex];
    const nextColumnIndex = currentBoard.columns.findIndex(col => col.order === currentColumn.order + 1);
    
    // Se não houver próxima coluna, não fazer nada
    if (nextColumnIndex === -1) {
        alert('Não há próxima coluna disponível.');
        return;
    }
    
    const nextColumn = currentBoard.columns[nextColumnIndex];
    
    // Verificar se a próxima coluna não é a de cancelamento (deve ser movida explicitamente)
    if (nextColumn.type === COLUMN_TYPES.CANCELAMENTO) {
        alert('Não é possível mover diretamente para a coluna de Cancelamento. Use o botão de cancelar.');
        return;
    }
    
    // Encontrar o card
    const cardIndex = currentColumn.cards.findIndex(card => card.id === cardId);
    const card = currentColumn.cards[cardIndex];
    
    // Verificar se o card está bloqueado
    if (card.blocked) {
        alert('Não é possível mover um card bloqueado. Desbloqueie-o primeiro.');
        return;
    }
    
    // Registrar a data de movimentação
    card.movedAt = new Date().toISOString();
    
    // Remover da coluna atual e adicionar à próxima
    currentColumn.cards.splice(cardIndex, 1);
    nextColumn.cards.push(card);
    
    // Atualizar no localStorage
    saveBoards();
    
    // Atualizar a visualização
    renderColumns();
}

// Mover um card para a coluna de cancelamento
function moveCardToCancellation(cardId, columnId) {
    // Encontrar coluna atual e de cancelamento
    const currentColumnIndex = currentBoard.columns.findIndex(col => col.id === columnId);
    const currentColumn = currentBoard.columns[currentColumnIndex];
    const cancellationColumnIndex = currentBoard.columns.findIndex(col => col.type === COLUMN_TYPES.CANCELAMENTO);
    
    // Se não houver coluna de cancelamento, não fazer nada
    if (cancellationColumnIndex === -1) {
        alert('Coluna de cancelamento não encontrada.');
        return;
    }
    
    const cancellationColumn = currentBoard.columns[cancellationColumnIndex];
    
    // Encontrar o card
    const cardIndex = currentColumn.cards.findIndex(card => card.id === cardId);
    const card = currentColumn.cards[cardIndex];
    
    // Verificar se o card está bloqueado
    if (card.blocked) {
        alert('Não é possível mover um card bloqueado. Desbloqueie-o primeiro.');
        return;
    }
    
    // Registrar a data de movimentação
    card.movedAt = new Date().toISOString();
    
    // Remover da coluna atual e adicionar à de cancelamento
    currentColumn.cards.splice(cardIndex, 1);
    cancellationColumn.cards.push(card);
    
    // Atualizar no localStorage
    saveBoards();
    
    // Atualizar a visualização
    renderColumns();
}

// Manipular submissão do formulário de novo board
function handleBoardFormSubmit(event) {
    event.preventDefault();
    
    const boardName = boardNameInput.value.trim();
    
    if (!boardName) {
        alert('O nome do board é obrigatório.');
        return;
    }
    
    // Criar novo board
    const newBoard = {
        id: generateId(),
        name: boardName,
        columns: []
    };
    
    // Adicionar colunas padrão
    newBoard.columns.push({
        id: generateId(),
        name: 'Inicial',
        type: COLUMN_TYPES.INICIAL,
        order: 1,
        cards: []
    });
    
    newBoard.columns.push({
        id: generateId(),
        name: 'Final',
        type: COLUMN_TYPES.FINAL,
        order: 2,
        cards: []
    });
    
    newBoard.columns.push({
        id: generateId(),
        name: 'Cancelamento',
        type: COLUMN_TYPES.CANCELAMENTO,
        order: 3,
        cards: []
    });
    
    // Adicionar à lista de boards
    boards.push(newBoard);
    
    // Salvar no localStorage
    saveBoards();
    
    // Atualizar seletor de boards
    loadBoards();
    
    // Selecionar o novo board
    boardSelector.value = boards.length - 1;
    loadBoard(boards.length - 1);
    
    // Fechar modal
    boardModal.style.display = 'none';
}

// Manipular submissão do formulário de nova coluna
function handleColumnFormSubmit(event) {
    event.preventDefault();
    
    const columnName = columnNameInput.value.trim();
    const columnOrder = parseInt(columnOrderInput.value);
    const columnType = columnTypeInput.value;
    
    if (!columnName || !columnOrder) {
        alert('Todos os campos são obrigatórios.');
        return;
    }
    
    // Verificar tipo da coluna
    if (columnType === COLUMN_TYPES.INICIAL && hasColumnOfType(COLUMN_TYPES.INICIAL)) {
        alert('Já existe uma coluna do tipo INICIAL.');
        return;
    }
    
    if (columnType === COLUMN_TYPES.FINAL && hasColumnOfType(COLUMN_TYPES.FINAL)) {
        alert('Já existe uma coluna do tipo FINAL.');
        return;
    }
    
    if (columnType === COLUMN_TYPES.CANCELAMENTO && hasColumnOfType(COLUMN_TYPES.CANCELAMENTO)) {
        alert('Já existe uma coluna do tipo CANCELAMENTO.');
        return;
    }
    
    // Reordenar colunas existentes
    currentBoard.columns.forEach(column => {
        if (column.order >= columnOrder) {
            column.order++;
        }
    });
    
    // Verificar ordem conforme regras:
    // - INICIAL deve ser a primeira
    // - FINAL deve ser a penúltima
    // - CANCELAMENTO deve ser a última
    let reorderNeeded = false;
    
    if (columnType === COLUMN_TYPES.INICIAL && columnOrder !== 1) {
        alert('A coluna INICIAL deve ser a primeira.');
        reorderNeeded = true;
    }
    
    if (columnType === COLUMN_TYPES.CANCELAMENTO && 
        columnOrder !== currentBoard.columns.length + 1) {
        alert('A coluna CANCELAMENTO deve ser a última.');
        reorderNeeded = true;
    }
    
    if (columnType === COLUMN_TYPES.FINAL && 
        columnOrder !== currentBoard.columns.length) {
        alert('A coluna FINAL deve ser a penúltima.');
        reorderNeeded = true;
    }
    
    if (reorderNeeded) {
        // Restaurar ordens anteriores
        reorderColumns();
        return;
    }
    
    // Criar nova coluna
    const newColumn = {
        id: generateId(),
        name: columnName,
        type: columnType,
        order: columnOrder,
        cards: []
    };
    
    // Adicionar ao board
    currentBoard.columns.push(newColumn);
    
    // Salvar no localStorage
    saveBoards();
    
    // Atualizar visualização
    renderColumns();
    
    // Fechar modal
    columnModal.style.display = 'none';
}

// Reordenar colunas (restaurar ordem original)
function reorderColumns() {
    const sortedColumns = [...currentBoard.columns].sort((a, b) => a.order - b.order);
    
    sortedColumns.forEach((column, index) => {
        column.order = index + 1;
    });
}

// Verificar se já existe uma coluna do tipo especificado
function hasColumnOfType(type) {
    return currentBoard.columns.some(column => column.type === type);
}

// Manipular submissão do formulário de novo card
function handleCardFormSubmit(event) {
    event.preventDefault();
    
    const cardTitle = cardTitleInput.value.trim();
    const cardDescription = cardDescriptionInput.value.trim();
    const columnId = cardColumnInput.value;
    
    if (!cardTitle || !cardDescription || !columnId) {
        alert('Todos os campos são obrigatórios.');
        return;
    }
    
    // Encontrar a coluna
    const column = currentBoard.columns.find(col => col.id === columnId);
    
    if (!column) {
        alert('Coluna não encontrada.');
        return;
    }
    
    // Criar novo card
    const newCard = {
        id: cardForm.dataset.tempId || generateId(),
        title: cardTitle,
        description: cardDescription,
        createdAt: new Date().toISOString(),
        blocked: false,
        blockReason: null,
        movedAt: null
    };
    
    // Adicionar à coluna
    column.cards.push(newCard);
    
    // Salvar no localStorage
    saveBoards();
    
    // Atualizar visualização
    renderColumns();
    
    // Fechar modal
    cardModal.style.display = 'none';
}

// Manipular submissão do formulário de bloqueio/desbloqueio
function handleBlockFormSubmit(event) {
    event.preventDefault();
    
    const cardId = blockForm.dataset.cardId;
    const reason = blockReasonInput.value.trim();
    
    if (!reason) {
        alert('O motivo é obrigatório.');
        return;
    }
    
    // Encontrar o card em todas as colunas
    let foundCard = null;
    let foundColumn = null;
    
    for (const column of currentBoard.columns) {
        const card = column.cards.find(c => c.id === cardId);
        if (card) {
            foundCard = card;
            foundColumn = column;
            break;
        }
    }
    
    if (!foundCard) {
        alert('Card não encontrado.');
        return;
    }
    
    // Atualizar status de bloqueio
    foundCard.blocked = !foundCard.blocked;
    foundCard.blockReason = reason;
    
    // Salvar no localStorage
    saveBoards();
    
    // Atualizar visualização
    renderColumns();
    
    // Fechar modal
    blockModal.style.display = 'none';
}

// Exportar board para HTML
function exportBoardToHtml() {
    if (!currentBoard) {
        alert('Nenhum board selecionado.');
        return;
    }
    
    // Criar conteúdo HTML
    let html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${currentBoard.name} - Kanban</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            h1 {
                text-align: center;
                color: #333;
            }
            .board {
                display: flex;
                gap: 20px;
                overflow-x: auto;
                padding-bottom: 20px;
            }
            .column {
                background-color: #ebecf0;
                border-radius: 5px;
                width: 280px;
                min-width: 280px;
                padding: 10px;
            }
            .column-header {
                margin-bottom: 10px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
            }
            .column-type {
                font-size: 12px;
                padding: 3px 6px;
                border-radius: 3px;
                background-color: #ddd;
            }
            .column-type.inicial { background-color: #61bd4f; color: white; }
            .column-type.final { background-color: #0079bf; color: white; }
            .column-type.cancelamento { background-color: #eb5a46; color: white; }
            .column-type.pendente { background-color: #ff9f1a; color: white; }
            .card {
                background-color: white;
                border-radius: 3px;
                padding: 10px;
                margin-bottom: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.15);
            }
            .card-title {
                font-weight: bold;
                margin-bottom: 5px;
            }
            .card-description {
                font-size: 13px;
                color: #666;
                margin-bottom: 8px;
            }
            .card-date {
                font-size: 11px;
                color: #999;
                font-style: italic;
            }
            .card.blocked {
                border-left: 4px solid #eb5a46;
            }
            .blocked-label {
                display: inline-block;
                background-color: #eb5a46;
                color: white;
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 10px;
                margin-bottom: 5px;
            }
            .export-info {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <h1>${currentBoard.name}</h1>
        
        <div class="board">
    `;
    
    // Adicionar colunas
    const sortedColumns = [...currentBoard.columns].sort((a, b) => a.order - b.order);
    
    sortedColumns.forEach(column => {
        html += `
        <div class="column">
            <div class="column-header">
                <div>${column.name}</div>
                <div class="column-type ${column.type.toLowerCase()}">${column.type}</div>
            </div>
        `;
        
        // Adicionar cards
        const sortedCards = [...column.cards].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        sortedCards.forEach(card => {
            html += `
            <div class="card ${card.blocked ? 'blocked' : ''}">
                ${card.blocked ? '<div class="blocked-label">BLOQUEADO</div>' : ''}
                <div class="card-title">${card.title}</div>
                <div class="card-description">${card.description}</div>
                <div class="card-date">Criado em: ${formatDate(card.createdAt)}</div>
            </div>
            `;
        });
        
        html += `</div>`;
    });
    
    html += `
        </div>
        
        <div class="export-info">
            Exportado em ${formatDate(new Date().toISOString())}
        </div>
    </body>
    </html>
    `;
    
    // Criar blob e link para download
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBoard.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Gerar relatório do board atual
function generateReport() {
    if (!currentBoard) {
        alert('Nenhum board selecionado.');
        return;
    }
    
    let reportHtml = `
        <div class="report-section">
            <h3>Informações Gerais</h3>
            <p><strong>Nome do Board:</strong> ${currentBoard.name}</p>
            <p><strong>Total de Colunas:</strong> ${currentBoard.columns.length}</p>
            <p><strong>Total de Cards:</strong> ${getTotalCards()}</p>
        </div>
        
        <div class="report-section">
            <h3>Tempo de Conclusão de Tarefas</h3>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>Coluna</th>
                        <th>Criado em</th>
                        <th>Movido em</th>
                        <th>Tempo na Coluna</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Adicionar informações de cards
    const sortedColumns = [...currentBoard.columns].sort((a, b) => a.order - b.order);
    
    sortedColumns.forEach(column => {
        column.cards.forEach(card => {
            reportHtml += `
                <tr>
                    <td>${card.title}</td>
                    <td>${column.name}</td>
                    <td>${formatDate(card.createdAt)}</td>
                    <td>${card.movedAt ? formatDate(card.movedAt) : 'N/A'}</td>
                    <td>${getTimeInColumn(card)}</td>
                </tr>
            `;
        });
    });
    
    reportHtml += `
                </tbody>
            </table>
        </div>
        
        <div class="report-section">
            <h3>Cards Bloqueados</h3>
    `;
    
    const blockedCards = getBlockedCards();
    
    if (blockedCards.length === 0) {
        reportHtml += `<p>Não há cards bloqueados.</p>`;
    } else {
        reportHtml += `
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>Coluna</th>
                        <th>Motivo do Bloqueio</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        blockedCards.forEach(({ card, column }) => {
            reportHtml += `
                <tr>
                    <td>${card.title}</td>
                    <td>${column.name}</td>
                    <td>${card.blockReason}</td>
                </tr>
            `;
        });
        
        reportHtml += `
                </tbody>
            </table>
        `;
    }
    
    reportHtml += `</div>`;
    
    // Exibir relatório
    reportContent.innerHTML = reportHtml;
    reportModal.style.display = 'block';
}

// Obter o número total de cards
function getTotalCards() {
    let total = 0;
    currentBoard.columns.forEach(column => {
        total += column.cards.length;
    });
    return total;
}

// Obter lista de cards bloqueados
function getBlockedCards() {
    const blockedCards = [];
    
    currentBoard.columns.forEach(column => {
        column.cards.forEach(card => {
            if (card.blocked) {
                blockedCards.push({ card, column });
            }
        });
    });
    
    return blockedCards;
}

// Calcular tempo em coluna
function getTimeInColumn(card) {
    const createdDate = new Date(card.createdAt);
    const movedDate = card.movedAt ? new Date(card.movedAt) : new Date();
    
    const diffTime = Math.abs(movedDate - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
        return `${diffDays} dias, ${diffHours} horas`;
    } else {
        return `${diffHours} horas`;
    }
}

// Criar board de exemplo
function createExampleBoard() {
    // Criar board
    const exampleBoard = {
        id: generateId(),
        name: 'Board de Exemplo',
        columns: []
    };
    
    // Adicionar colunas
    exampleBoard.columns.push({
        id: generateId(),
        name: 'Backlog',
        type: COLUMN_TYPES.INICIAL,
        order: 1,
        cards: []
    });
    
    exampleBoard.columns.push({
        id: generateId(),
        name: 'Em Desenvolvimento',
        type: COLUMN_TYPES.PENDENTE,
        order: 2,
        cards: []
    });
    
    exampleBoard.columns.push({
        id: generateId(),
        name: 'Em Teste',
        type: COLUMN_TYPES.PENDENTE,
        order: 3,
        cards: []
    });
    
    exampleBoard.columns.push({
        id: generateId(),
        name: 'Concluído',
        type: COLUMN_TYPES.FINAL,
        order: 4,
        cards: []
    });
    
    exampleBoard.columns.push({
        id: generateId(),
        name: 'Cancelado',
        type: COLUMN_TYPES.CANCELAMENTO,
        order: 5,
        cards: []
    });
    
    // Adicionar cards de exemplo
    const backlogColumn = exampleBoard.columns[0];
    const devColumn = exampleBoard.columns[1];
    const testColumn = exampleBoard.columns[2];
    const doneColumn = exampleBoard.columns[3];
    const cancelledColumn = exampleBoard.columns[4];
    
    // Cards no Backlog
    backlogColumn.cards.push({
        id: generateId(),
        title: 'Implementar Sistema de Login',
        description: 'Desenvolver tela de login com validação de credenciais e recuperação de senha.',
        createdAt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias atrás
        blocked: false,
        blockReason: null,
        movedAt: null
    });
    
    backlogColumn.cards.push({
        id: generateId(),
        title: 'Criar Relatório de Vendas',
        description: 'Desenvolver relatório com gráficos mostrando vendas por região e período.',
        createdAt: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 dias atrás
        blocked: false,
        blockReason: null,
        movedAt: null
    });
    
    // Cards em Desenvolvimento
    devColumn.cards.push({
        id: generateId(),
        title: 'Implementar Cadastro de Produtos',
        description: 'Criar formulário de cadastro com validação e upload de imagens.',
        createdAt: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias atrás
        blocked: true,
        blockReason: 'Aguardando definição dos campos obrigatórios pelo cliente',
        movedAt: new Date(new Date().getTime() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 dias atrás
    });
    
    devColumn.cards.push({
        id: generateId(),
        title: 'Otimizar Banco de Dados',
        description: 'Melhorar performance das consultas e adicionar índices nas tabelas principais.',
        createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
        blocked: false,
        blockReason: null,
        movedAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 dias atrás
    });
    
    // Cards em Teste
    testColumn.cards.push({
        id: generateId(),
        title: 'Integração com Gateway de Pagamento',
        description: 'Testar integração com API de pagamentos e fluxo de checkout.',
        createdAt: new Date(new Date().getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 dias atrás
        blocked: false,
        blockReason: null,
        movedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 dias atrás
    });
    
    // Cards Concluídos
    doneColumn.cards.push({
        id: generateId(),
        title: 'Implementar Layout Responsivo',
        description: 'Adaptar interface para funcionar em dispositivos móveis e tablets.',
        createdAt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias atrás
        blocked: false,
        blockReason: null,
        movedAt: new Date(new Date().getTime() - 25 * 24 * 60 * 60 * 1000).toISOString() // 25 dias atrás
    });
    
    // Cards Cancelados
    cancelledColumn.cards.push({
        id: generateId(),
        title: 'Sistema de Chat Interno',
        description: 'Implementar chat em tempo real para comunicação entre equipes.',
        createdAt: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 dias atrás
        blocked: false,
        blockReason: null,
        movedAt: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 dias atrás
    });
    
    // Adicionar à lista de boards
    boards.push(exampleBoard);
    
    // Salvar no localStorage
    saveBoards();
    
    // Atualizar seletor de boards
    loadBoards();
    
    // Selecionar o novo board
    boardSelector.value = boards.length - 1;
    loadBoard(boards.length - 1);
}

// Salvar boards no localStorage
function saveBoards() {
    localStorage.setItem('kanban-boards', JSON.stringify(boards));
}

// Gerar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}