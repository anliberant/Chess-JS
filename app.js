let map = Array(),
    map2 = Array(),
    helpers = Array(),
    moveColor = 'white',
    moveFromX,
    moveFromY,
    pawnAttackX,
    pawnAttackY,
    fromFigure,
    toFigure;
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
    if (figure == ' ') {
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

    return isCorrectMove(sx, sy, dx, dy);
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

function clickCellTo(toX, toY) {
    fromFigure = map[moveFromX][moveFromY];
    toFigure = map[toX][toY];

    map[toX][toY] = fromFigure;
    map[moveFromX][moveFromY] = ' ';

    checkPawnAttack(fromFigure, toX, toY);

    turnMove();
    markMovesFrom();
    showMap();
}

function checkPawnAttack(fromFigure, toX, toY) {
    if (isPawn(fromFigure)) {
        if (toX == pawnAttackX && toY == pawnAttackY) {
            if (getColor(toX, toY) == 'white') {
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
    initMap();
    markMovesFrom();
    showMap();
}
start();
