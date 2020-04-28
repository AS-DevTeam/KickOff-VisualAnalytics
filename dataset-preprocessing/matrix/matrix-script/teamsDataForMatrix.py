import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import manifold
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn import preprocessing

teams = list()
MDS_results = list()
PCA_results = list()
tSNE_results = list()


# create file with: name, home goals, away goals, number of wins, number of draws and number of defeats

def createFilesForReduction():

    teams = list()

    with open("src/teams_results_italy.csv", "r") as teamsFile:
        teamsFile.readline()
        for line in teamsFile:
            wins = 0
            draws = 0
            defeats = 0
            score = 0
            line = line.split(",")

            # loop on results of 38 gamesweek

            for i in range(6, 43):
                if line[i] == "1":
                    wins += 1
                elif line[i] == "0":
                    draws += 1
                else:
                    defeats += 1
            
            # loop on scores of 38 gamesweek

            for i in range(44, 81):
                score = score + float(line[i])


            teams.append([line[2], int(line[3]), int(line[4]), wins, draws, defeats, score])

        return teams

    with open ("results/teams_for_reduction.csv", "w") as output:
        writer = csv.writer(output, delimiter=",")
        writer_header = csv.DictWriter(output, fieldnames=["teamName", "homeGoals", "awayGoals", "numWins", "numDraws", "numDefeats", "score"])
        writer_header.writeheader()
        for i in teams:
            writer.writerow(i)
            

def generate_MDS_output():
    #cluster 1 range is [0:7], cluster 2 range is [7:13]
    data = pd.io.parsers.read_csv(
        'results/teams_for_reduction.csv', 
        header=0,
        usecols=[1,2,3,4,5,6]
        )
    d=data.values[:,1:]
    s_id=data.values.T[0]


    #data standardization
    std_scale = preprocessing.StandardScaler().fit(d)
    d= std_scale.transform(d)   

    mds = manifold.MDS(n_components=1, dissimilarity="euclidean",random_state=2)
    pos = mds.fit(d).embedding_

    return pos


def generate_PCA_output():
    d=np.genfromtxt('results/teams_for_reduction.csv',skip_header=1,usecols=[1,2,3,4,5,6],delimiter=',')
    
    #normalize the data with StandardScaler
    d_std = preprocessing.StandardScaler().fit_transform(d)
    #compute PCA
    d_std = preprocessing.StandardScaler().fit_transform(d)
    pca=PCA(n_components=1)
    dpca=pca.fit_transform(d_std)
    
    return dpca

def generate_tSNE_output():
    RS = 20150101

    data = pd.io.parsers.read_csv(
        'results/teams_for_reduction.csv', 
        header=0,
        usecols=[1,2,3,4,5,6]
        )
    d=data.values[:,1:]

    digits_proj_tsne = TSNE(random_state=RS, n_components=1).fit_transform(d)

    return digits_proj_tsne


#createFilesForReduction()
#MDS()
teams = createFilesForReduction()
MDS_result = generate_MDS_output()
PCA_result = generate_PCA_output()
tSNE_results = generate_tSNE_output()
print(tSNE_results)


# create output file with values of MDS, PCA and tSNE algorithms

with open("results/team_MDS_PCA_tSNE_italy.csv", "w") as output:
    writer = csv.writer(output, delimiter=",")
    writer_header = csv.DictWriter(output, fieldnames=["teamName", "MDS_score", "PCA_score", "tSNE_score"])
    writer_header.writeheader()
    for i in range(0, len(MDS_result)):
        writer.writerow([teams[i][0], MDS_result[i][0], PCA_result[i][0], tSNE_results[i][0]])