import json
import csv
import re

# dict that will contain the pairs char:accent
char_soup = dict()

# open the file with the pairs char,accent to fill the dict
with open("src/to_replace.txt","r", encoding="utf8") as to_replace_file:
    for line in to_replace_file:
        pair = line.split(",")
        char_soup.update({pair[0]: pair[1].replace("\n","")})


# set variables for matches of different countries
# country2 is needed for england that contains alsi teams for Walles (XWA)
country = "ESP"
country2 = ""
matches_file = 'src/matches_Spain.json'
output_file_name = 'results/teams_results_spain.csv'

if country == "DEU": nTeams = 18
else: nTeams = 20

# list that contains teams: wiId - Name - Area
teams = list()

# list that contains information about single matchs
matches_list = list()

# scan teams file and populate the list
with open('src/teams.json') as json_file:
    data = json.load(json_file)

    for i in range(0,len(data)):
        teams.append([data[i]["wyId"], data[i]["name"], data[i]["area"]["alpha3code"]])

with open(matches_file) as matches_json_file:
    matches = json.load(matches_json_file)

    for y in range(0,len(matches)):
        
        team_data = matches[y]["teamsData"]
        match_id = matches[y]["wyId"]

        id_list_home = list()
        id_list_away = list()

        # the order of 'home' and 'away' is not always the same in the matches file
        for t in list(team_data.keys()):
                team = team_data.get(t)
                if team["side"] == "home":
                    id_list_home.append(team["teamId"])
                    id_list_home.append(team["score"])
                else:
                    id_list_away.append(team["teamId"])
                    id_list_away.append(team["score"])
                
        gameweek = matches[y]["gameweek"]
        winner = matches[y]["winner"]

        # append to matches_list in order: matchId, gameweek, homeId, homeGoals, awayId, awayGoals and winnerId
        matches_list.append([match_id, gameweek, id_list_home[0], id_list_home[1], id_list_away[0], id_list_away[1], winner])


# team_list will contain all information about a single team
team_list = list()

# number of total home and away goals
home_score = 0
away_score = 0


for elem in teams:
    if elem[2] == country or elem[2] == country2:

        if country == "DEU":
            results_vec = [0] * 34
        else:
            results_vec = [0] * 38
            
        for m in matches_list:

            # if the focused team (elem[0]) is the home or away team, increment is total amount of home/away goals
            if elem[0] == m[2] or elem[0] == m[4]:
                if elem[0] == m[2]:
                    home_score = home_score + int(m[3])
                elif elem[0] == m[4]:
                    away_score = away_score + int(m[5])

                # keep track of the winner                    
                if elem[0] == m[6]: result = 1
                elif int(m[6]) == 0: result = 0
                else: result = -1

                for i in range(1,(nTeams*2)-1):
                    if i == m[1]:
                        results_vec[i-1]=result

            
        # append to team_list in order: country, teamId, name, #homeGoals, #awayGoals and the vector of season results
        team_list.append([elem[2], elem[0], elem[1], home_score, away_score, results_vec])
        home_score = 0
        away_score = 0



# write all information in a SCV file
with open(output_file_name, 'w', newline='') as output:
    writer = csv.writer(output, delimiter=",")
    if nTeams == 20:
        writer_header = csv.DictWriter(output, fieldnames = ["Nationality", "wiId", "Name", "homeGoals", "awayGoals", "gameweek0", "gameweek1", "gameweek2", "gameweek3", "gameweek4", "gameweek5", "gameweek6", "gameweek7", "gameweek8", "gameweek9"
        , "gameweek10", "gameweek11", "gameweek12", "gameweek13", "gameweek14", "gameweek15", "gameweek16", "gameweek17", "gameweek18", "gameweek19", "gameweek20", "gameweek21", "gameweek22", "gameweek23"
        , "gameweek24", "gameweek25", "gameweek26", "gameweek27", "gameweek28", "gameweek29", "gameweek30", "gameweek31", "gameweek32", "gameweek33", "gameweek34", "gameweek35", "gameweek36", "gameweek37", "gameweek38"])
    else:
        writer_header = csv.DictWriter(output, fieldnames = ["Nationality", "wiId", "Name", "homeGoals", "awayGoals", "gameweek0", "gameweek1", "gameweek2", "gameweek3", "gameweek4", "gameweek5", "gameweek6", "gameweek7", "gameweek8", "gameweek9"
        , "gameweek10", "gameweek11", "gameweek12", "gameweek13", "gameweek14", "gameweek15", "gameweek16", "gameweek17", "gameweek18", "gameweek19", "gameweek20", "gameweek21", "gameweek22", "gameweek23"
        , "gameweek24", "gameweek25", "gameweek26", "gameweek27", "gameweek28", "gameweek29", "gameweek30", "gameweek31", "gameweek32", "gameweek33", "gameweek34"])
    writer_header.writeheader()

    # trick to add season results in columns
    for elem in team_list:
        supp_list = list()
        for info in elem[5]:
            supp_list.append(info)

        keys_last = re.findall(r"\\\w{0,5}",elem[2])

        if len(keys_last):
            for k in keys_last:
                if char_soup.get(k):
                    print("si")
                    elem[2] = \
                        elem[2].replace(k,char_soup.get(k))
        
        # not so elegant, but it works
        if nTeams == 20:
            writer.writerow([elem[0], elem[1] , elem[2], elem[3], elem[4], supp_list[0], supp_list[1], supp_list[2], supp_list[3]
            , supp_list[4], supp_list[5], supp_list[6], supp_list[7], supp_list[8], supp_list[9], supp_list[10], supp_list[11]
            , supp_list[12], supp_list[13], supp_list[14], supp_list[15], supp_list[16], supp_list[17], supp_list[18], supp_list[19]
            , supp_list[20], supp_list[21], supp_list[22], supp_list[23], supp_list[24], supp_list[25], supp_list[26], supp_list[27]
            , supp_list[28], supp_list[29], supp_list[30], supp_list[31], supp_list[32], supp_list[33], supp_list[34], supp_list[35]
            , supp_list[36], supp_list[37]])
        else:
            writer.writerow([elem[0], elem[1] , elem[2], elem[3], elem[4], supp_list[0], supp_list[1], supp_list[2], supp_list[3]
            , supp_list[4], supp_list[5], supp_list[6], supp_list[7], supp_list[8], supp_list[9], supp_list[10], supp_list[11]
            , supp_list[12], supp_list[13], supp_list[14], supp_list[15], supp_list[16], supp_list[17], supp_list[18], supp_list[19]
            , supp_list[20], supp_list[21], supp_list[22], supp_list[23], supp_list[24], supp_list[25], supp_list[26], supp_list[27]
            , supp_list[28], supp_list[29], supp_list[30], supp_list[31], supp_list[32], supp_list[33]])

# print statistics of all teams of the selected country
for elem in team_list:
    print(elem)
    print('\n')



