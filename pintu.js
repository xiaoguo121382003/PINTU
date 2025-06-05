// 游戏数据
const gameData = {
    currentLevel: 1,
    currentStage: 1,
    score: 0,
    hintsUsed: 0,
    startTime: null,
    timerInterval: null,
    elapsedTime: 0,
    levelStartTime: null,
    levelElapsedTime: 0,
    isPlaying: false,
    isChecking: false,
    // 游戏单词和图片数据
    wordsData: [
        // 第一关
        [
            { word: "APPLE", meaning: "苹果", image: "https://picsum.photos/seed/apple/300/300" },
            { word: "BANANA", meaning: "香蕉", image: "https://picsum.photos/seed/banana/300/300" },
            { word: "CHERRY", meaning: "樱桃", image: "https://picsum.photos/seed/cherry/300/300" },
            { word: "DOG", meaning: "狗", image: "https://picsum.photos/seed/dog/300/300" },
            { word: "ELEPHANT", meaning: "大象", image: "https://picsum.photos/seed/elephant/300/300" }
        ],
        // 第二关
        [
            { word: "FLOWER", meaning: "花", image: "https://picsum.photos/seed/flower/300/300" },
            { word: "GUITAR", meaning: "吉他", image: "https://picsum.photos/seed/guitar/300/300" },
            { word: "HOUSE", meaning: "房子", image: "https://picsum.photos/seed/house/300/300" },
            { word: "ICE CREAM", meaning: "冰淇淋", image: "https://picsum.photos/seed/icecream/300/300" },
            { word: "JUMP", meaning: "跳跃", image: "https://picsum.photos/seed/jump/300/300" }
        ]
    ],
    currentWordData: null,
    puzzlePieces: [],
    puzzleGrid: [],
    pieceSize: 0,
    isDragging: false,
    draggedPiece: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    soundEnabled: true,
    bgMusic: null,
    clickSound: null,
    successSound: null,
    failSound: null,
    soundPlayed: false // 记录是否已播放过单词读音
};

