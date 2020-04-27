# The file containing all the players
filePlayers = "../final-merged-players/players.csv"

# Path to dir containing all the teams
pathTeams = "../teams-by-sergio/"

# New dir path, for the new files of players, divided by league
pathNewDir = "../players-by-league/"

# List of the teams files to open
teamsToOpen = ["stat_England.csv", "stat_France.csv", "stat_Italy.csv", "stat_Spain.csv", "stat_Germany.csv"]

# This dict will store the wyId of the teams, divided by nation
dict_teamsWyId = {"England": list(), "France": list(), "Italy": list(), "Spain": list(), "Germany":list() }

# This dict will store the info of the players, divided by nation
dict_players = {"England": list(), "France": list(), "Italy": list(), "Spain": list(), "Germany":list() }

# For each team
for t in teamsToOpen:
    file = pathTeams + t

    # First divide by _ then take the second element, meaning the nationality name
    # then remove .csv extension, it will be used as a key, to access the dict
    keyName = t.split("_")[1].replace(".csv","")

    # We open the file and collect the wyId inside the dictionary
    with open(file,"r") as csv:
        next(csv)
        for line in csv:
            line = line.split(",")
            wyId = line[1]
            dict_teamsWyId.get(keyName).append(wyId)

    csv.close()

# We then open the player file
with open(filePlayers,"r") as csvPlayers:
    header = next(csvPlayers)

    # Searching for the team
    for line in csvPlayers:
        split_line = line.split(",")
        # Get the team id
        teamId = split_line[10]
        flag_teamFound = False

        for k in list(dict_teamsWyId.keys()):
            teams = dict_teamsWyId.get(k)
            for t in teams:
                if t == teamId:
                    dict_players.get(k).append(line)
                    flag_teamFound = True
                    break
            # No need to go over with the other keys
            if(flag_teamFound):
                break

    csvPlayers.close()

# Writing a new file for each field in the dictionary
for k,v in dict_players.items():
    fileName = k + "_players.csv"
    file = pathNewDir + fileName
    with open(file,"w") as newCsv:
        newCsv.write(header)
        for line in v:
            newCsv.write(line)
    newCsv.close()


