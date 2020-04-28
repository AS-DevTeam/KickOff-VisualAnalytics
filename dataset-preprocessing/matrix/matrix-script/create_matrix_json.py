import csv
import json

teams = list()
data = {}
data['nodes'] = []
data['links'] = []

with open('results/team_MDS_PCA_tSNE_italy.csv', 'r') as csvFile:
    csvFile.readline()
    for team in csvFile:
        team = team.split(',')
        teams.append([team[0], team[1], team[2], team[3]])
        data['nodes'].append({
            'name': team[0],
            'group': 0
        })
        
    cont = 0
    val = 0.0
    for i in range(0, len(teams)-1):
        for y in range(i+1, len(teams)):
            cont += 1
            print(str(teams[i][0] + " " + str(teams[y][0])))
            val_MDS = abs(float(teams[i][1])-float(teams[y][1]))
            val_PCA = abs(float(teams[i][2])-float(teams[y][2]))
            val_tSNE = abs(float(teams[i][3])-float(teams[y][3]))
            data['links'].append({
                'source':str(i),
                'target':str(y),
                'value_MDS': val_MDS,
                'value_PCA': val_PCA,
                'value_tSNE': val_tSNE
            })

    print(cont)       




with open('matrix_data_serieA.json', 'w') as outfile:
    json.dump(data, outfile)