// DOM元素
const elements = {
    wordDisplay: document.getElementById('word-display'),
    meaningDisplay: document.getElementById('meaning-display'),
    soundBtn: document.getElementById('sound-btn'),
    hintImage: document.getElementById('hint-image'),
    hintImageImg: document.getElementById('hint-image').querySelector('img'),
    hintContainer: document.getElementById('hint-container'),
    puzzleContainer: document.getElementById('puzzle-container'),
    puzzleGrid: document.getElementById('puzzle-grid'),
    dropZone: document.getElementById('drop-zone'),
    piecesContainer: document.getElementById('pieces-container'),
    scoreDisplay: document.getElementById('score'),
    timerDisplay: document.getElementById('timer'),
    levelDisplay: document.getElementById('level'),
    stageDisplay: document.getElementById('stage'),
    hintsLeftDisplay: document.getElementById('hints-left'),
    hintProgress: document.getElementById('hint-progress').querySelector('div'),
    startBtn: document.getElementById('start-btn'),
    exitBtn: document.getElementById('exit-btn'),
    resetBtn: document.getElementById('reset-btn'),
    confirmBtn: document.getElementById('confirm-btn'),
    hintBtn: document.getElementById('hint-btn'),
    resultModal: document.getElementById('result-modal'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    resultScore: document.getElementById('result-score'),
    resultTime: document.getElementById('result-time'),
    nextStageBtn: document.getElementById('next-stage-btn'),
    closeResultBtn: document.getElementById('close-result-btn'),
    levelCompleteModal: document.getElementById('level-complete-modal'),
    completedLevel: document.getElementById('completed-level'),
    levelTotalScore: document.getElementById('level-total-score'),
    levelTotalTime: document.getElementById('level-total-time'),
    nextLevelBtn: document.getElementById('next-level-btn'),
    closeLevelBtn: document.getElementById('close-level-btn'),
    gameOverModal: document.getElementById('game-over-modal'),
    finalScore: document.getElementById('final-score'),
    finalLevel: document.getElementById('final-level'),
    restartBtn: document.getElementById('restart-btn'),
    closeGameBtn: document.getElementById('close-game-btn')
};

// 初始化游戏
function initGame() {
    // 加载音频
    loadSounds();
    
    // 开始播放背景音乐
    playBackgroundMusic();
    
    // 禁用按钮直到游戏开始
    elements.confirmBtn.disabled = true;
    elements.confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
    elements.resetBtn.disabled = true;
    elements.resetBtn.classList.add('opacity-50', 'cursor-not-allowed');
    elements.hintBtn.disabled = true;
    elements.hintBtn.classList.add('opacity-50', 'cursor-not-allowed');
    
    // 添加事件监听器
    setupEventListeners();
}

// 加载音频
function loadSounds() {
    gameData.bgMusic = new Audio('https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-664.mp3');
    gameData.bgMusic.loop = true;
    gameData.bgMusic.volume = 0.3;
    
    gameData.clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
    gameData.clickSound.volume = 0.5;
    
    gameData.successSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    gameData.successSound.volume = 0.6;
    
    gameData.failSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-negative-guitar-tone-2324.mp3');
    gameData.failSound.volume = 0.6;
    
    // 单词发音数据（使用示例音频）
    gameData.wordSounds = {
        "APPLE": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
        "BANANA": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
        "CHERRY": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
        "DOG": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
        "ELEPHANT": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
        "FLOWER": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
        "GUITAR": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
        "HOUSE": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
        "ICE CREAM": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
        "JUMP": "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3"
    };
}

// 播放背景音乐
function playBackgroundMusic() {
    if (gameData.soundEnabled && gameData.bgMusic) {
        gameData.bgMusic.play().catch(e => console.log('背景音乐播放失败:', e));
    }
}

// 播放点击音效
function playClickSound() {
    if (gameData.soundEnabled && gameData.clickSound) {
        gameData.clickSound.currentTime = 0;
        gameData.clickSound.play().catch(e => console.log('点击音效播放失败:', e));
    }
}

// 播放成功音效
function playSuccessSound() {
    if (gameData.soundEnabled && gameData.successSound) {
        gameData.successSound.currentTime = 0;
        gameData.successSound.play().catch(e => console.log('成功音效播放失败:', e));
    }
}

// 播放失败音效
function playFailSound() {
    if (gameData.soundEnabled && gameData.failSound) {
        gameData.failSound.currentTime = 0;
        gameData.failSound.play().catch(e => console.log('失败音效播放失败:', e));
    }
}

// 播放单词读音
function playWordSound(word) {
    if (gameData.wordSounds[word]) {
        const sound = new Audio(gameData.wordSounds[word]);
        sound.volume = 0.8;
        sound.play().catch(e => console.log('单词读音播放失败:', e));
        gameData.soundPlayed = true;
    }
}

// 开始关卡
function startLevel(level) {
    gameData.currentLevel = level;
    gameData.currentStage = 1;
    gameData.levelStartTime = Date.now();
    gameData.levelElapsedTime = 0;
    
    // 更新显示
    elements.levelDisplay.textContent = gameData.currentLevel;
    elements.stageDisplay.textContent = `${gameData.currentStage}/5`;
    
    // 开始第一个小关卡
    startStage();
}

// 开始小关卡
function startStage() {
    // 重置游戏状态
    resetStage();
    
    // 获取当前关卡数据
    const levelData = gameData.wordsData[gameData.currentLevel - 1];
    if (!levelData) {
        // 如果没有更多关卡数据，游戏结束或进入下一关
        completeLevel();
        return;
    }
    
    // 获取当前小关卡数据
    gameData.currentWordData = levelData[gameData.currentStage - 1];
    if (!gameData.currentWordData) {
        completeLevel();
        return;
    }
    
    // 更新显示
    elements.wordDisplay.textContent = gameData.currentWordData.word;
    elements.meaningDisplay.textContent = '';
    elements.meaningDisplay.classList.remove('opacity-100');
    elements.meaningDisplay.classList.add('opacity-0');
    elements.hintImageImg.src = gameData.currentWordData.image;
    elements.hintImage.classList.add('hidden');
    elements.hintsLeftDisplay.textContent = 3 - gameData.hintsUsed;
    elements.hintProgress.style.width = `${(3 - gameData.hintsUsed) * 33.33}%`;
    
    // 重置单词读音状态
    gameData.soundPlayed = false;
    
    // 创建拼图
    createPuzzle();
    
    // 开始计时
    startTimer();
    
    // 设置游戏状态
    gameData.isPlaying = true;
    gameData.isChecking = false;
    
    // 启用按钮
    elements.confirmBtn.disabled = false;
    elements.confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    elements.resetBtn.disabled = false;
    elements.resetBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    elements.hintBtn.disabled = false;
    elements.hintBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    elements.startBtn.disabled = true;
    elements.startBtn.classList.add('opacity-50', 'cursor-not-allowed');
}

// 重置小关卡
function resetStage() {
    gameData.hintsUsed = 0;
    gameData.puzzlePieces = [];
    gameData.puzzleGrid = [];
    
    // 清空容器
    elements.puzzleGrid.innerHTML = '';
    elements.piecesContainer.innerHTML = '';
    
    // 停止计时器
    if (gameData.timerInterval) {
        clearInterval(gameData.timerInterval);
        gameData.timerInterval = null;
    }
    
    // 重置显示
    elements.scoreDisplay.textContent = gameData.score;
    elements.timerDisplay.textContent = '00:00';
    elements.levelDisplay.textContent = gameData.currentLevel;
    elements.stageDisplay.textContent = `${gameData.currentStage}/5`;
    elements.hintsLeftDisplay.textContent = 3;
    elements.hintProgress.style.width = '100%';
    
    // 隐藏提示图片
    elements.hintImage.classList.add('hidden');
    
    // 重置游戏状态
    gameData.startTime = null;
    gameData.elapsedTime = 0;
    gameData.soundPlayed = false;
}

// 创建拼图
function createPuzzle() {
    const containerSize = Math.min(elements.puzzleContainer.clientWidth, elements.puzzleContainer.clientHeight);
    gameData.pieceSize = containerSize / 3;
    
    // 创建拼图格子
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot relative';
            slot.dataset.row = i;
            slot.dataset.col = j;
            elements.puzzleGrid.appendChild(slot);
            
            // 存储格子信息
            gameData.puzzleGrid.push({
                row: i,
                col: j,
                piece: null,
                element: slot
            });
        }
    }
    
    // 创建拼图碎片
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece absolute rounded-md shadow-md overflow-hidden';
            piece.style.width = `${gameData.pieceSize}px`;
            piece.style.height = `${gameData.pieceSize}px`;
            piece.style.backgroundImage = `url(${gameData.currentWordData.image})`;
            piece.style.backgroundSize = `${containerSize}px ${containerSize}px`;
            piece.style.backgroundPosition = `-${j * gameData.pieceSize}px -${i * gameData.pieceSize}px`;
            piece.dataset.row = i;
            piece.dataset.col = j;
            piece.dataset.correct = 'false';
            
            // 存储碎片信息
            gameData.puzzlePieces.push({
                row: i,
                col: j,
                element: piece,
                correct: false,
                currentRow: null,
                currentCol: null
            });
            
            // 添加到碎片容器
            elements.piecesContainer.appendChild(piece);
            
            // 设置随机位置
            const containerRect = elements.piecesContainer.getBoundingClientRect();
            let randomX, randomY;
            let validPosition = false;
            let attempts = 0;
            
            // 尝试找到不重叠的位置
            while (!validPosition && attempts < 50) {
                randomX = Math.random() * (containerRect.width - gameData.pieceSize);
                randomY = Math.random() * (containerRect.height - gameData.pieceSize);
                
                validPosition = true;
                
                // 检查与已放置碎片的重叠
                for (let k = 0; k < i * 3 + j; k++) {
                    const otherPiece = gameData.puzzlePieces[k];
                    const otherLeft = parseFloat(otherPiece.element.style.left);
                    const otherTop = parseFloat(otherPiece.element.style.top);
                    
                    // 简单的重叠检测，留有一定间距
                    if (
                        randomX < otherLeft + gameData.pieceSize + 10 &&
                        randomX + gameData.pieceSize + 10 > otherLeft &&
                        randomY < otherTop + gameData.pieceSize + 10 &&
                        randomY + gameData.pieceSize + 10 > otherTop
                    ) {
                        validPosition = false;
                        attempts++;
                        break;
                    }
                }
            }
            
            // 如果尝试多次仍无法找到不重叠位置，使用最后一次尝试的位置
            piece.style.left = `${randomX}px`;
            piece.style.top = `${randomY}px`;
            
            // 添加拖拽事件
            setupDragEvents(piece);
        }
    }
}

