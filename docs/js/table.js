function pageLoad(){

  getData();
}

var mainMatches = []

class Match {
    sku = undefined
    division = undefined
    round = undefined
    instance = undefined
    matchnum = undefined
    field = undefined
    red1 = undefined
    red2 = undefined
    red3 = undefined
    redsit = undefined
    blue1 = undefined
    blue2 = undefined
    blue3 = undefined
    bluesit = undefined
    redscore = undefined
    bluescore = undefined
    scored = undefined
    scheduled = undefined
}

class SimpleMatch {
    constructor(redScore, blueScore){
        this.redScore = redScore;
        this.blueScore = blueScore;
    }

    getWinningScore(){
        if(this.redScore > this.blueScore){
            return this.redScore;
        }
        else{
            return this.blueScore;
        }
    }

    getLosingScore(){
        if(this.redScore > this.blueScore){
            return this.blueScore;
        }
        else{
            return this.redScore;
        }
    }
}


function getData(){
    
    var url = "https://api.vexdb.io/v1/get_matches?sku=RE-VRC-17-4887"
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'json';
    var all_matches = [];
    request.onload = function(e) {
        console.log(request.status);
        console.log(request.response);
        for(let i = 0; i < request.response.result.length; i++){
            var json_match = request.response.result[i];
            var match = new SimpleMatch(
                                    redScore = json_match.redscore,
                                    blueScore = json_match.bluescore);
            all_matches.push(match);
        }
        score_array = getScoreArray(all_matches);
        buildTable(score_array);
    }
    request.send(null);
}

function getScoreArray(matchList){
    var array  = []
    var maxScore = 70;
    for(var i = 0; i <= maxScore; i++){
        var row = []
        for(var j = 0; j <=maxScore; j++){
            row.push(0)
        }
        array.push(row)
    }
    for(var k = 0; k < matchList.length; k++){
        var winScore = matchList[k].getWinningScore();
        var losingScore = matchList[k].getLosingScore();
        array[losingScore][winScore] += 1;
    }
    return array;
}


function buildTable(scoreArray){
    var table = document.getElementById("scoreTable");
    var htmlString = "";

    var maxRow = 70;
    var maxCol = 70;

    for(var i = -1; i <= maxRow; i++){
        htmlString += "<tr id='row_" + i + "'>";
        for(var j = 0; j <= maxCol; j++){
            //label row
            if(i === -1){
                //don't label top right cell
                if(j > maxCol){
                    htmlString += "<th></th>"
                }
                else{
                    htmlString += "<th id='colHeader_" + j + "'>" + j + "</th>";
                }
            }
            else{
                //black squares
                if(j <= i-1){
                    htmlString += "<td class='black'></td>";
                }
                //row labels
                else if(j === maxCol + 1){
                    htmlString += "<th id='rowHeader_" + i + "'>" + i + "</th>";
                }
                //color green
                else if(scoreArray[i][j] > 0){
                    htmlString += "<td id='cell_" + i + "-" + j + "' class='green'>" + scoreArray[i][j] + "</td>";
                }
                //no color
                else{
                    htmlString += "<td id='cell_" + i + "-" + j + "' class='blank'>0</td>";
                }
            }



        }
        htmlString += "</tr>";
    }
    table.innerHTML = htmlString;
}