import urllib3
import json
from collections import namedtuple

Event = namedtuple("Event", ['sku'])
SimpleMatch = namedtuple("Match", ['winScore', 'loseScore'])

def get_season_events(season):
    url = "https://api.vexdb.io/v1/get_events?season=" + season
    nodata_url = url + "&nodata=true"
    http=urllib3.PoolManager()
    response = http.request("GET", url)
    nodata_response = http.request("GET", nodata_url)
    data = json.loads(response.data)
    nodata_data = json.loads(nodata_response.data)
    nodata_size = nodata_data["size"]
    all_events = []
    for event in data['result']:
        all_events.append(
            Event(sku=event['sku'])
        )
    if len(all_events) != nodata_size:
        print("Error: event size mismatch:") 
        print("nodata: " + str(nodata_size) + "all_events: " + str(len(all_events)))    
    return all_events

def get_simple_matches(sku):
    url = "https://api.vexdb.io/v1/get_matches?sku=" + sku
    nodata_url = url + "&nodata=true"
    http=urllib3.PoolManager()
    response = http.request("GET", url)
    nodata_response = http.request("GET", nodata_url)
    data = json.loads(response.data)
    nodata_data = json.loads(nodata_response.data)
    nodata_size = nodata_data["size"]
    all_matches = []
    for match in data['result']:
        redScore = match['redscore']
        blueScore = match['bluescore']
        if (redScore > blueScore):
            winScore = redScore
            loseScore = blueScore
        else:
            winScore = blueScore
            loseScore = redScore
        all_matches.append(
            SimpleMatch(winScore=winScore, loseScore=loseScore)
        )
    if len(all_matches) != nodata_size:
        print("Error: match size mismatch:")
        print('sku: ' + sku) 
        print("nodata: " + str(nodata_size) + "all_events: " + str(len(all_matches)))    
    return all_matches

def get_max_score(matches):
    max_score = 0
    for match in matches:
        if match.winScore > max_score:
            max_score = match.winScore
    return max_score

def write_arrary_csv(matches, filename):
    max_score = get_max_score(matches)
    rows = []
    i = 0
    while i <= max_score:
        j = 0
        cols = []
        while j <= max_score:
            cols.append(0)
            j += 1
        rows.append(cols)
        i += 1
    for match in matches:
        rows[match.loseScore][match.winScore] += 1

    f = open(filename, 'w')
    f.write(str(max_score) + ",")
    for i, row in enumerate(rows):
        f.write("\n")
        for j, val in enumerate(row):
            if j >= i:
                f.write(str(val) + ",")


if __name__ == "__main__":
    get_season_events("Starstruck")
    matches = get_simple_matches("RE-VRC-18-5649")
    write_arrary_csv(matches, "./docs/data/demo.csv")