// 设置拖拽事件
function setupDragEvents(piece) {
    // 鼠标/触摸开始
    const startDrag = (e) => {
        if (!gameData.isPlaying || gameData.isDragging || gameData.isChecking) return;
        
        e.preventDefault();
        gameData.isDragging = true;
        gameData.draggedPiece = piece;
        
        // 获取初始位置和偏移量
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        const rect = piece.getBoundingClientRect();
        gameData.offsetX = clientX - rect.left;
        gameData.offsetY = clientY - rect.top;
        
        // 提升层级
        piece.style.zIndex = '100';
        
        // 添加拖拽样式
        piece.classList.add('scale-110', 'shadow-lg');
        
        // 添加事件监听器
        document.addEventListener('mousemove', dragPiece);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', dragPiece, { passive: false });
        document.addEventListener('touchend', endDrag);
    };
    
    // 拖拽中
    const dragPiece = (e) => {
        if (!gameData.isDragging) return;
        
        e.preventDefault();
        
        // 获取当前位置
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        // 计算新位置
        const newX = clientX - gameData.offsetX;
        const newY = clientY - gameData.offsetY;
        
        // 获取容器位置
        const containerRect = elements.piecesContainer.getBoundingClientRect();
        
        // 限制在容器内
        const maxX = containerRect.width - gameData.pieceSize;
        const maxY = containerRect.height - gameData.pieceSize;
        
        const boundedX = Math.max(0, Math.min(newX - containerRect.left, maxX));
        const boundedY = Math.max(0, Math.min(newY - containerRect.top, maxY));
        
        // 设置位置
        piece.style.left = `${boundedX}px`;
        piece.style.top = `${boundedY}px`;
        
        // 检查是否接近目标位置
        checkNearSlot(piece, boundedX, boundedY);
    };
    
    // 拖拽结束
    const endDrag = (e) => {
        if (!gameData.isDragging) return;
        
        e.preventDefault();
        
        // 重置样式
        piece.classList.remove('scale-110', 'shadow-lg');
        
        // 检查是否在目标位置
        snapToSlot(piece);
        
        // 重置拖拽状态
        gameData.isDragging = false;
        gameData.draggedPiece = null;
        
        // 移除事件监听器
        document.removeEventListener('mousemove', dragPiece);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', dragPiece);
        document.removeEventListener('touchend', endDrag);
    };
    
    // 添加事件监听器
    piece.addEventListener('mousedown', startDrag);
    piece.addEventListener('touchstart', startDrag, { passive: false });
}

