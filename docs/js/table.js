function pageLoad(){

    var dropdown = document.querySelector('.dropdown');
    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown.classList.toggle('is-active');});

    getTableByPreset_AllTurningPoint();
}

function getTableBySku(){
    var sku = document.getElementById("sku_input").value;
    getData(sku)
}

function getTableByPreset_AllTurningPoint(){
    buildTable(turning_point_all_matches)
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


function getData(sku){
    var t0 = performance.now();
    var url = "https://api.vexdb.io/v1/get_matches?sku=" + sku;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'json';
    var all_matches = [];
    request.onload = function(e) {
        var t2 = performance.now();
        console.log("Time2: " + (t2 -t1) );
        console.log(request.status);
        console.log(request.response);
        for(let i = 0; i < request.response.result.length; i++){
            var json_match = request.response.result[i];
            var match = new SimpleMatch(
                                    redScore = json_match.redscore,
                                    blueScore = json_match.bluescore);
            all_matches.push(match);
        }
        var t3 = performance.now();
        console.log("Time3: " + (t3 -t2) );
        score_array = getScoreArray(all_matches);
        var t4 = performance.now();
        console.log("Time3: " + (t4 -t3) );
        buildTable(score_array);
        //buildTable(turning_point_all_matches)
        
        var t5 = performance.now();
        console.log("Time3: " + (t5 -t4) );
    }
    request.send(null);
    var t1 = performance.now()
    console.log("Time1: " + (t1 -t0) );
}

function getScoreArray(matchList){
    var array  = []
    var maxScore = 45; //for turning point
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

    var maxRow = scoreArray.length;
    var maxCol = scoreArray[0].length;
    var max_combined_score = 57 //for turning point
    var max_row_score = Math.floor(max_combined_score / 2) + 2 
    var season = "Turning Point" //for season dependant black boxes

    htmlString += "<tr><td id='hAxisLabel' class='axisLabel' colspan=" + (maxCol + 2) + ">Winning Team Score</td>";
    //htmlString += "<td style='width: 3px;'></td>";
    htmlString += "<td id='vAxisLabel' class='axisLabel' rowspan=" + (maxRow + 3) + "><div class='vertical'>Losing Team Score</div></td></tr>";


    for(var i = -1; i < max_row_score; i++){
        htmlString += "<tr id='row_" + i + "'>";
        for(var j = 0; j < maxCol+1; j++){
            //label row
            if(i === -1){
                //don't label top right cell
                if(j == maxCol){
                    htmlString += "<th></th>"
                }
                else{
                    htmlString += "<th id='colHeader_" + j + "'>" + j + "</th>";
                }
            }
            else{
                //row labels
                if(j == maxCol){
                    htmlString += "<th class='loseScoreLabel' id='rowHeader_" + i + "'>" + i + "</th>";
                }
                 //black squares
                else if((j <= i-1)||(j+i > max_combined_score)) {
                    htmlString += "<td class='black'></td>";
                }
                
                //color green
                else if(scoreArray[i][j] > 0){
                    htmlString += "<td id='cell_" + i + "-" + j + "' class='green'>" + scoreArray[i][j] + "</td>";
                }
                else{
                    switch(season){
                    case "Turning Point":
                        switch(j){
                            case 45:
                                switch(i){
                                    
                                    case 1:
                                    case 2:
                                    case 4:
                                    case 5:
                                    case 7:
                                    case 8:
                                    case 10:
                                    case 11:
                                        htmlString += "<td class='black'></td>";
                                        break;
                                        
                                    default:
                                        htmlString += "<td id='cell_" + i + "-" + j + "' class='blank'>0</td>";
                                        break;
                                }
                                break;
                                
                            case 44:
                                switch(i){
                                    case 2:
                                    case 5:
                                    case 8:
                                    case 11:
                                        htmlString += "<td class='black'></td>";
                                        break;
                                    default:
                                        htmlString += "<td id='cell_" + i + "-" + j + "' class='blank'>0</td>";
                                        break;
                                }
                                break;
                            
                           default:
                                        htmlString += "<td id='cell_" + i + "-" + j + "' class='blank'>0</td>";
                                        break;
                        }
                        break
                    default:
                        htmlString += "<td id='cell_" + i + "-" + j + "' class='blank'>0</td>";
                        break
                    }
                    //no color                    
                }
                 
            }



        }
        htmlString += "</tr>";
    }
    table.innerHTML = htmlString;
}

function readCSV(){
    var f = new File([""], "./data/demo.csv");
    var reader = new FileReader();
    reader.onload = function(e) {
        var text = reader.result;
    }
    reader.readAsText(f);
}