import json
import os
from os.path import isfile, join
import time

# URLs
url_playerRanks = "../playerank.json"
url_players = "../final-merged-players/players.csv"
url_andreaTeams = "../teams-by-andrea"
url_pappalardoTeams = "../matches"

# Dicts
# dict_playerRanks - contains the id of the players and their ranks per match
dict_playerRanks = dict()

# dict_teamRanks - contains the id of the teams and their ranks per match
dict_teamRanks = dict()

# dict_playersAndTeams - contains the id of the players and their teamid
dict_playersAndTeams = dict()

# dict_leaguesAndMatches - contains for each league the pairs matchid and
# the corresponding game week
dict_leagueAndMatches = dict()

# Sets
set_teamIds = set()

# Number of players
players_number = 0

# BUILD MATCHID-PLAYERID
with open(url_playerRanks) as json_file:
    ranks = json.load(json_file)
    # Creating the dict with the ranks of the players for every match
    # Init the dict
    for j in range(0, len(ranks)):
        if ranks[ j ][ "matchId" ] not in list(dict_playerRanks):
            dict_playerRanks.update({str(ranks[ j ][ "matchId" ]): [ ]})

    for i in range(0, len(ranks)):
        # Update case
        pair = (str(ranks[ i ][ "playerId" ]), str(ranks[ i ][ "playerankScore" ]))
        key = str(ranks[ i ][ "matchId" ])
        dict_playerRanks[ key ].append(pair)

json_file.close()

# BUILD PLAYERID-TEAMID
# Looking for teamIds
with open(url_players, "r") as csv_file:
    # Indexes of the information to store
    index_teamId = 0
    index_wyId = 0

    first_line = next(csv_file)
    first_line = first_line.split(",")

    for field in range(0, len(first_line)):
        if "teamId" == first_line[field]:
            index_teamId = field

        if "wyId" == first_line[ field ]:
            index_wyId = field

    for line in csv_file:
        players_number += 1
        line = line.split(",")

        # Add the pair playerId:teamId in the dict, in order to access
        # the teamId easily
        if line[ index_teamId ] not in "None":
            dict_playersAndTeams.update({str(line[ index_wyId ]): line[ index_teamId ]})

csv_file.close()

# Shape the dict_teamRanks with the same structure of dict_playerRanks
for k in dict_playerRanks.keys():
    # Create an empty entry for the teams in a given match
    dict_teamRanks.update({k: [ ]})

    # Store temporary values of teams for a given match, where I will store
    # all teams scores for that day
    dict_temp_teamsAndScores = dict()

    # List containing the value of the score of the player for a given match
    players_and_scores = dict_playerRanks.get(k)

    # For each player in the list we update the corresponding team
    for p in players_and_scores:
        team_score = 0.00

        # The id of the player
        playerId = p[0]
        # The score of the player
        scoreOfp = p[1]

        # Retrieve the team id of the player
        teamToUpdate = dict_playersAndTeams.get(str(playerId))

        if teamToUpdate is not None:
            if str(teamToUpdate) in list(dict_temp_teamsAndScores.keys()):
                dict_temp_teamsAndScores[ teamToUpdate ] += float(scoreOfp)

            else:
                dict_temp_teamsAndScores.update({teamToUpdate: float(scoreOfp)})

    for key, value in dict_temp_teamsAndScores.items():
        dict_teamRanks[k].append((key, value))

# Orignal files about the matches by Pappalardo
files_orginalMatches = [ join(url_pappalardoTeams, f) for f in os.listdir(url_pappalardoTeams) if
                         isfile(join(url_pappalardoTeams, f)) ]

# Remove unused files from the list
files_orginalMatches.remove(join(url_pappalardoTeams, "matches_World_Cup.json"))
files_orginalMatches.remove(join(url_pappalardoTeams, "matches_European_Championship.json"))

# Look for the pairs wyId-gameweek in the orignal files
for f in files_orginalMatches:
    with open(f) as json_file:
        league = json.load(json_file)

        # Clean name of the league
        name = f[ f.find("_") + 1: f.find(".json") ]

        # This dict will contain the pairs for a single league
        dict_temp_gameweek_wyId = dict()

        # Final dict to update
        dict_leagueAndMatches.update({name: dict()})

        for j in range(0, len(league)):
            if league[j][ "wyId" ] not in list(dict_temp_gameweek_wyId):
                dict_temp_gameweek_wyId.update({str(league[j]["wyId"]): ""})

        for i in range(0, len(league)):
            # Update case
            dict_temp_gameweek_wyId[ str(league[i]["wyId"]) ] = str(league[ i ][ "gameweek" ])

    json_file.close()

    # Update the dict
    dict_leagueAndMatches[name] = dict_temp_gameweek_wyId


