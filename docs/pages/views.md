---
layout: default
title: Views
nav_order: 5
---
KickOff is implemented as a web-based application composed of 2 main views accessible by the right side retractable menu (fig. \ref{fig:menu}):
\begin{itemize}
    \item \textbf{players view} allows the user to select players to analyze his skills and abilities (T1). It also allows a comparison between players based on their skills (T3);
    \item \textbf{teams view} allows the user to analyze the trend of a single team during the season (T2) and also to compare different teams based on their results (T4).
\end{itemize}

\par In the upper part of each view there is also a setting bar that allows the user to tune parameters that will reflect on the components of the view, in particular: for the \textit{players view} the user will be able to select the skills to be shown, for the \textit{teams view} the user will able to select the championship, choose the number of clusters in which the teams will be grouped on according to the results of \textit{K-Means} algorithm and the dimensionality-reduction algorithm to apply.
\newline
\par The system has a responsive layout that allows adapting the visualization of all the component of the views on different screen dimensions or different level of browser zooming.
\begin{figure}[h]
\center
\includegraphics[scale=0.52]{images/menù.png}
\caption{Lateral menu.}
\label{fig:menu}
\end{figure}

\subsection{Players view}
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


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\subsection{Teams View}
This view implements two analytical tasks (T2 and T4) described in the \textit{Section II}. It is divided in three visualization: the \textit{teams scatterplot} and the \textit{matrix} giving an overview of the teams' performance, the \textit{teams barchart} allowing direct comparison between two teams.

\subsubsection{\textbf{Teams Scatterplot}} In this component (fig. \ref{fig:teams_scatterplot}) each team is represented by a dot whose colour depends on the cluster it belongs to. The position of the dot in the chart depends on the results of the dimensionality-reduction algorithm (2 components) applied on the team's attributes as explained in \textit{section III}. For this reason, both x-axis and y-axis are meaningless but the user can obtain information about teams seeing their position: the closer they are, the more their performances are similar.

\begin{figure}[h]
\center
\includegraphics[scale=0.5, width=\textwidth/2]{images/teams_scatterplot.png}
\caption{Teams Scatterplot.}
\label{fig:teams_scatterplot}
\end{figure}

\subsubsection{\textbf{Matrix}} In this component the teams are represented on both rows and columns. The cell encodes the information about the \textit{dissimilarity} between the teams identified by that row and column using a  9 levels green color scale \cite{colorbrewer}.
\begin{figure}[h]
\center
\includegraphics[scale=0.36, width=\textwidth/2]{images/matrix.png}
\caption{Matrix.}
\label{fig:matrix}
\end{figure}

\par This chart (fig. \ref{fig:matrix}) allows a comparison among teams' performance, in particular, for each couple of teams the higher is the intensity of the green, the more they have different performance, on the contrary, the lower is the intensity, the more the teams will have similar performance.
\newline

\subsubsection{\textbf{Teams Barchart}} In this component, each bar represents the total score of a team in a game week. If 2 teams are selected will be shown two adjacent bars, one for each team, for the half of the total number of game weeks, otherwise, if just 1 team is selected will be shown just one bar for each game week. The second half of game weeks results is accessible by clicking on the "Second round" button.

\par This chart (fig. \ref{fig:teams_barchart}) allows the user to directly compare the trend of 1 or 2 teams during the season and analyze which game week had the best performance.

\begin{figure}[h]
\center
\includegraphics[scale=0.4, width=\textwidth/2]{images/teams_barchart.png}
\caption{Teams Barchart.}
\label{fig:teams_barchart}
\end{figure}

\subsubsection{\textbf{Interactions among components}}
The components of the \textit{teams view} are connected through interactions, it means that operation done on one of them triggers a change on one (or more) other components of the view.

\par Let's see these interactions in detail:
\begin{itemize}
    \item the \textbf{teams scatterplot} component implements a lasso function to select groups of teams. This selection will be reflected on the \textit{matrix} highlighting the corresponding name of selected teams. It also allows the user to know the complete name of a team opening a tooltip when the mouse is over the dot;
    \item the \textbf{matrix} component allows exploiting the mouse over function on a cell to individuate the position of the corresponding teams on the \textit{teams scatterplot}. Is possible to select 1 or 2 teams by clicking on a cell, it will reflect the selection on the \textit{teams barchart} updating the bars. It also allows the user to know the value of the \textit{dissimilarity} opening a tooltip when the mouse is over the cell;
    \item the \textbf{teams barchart} component allows to exploit the mouse over function on a bar to highlights the corresponding team on both the \textit{teams scatterplot} and \textit{matrix} components. It also allows the user to know the complete name of the team and the corresponding score value opening a tooltip when the mouse is over the bar of a game week.
\end{itemize}