// 检查是否接近目标位置
function checkNearSlot(piece, x, y) {
    const containerRect = elements.puzzleContainer.getBoundingClientRect();
    const pieceRect = piece.getBoundingClientRect();
    const centerX = pieceRect.left + pieceRect.width / 2;
    const centerY = pieceRect.top + pieceRect.height / 2;
    
    // 检查是否在拼图区域内
    if (
        centerX >= containerRect.left && 
        centerX <= containerRect.right && 
        centerY >= containerRect.top && 
        centerY <= containerRect.bottom
    ) {
        // 计算在哪个格子内
        const relativeX = centerX - containerRect.left;
        const relativeY = centerY - containerRect.top;
        
        const col = Math.floor(relativeX / gameData.pieceSize);
        const row = Math.floor(relativeY / gameData.pieceSize);
        
        // 检查格子是否有效
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
            // 检查格子是否已被占用
            const slot = gameData.puzzleGrid[row * 3 + col];
            
            if (!slot.piece) {
                // 高亮显示可能的放置位置
                elements.puzzleGrid.children[row * 3 + col].classList.add('bg-blue-100');
                
                // 延迟移除高亮，避免闪烁
                setTimeout(() => {
                    if (!gameData.isDragging || gameData.draggedPiece !== piece) {
                        elements.puzzleGrid.children.forEach(slot => {
                            slot.classList.remove('bg-blue-100');
                        });
                    }
                }, 200);
            }
        }
    }
}

