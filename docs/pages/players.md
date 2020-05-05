---
layout: default
title: Player view
parent: Views
nav_order: 1
---

# Players view

This view implements two analytical tasks (T1 and T3) described in the in the [analytical task section](https://kickoff-va.github.io/KickOff-VisualAnalytics/pages/domain-analytical.html). It is logically divided in 2 steps:

## Filtering Step

The filtering step is represented by the upper part of the page containing 2 components: scatterplot and parallel coordinates. These two component allow a first selection of the players that will be reflected in the second step;

## Player comparison step

The player-comparison step is performed in the lower part of the page, in particular there are two components: a selection and a visual component. The player-selection part, consisting of the group of players obtained in the filtering step, allows to select each player (displayed with a card) in order to make a further and detailed investigation in the visual component, by using a barchart and a radar chart.

## The view in detail

Now let's describe each component of the view, what it represents and its main functionality.

### Players Scatterplot
In this component each player is represented by a dot whose colour depends on his role. The x-axis represents the **average score** of the player over the year and the y-axis the number of **minutes played** in the year.

This chart is useful to see the impact of a player during the year, the more the player is in the upper-right corner, the better his contribution to his team will be. On the contrary, the more his position is in the lower right corner, the less his contribution to his team will be.

### Parallel Coordinates
In this component each player is represented by a broken line whose colour depends on his role. The skills to be displayed can be selected from the dropdown list in the setting bar at the top of the page.

Thanks to this chart the user is able to see the values (approximately) of the players' selected skills.

### Barchart
In this component each player is represented by a vertical bar where the height depends on the **overall** value of the player. The colours of the bars are assigned according to a colour scale starting from intense orange to intense blue, passing through different shades of these colours (it depends on the number of selected players).

This chart allows a direct comparison among players based only on the **overall** value.

### Radar Chart
In this last component each player is represented by a polygon where each vertex represents the exact value of a skill. The colour of each player's polygon is the same as the barchart one and the thickness of the polygonal outline encodes the value of the player's **overall**. The skills to be displayed can be selected from the dropdown list in the setting bar at the top of the page.

This chart allows a direct comparison among players based on their selected skills' values.

## Interactions among components

The components of the players view are connected through interactions, it means that operation done on one of them triggers a change on one (or more) other components of the view. Let's see these interactions in detail:

1. the players scatterplot component implements a lasso function to select groups of players. This selection will be reflected on both parallel coordinates and focused players components. It also allows the user to know the complete name, the average score and the number of minutes played of a player opening a tooltip when the mouse is over the dot;

2. the parallel coordinates component allows the brush functionality. By clicking and dragging along any axis, you can specify a filter for that dimension. Also this filtering will be reflected on both players scatterplot and focused players components;

3. the focused players box shows the cards of the players selected in the filtering step. Adding one player (clicking on the "+" button) will draw his bar in the players barchart and will add the relative polygon in the radar chart;

4. the players barchart allows to focus a single player by moving the mouse over his bar, it will also highlight the relative polygon in the radar chart;
