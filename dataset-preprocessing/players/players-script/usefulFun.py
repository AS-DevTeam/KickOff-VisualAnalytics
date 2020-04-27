import ast
import random
import re

# this function helps in creating the formatted row of the player obtained by merging the fifa players
# with the one of the pappalardo's dataset
def merge_row_csv(fifaPlayer, pappaPlayer):
    # empty row
    row = ""

    # there are two different cases depending if the the player in the pappalardo's dataset is
    # stored in a dictionary or in simple list. In each case we return the final row.
    if "dict" in str(type(pappaPlayer)):
        # if it is a dict we write the content of all its values
        for k in pappaPlayer.keys():
            row = row + str(pappaPlayer.get(k)) + ";"

        # we need to add only some of the extra attributes in the fifa dataset, some attributes
        # are just a repetition of the team, the nationality, ... . In particular we are interested
        # in the skills values and some additional field such as the player picture.
        photo = fifaPlayer[4]
        flag = fifaPlayer[6]
        overall = fifaPlayer[7]
        club_logo = fifaPlayer[10]

        row = row + photo + ";" + flag + ";" + club_logo + ";" + overall + ";"

        for f in range(12, len(fifaPlayer)):
            if f == len(fifaPlayer) - 1:
                row = row + str(fifaPlayer[f])

            else:
                row = row + str(fifaPlayer[f]) + ";"

        return row

    else:
        # in case of a list we simply pick each element of the list and we concatenate it with the row
        for k in range(0, len(pappaPlayer)):
            row = row + str(pappaPlayer[k]) + ";"

        photo = fifaPlayer[ 4 ]
        flag = fifaPlayer[ 6 ]
        overall = fifaPlayer[ 7 ]
        club_logo = fifaPlayer[ 10 ]

        row = row + photo + ";" + flag + ";" + club_logo + ";" + overall + ";"

        for f in range(12, len(fifaPlayer)):
            if f == len(fifaPlayer) - 1:
                row = row + str(fifaPlayer[f])

            else:
                row = row + str(fifaPlayer[f]) + ";"

        return row


# this function makes the header of the file that contains the merged players between the two dataset. At the
# end we return the well-formed header
def make_merged_csv_header():
    # this list will contains all the names of the attributes necessary for the player, that are taken
    # from the pappalardo players, like lastName, firstName, ...
    pappaPlayer = list()
    header = ""

    # this attributes are the keys of the dictionaries stored in this file, where a single dictionary
    # contains relevant information about a single pappalardo's player. We just extract one single player.
    with open('pappalardo_players_fixed_with_teams.txt', 'r') as fixed:
        line = next(fixed)
        line = line.replace("\n", "")
        line = ast.literal_eval(line)
        pappaPlayer.append(line)
    fixed.close()


    for k in list(pappaPlayer[0].keys()):
        header = header + str(k) + ";"

    # again we do not need all the information of the fifa dataset, so we just use some of them
    # as described in the function above.

    with open('../fifa_players.csv', 'r', encoding="utf8") as fifa:
        row = next(fifa)  # we take the first line in the csv (column headers)
    fifa.close()

    row = row.split(";")
    photo = row[ 4 ]
    flag = row[ 6 ]
    overall = row[ 7 ]
    club_logo = row[ 10 ]

    header = header + photo + ";" + flag + ";" + club_logo + ";" + overall + ";"

    for f in range(12, len(row)):
        if f == len(row) - 1:
            header = header + str(row[ f ])
        else:
            header = header + str(row[ f ]) + ";"

    # at the end we return the well formed header
    return header

