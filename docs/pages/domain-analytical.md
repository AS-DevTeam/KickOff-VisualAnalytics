---
layout: default
title: Domain and analytical tasks
nav_order: 3
---
# Domain and analytical tasks

The first step of our work was the study of our domain of interest: the world of football. We started studying which are the most important factors that are useful to describe the performance of both teams and players. In this step, thanks to the help of the literature and existing tools like **WyScout**  and **Transfermarkt** we identify the general requirements for an effective and efficient performance evaluation system.

## Analytical Tasks
To accomplish this goal, the system was designed to address several visual analytical task categories for performance evaluation:

- **T1 Performance of the single player**. The user may want to evaluate the skills of a single player in order to know which are his best aspects and in which he is lacking.

- **T2 Performance of the single team.** The user may want to evaluate the performance of the single team during the year, see the progress of the team's score in the game weeks.

- **T3 Comparison among players**. A comparison that a user may want to do is among single players belonging to the five major leagues. This comparison can be useful to analyze particular aspects of the player's performance and compare it in order to understand which player performs better in which situation. Each player is described by 38 attributes and a special one called *Overall* that summarizes the characteristics of the player in a unique value.

- **T4 Comparison among teams.** Another comparison might be the one among the teams belonging to the same league. Compare the performance of the teams during the year and cluster them based on the result of a dimensionality-reduction algorithm calculated on six attributes.
