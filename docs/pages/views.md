---
layout: default
title: Views
nav_order: 5
has_children: true
---
# How the system is organized

KickOff is implemented as a web-based application composed of 2 main views accessible by the right side retractable menu:

- **The players view** allows the user to select players to analyze his skills and abilities (T1). It also allows a comparison between players based on their skills (T3);
- **The teams view** allows the user to analyze the trend of a single team during the season (T2) and also to compare different teams based on their results (T4).

In the upper part of each view there is also a setting bar that allows the user to tune parameters that will reflect on the components of the view, in particular: for the players view the user will be able to select the skills to be shown, for the teams view the user will able to select the championship, choose the number of clusters in which the teams will be grouped on according to the results of **K-Means** algorithm and the dimensionality-reduction algorithm to apply.

The system has a responsive layout that allows adapting the visualization of all the component of the views on different screen dimensions or different level of browser zooming.
