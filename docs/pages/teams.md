---
layout: default
title: Teams view
parent: Views
nav_order: 2
---

# Teams View
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
