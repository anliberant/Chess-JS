'use strict';
const scrollToTopBtn = document.querySelector('#scrollToTopBtn'),
    backBtn = document.querySelector('#back_figure'),
    infoBlock = document.querySelector('#info'),
    newBtn = document.querySelector('#new_game');
backBtn.addEventListener('click', backFigure);
newBtn.addEventListener('click', start);
function scrollToTop() {
    document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}
scrollToTopBtn.addEventListener('click', scrollToTop);
let map = Array(),
    map2 = Array(),
    helpers = Array(),
    moveColor = 'white',
    moveFromX,
    moveFromY,
    pawnAttackX,
    pawnAttackY,
    fromFigure,
    toFigure,
    selectedFigure,
    possibleMoves,
    savePawnFigure = ' ',
    savePawnX = -1,
    savePawnY = -1,
    canWhiteCastleLeft,
    canWhiteCastleRight,
    canBlackCastleLeft,
    canBlackCastleRight,
    lastSavedMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
    mapLoaded = false,
    mapSaved = false;
function initMap() {
    map2 = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ];
    canWhiteCastleLeft = true;
    canWhiteCastleRight = true;
    canBlackCastleLeft = true;
    canBlackCastleRight = true;
    map = [
        ['R', 'P', ' ', ' ', ' ', ' ', 'p', 'r'],
        ['N', 'P', ' ', ' ', ' ', ' ', 'p', 'n'],
        ['B', 'P', ' ', ' ', ' ', ' ', 'p', 'b'],
        ['Q', 'P', ' ', ' ', ' ', ' ', 'p', 'q'],
        ['K', 'P', ' ', ' ', ' ', ' ', 'p', 'k'],
        ['B', 'P', ' ', ' ', ' ', ' ', 'p', 'b'],
        ['N', 'P', ' ', ' ', ' ', ' ', 'p', 'n'],
        ['R', 'P', ' ', ' ', ' ', ' ', 'p', 'r'],
    ];
}
function initHelpers() {
    helpers = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ];
}
function markMovesFrom() {
    initHelpers();
    possibleMoves = 0;
    for (let sx = 0; sx <= 7; sx++) {
        for (let sy = 0; sy <= 7; sy++) {
            for (let dx = 0; dx <= 7; dx++) {
                for (let dy = 0; dy <= 7; dy++) {
                    if (canFigureMove(sx, sy, dx, dy)) {
                        helpers[sx][sy] = 1;
                        possibleMoves++;
                    }
                }
            }
        }
    }
}
function markMovesTo() {
    initHelpers();
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            if (canFigureMove(moveFromX, moveFromY, x, y)) {
                helpers[x][y] = 2;
            }
        }
    }
}
function canMoveFrom(x, y) {
    if (!onMap(x, y)) {
        return false;
    }
    return getColor(x, y) == moveColor;
}
function canMoveTo(x, y) {
    if (!onMap(x, y)) {
        return false;
    }
    if (map[x][y] == ' ') {
        return true;
    } else {
        return getColor(x, y) != moveColor;
    }
}
function getColor(x, y) {
    let figure = map[x][y];
    if (figure == ' ' || figure == 'undefined' || figure == null) {
        return '';
    }
    return figure.toUpperCase() == figure ? 'white' : 'black';
}

function canFigureMove(sx, sy, dx, dy) {
    if (!canMoveFrom(sx, sy)) {
        return false;
    }
    if (!canMoveTo(dx, dy)) {
        return false;
    }
    if (!isCorrectMove(sx, sy, dx, dy)) {
        return false;
    }
    if (!isCheckAfterMove(sx, sy, dx, dy)) {
        return true;
    }
    return false;
    // return !isCheck(sx, sy, dx, dy);
}
function isCheckAfterMove(sx, sy, dx, dy) {
    moveFigure(sx, sy, dx, dy);
    turnMove();
    let check = isCheck(moveColor);
    turnMove();
    loadFigure(sx, sy, dx, dy);
    return check;
}

