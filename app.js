let map = Array(),
    map2 = Array(),
    helpers = Array(),
    moveColor = 'white',
    moveFromX,
    moveFromY;
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
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            if (canMoveFrom(x, y)) {
                helpers[x][y] = 1;
            }
        }
    }
}
function markMovesTo() {
    initHelpers();
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            if (canMoveTo(x, y)) {
                helpers[x][y] = 2;
            }
        }
    }
}
function canMoveFrom(x, y) {
    return getColor(x, y) == moveColor;
}
function canMoveTo(x, y) {
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

function clickCellFrom(x, y) {
    moveFromX = x;
    moveFromY = y;
    markMovesTo();
    showMap();
}

function clickCellTo(x, y) {
    map[x][y] = map[moveFromX][moveFromY];
    map[moveFromX][moveFromY] = '';
    showMap();
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
                console.log(td.innerHTML);
                console.log(td.id);
                let x = td.id[0],
                    y = td.id[1];
                console.log(x + '' + y);
                helpers = helpers.reverse();

                if (helpers[x][y] == '1') {
                    console.log(1);
                    clickCellFrom(x, y);
                }
                if (helpers[x][y] == '2') {
                    console.log('2');
                    clickCellTo(x, y);
                } else {
                    return;
                }
            }
        });
    });
}
initMap();
markMovesFrom();
showMap();