// 自动对齐到最近的格子
function snapToSlot(piece) {
    const containerRect = elements.puzzleContainer.getBoundingClientRect();
    const pieceRect = piece.getBoundingClientRect();
    const centerX = pieceRect.left + pieceRect.width / 2;
    const centerY = pieceRect.top + pieceRect.height / 2;
    
    // 检查是否在拼图区域内
    if (
        centerX >= containerRect.left && 
        centerX <= containerRect.right && 
        centerY >= containerRect.top && 
        centerY <= containerRect.bottom
    ) {
        // 计算在哪个格子内
        const relativeX = centerX - containerRect.left;
        const relativeY = centerY - containerRect.top;
        
        const col = Math.floor(relativeX / gameData.pieceSize);
        const row = Math.floor(relativeY / gameData.pieceSize);
        
        // 检查格子是否有效
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
            // 检查格子是否已被占用
            const slotIndex = row * 3 + col;
            const slot = gameData.puzzleGrid[slotIndex];
            
            if (!slot.piece) {
                // 放置到格子中
                const slotElement = elements.puzzleGrid.children[slotIndex];
                const slotRect = slotElement.getBoundingClientRect();
                
                // 计算相对于碎片容器的位置
                const containerOffset = elements.piecesContainer.getBoundingClientRect();
                const newLeft = slotRect.left - containerOffset.left;
                const newTop = slotRect.top - containerOffset.top;
                
                // 设置位置
                piece.style.left = `${newLeft}px`;
                piece.style.top = `${newTop}px`;
                
                // 记录碎片位置
                const pieceData = gameData.puzzlePieces.find(p => p.element === piece);
                if (pieceData) {
                    pieceData.currentRow = row;
                    pieceData.currentCol = col;
                    
                    // 检查是否正确
                    const isCorrect = pieceData.row === row && pieceData.col === col;
                    pieceData.correct = isCorrect;
                    piece.dataset.correct = isCorrect.toString();
                    
                    // 添加正确样式
                    if (isCorrect) {
                        piece.classList.add('ring-2', 'ring-green-500');
                    } else {
                        piece.classList.remove('ring-2', 'ring-green-500');
                    }
                }
                
                // 更新格子信息
                slot.piece = piece;
                
                // 移除所有高亮
                elements.puzzleGrid.children.forEach(slot => {
                    slot.classList.remove('bg-blue-100');
                });
                
                return true;
            } else {
                // 如果格子已被占用，检查是否可以交换位置
                const occupyingPiece = slot.piece;
                const occupyingPieceData = gameData.puzzlePieces.find(p => p.element === occupyingPiece);
                
                // 检查是否可以移动到碎片容器的空位置
                if (moveToEmptySpace(occupyingPiece)) {
                    // 放置到格子中
                    const slotElement = elements.puzzleGrid.children[slotIndex];
                    const slotRect = slotElement.getBoundingClientRect();
                    
                    // 计算相对于碎片容器的位置
                    const containerOffset = elements.piecesContainer.getBoundingClientRect();
                    const newLeft = slotRect.left - containerOffset.left;
                    const newTop = slotRect.top - containerOffset.top;
                    
                    // 设置位置
                    piece.style.left = `${newLeft}px`;
                    piece.style.top = `${newTop}px`;
                    
                    // 记录碎片位置
                    const pieceData = gameData.puzzlePieces.find(p => p.element === piece);
                    if (pieceData) {
                        pieceData.currentRow = row;
                        pieceData.currentCol = col;
                        
                        // 检查是否正确
                        const isCorrect = pieceData.row === row && pieceData.col === col;
                        pieceData.correct = isCorrect;
                        piece.dataset.correct = isCorrect.toString();
                        
                        // 添加正确样式
                        if (isCorrect) {
                            piece.classList.add('ring-2', 'ring-green-500');
                        } else {
                            piece.classList.remove('ring-2', 'ring-green-500');
                        }
                    }
                    
                    // 更新格子信息
                    slot.piece = piece;
                    
                    // 移除所有高亮
                    elements.puzzleGrid.children.forEach(slot => {
                        slot.classList.remove('bg-blue-100');
                    });
                    
                    return true;
                }
            }
        }
    }
    
    // 不在拼图区域内或格子已占用，重置高亮
    elements.puzzleGrid.children.forEach(slot => {
        slot.classList.remove('bg-blue-100');
    });
    
    return false;
}