function isCheck(color) {
    let king = findFigure(moveColor == 'white' ? 'k' : 'K');
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            if (getColor(x, y) == color) {
                if (isCorrectMove(x, y, king.x, king.y)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isCheckMate() {
    if (!isCheck(moveColor)) {
        return false;
    }
    return possibleMoves == 0;
}

function isStaleMate(moveColor) {
    return !isCheck(moveColor) && possibleMoves == 0;
}

function loadFigure(sx, sy, dx, dy) {
    map[sx][sy] = fromFigure;
    map[dx][dy] = toFigure;
    backPawnAttack();
}

function findFigure(figure) {
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            if (map[x][y] == figure) {
                return { x: x, y: y };
            }
        }
    }
    return { x: -1, y: -1 };
}

function isCorrectMove(sx, sy, dx, dy) {
    let figure = map[sx][sy];
    if (isKing(figure)) {
        return isCorrectKingMove(sx, sy, dx, dy);
    }
    if (isQueen(figure)) {
        return isCorrectQueenMove(sx, sy, dx, dy);
    }
    if (isBishop(figure)) {
        return isCorrectBishopMove(sx, sy, dx, dy);
    }
    if (isKnight(figure)) {
        return isCorrectKnightMove(sx, sy, dx, dy);
    }
    if (isRook(figure)) {
        return isCorrectRookMove(sx, sy, dx, dy);
    }
    if (isPawn(figure)) {
        return isCorrectPawnMove(sx, sy, dx, dy);
    }
    return true;
}
function isKing(figure) {
    return figure.toUpperCase() == 'K';
}
function isQueen(figure) {
    return figure.toUpperCase() == 'Q';
}
function isBishop(figure) {
    return figure.toUpperCase() == 'B';
}
function isKnight(figure) {
    return figure.toUpperCase() == 'N';
}
function isRook(figure) {
    return figure.toUpperCase() == 'R';
}
function isPawn(figure) {
    return figure.toUpperCase() == 'P';
}

function isCorrectKingMove(sx, sy, dx, dy) {
    if (Math.abs(dx - sx) <= 1 && Math.abs(dy - sy) <= 1) {
        return true;
    }
    return canCastle(sx, sy, dx, dy);
}
function canCastle(sx, sy, dx, dy) {
    if (dy != sy) {
        return false;
    }
    if (Math.abs(dx - sx) != 2) {
        return false;
    }
    turnMove();
    let checked = isCheck(moveColor);
    turnMove();
    if (checked) {
        return false;
    }

    if (map[sx][sy] == 'K' && sx == 4 && sy == 0 && dx == 6 && dy == 0) {
        return canWhiteClRight();
    }
    if (map[sx][sy] == 'K' && sx == 4 && sy == 0 && dx == 2 && dy == 0) {
        return canWhiteClLeft();
    }
    if (map[sx][sy] == 'k' && sx == 4 && sy == 7 && dx == 6 && dy == 7) {
        return canBlackClRight();
    }
    if (map[sx][sy] == 'k' && sx == 4 && sy == 7 && dx == 2 && dy == 7) {
        return canBlackClLeft();
    }
    return false;
}
function canWhiteClRight() {
    if (!canWhiteCastleRight) {
        return false;
    }
    if (isCheck(moveColor)) {
        return false;
    }
    if (isCheckAfterMove(4, 0, 5, 0)) {
        return false;
    }
    if (!isEmpty(5, 0)) {
        return false;
    }
    if (!isEmpty(6, 0)) {
        return false;
    }
    if (map[7][0] != 'R') {
        return false;
    }
    return true;
}
function canWhiteClLeft() {
    if (!canWhiteCastleLeft) {
        return false;
    }
    if (isCheck(moveColor)) {
        return false;
    }
    if (isCheckAfterMove(4, 0, 3, 0)) {
        return false;
    }
    if (!isEmpty(3, 0)) {
        return false;
    }
    if (!isEmpty(2, 0)) {
        return false;
    }
    if (!isEmpty(1, 0)) {
        return false;
    }
    if (map[0][0] != 'R') {
        return false;
    }
    return true;
}
function canBlackClRight() {
    if (!canBlackCastleRight) {
        return false;
    }
    if (isCheck('black')) {
        return false;
    }
    if (isCheckAfterMove(4, 7, 5, 7)) {
        return false;
    }
    if (!isEmpty(5, 7)) {
        return false;
    }
    if (!isEmpty(6, 7)) {
        return false;
    }
    if (map[7][7] != 'r') {
        return false;
    }
    return true;
}
function canBlackClLeft() {
    if (!canBlackCastleLeft) {
        return false;
    }
    if (isCheck(moveColor)) {
        return false;
    }
    if (isCheckAfterMove(7, 0, 7, 0)) {
        return false;
    }
    if (!isEmpty(3, 7)) {
        return false;
    }
    if (!isEmpty(2, 7)) {
        return false;
    }
    if (!isEmpty(1, 7)) {
        return false;
    }
    if (map[0][7] != 'r') {
        return false;
    }
    return true;
}

function isCorrectQueenMove(sx, sy, dx, dy) {
    let deltaX = Math.sign(dx - sx);
    let deltaY = Math.sign(dy - sy);

    do {
        sx = Math.floor(sx) + Math.floor(deltaX);
        sy = Math.floor(sy) + Math.floor(deltaY);

        if (sx == dx && sy == dy) {
            return true;
        }
    } while (isEmpty(sx, sy));

    return false;
}
function isCorrectBishopMove(sx, sy, dx, dy) {
    let deltaX = Math.sign(dx - sx);
    let deltaY = Math.sign(dy - sy);

    if (Math.abs(deltaX) + Math.abs(deltaY) != 2) {
        return false;
    }
    do {
        sx = Math.floor(sx) + Math.floor(deltaX);
        sy = Math.floor(sy) + Math.floor(deltaY);

        if (sx == dx && sy == dy) {
            return true;
        }
    } while (isEmpty(sx, sy));

    return false;
}
function isCorrectKnightMove(sx, sy, dx, dy) {
    if (Math.abs(dx - sx) == 1 && Math.abs(dy - sy) == 2) {
        return true;
    }
    if (Math.abs(dx - sx) == 2 && Math.abs(dy - sy) == 1) {
        return true;
    }
    return false;
}
function isCorrectRookMove(sx, sy, dx, dy) {
    let deltaX = Math.sign(dx - sx);
    let deltaY = Math.sign(dy - sy);

    if (Math.abs(deltaX) + Math.abs(deltaY) != 1) {
        return false;
    }
    do {
        sx = Math.floor(sx) + Math.floor(deltaX);
        sy = Math.floor(sy) + Math.floor(deltaY);
        if (sx == dx && sy == dy) {
            return true;
        }
    } while (isEmpty(sx, sy));

    return false;
}

function isEmpty(x, y) {
    if (!onMap(x, y)) {
        return false;
    }
    return map[x][y] == ' ';
}
function onMap(x, y) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}
function isCorrectPawnMove(sx, sy, dx, dy) {
    if (sy < 1 || sy > 6) {
        return false;
    }
    if (getColor(sx, sy) == 'white') {
        return isCorrectSignPawnMove(sx, sy, dx, dy, 1);
    } else if (getColor(sx, sy) == 'black') {
        return isCorrectSignPawnMove(sx, sy, dx, dy, -1);
    } else {
        return false;
    }
}
function isCorrectSignPawnMove(sx, sy, dx, dy, sign) {
    if (isPawnPassant(sx, sy, dx, dy, sign)) {
        return true;
    }
    if (!isEmpty(dx, dy)) {
        if (Math.abs(dx - sx) != 1) {
            return false;
        }
        return dy - sy == sign;
    }
    if (dx != sx) {
        return false;
    }
    if (dy - sy == sign) {
        return true;
    }
    if (dy - sy == sign * 2) {
        if (sy != 1 && sy != 6) {
            return false;
        }
        //return isEmpty(sx, sy + sign);
        return true;
    }

    return false;
}

