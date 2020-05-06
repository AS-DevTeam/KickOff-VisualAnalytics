---
layout: default
title: Dataset
nav_order: 3
---
# Dataset
To implement the views described above, we needed lots of details about teams and players' skills. At the moment of the creation of our system, we were no able to find a single open-source dataset that includes all the information that we need. For that reason, we decided to insert a preliminary step of data preprocessing in order to merge information coming from two different open-source datasets taken from Kaggle [kaggle](https://www.kaggle.com/) and FigShare [figShare](https://figshare.com/).
A short description of the two datasets is shown above:

## Soccer event dataset

[Soccer match event dataset] (https://figshare.com/collections/Soccer_match_event_dataset/4415000) is composed by 8 files containing information about Coaches, Referees, Players, Teams, Competitions, Events, Matches and Players ranks. All these files are in described in a JSON format so that, for example, a single team is described as:
```json
{   "city": "Milano",
    "name": "Milan",
    "wyId": 3157,
    "officialName": "AC Milan",
        "area": {
            "name": "Italy",
            "id": "380",
            "alpha3code": "ITA",
            "alpha2code": "IT"
            },
    "type": "club"
}
```
We decided to don't use *Coaches*, *Events* and *Referees* files that contain information that is not useful for our purpose. Let's see the content of the other files, describing their most important fields:

- **Players** contains information about each player: personal information, identifier of the current club, role and the unique identifier;
- **Teams** contains information about each team: name of the city, name of the team, the geographic area that belongs to, the type (club/national) and the unique identifier;
- **Matches** contains information about each match of the year: the identifier of the competition, the week of the league that belongs to, the unique identifier, the winner and other detailed information;
- **Competitions** contains information the leagues: the geographic area associated with the league, the name, the type (for club/international) and the unique identifier;
- **PlayeRanks** contains information about the performance of a single player in a match: identifier of the match, the identifier of the player, the number of minutes played, the role in the match, the number of goals scored and the score obtained by the player in the match.


## FIFA 19 complete player dataset

[FIFA 19 complete player dataset](https://www.kaggle.com/karangadiya/fifa19/data#) is composed by one single file in CSV format with 18206 players and 88 attributes per player. Each row of the file represent a single player described by name, ID, age, link of the photo (if available), nationality, market value, club, preferred foot, other information and 60 attributes strictly related to player's football skills (ex: Crossing, Finishing, Passing ecc.)
