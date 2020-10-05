let map = Array(),
    helpers = Array(),
    moveColor = 'white';
function initMap() {
    map = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ];
}
function initHelpers() {
    helpers = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
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
function canMoveFrom(x, y) {
    if (getColor(x, y) == moveColor) {
        return true;
    } else {
        return false;
    }
}
function getColor(x, y) {
    let figure = map[x][y];
    if (figure == '') {
        return '';
    }
    return figure.toUpperCase() == figure ? 'white' : 'black';
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
        html = '<table border="1">';
    for (let i = 7; i >= 0; i--) {
        html += '<tr>';
        for (let j = 0; j <= 7; j++) {
            if (helpers[i][j] == '') {
                color = (j + i) % 2 ? '#eeffee' : '#abcdef';
            } else {
                color = helpers[i][j] == 1 ? '#aaffaa' : '#ffaaaa';
            }
            html += `<td style="background-color: ${color}" id="${j}${i + 1}">`;
            html += figureToHtml(map[i][j]);
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
}
initMap();
markMovesFrom();
showMap();

document.querySelector('table').addEventListener('click', function (event) {
    var td = event.target;
    while (td !== this && !td.matches('td')) {
        td = td.parentNode;
    }
    if (td === this) {
        console.log('No table cell found');
    } else {
        console.log(td.innerHTML);
        console.log(td.id);
    }
});
