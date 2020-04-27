# we read all the data in order to make a file with the following format to be used to make
# the heatmap representation. The file will be structured in this way: we have tree columns,
# one for the player name, one for the variables (overall, crossing, ... ) and one for the
# corresponding value

path = "../players-by-league/"
fileNames = ["England_players.csv","France_players.csv","Germany_players.csv","Italy_players.csv","Spain_players.csv"]
for f in fileNames:
    # list for containing the result of the computation on the original dataset of players
    result = list()

    file = path + f
    with open(file,"r") as csvFile:
        firstLine = next(csvFile)
        firstLine = firstLine.replace("\n","").split(",")

        # get the fields
        header = dict()
        for i in range(21, len(firstLine)):
            header.update({i: firstLine[i]})

        for line in csvFile:
            line = line.replace("\n","").split(",")
            completeName = line[1] + " " + line[0]

            for k,v in header.items():
                if line[k] == "":
                    val = 0
                    result.append(completeName + "," + v + "," + str(int(val)))
                else:
                    if "+" in line[k]:
                        line[k] = (line[k].split("+"))[0]
                        result.append(completeName + "," + v + "," + str(int(line[k])))
                    elif "-" in line[k]:
                        line[k] = (line[k].split("-"))[0]
                        result.append(completeName + "," + v + "," + str(int(line[k])))
                    else:
                        result.append(completeName + "," + v + "," + str(int(line[ k ])))

    csvFile.close()

    # Write the final file
    with open("../heatmap-data/" + f.replace(".csv","") + "-heatmap.csv","w") as heatmapFile:
        for elem in result:
            heatmapFile.write(elem + "\n")

    heatmapFile.close()



