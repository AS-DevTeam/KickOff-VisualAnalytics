from string import printable
from usefulFun import merge_row_csv, make_merged_csv_header

# list with relevant information about players in pappalardo's dataset
pappalardo_players = list()

# match counters
matches = list()

# list with relevant information about players in fifa's dataset
fifa_players = list()


# unmatched list
unmatched = list()

# a counter for those player that does not have a team
no_team_players = 0

# open the file with the corrected names and fill the list
with open('second-attempt/new-version-not-matched.csv', 'r') as fixed:
    first_line = next(fixed)

    for line in fixed:
        line = line.replace("\n", "")
        line = line.split(";")
        pappalardo_players.append(line)

fixed.close()

# for each element in the list we will seek the player in the fifa dataset
# looking for a match, comparing the last name, the birth date and the
# nationality.

with open('../fifa_players.csv', 'r', encoding="utf8") as fifa:
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

        # get player useful characteristics
        complete_name = player[2].strip()
        age = int(player[3].strip())
        nationality = player[5].strip()
        club = ''.join(char for char in player[ 9 ] if char in printable)

        if "." in complete_name:
            name = complete_name.split(".")[1].strip()

        else:
            name = complete_name

        if name in p_name:
            if club in p_team_official:
                match_pair = (player, p)
                matches.append(match_pair)

                not_catch = False
                break

            elif nationality in p_country or p_birthCountry:
                if abs(p_age - age) < 4:
                    match_pair = (player, p)
                    matches.append(match_pair)

                    not_catch = False
                    break

    if not_catch:
        if "????" in p_team_official:
            no_team_players +=1

        unmatched.append(p)

print("Pappalardo players: " + str(len(pappalardo_players)) + "\n")
print("Matches (" + str(len(matches)) + ") ")
print(len(unmatched))
print("Of these, the one with no teams are: " + str(no_team_players))

with open('second-attempt/latest-merged-players.csv','a') as csv_match:
    csv_match.write(make_merged_csv_header())
    for elem in matches:
        csv_match.write(merge_row_csv(elem[0], elem[1]))

csv_match.close()

with open('second-attempt/latest-not-matched-players.csv','a') as csv:
    # first element and its keys
    csv.write(first_line)

    for elem in unmatched:
        for k in range(0, len(elem)):
            if k == len(elem) - 1:
                csv.write(str(elem[k]) + "\n")
            else:
                csv.write(str(elem[k]) + ";")

csv.close()