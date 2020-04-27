# we import ast for using "literal_eval(node_or_string)": (from the man)
#   Safely evaluate an expression node or a string containing a Python
#   expression.  The string or node provided may only consist of the following
#   Python literal structures: strings, numbers, tuples, lists, dicts, booleans,
#   and None.
import ast
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
with open('pappalardo_players_fixed_with_teams.txt', 'r') as fixed:
    for line in fixed:
        line = line.replace("\n", "")
        line = ast.literal_eval(line)
        pappalardo_players.append(line)

# for each element in the list we will seek the player in the fifa dataset
# looking for a match, comparing the last name, the birth date and the
# nationality.

with open('../fifa_players.csv', 'r', encoding="utf8") as fifa:
    next(fifa)  # we skip the first line in the csv (column headers)
    for line in fifa:
        player = line.split(';')
        fifa_players.append(player)

for p in pappalardo_players:
    not_catch = True

    # useful information of pappalardo players
    p_name = p.get("lastName")
    p_age = p.get("age")
    p_birthCountry = p.get("birthCountry")
    p_country = p.get("country")
    p_team_official = p.get("team-official-name")
    p_team_complete = p.get("team-complete-name")

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
            if "????" in p_team_complete or "????" in p_team_official:
                if nationality in p_country or p_birthCountry:
                    if abs(p_age - age) < 4:
                        match_pair = (player,p)
                        matches.append(match_pair)

                        not_catch = False
                        break
            else:
                if club in p_team_official or club in p_team_complete:
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

with open('first-attempt/merged-players.csv','a') as csv_match:
    csv_match.write(make_merged_csv_header())
    for elem in matches:
        csv_match.write(merge_row_csv(elem[0 ], elem[1 ]))

csv_match.close()

with open('first-attempt/not-matched-players.csv','a') as csv:
    # first element and its keys
    first = list(unmatched[0].keys())

    # make the header of the csv file
    for k in range(0,len(first)):
        if k == len(first) - 1:
            csv.write(first[k] + "\n")
        else:
            csv.write(first[k] + ";")

    for elem in unmatched:
        keys = list(elem.keys())
        for k in range(0, len(keys)):
            if k == len(first) - 1:
                csv.write(str(elem.get(keys[k])) + "\n")
            else:
                csv.write(str(elem.get(keys[k])) + ";")

csv.close()