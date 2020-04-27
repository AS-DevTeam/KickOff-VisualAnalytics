import json
import re

"""
This script will parse the json file from Pappalardo and store in a txt file
the fixed name, the one with the accents and the old one.
"""

# dict that will contain the pairs char:accent
char_soup = dict()

# list of dict with useful information from pappalardo file
players_info = list()

# if a key is not found we put it in the set
non_founded_keys = set()

# open the file with the pairs char,accent to fill the dict
with open("to_replace.txt","r") as to_replace_file:
    for line in to_replace_file:
        pair = line.split(",")
        char_soup.update({pair[0]: pair[1].replace("\n","")})

# open the file of the players and fix the names
with open("../players.json") as json_file:
    pappalardo_players = json.load(json_file)

    for i in range(0,len(pappalardo_players)):
        old_firstname = pappalardo_players[i]["firstName"]
        old_lastname = pappalardo_players[i]["lastName"]

        # find with regular expressions the characters in the name, they
        # will be the keys to use in our dict
        keys_last = re.findall(r"\\\w{0,5}",pappalardo_players[i]["lastName"])

        # if there is a match, the list of accents is not empty we use the
        # dict to get the correct accents.
        if len(keys_last):
            for k in keys_last:
                if char_soup.get(k):
                    pappalardo_players[i]["lastName"] = \
                        pappalardo_players[i]["lastName"].replace(k,char_soup.get(k))
                else:
                    print("Key not found: " + k)
                    non_founded_keys.add(k)


        # the same for the first name
        keys_first = re.findall(r"\\\w{0,5}", pappalardo_players[i]["firstName"])
        if len(keys_first):
            for k in keys_first:
                if char_soup.get(k):
                    pappalardo_players[i]["firstName"] = \
                        pappalardo_players[i]["firstName"].replace(k,char_soup.get(k))
                else:
                    print("Key not found: " + k)
                    non_founded_keys.add(k)

        # the same for the country
        keys_first = re.findall(r"\\\w{0,5}", pappalardo_players[i]["passportArea"]["name"])
        if len(keys_first):
            for k in keys_first:
                if char_soup.get(k):
                    pappalardo_players[ i ][ "passportArea" ][ "name" ] = \
                        pappalardo_players[ i ][ "passportArea" ][ "name" ].replace(k,char_soup.get(k))
                else:
                    print("Key not found: " + k)
                    non_founded_keys.add(k)

        # the same for the country
        keys_first = re.findall(r"\\\w{0,5}", pappalardo_players[ i ][ "birthArea" ][ "name" ])
        if len(keys_first):
            for k in keys_first:
                if char_soup.get(k):
                    pappalardo_players[ i ][ "birthArea" ][ "name" ] = \
                        pappalardo_players[ i ][ "birthArea" ][ "name" ].replace(k, char_soup.get(k))
                else:
                    print("Key not found: " + k)
                    non_founded_keys.add(k)

        # print the corrected lastnames
        print("Old lastname: " + old_lastname + ", now the name is : " + pappalardo_players[i]["lastName"])

        # print the corrected firstnames
        print("Old firstname: " + old_firstname + ", now the name is : " + pappalardo_players[i]["firstName"] + "\n")
        age = 2019 - int(str(pappalardo_players[i]["birthDate"]).split("-")[0])

        info = {
            "lastName":         pappalardo_players[i]["lastName"],
            "firstName":        pappalardo_players[i]["firstName"],
            "birthDate":        pappalardo_players[i]["birthDate"],
            "role":             pappalardo_players[i]["role"]["name"],
             "id":              pappalardo_players[i]["passportArea"]["id"],
            "wyId":             pappalardo_players[i]["wyId"],
            "country":          pappalardo_players[i]["passportArea"]["name"],
            "birthCountry":     pappalardo_players[i]["birthArea"]["name"],
            "teamId":           pappalardo_players[i]["currentTeamId"],
            "nationalTeamId":   pappalardo_players[i]["currentNationalTeamId"],
            "foot":             pappalardo_players[i]["foot"],
            "age":              age
            }

        players_info.append(info)


print("The list of non founded keys: (" + str(len(non_founded_keys)) + ")\n")
for key in non_founded_keys:
    print(key)

players_info = sorted(players_info, key = lambda i: i["lastName"])
for player in players_info:
    print(player)


# save players information collected during the scanning
with open("pappalardo_players_fixed.txt","a") as names_file:
    for p in players_info:
        names_file.write(str(p) + "\n")