function isPawnPassant(sx, sy, dx, dy, sign) {
    if (!(dx == pawnAttackX && dy == pawnAttackY)) {
        return false;
    }
    if (sign == 1 && sy != 4) {
        return false;
    }
    if (sign == -1 && sy != 3) {
        return false;
    }

    if (dy - sy != sign) {
        return false;
    }
    return true;
}

function clickCellFrom(x, y) {
    moveFromX = x;
    moveFromY = y;
    markMovesTo();
    showMap();
}

function moveFigure(sx, sy, dx, dy) {
    if (!onMap(dx, dy)) {
        return false;
    }

    fromFigure = map[sx][sy];
    toFigure = map[dx][dy];

    map[dx][dy] = fromFigure;
    map[sx][sy] = ' ';
    movePawnAttack(fromFigure, dx, dy);
}

function backFigure() {
    if (!mapSaved) {
        infoBlock.innerHTML = '<h3>This is a first turn</h3>';
    }
    if (mapLoaded) {
        infoBlock.innerHTML = '<h3>You can back only once</h3>';
    }
    setTimeout(() => {
        infoBlock.innerHTML = '';
    }, 3000);
    if (mapSaved && !mapLoaded) {
        loadSavedMap();
    }
}

function clickCellTo(toX, toY) {
    saveMap();
    moveFigure(moveFromX, moveFromY, toX, toY);
    lastCellPown(fromFigure, toX, toY);

    checkPawnAttack(fromFigure, toX, toY);
    updateCastleFlags(moveFromX, moveFromY, toX, toY);
    moveCastleRook(moveFromX, moveFromY, toX, toY);
    turnMove();
    markMovesFrom();
    showMap();
    mapLoaded = false;
}
function updateCastleFlags(moveFromX, moveFromY, toX, toY) {
    let tmpFigure = map[toX][toY];
    if (tmpFigure == 'K') {
        canWhiteCastleLeft = false;
        canWhiteCastleRight = false;
    }
    if (tmpFigure == 'k') {
        canBlackCastleLeft = false;
        canBlackCastleRight = false;
    }
    if (tmpFigure == 'R' && moveFromX == 0 && moveFromY == 0) {
        canWhiteCastleLeft = false;
    }
    if (tmpFigure == 'R' && moveFromX == 7 && moveFromY == 0) {
        canWhiteCastleRight = false;
    }
    if (tmpFigure == 'r' && moveFromX == 0 && moveFromY == 7) {
        canBlackCastleLeft = false;
    }
    if (tmpFigure == 'r' && moveFromX == 7 && moveFromY == 7) {
        canBlackCastleRight = false;
    }
}
function moveCastleRook(moveFromX, moveFromY, toX, toY) {
    if (!isKing(map[toX][toY])) {
        return false;
    }
    if (Math.abs(toX - moveFromX) < 2) {
        return false;
    }
    if (toX == 6 && toY == 0) {
        map[7][0] = ' ';
        map[5][0] = 'R';
    }
    if (toX == 2 && toY == 0) {
        map[0][0] = ' ';
        map[3][0] = 'R';
    }
    if (toX == 6 && toY == 7) {
        map[7][7] = ' ';
        map[5][7] = 'r';
    }
    if (toX == 2 && toY == 7) {
        map[0][7] = ' ';
        map[3][7] = 'r';
    }
}
function lastCellPown(fromFigure, toX, toY) {
    if (!isPawn(fromFigure)) {
        return;
    }
    if (!(toY == 7 || toY == 0)) {
        return;
    }
    do {
        selectedFigure = prompt('Select a figure to promote: Q R B N', 'Q');
    } while (
        !(
            selectedFigure == 'Q' ||
            selectedFigure == 'q' ||
            selectedFigure == 'R' ||
            selectedFigure == 'r' ||
            selectedFigure == 'B' ||
            selectedFigure == 'b' ||
            selectedFigure == 'N' ||
            selectedFigure == 'n'
        )
    );
    if (moveColor == 'white') {
        selectedFigure = selectedFigure.toUpperCase();
    } else {
        selectedFigure = selectedFigure.toLowerCase();
    }
    map[toX][toY] = selectedFigure;
    // return fromFigure;
}

