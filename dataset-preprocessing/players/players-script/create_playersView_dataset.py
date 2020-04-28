import csv
import json

playerank = list()
players = list()

# populate playerRank list with player id, match id and score of the player in the match
# one element of the list for each match of the player and relative score
with open('src/playerank.json') as json_file:
    data = json.load(json_file)

    for i in range(0,len(data)):
        playerank.append([data[i]["playerId"], data[i]["matchId"], data[i]["playerankScore"], data[i]["minutesPlayed"]])

# populate player list with first name, last name and id
# each element of the list represents a player with information about him
with open("src/players.csv", "r", encoding="utf8") as csv_file:
    first_line = next(csv_file)
    first_line = first_line.split(",")
    player_id = 0
    lastName = 0
    firstName = 0
    role = 0

    for i in range(0, len(first_line)):
        if "wyId" in str(first_line[i]):
            player_id = i

        if "lastName" in str(first_line[i]):
            lastName = i

        if "firstName" in str(first_line[i]):
            firstName = i

        if "role" in str(first_line[i]):
            role = i

    for line in csv_file:
        player = line.split(",")
        players.append([player[firstName], player[lastName], player[player_id], player[role]])

csv_file.close()

list_player = list()

# for each player sum the score of each match that he plays and write the results on a csv
with open('results/players_with_ranks.csv', 'w', newline='', encoding="utf8") as output:
    writer = csv.writer(output, delimiter=",")
    writer_header = csv.DictWriter(output, fieldnames=["firstName", "lastName", "wiId", "averageScore", "minutesPlayed", "role"])
    writer_header.writeheader()
    for p in players:
        mPlayed = 0
        score = 0
        for r in playerank:
            if int(p[2]) == int(r[0]):
                if float(r[2]) < 0:
                    score += 0
                else:
                    score += float(r[2])
                mPlayed += int(r[3])
        writer.writerow([p[0], p[1], p[2], score*100, mPlayed, p[3]])



#writer.writerow([p[0], int(p[1]), float(r[2])])

'''with open('results/players_with_ranks.csv', 'w', newline='', encoding="utf8") as output:
    writer = csv.writer(output, delimiter=",")
    writer_header = csv.DictWriter(output, fieldnames=["lastName", "wiId", "averageScore"])
    writer_header.writeheader()
    for i in list_player:
        #player_name = i[0]
        for p in list_player:
            if p[0] == i[0]:
                print("yes")
                rank = float(score) + float(p[2])
        #writer.writerow([i[0], i[1], score])
        #print(i[0], i[1], score)'''