# this function helps in creating the formatted row of the player obtained by merging the fifa players
# with the one of the pappalardo's dataset. Here we have a different situation from the previous function.
def diffStruct_merge_row_csv(fifaPlayer, pappaPlayer, fileCSV):
    # empty row
    row = ""

    # this case is different from the previous since this function is used in the case of other fifa files,
    # having a different structure from the fifa19 dataset.

    if "dict" in str(type(pappaPlayer)):
        # if it is a dict we write the content of all its values
        for k in pappaPlayer.keys():
            row = row + str(pappaPlayer.get(k)) + ";"

        # we need to add only some of the extra attributes in the fifa dataset, some attributes
        # are just a repetition of the team, the nationality, ... . In particular we are interested
        # in the skills values and some additional field such as the player picture.

        photo = "https://cdn.sofifa.org/players/4/19/"
        club = "empty"
        flag = "empty"
        attributesToSearch = ["sofifaid","overall", "weak_foot", "skill_moves","team_jersey_number","attacking_crossing"]

        # search the relevant fields
        index_and_fields = find_rel_fields(fileCSV, attributesToSearch)

        photo = photo + fifaPlayer[index_and_fields.get("sofifaid")]
        overall = fifaPlayer[index_and_fields.get("overall")]
        weak_foot = fifaPlayer[index_and_fields.get("weak_foot")]
        skill_moves = fifaPlayer[index_and_fields.get("skill_moves")]
        jersey_number = fifaPlayer[index_and_fields.get("team_jersey_number")]

        row = row + photo + ";" + flag + ";" + club + ";" + overall + ";" + weak_foot + ";" + skill_moves + ";" + jersey_number + ";"


        for f in range(index_and_fields.get("attacking_crossing"), len(fifaPlayer)):
            if f == len(fifaPlayer) - 1:
                row = row + str(fifaPlayer[f])

            else:
                row = row + str(fifaPlayer[f]) + ";"

        return row

    else:
        # in case of a list we simply pick each element of the list and we concatenate it with the row
        for k in range(0, len(pappaPlayer)):
            row = row + str(pappaPlayer[k]) + ";"

        # we need to add only some of the extra attributes in the fifa dataset, some attributes
        # are just a repetition of the team, the nationality, ... . In particular we are interested
        # in the skills values and some additional field such as the player picture.

        photo = "https://cdn.sofifa.org/players/4/19/"
        club = "empty"
        flag = "empty"
        attributesToSearch = [ "sofifa_id", "overall", "weak_foot", "skill_moves", "team_jersey_number",
                               "attacking_crossing" ]

        # search the relevant fields
        index_and_fields = find_rel_fields(fileCSV, attributesToSearch)

        photo = photo + fifaPlayer[ index_and_fields.get("sofifa_id") ] + ".png"
        overall = fifaPlayer[ index_and_fields.get("overall") ]
        weak_foot = fifaPlayer[ index_and_fields.get("weak_foot") ]
        skill_moves = fifaPlayer[ index_and_fields.get("skill_moves") ]
        jersey_number = fifaPlayer[ index_and_fields.get("team_jersey_number") ]

        row = row + photo + ";" + flag + ";" + club + ";" + overall + ";" + weak_foot + ";" + skill_moves + ";" + jersey_number + ";"

        for f in range(index_and_fields.get("attacking_crossing"), len(fifaPlayer)):
            if f == len(fifaPlayer) - 1:
                row = row + str(fifaPlayer[f])

            else:
                row = row + str(fifaPlayer[ f ]) + ";"

        return row




# This function is used to search the attributes in which we are interested in within a
# csv file; it is particular useful, because the different fifa files are structured in
# a different way, since they do not came from the same author.
def find_rel_fields(fileCSV, attributesToSearch):
    rel_fields = dict()

    with open(fileCSV,"r") as csv:
        first_line = next(csv)
    csv.close()

    for attr in attributesToSearch:
        if "," in first_line:
            fields = first_line.split(",")
            for f in range(0, len(fields)):
                if str(fields[f]).strip() == attr:
                    rel_fields.update({attr: f})

        elif ";" in first_line:
            fields = first_line.split(";")
            for f in range(0, len(fields)):
                if str(fields[f]).strip() == attr:
                    rel_fields.update({attr: int(f)})

        else:
            print("This is not a csv.")


    return rel_fields

# This function assign some values to the unmatched players
def castolo_type_player(unmatched_player,fileCSV):
    castolo_type = unmatched_player
    attributes_to_assign = list()

    # the file csv is the one were i can retrieve the field that the
    # unmatched player should have. Typically this file will have the same
    # structure of the .csv containing the merged players.
    with open(fileCSV,"r") as csv:
        first_line = next(csv)
    csv.close()

    # I need only the additional fifa fields, not the one of the unmatched player
    start = len(unmatched_player)

    if "," in first_line:
        fields = first_line.split(",")
        for f in range(start, len(fields)):
            attributes_to_assign.append(fields[f])

    elif ";" in first_line:
        fields = first_line.split(";")
        for f in range(start, len(fields)):
            attributes_to_assign.append(fields[f])


    else:
        print("This is not a csv.")

    print(attributes_to_assign)
    # assign custom values to the attributes
    for attr in attributes_to_assign:
        if "Photo" in attr:
            castolo_type.append("empty")

        elif "Flag" in attr:
            castolo_type.append("empty")

        elif "Club" in attr:
            castolo_type.append("empty")

        elif "Weak" in attr:
            val = random.randrange(0, 5, 1)
            castolo_type.append(val)

        elif "Skill" in attr:
            val = random.randrange(0, 5, 1)
            castolo_type.append(val)
        elif "Jersey" in attr:
            castolo_type.append("empty")

        else:
            val = random.randrange(60,89,1)
            castolo_type.append(val)

    return castolo_type

# fix the strange chars
def fix_hell_chars(to_correct):
    # dict that will contain the pairs char:accent
    char_soup = dict()

    # if a key is not found we put it in the set
    non_founded_keys = set()

    # open the file with the pairs char,accent to fill the dict
    with open("to_replace.txt", "r") as to_replace_file:
        for line in to_replace_file:
            pair = line.split(",")
            char_soup.update({pair[ 0 ]: pair[ 1 ].replace("\n", "")})

    to_replace_file.close()

    keys_last = re.findall(r"\\\w{0,5}", to_correct)

    # if there is a match, the list of accents is not empty we use the
    # dict to get the correct accents.
    if len(keys_last):
        for k in keys_last:
            if char_soup.get(k):
               to_correct = to_correct.replace(k, char_soup.get(k))
            else:
                print("Key not found: " + k)
                non_founded_keys.add(k)

    return to_correct