function movePawnAttack(fromFigure, toX, toY) {
    if (isPawn(fromFigure)) {
        if (toX == pawnAttackX && toY == pawnAttackY) {
            let y =
                moveColor == 'white' ? Math.abs(toY) - 1 : Math.abs(toY) + 1;
            savePawnFigure = map[toX][y];
            savePawnX = toX;
            savePawnY = y;
            map[toX][y] = ' ';
        }
    }
}
function backPawnAttack() {
    if (loadSavedMap) {
        return;
    }
    if (savePawnX != -1 && savePawnY != -1) {
        map[savePawnX][savePawnY] = savePawnFigure;
    }
}
function checkPawnAttack(fromFigure, toX, toY) {
    pawnAttackX = -1;
    pawnAttackY = -1;
    savePawnFigure = ' ';
    savePawnX = -1;
    savePawnY = -1;
    if (isPawn(fromFigure)) {
        if (Math.abs(toY - moveFromY)) {
            pawnAttackX = moveFromX;
            pawnAttackY = (Math.abs(moveFromY) + Math.abs(toY)) / 2;
        }
    }
}
function turnMove() {
    moveColor = moveColor == 'white' ? 'black' : 'white';
}

function figureToHtml(figure) {
    switch (figure) {
        case 'K':
            return '<span>&#9812;</span>';
        case 'k':
            return '<span>&#9818;</span>';
        case 'Q':
            return '<span>&#9813;</span>';
        case 'q':
            return '<span>&#9819;</span>';
        case 'R':
            return '<span>&#9814;</span>';
        case 'r':
            return '<span>&#9820;</span>';
        case 'B':
            return '<span>&#9815;</span>';
        case 'b':
            return '<span>&#9821;</span>';
        case 'N':
            return '<span>&#9816;</span>';
        case 'n':
            return '<span>&#9822;</span>';
        case 'P':
            return '<span>&#9817;</span>';
        case 'p':
            return '<span>&#9823;</span>';
        default:
            return '<span>&nbsp</span>';
    }
}

