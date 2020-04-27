import csv
from itertools import zip_longest as izip
import os
from os.path import isfile, join
fileToTraspose = ["stat_Germany.csv","stat_Germany.csv","stat_Germany.csv"]

# Make the transpose of the file
a = izip(*csv.reader(open("../teams-by-sergio/stat_Germany.csv", "rt")))
csv.writer(open("../teams-by-sergio/transponse_stat_Germany.csv", "wt")).writerows(a)

# Lines of the file in which we are interested in
good_lines = list()

# Read the transpose file
with open("../teams-by-sergio/transponse_stat_Germany.csv","r") as csv:
    # Skip the first two lines, since we do not need the nationality nor the ids of the teams
    first_line = next(csv)
    second_line = next(csv)

    for line in csv:
        split_line = line.split(",")

        # Collect the row containing team names
        if "Name" in split_line[0]:
            good_lines.append(line.replace("\n","").replace("Name","MatchDay"))

        # Collect the row containing gameweeks
        if "gamesweekScore" in split_line[0]:
            good_lines.append(line.replace("\n","").replace("gamesweekScore","gameWeek-"))

csv.close()

with open("../teams-by-sergio/transponse_stat_Germany.csv","w") as csv:
    for elem in good_lines:
        csv.write(elem + "\n")
csv.close()


