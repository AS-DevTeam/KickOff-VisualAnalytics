import json
import re

# list of json files to open
jsonFiles = ["England.json", "France.json", "Germany.json", "Italy.json", "Spain.json" ]

# common path to the json files
path = "../matches/matches_"

# all european players
european_players = set()

#info about not matched
not_matched_info = list()

for file in jsonFiles:
    file_path = str(path + file)

    # we open each file to collect the players
    with open(file_path) as json_file:
        championship = json.loads(json_file.read())

        for i in range(0,len(championship)):
            match = championship[i]
            teamsData = match[ "teamsData" ]

            # once we get the teams we can start looking for the bench and the
            # linup and then collecting the players

            # we cycle among the teamsData.keys, we will cycle with only two values since
            # there are only teams involved in a match, identified by theri ids, corresponding
            # to the keys.
            for t in list(teamsData.keys()):
                team = teamsData.get(t)

                # collecting all players in the bench
                for i in range(0,len(team["formation"]["bench"])):
                    # print(team["formation"]["bench"][i]["playerId"])
                    pair = (team["formation"]["bench"][i]["playerId"],t)
                    european_players.add(pair)

                for j in range(0,len(team["formation"]["lineup"])):
                    # print(team["formation"]["lineup"][j]["playerId"])
                    pair = (team["formation"]["lineup"][j]["playerId"], t)
                    european_players.add(pair)


    json_file.close()

with open("first-attempt/not-matched-players.csv","r", encoding="utf8") as csv:
    first_line = next(csv)
    first_line = first_line.split(";")
    wyId = 0
    teamId = 0

    for i in range(0,len(first_line)):
        if "wyId" in str(first_line[i]):
            wyId = i

        if "teamId" in str(first_line[i]):
            teamId = i

    for line in csv:
        player = line.split(";")
        not_matched_info.append(player)

csv.close()

# dict that will contain the pairs char:accent
char_soup = dict()

# if a key is not found we put it in the set
non_founded_keys = set()

# open the file with the pairs char,accent to fill the dict
with open("to_replace.txt","r") as to_replace_file:
    for line in to_replace_file:
        pair = line.split(",")
        char_soup.update({pair[0]: pair[1].replace("\n","")})


# list with relevant information about teams in pappalardo's dataset
pappalardo_teams = list()

with open('../teams.json') as json_file:
    pappa = json.load(json_file)

    for i in range(0, len(pappa)):

        # resolve all problems with strange characters for both names of the team
        keys_first = re.findall(r"\\\w{0,5}", pappa[ i ]["name"])
        if len(keys_first):
            for k in keys_first:
                if char_soup.get(k):
                    pappa[i]["name"] = \
                        pappa[i]["name"].replace(k, char_soup.get(k))
                else:
                    print("Key not found: " + k)
                    non_founded_keys.add(k)

        # here for the official one
        keys_first = re.findall(r"\\\w{0,5}", pappa[ i ][ "officialName" ])
        if len(keys_first):
            for k in keys_first:
                if char_soup.get(k):
                    pappa[i][ "officialName" ] = \
                        pappa[i][ "officialName" ].replace(k, char_soup.get(k))
                else:
                    print("Key not found: " + k)
                    non_founded_keys.add(k)

        info_team = (int(pappa[i]["wyId"]), pappa[i]["officialName"], pappa[ i ]["name" ])
        pappalardo_teams.append(info_team)

result = list()

for elem in european_players:
    # elem is a pair constituted by an id and the team name
    for p in not_matched_info:
        # we check if the player is the same by comparing the two ids
        if int(p[wyId]) == elem[0]:
            for t in pappalardo_teams:
                # we search for the teams, by writing the correct team, since the first scan of some of
                # those players looking for the proper team did not work. If the teamId match, then:
                if int(elem[1]) == int(t[0]):
                    player_with_team = ""
                    for k in range(0,len(p)):
                        if "????" in p[k]:
                            player_with_team = player_with_team + t[2] + ";"

                        elif "null" in p[teamId] or "None" in p[teamId]:
                            player_with_team = player_with_team + t[1] + ";"

                        elif k == len(p)-1:
                            player_with_team = player_with_team + str(p[k]).replace("\n","")

                        else:
                            player_with_team = player_with_team + str(p[k]) + ";"

                    result.append(player_with_team)

                    # avoid further cycles
                    break

            # avoid further cycles
            break

# now we write a new file with the new version of not matched players not matched
with open("second-attempt/new-version-not-matched.csv","a") as new_version:

    # writing the header
    for f in range(0,len(first_line)):
        if f == len(first_line)-1:
            new_version.write(first_line[f])
        else:
            new_version.write(first_line[f] + ";")

    # writing the content
    for row in result:
        new_version.write(row + "\n")

new_version.close()