function showInfo() {
    let html = 'Turns: ' + moveColor + ' ';
    turnMove();
    if (isStaleMate(moveColor)) {
        html = '';
        html += '<span class="warning">STELEMATE</span>';
    }
    if (isCheck(moveColor)) {
        html += '<span class="warning">Check</span>';
    }
    if (isCheckMate(moveColor)) {
        html = '';
        html += '<span class="warning">CHECKMATE</span>';
    }
    turnMove();
    document.querySelector('#turn').innerHTML = html;
}

function showMap() {
    let color,
        html = '<table>';
    for (let i = 7; i >= 0; i--) {
        html += '<tr>';
        for (let j = 0; j <= 7; j++) {
            if (helpers[j][i] == ' ') {
                color = (j + i) % 2 ? '#E1E3E8' : '#7C8596';
            } else {
                color = helpers[j][i] == 1 ? '#aaffaa' : '#ffaaaa';
            }
            html += `<td style="background-color: ${color}" id="${j}${i}">`;
            html += figureToHtml(map[j][i]);
            html += `</td>`;

            if (j == 7) {
                html +=
                    '<td class="symbol">' +
                    String.fromCharCode(97 + i).toLocaleUpperCase() +
                    '</td>';
            }
        }
        html += '</tr>';
        if (i == 0) {
            html += '<tr>';
            for (let i = 0; i <= 7; i++) {
                html += '<td class="number">' + i + '</td>';
            }
            html += '</tr>';
        }
        showInfo();
    }
    document.querySelector('#board').innerHTML = html;
    document.querySelectorAll('td').forEach((item) => {
        item.addEventListener('click', (e) => {
            var td = e.target;
            while (td !== this && !td.matches('td')) {
                td = td.parentNode;
            }
            if (td === this) {
                console.log('No table cell found');
            } else {
                let x = td.id[0],
                    y = td.id[1];
                //  helpers = helpers.reverse();
                if (helpers[x][y] == '1') {
                    clickCellFrom(x, y);
                }
                if (helpers[x][y] == '2') {
                    clickCellTo(x, y);
                } else {
                    return;
                }
            }
        });
    });
}

function saveMap() {
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            lastSavedMap[x][y] = map[x][y];
        }
    }
    mapSaved = true;
}
function loadSavedMap() {
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            map[x][y] = lastSavedMap[x][y];
        }
    }

    mapLoaded = true;
    turnMove();
    markMovesFrom();
    showMap();
}
function start() {
    moveColor = 'white';
    initMap();
    markMovesFrom();
    showMap();
}
start();