# Get all the file written by @AndreaNapoletani about the performance of the teams
files_by_andrea = [join(url_andreaTeams, f) for f in os.listdir(url_andreaTeams) if isfile(join(url_andreaTeams, f)) ]

for f in files_by_andrea:
    # List with the lines to write in the new file
    list_newFileToWrite = list()

    # Clean name of the league, with the first capital letter
    name = f[ f.find("results_") + len("results_"): f.find(".csv") ].title()

    with open(f, "r") as csv_league:
        first = next(csv_league)
        split_first = first.split(",")

        index_id = 0

        counter_gamesWeeks = 0

        # Looking for Team id
        for field in range(0, len(split_first)):
            if "wiId" == split_first[ field ]:
                index_id = field

            if "gameweek" in split_first[ field ]:
                counter_gamesWeeks += 1

        # Add the field names for the scores for every gameweek
        new_first_line = ""

        # Assembling the first line of the csv
        # We reduce the lenght since the original file has empty last column
        for item in range(0, len(split_first) - 1):
            if item == len(split_first) - 2:
                new_first_line = new_first_line + split_first[ item ] + ","
            else:
                new_first_line = new_first_line + split_first[ item ] + ","

        # The same here, because we count a wrong number of columns, because
        # again the last one is empty
        for count in range(0, counter_gamesWeeks - 1):
            if count == counter_gamesWeeks - 2:
                new_first_line = new_first_line + "gamesweekScore" + str(count) + "\n"
            else:
                new_first_line = new_first_line + "gamesweekScore" + str(count) + ","

        # Append the new_first_line in the list
        list_newFileToWrite.append(new_first_line)

        # I have to access to the correct league
        gamesWeeks = dict_leagueAndMatches.get(name)

        for file_row in csv_league:
            file_row = file_row.split(",")
            teamId = file_row[ index_id ]

            # List of pairs (gameweek,score of the team)
            list_weeks_teamScore = list()
            # We use an auxiliary dict, since in a week a team can play several times
            dict_weeks_teamScore = dict()

            # For each match id
            for k in dict_teamRanks.keys():
                # For each team
                for item in dict_teamRanks.get(k):
                    # Searching for the team
                    if item[0] == teamId:
                        if gamesWeeks.get(k) is not None:
                            if gamesWeeks.get(k) in dict_weeks_teamScore.keys():
                                # Update only in the case there is a positive rank
                                if float(item[1]) > 0:
                                    dict_weeks_teamScore[gamesWeeks.get(k)] += float("%.2f" % item[1])

                            else:
                                # Discard negative values
                                if float(item[1]) > 0:
                                    dict_weeks_teamScore.update({gamesWeeks.get(k): float("%.2f" % item[1])})
                                else:
                                    dict_weeks_teamScore.update({gamesWeeks.get(k): 0.00})

            for k,v in dict_weeks_teamScore.items():
                if float(v) < 0:
                    v = 0
                    list_weeks_teamScore.append((k, float(v)))
                else:
                    # Normalized values
                    list_weeks_teamScore.append((k,float(v/players_number)*10000))

            list_weeks_teamScore = sorted(list_weeks_teamScore, key=lambda tup: int(tup[ 0 ]))

            # Now I define the row to write in the new csv file
            new_row = ""
            for item in range(0, len(file_row)):
                if item == len(file_row) - 1:
                    new_row = new_row + file_row[item].replace("\n","") + ","
                else:
                    new_row = new_row + file_row[ item ] + ","

            for item in range(0, len(list_weeks_teamScore)):
                if item == len(list_weeks_teamScore) - 1:
                    new_row = new_row + str(list_weeks_teamScore[ item ][ 1 ]) + "\n"

                else:
                    new_row = new_row + str(list_weeks_teamScore[ item ][ 1 ]) + ","

            list_newFileToWrite.append(new_row)

    csv_league.close()

    # Remove the national team, since we are not interested in it
    list_newFileToWrite = list_newFileToWrite[:-1]
    # Write the new csv file
    filename = "../teams-by-sergio/stat_" + name + ".csv"
    with open(filename, "w") as csv_to_write:
        for elem in list_newFileToWrite:
            csv_to_write.write(elem)
    csv_to_write.close()

# print(players_number)