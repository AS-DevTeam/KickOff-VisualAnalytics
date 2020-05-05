---
layout: default
title: Preprocessing
nav_order: 4
---

# Preprocessing of data
Starting from these two datasets we needed to merge information taken from both to create a single dataset containing only the data that we had to use for our visual views. We created different types of files with different structures based on the type of visualization that will use them, we can summarize them in two groups: data referred to \textbf{players} and referred to \textbf{teams}.

\par For the players we created a new CSV file that adds the information of players' skills taken from \textit{FIFA19 complete player dataset} to the "base" information of a player taken from \textit{Soccer match event dataset}.

\par For the teams we created 3 new files:
\begin{itemize}
    \item the first CSV file contains information about the total score of a team in each game week: it has been computed as the sum of the scores of all players belonging to the team in the single game week, iterated on each game week;
    \item the second CSV file contains the result of the application of 3 different dimensionality-reduction algorithms applied on 6 attributes of each team:
    \begin{itemize}
        \item \textit{number of home goals};
        \item \textit{number of away goals};
        \item \textit{number of wins};
        \item \textit{number of draws};
        \item \textit{number of defeats};
        \item \textit{total score of the team in the entire season}.
    \end{itemize}
    The algorithms used in this step are \textbf{PCA} \cite{pca}, \textbf{MDS} \cite{MDS} and \textbf{tSNE} \cite{tsne}, each of them calculated on 2 components. The file also contains the results of \textbf{K-Means} \cite{kmeans} algorithm applied on the first component of each dimensionality-reduction algorithm to group the teams in 2, 3, 4 or 5 clusters. This step required particular attention for the right tune of the parameters of each algorithm, in order to obtain coherent results;
    \item the last file is a JSON format file and contains information about the similarity among teams belonging to the same championship. The file is structured as:
    \begin{itemize}
        \item a group of \textit{nodes} with one entry for each team of the championship;
        \item a group of \textit{links} with one entry for each couple of teams and a value that represents the similarity among them (3 values based on the results of the 3 dimensionality-reduction algorithms). This value is calculated as:
    \begin{equation}\left| valueFirstTeam - valueSecondTeam \right|\end{equation}
    An example of the file structure is shown below:
    \begin{lstlisting}[language=json,firstnumber=1]
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
\end{lstlisting}
    \end{itemize}
\end{itemize}

## Technologies

\section{Technologies}
For the developing of our project we used three main technologies:
\subsection{Python}
\textbf{Python} \cite{python} has been used for the entire step of data preprocessing. It has been used for all operation of \textit{read from} and \textit{write to} CSV and JSON files and also for the application of dimensionality-reduction algorithms. In particular, for the application of PCA, MDS and tSNE we used \texttt{scikit-learn} that provides us powerful and easy to apply functions for dimensionality reduction.
\subsection{Javascript and D3.js}
\textbf{Javascript} \cite{javascript} and \textbf{D3.js} \cite{d3} have been used for the developing of the views that composes the system.
\subsection{Node.js}
\textbf{Node.js} \cite{node} has been used to build our project. It allowed us better handling of connection and also an increment of the scalability of our project.
