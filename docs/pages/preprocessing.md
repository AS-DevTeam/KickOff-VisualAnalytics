---
layout: default
title: Preprocessing
nav_order: 4
---

# Preprocessing of data
tarting from these two datasets we needed to merge information taken
from both to create a single dataset containing only the data that we
had to use for our visual views. We created different types of files
with different structures based on the type of visualization that will
use them, we can summarize them in two groups: data referred to
**players** and referred to **teams**.

For the players we created a new CSV file that adds the information of
players’ skills taken from *FIFA19 complete player dataset* to the
“base” information of a player taken from *Soccer match event dataset*.

For the teams we created 3 new files:

1. the first CSV file contains information about the total score of a
    team in each game week: it has been computed as the sum of the
    scores of all players belonging to the team in the single game week,
    iterated on each game week;

2. the second CSV file contains the result of the application of 3
    different dimensionality-reduction algorithms applied on 6
    attributes of each team:

    -   *number of home goals*;

    -   *number of away goals*;

    -   *number of wins*;

    -   *number of draws*;

    -   *number of defeats*;

    -   *total score of the team in the entire season*.

    The algorithms used in this step are **PCA** @pca, **MDS** @MDS and
    **tSNE** @tsne, each of them calculated on 2 components. The file
    also contains the results of **K-Means** @kmeans algorithm applied
    on the first component of each dimensionality-reduction algorithm to
    group the teams in 2, 3, 4 or 5 clusters. This step required
    particular attention for the right tune of the parameters of each
    algorithm, in order to obtain coherent results;

3. the last file is a JSON format file and contains information about
    the similarity among teams belonging to the same championship. The
    file is structured as:

    -   a group of *nodes* with one entry for each team of the
        championship;

    -   a group of *links* with one entry for each couple of teams and a
        value that represents the similarity among them (3 values based
        on the results of the 3 dimensionality-reduction algorithms).
        This value is calculated as:

        $$\left| valueFirstTeam - valueSecondTeam \right|$$

        An example of the file structure is shown below:

        ```json
        {
         "nodes": [
           {"name": "SPAL", "group": 0},
           {"name": "Milan", "group": 0},
            .
            .
            .
          ]


         "links": [
           {"source": "0", "target": "1",
           "value_MDS": 3.032360350838,
           "value_PCA": 2.527204736542,
           "value_tSNE": 13.708524},
            .
            .
            .
          ]
        }
        ```

## Technologies

For the developing of our project we used three main technologies:

### Python

**Python** has been used for the entire step of data
preprocessing. It has been used for all operation of *read from* and
*write to* CSV and JSON files and also for the application of
dimensionality-reduction algorithms. In particular, for the application
of PCA, MDS and tSNE we used `scikit-learn` that provides us powerful
and easy to apply functions for dimensionality reduction.

### Javascript and D3JS

**Javascript** and **D3.js** have been used for the
developing of the views that composes the system.

### NodeJS

**Node.js** has been used to build our project. It allowed us
better handling of connection and also an increment of the scalability
of our project.