// 移动到碎片容器的空位置
function moveToEmptySpace(piece) {
    const containerRect = elements.piecesContainer.getBoundingClientRect();
    const pieceSize = gameData.pieceSize;
    
    // 尝试找到空位置
    for (let attempt = 0; attempt < 50; attempt++) {
        const randomX = Math.random() * (containerRect.width - pieceSize);
        const randomY = Math.random() * (containerRect.height - pieceSize);
        
        // 检查是否与其他碎片重叠
        let overlapping = false;
        
        for (const otherPiece of gameData.puzzlePieces) {
            if (otherPiece.element === piece) continue;
            
            const otherLeft = parseFloat(otherPiece.element.style.left);
            const otherTop = parseFloat(otherPiece.element.style.top);
            
            if (otherLeft === undefined || otherTop === undefined) continue;
            
            // 简单的重叠检测
            if (
                randomX < otherLeft + pieceSize + 10 &&
                randomX + pieceSize + 10 > otherLeft &&
                randomY < otherTop + pieceSize + 10 &&
                randomY + pieceSize + 10 > otherTop
            ) {
                overlapping = true;
                break;
            }
        }
        
        if (!overlapping) {
            // 更新碎片位置
            piece.style.left = `${randomX}px`;
            piece.style.top = `${randomY}px`;
            
            // 清除格子信息
            const pieceData = gameData.puzzlePieces.find(p => p.element === piece);
            if (pieceData) {
                pieceData.currentRow = null;
                pieceData.currentCol = null;
            }
            
            // 更新格子信息
            for (const slot of gameData.puzzleGrid) {
                if (slot.piece === piece) {
                    slot.piece = null;
                    break;
                }
            }
            
            return true;
        }
    }
    
    return false;
}

// 开始计时器
function startTimer() {
    gameData.startTime = Date.now();
    gameData.elapsedTime = 0;
    
    if (gameData.timerInterval) {
        clearInterval(gameData.timerInterval);
    }
    
    gameData.timerInterval = setInterval(() => {
        gameData.elapsedTime = Math.floor((Date.now() - gameData.startTime) / 1000);
        gameData.levelElapsedTime = Math.floor((Date.now() - gameData.levelStartTime) / 1000);
        
        // 更新显示
        updateTimerDisplay();
        
        // 检查是否超时（5分钟）
        if (gameData.elapsedTime >= 300) {
            timeUp();
        }
    }, 1000);
}

// 更新计时器显示
function updateTimerDisplay() {
    const minutes = Math.floor(gameData.elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (gameData.elapsedTime % 60).toString().padStart(2, '0');
    elements.timerDisplay.textContent = `${minutes}:${seconds}`;
    
    // 时间快到时显示警告