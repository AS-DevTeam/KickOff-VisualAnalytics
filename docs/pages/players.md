---
layout: default
title: Player view
parent: Views
nav_order: 1
---

# Players view

This view implements two analytical tasks (T1 and T3) described in the \textit{Section II}. It is logically divided in 2 steps: \begin{itemize}
    \item the \textbf{filtering step} is represented by the upper part of the page containing 2 components: \textit{scatterplot} and \textit{parallel coordinates}. These two component allow a first selection of the players that will be reflected in the second step;
    \item the \textbf{player-comparison step} is performed in the lower part of the page, in particular there are two components: a \textit{selection} and a \textit{visual component}. The \textit{player-selection} part (fig \ref{fig:player_selection}), consisting of the group of players obtained in the filtering step, allows to select each player (displayed with a card) in order to make a further and detailed investigation in the visual component, by using a \textit{barchart} and a \textit{radar chart}.
\end{itemize}

\begin{figure}[h]
\center
\includegraphics[scale=0.8]{images/player_selection.png}
\caption{Player Selection.}
\label{fig:player_selection}
\end{figure}

\begin{figure}[t!]
\center
\includegraphics[scale=0.5, width=\textwidth/2]{images/players_scatterplot.png}
\caption{Players Scatterplot.}
\label{fig:players_scatterplot}
\end{figure}

\subsubsection{\textbf{Players Scatterplot}} In this component (fig. \ref{fig:players_scatterplot}) each player is represented by a dot whose colour depends on his role. The x-axis represents the \textit{average score} of the player over the year and the y-axis the number of \textit{minutes played} in the year.

\par This chart is useful to see the impact of a player during the year, the more the player is in the upper-right corner, the better his contribution to his team will be. On the contrary, the more his position is in the lower right corner, the less his contribution to his team will be.
\newline
\subsubsection{\textbf{Parallel Coordinates}} In this component (fig. \ref{fig:parallel_coordinates}) each player is represented by a broken line whose colour depends on his role. The skills to be displayed can be selected from the dropdown list in the setting bar at the top of the page.

\par Thanks to this chart the user is able to see the values (approximately) of the players' selected skills.
\newline
\begin{figure}[h]
  \centering
  \includegraphics[keepaspectratio, scale=0.55, width=\textwidth/2]{images/parallel_coordinates_short.png}
  \caption{Parallel Coordinates.}
  \label{fig:parallel_coordinates}
\end{figure}

\begin{figure}[h]
\center
\includegraphics[scale=0.52, width=\textwidth/2]{images/players_barchart.png}
\caption{Players Barchart.}
\label{fig:players_barchart}
\end{figure}

\subsubsection{\textbf{Barchart}} In this component (fig. \ref{fig:players_barchart}) each player is represented by a vertical bar where the height depends on the \textit{overall} value of the player. The colours of the bars are assigned according to a colour scale starting from intense orange to intense blue, passing through different shades of these colours (it depends on the number of selected players).
\par This chart allows a direct comparison among players based only on the \textit{overall} value.



\subsubsection{\textbf{Radar Chart}}
In this last component (fig. \ref{fig:radar}) each player is represented by a polygon where each vertex represents the exact value of a skill. The colour of each player's polygon is the same as the barchart one and the thickness of the polygonal outline encodes the value of the player's \textit{overall}. The skills to be displayed can be selected from the dropdown list in the setting bar at the top of the page.

\par This chart allows a direct comparison among players based on their selected skills' values.

\begin{figure}[h]
\center
\includegraphics[scale=0.501, width=\textwidth/2]{images/radar.png}
\caption{Radar Chart.}
\label{fig:radar}
\end{figure}

\subsubsection{\textbf{Interactions among components}} The components of the \textit{players view} are connected through interactions, it means that operation done on one of them triggers a change on one (or more) other components of the view.

\par Let's see these interactions in detail:
\begin{itemize}
    \item the \textbf{players scatterplot} component implements a lasso function to select groups of players. This selection will be reflected on both \textit{parallel coordinates} and \textit{focused players} components. It also allows the user to know the complete name, the average score and the number of minutes played of a player opening a tooltip when the mouse is over the dot;
    \item the \textbf{parallel coordinates} component allows the brush functionality. By clicking and dragging along any axis, you can specify a filter for that dimension. Also this filtering will be reflected on both \textit{players scatterplot} and \textit{focused players} components;
    \item the \textbf{focused players} box shows the cards of the players selected in the \textit{filtering step}. Adding one player (clicking on the "+" button) will draw his bar in the \textit{players barchart} and will add the relative polygon in the \textit{radar chart};
    \item the \textbf{players barchart} allows to focus a single player by moving the mouse over his bar, it will also highlight the relative polygon in the \textit{radar chart};
\end{itemize}
