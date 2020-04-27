from script.usefulFun import *
from string import printable
import time

# list with relevant information about players in pappalardo's dataset
pappalardo_players = list()

# match counters
matches = list()

# a counter for those player that does not have a team
no_team_players = 0

# list to contain the relevant fields of the fifa files, all the files
# have the same structure
rel_fields = dict()
attributes = ["short_name","club","nationality","age"]
rel_fields = find_rel_fields('../fifa-data/fifa_20.csv',attributes)

path_to_fifa = '../fifa-data/'
fifa_files = ['fifa_20.csv','fifa_18.csv','fifa_15.csv']

# open the file with the corrected names and fill the list
with open('second-attempt/latest-not-matched-players.csv', 'r') as fixed:
    first_line = next(fixed)

    for line in fixed:
        line = line.replace("\n", "")
        line = line.split(";")
        pappalardo_players.append(line)

fixed.close()
# for each element in the list we will seek the player in the fifa dataset
# looking for a match, comparing the last name, the birth date and the
# nationality.

print("\nThe initial pappalardo's players (the not matched ones) are: " + str(len(pappalardo_players)))

for f in fifa_files:
    fileCSV = path_to_fifa + f

    # list with relevant information about players in fifa's dataset
    fifa_players = list()

    print("Now scanning: " + fileCSV)

    with open(fileCSV, 'r', encoding="utf8") as fifa:
        next(fifa)  # we skip the first line in the csv (column headers)
        for line in fifa:
            player = line.split(';')
            fifa_players.append(player)

    fifa.close()

    for p in pappalardo_players:
        not_catch = True

        # useful information of pappalardo players
        p_name = p[0] + " " + p[1]
        p_age = int(p[13])
        p_birthCountry = p[5]
        p_country = p[9]
        p_team_official = p[4]

        for player in fifa_players:
            # indexes of fields in the file
            name_index = int(rel_fields.get("short_name"))
            club_index = int(rel_fields.get("club"))
            nation_index = int(rel_fields.get("nationality"))
            age_index = int(rel_fields.get("age"))

            # get player useful characteristics
            complete_name = player[name_index].strip()
            age = int(player[age_index].strip())
            nationality = player[nation_index].strip()
            club = ''.join(char for char in player[club_index] if char in printable)

            if "." in complete_name:
                if "" == complete_name.split(".")[1].strip():
                    name = complete_name.split(".")[0].strip()

                else:
                    name = complete_name.split(".")[1].strip()

            else:
                name = complete_name

            if name in p_name:
                if nationality in p_country or p_birthCountry:
                    if abs(p_age - age) < 5:
                        match_pair = (player, p)
                        matches.append(match_pair)

                        # every time I have a match I have to remove the player from the list
                        # otherwise I may have two matches since we are dealing with two fifa
                        # files.
                        pappalardo_players.remove(p)

                        not_catch = False
                        break



print("NOT MATCHED Pappalardo players: " + str(len(pappalardo_players)) + "\n")
print("Matches (" + str(len(matches)) + ") ")
print("Of these, the one with no teams are: " + str(no_team_players))

with open('third-attempt/merged-players.csv','a') as csv_match:
    csv_match.write(make_merged_csv_header())
    for elem in matches:
        # elem[0] is the fifa player
        # elem[1] is the pappalardo player
        csv_match.write(diffStruct_merge_row_csv(elem[0], elem[1], path_to_fifa + fifa_files[0]))

csv_match.close()

with open('third-attempt/custom-value-players.csv','a') as csv_custom:
    csv_custom.write(make_merged_csv_header())
    for elem in pappalardo_players:
        castolo = castolo_type_player(elem, 'third-attempt/merged-players.csv')

        # write the player into the file
        row = ""
        for i in range(0,len(castolo)):
            if i == len(castolo) -1:
                row = row + str(castolo[i]) + "\n"
            else:
                row = row + str(castolo[i]) + ";"

        csv_custom.write(row)
csv_custom.close()




