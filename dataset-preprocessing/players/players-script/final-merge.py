# all the file with the merged players between pappalardo dataset and the fifa dataset
file_to_merge = ["first-attempt/merged-players.csv",
                 "second-attempt/latest-merged-players.csv",
                 "third-attempt/custom-value-players.csv",
                 "third-attempt/merged-players.csv"]

# the set gathering all the players from the file
players_set = set()

# header of the file
header = ""

for file in file_to_merge:
    with open(file,"r") as csv:
        header = next(csv)
        for line in csv:
            players_set.add(line.replace("????","empty"))
    csv.close()

with open("../final-merged-players/players.csv","a") as players_file:
    header = header.split(";")
    for i in range(0,len(header)):
        if i == len(header) - 1:
            players_file.write(header[ i ])
        else:
            players_file.write(header[i] + ",")

    for p in players_set:
        p = p.split(";")
        for i in range(0, len(p)):
            if i == len(p) - 1:
                players_file.write(p[ i ])
            else:
                players_file.write(p[ i ] + ",")

players_file.close()

