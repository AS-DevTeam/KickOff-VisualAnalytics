import ast
import json
import re

# dict that will contain the pairs char:accent
char_soup = dict()

# if a key is not found we put it in the set
non_founded_keys = set()

# open the file with the pairs char,accent to fill the dict
with open("to_replace.txt","r") as to_replace_file:
    for line in to_replace_file:
        pair = line.split(",")
        char_soup.update({pair[0]: pair[1].replace("\n","")})

# list with relevant information about players in pappalardo's dataset
pappalardo_players = list()

# list with relevant information about teams in pappalardo's dataset
pappalardo_teams = list()

# open the file with the corrected names and fill the list
with open('pappalardo_players_fixed.txt', 'r') as fixed:
    for line in fixed:
        line = line.replace("\n", "")
        line = ast.literal_eval(line)
        pappalardo_players.append(line)

# open the file with the information about teams and store them in a list
with open('../teams.json') as json_file:
    pappa = json.load(json_file)

    for i in range(0, len(pappa)):

        # resolve all problems with strange characters for name of the teams
        keys_first = re.findall(r"\\\w{0,5}", pappa[ i ]["name"])
        if len(keys_first):
            for k in keys_first:
                if char_soup.get(k):
                    pappa[i]["name"] = \
                        pappa[i]["name"].replace(k, char_soup.get(k))
                else:
                    print("Key not found: " + k)
                    non_founded_keys.add(k)

        # here for the official names
        keys_first = re.findall(r"\\\w{0,5}", pappa[ i ][ "officialName" ])
        if len(keys_first):
            for k in keys_first:
                if char_soup.get(k):
                    pappa[i][ "officialName" ] = \
                        pappa[i][ "officialName" ].replace(k, char_soup.get(k))
                else:
                    print("Key not found: " + k)
                    non_founded_keys.add(k)

        # store the id of the team and the two names in the list
        info_team = (int(pappa[ i ][ "wyId" ]), pappa[ i ][ "officialName" ], pappa[ i ][ "name" ])
        pappalardo_teams.append(info_team)

# in the case in which some of the accent is not found
print("The list of non founded keys: (" + str(len(non_founded_keys)) + ")\n")
for key in non_founded_keys:
    print(key)

# if there are no problem with accents, then we write the file of players with their own team
if len(non_founded_keys) == 0:
    with open('pappalardo_players_fixed_with_teams.txt', 'a') as file:
        for p in pappalardo_players:
            not_found = True

            for i in pappalardo_teams:

                if p.get("teamId") == i[ 0 ]:
                    info = {
                        "lastName": p.get("lastName"),
                        "firstName": p.get("firstName"),
                        "birthDate": p.get("birthDate"),
                        "team-complete-name": i[ 1 ],
                        "team-official-name": i[ 2 ],
                        "role": p.get("role"),
                        "id": p.get("id"),
                        "wyId": p.get("wyId"),
                        "country": p.get("country"),
                        "birthCountry": p.get("birthCountry"),
                        "teamId": p.get("teamId"),
                        "nationalTeamId": p.get("nationalTeamId"),
                        "foot": p.get("foot"),
                        "age": p.get("age")
                    }

                    not_found = False

                    file.write(str(info) + "\n")

            if not_found:
                info = {
                    "lastName": p.get("lastName"),
                    "firstName": p.get("firstName"),
                    "brthDate": p.get("birthDate"),
                    "team-complete-name": "????",
                    "team-official-name": "????",
                    "role": p.get("role"),
                    "id": p.get("id"),
                    "wyId": p.get("wyId"),
                    "country": p.get("country"),
                    "birthCountry": p.get("birthCountry"),
                    "teamId": p.get("teamId"),
                    "nationalTeamId": p.get("nationalTeamId"),
                    "foot": p.get("foot"),
                    "age": p.get("age")
                }

                file.write(str(info) + "\n")
