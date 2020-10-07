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
    lastFigure,
    lastCellX,
    lastCellY,
    prevFigure,
    prevCellX,
    prevCellY;
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
    // map = [
    //     ['R', ' ', ' ', ' ', ' ', ' ', ' ', 'r'],
    //     ['N', ' ', ' ', ' ', ' ', ' ', ' ', 'n'],
    //     ['B', ' ', ' ', ' ', ' ', ' ', ' ', 'b'],
    //     ['Q', ' ', ' ', ' ', ' ', ' ', ' ', 'q'],
    //     ['K', ' ', ' ', ' ', ' ', ' ', ' ', 'k'],
    //     ['B', ' ', ' ', ' ', ' ', ' ', ' ', 'b'],
    //     ['N', ' ', ' ', ' ', ' ', ' ', ' ', 'n'],
    //     ['R', ' ', ' ', ' ', ' ', ' ', ' ', 'r'],
    // ];
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
    for (let sx = 0; sx <= 7; sx++) {
        for (let sy = 0; sy <= 7; sy++) {
            for (let dx = 0; dx <= 7; dx++) {
                for (let dy = 0; dy <= 7; dy++) {
                    if (canFigureMove(sx, sy, dx, dy)) {
                        helpers[sx][sy] = 1;
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
    if (!isCheck(sx, sy, dx, dy)) {
        return true;
    }
    return false;
    // return !isCheck(sx, sy, dx, dy);
}

function isCheck(sx, sy, dx, dy) {
    moveFigure(sx, sy, dx, dy, false);
    let king = findFigure('K');
    loadFigure(sx, sy, dx, dy);
}

function loadFigure(sx, sy, dx, dy) {
    map[sx][sy] = fromFigure;
    map[dx][dy] = toFigure;
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
    return false;
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
        return isCorrectSignPawnMove(sx, sy, dx, dy, +1);
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
    // if (Math.abs(dy - sy) != sign) {
    //     return false;
    // }
    //return Math.abs(dx - sy) == 1;
    return true;
}

function clickCellFrom(x, y) {
    moveFromX = x;
    moveFromY = y;
    markMovesTo();
    showMap();
}

function moveFigure(sx, sy, dx, dy, save) {
    if (!onMap(dx, dy)) {
        return false;
    }
    if (save) {
        saveLastMove(sx, sy, dx, dy);
    }
    fromFigure = map[sx][sy];
    toFigure = map[dx][dy];

    map[dx][dy] = fromFigure;
    map[sx][sy] = ' ';
}

function saveLastMove(sx, sy, dx, dy) {
    lastFigure = map[sx][sy];
    lastCellX = sx;
    lastCellY = sy;
    prevFigure = map[dx][dy];
    prevCellX = dx;
    prevCellY = dy;
}

function backFigure() {
    if (!lastFigure) {
        if (lastFigure == '') {
            infoBlock.innerHTML = '<h3>You can back only once</h3>';
        } else {
            infoBlock.innerHTML = '<h3>This is a first turn</h3>';
        }
        setTimeout(function () {
            infoBlock.innerHTML = '';
        }, 3000);
    } else {
        map[lastCellX][lastCellY] = lastFigure;
        map[prevCellX][prevCellY] = prevFigure;
        lastFigure = '';
        turnMove();
        markMovesFrom();
        showMap();
    }
}

function clickCellTo(toX, toY) {
    moveFigure(moveFromX, moveFromY, toX, toY, true);
    lastCellPown(fromFigure, toX, toY);

    checkPawnAttack(fromFigure, toX, toY);

    turnMove();
    markMovesFrom();
    showMap();
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

function checkPawnAttack(fromFigure, toX, toY) {
    if (isPawn(fromFigure)) {
        if (toX == pawnAttackX && toY == pawnAttackY) {
            if (moveColor == 'white') {
                map[toX][toY - 1] = ' ';
            } else {
                map[toX][Math.abs(toY) + 1] = ' ';
            }
        }
    }
    pawnAttackX = -1;
    pawnAttackY = -1;
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
function start() {
    moveColor = 'white';
    initMap();
    markMovesFrom();
    showMap();
}
start();
