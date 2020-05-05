// Define the div for the tooltip
var divMatrix = d3.select("body").append("div")
    .attr("class", "matrixTooltip")
    .style("opacity", 0);

function drawMatrix(selectedCountry, alg) {

    var country;

    switch (selectedCountry) {
        case "italy":
            country = "assets/matrix_data_serieA.json";
            break;
        case "spain":
            country = "assets/matrix_data_primeraDivision.json";
            break;
        case "germany":
            country = "assets/matrix_data_bundesliga.json";
            break;
        case "england":
            country = "assets/matrix_data_premierLeague.json";
            break;
        case "france":
            country = "assets/matrix_data_leagueOne.json";
            break;
    };

    var margin = { top: 120, right: 150, bottom: 150, left: 150 },
        width = document.getElementById("matrix").clientWidth - 270, //565,
        height = document.getElementById("matrix").clientHeight - 270; //565;

    /*var x = d3.scale.ordinal().rangeBands([0, width]),
        z = d3.scale.linear().domain([0,1000]).clamp(true),
        c = d3.scale.category10().domain(d3.range(10));*/

    var x = d3.scaleBand().range([0, width]),
        z = d3.scaleLinear().domain([0, 1000]).clamp(true),
        c = d3.scaleOrdinal(d3.schemeCategory10).domain(["a", "b"]);

    var colorScale = ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ae76", "#238b45", "#006d2c", "#00441b"];

    var svg = d3.select("#matrix").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        //.attr("transform", "translate(" + -200 + "," + 0 + ")")
        .append("g")
        .attr("transform", "translate(" + (margin.left + 20) + "," + margin.top + ")");



    d3.json(country, function(miserables) {
        var matrix = [],
            nodes = miserables.nodes,
            n = nodes.length;
        var indexTeams = []

        // Compute index per node.
        nodes.forEach(function(node, i) {
            node.index = i;
            node.count = 0;
            indexTeams.push([i, node.name]);
            matrix[i] = d3.range(n).map(function(j) { return { x: j, y: i, z: 0 }; });
        });


        // Convert links to matrix; count character occurrences.
        /*miserables.links.forEach(function(link) {
            matrix[link.source][link.target].z += link.value_MDS;
            matrix[link.target][link.source].z += link.value_MDS;
            matrix[link.source][link.source].z += link.value_MDS;
            matrix[link.target][link.target].z += link.value_MDS;
            nodes[link.source].count += link.value_MDS;
            nodes[link.target].count += link.value_MDS;
        });*/

        switch (alg) {
            case 'mds':
                miserables.links.forEach(function(link) {
                    matrix[link.source][link.target].z += link.value_MDS;
                    matrix[link.target][link.source].z += link.value_MDS;
                    matrix[link.source][link.source].z += link.value_MDS;
                    matrix[link.target][link.target].z += link.value_MDS;
                    nodes[link.source].count += link.value_MDS;
                    nodes[link.target].count += link.value_MDS;
                });
                break;
            case 'pca':
                miserables.links.forEach(function(link) {
                    matrix[link.source][link.target].z += link.value_PCA;
                    matrix[link.target][link.source].z += link.value_PCA;
                    matrix[link.source][link.source].z += link.value_PCA;
                    matrix[link.target][link.target].z += link.value_PCA;
                    nodes[link.source].count += link.value_PCA;
                    nodes[link.target].count += link.value_PCA;
                });
                break;
            case 'tsne':
                miserables.links.forEach(function(link) {
                    matrix[link.source][link.target].z += link.value_tSNE;
                    matrix[link.target][link.source].z += link.value_tSNE;
                    matrix[link.source][link.source].z += link.value_tSNE;
                    matrix[link.target][link.target].z += link.value_tSNE;
                    nodes[link.source].count += link.value_tSNE;
                    nodes[link.target].count += link.value_tSNE;
                });
                break;
        }

        // Precompute the orders.
        var orders = {
            name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
            count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
            group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
        };

        // The default sort order.
        x.domain(orders.name);
        //x.domain(orders.count)
        //x.domain(orders.group)

        //svg.append("rect")
        //.attr("class", "background")
        //.attr("stroke", "white") We do not want any border
        //.attr("width", width + margin.left + margin.right)
        //.attr("height", height + margin.top + margin.bottom);

        var row = svg.selectAll(".row")
            .data(matrix)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
            .each(row);

        row.append("line")
            .attr("x2", width);

        row.append("text")
            .attr("x", -6)
            .attr("y", x.bandwidth() / 2)
            // orginal no rotation and no dx
            // original dy .attr("dy", ".32em")
            .attr("dy", ".32em")
            //.attr("dx", "-1em")
            //.attr("transform", "rotate(-25)")
            .attr("text-anchor", "end")
            //.style("font-family", "Montserrat")
            .style("font-size", "15px")
            .text(function(d, i) {
                if (nodes[i].name.length >= 13) {
                    return nodes[i].name.slice(0, 13) + ".";
                } else {
                    return nodes[i].name;
                }
            })
            .attr("id", function(d, i) { return nodes[i].name.split(' ').join(''); });

        row.on("mouseover", function(d, i) { return selectTeamScatter(nodes[i].name.split(' ').join('')) })
            .on("mouseout", function(d, i) { return deselectTeamScatter(nodes[i].name.split(' ').join('')) });


        var column = svg.selectAll(".column")
            .data(matrix)
            .enter().append("g")
            .attr("class", "column")
            .style("font-family", "Montserrat Bold")
            .style("font-size", "15px")
            .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

        column.append("line")
            .attr("x1", -width);

        column.append("text")
            .attr("x", 6)
            .attr("y", x.bandwidth() / 2)
            // orginal no rotation and no dx
            // original dy .attr("dy", ".32em")
            .attr("dy", "-1em")
            .attr("dx", "1em")
            .attr("transform", "rotate(45)")
            .attr("text-anchor", "start")
            //.style("font-family", "Montserrat")
            .text(function(d, i) {
                if (nodes[i].name.length >= 13) {
                    return nodes[i].name.slice(0, 13) + ".";
                } else {
                    return nodes[i].name;
                }
            })
            .attr("id", function(d, i) { return nodes[i].name.split(' ').join('') });

        column.on("mouseover", function(d, i) { return selectTeamScatter(nodes[i].name.split(' ').join('')) })
            .on("mouseout", function(d, i) { return deselectTeamScatter(nodes[i].name.split(' ').join('')) });

        var file = "assets/transponse_stat_" + String(selectedCountry).toLocaleLowerCase() + ".csv";

        function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row.filter(function(d) { return d.z; }))
                .enter().append("rect")
                .on("click", function(d) {
                    var xTeam;
                    var yTeam;
                    //console.log(d.x);
                    for (var i in indexTeams) {
                        if (d.x == indexTeams[i][0]) {
                            //console.log(indexTeams[i][1])
                            yTeam = indexTeams[i][1];
                        }
                        if (d.y == indexTeams[i][0]) {
                            //console.log(indexTeams[i][1])
                            xTeam = indexTeams[i][1];
                        }
                    }
                    //console.log("x: " + xTeam)
                    //console.log("y: " + yTeam)
                    var teamsVec = [xTeam, yTeam];
                    drawTeamsTrend(file, 'first', teamsVec);
                    setActualTeamsBarchart(teamsVec);
                })
                .attr("class", "cell")
                .attr("rx", 4) // To make rounded corners
                .attr("ry", 4) // To make rounded corners
                .attr("x", function(d) { return x(d.x); })
                .attr("width", x.bandwidth() - 1.5)
                .attr("height", x.bandwidth() - 1.5)
                .style("fill", function(d) {
                    switch (selectedCountry) {
                        case 'italy':
                            switch (alg) {
                                case 'mds':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 0.752) { return colorScale[0] }
                                        if (d.z >= 0.753 && d.z <= 1.5) { return colorScale[1] }
                                        if (d.z >= 1.501 && d.z <= 2.248) { return colorScale[2] }
                                        if (d.z >= 2.249 && d.z <= 2.996) { return colorScale[3] }
                                        if (d.z >= 2.997 && d.z <= 3.744) { return colorScale[4] }
                                        if (d.z >= 3.745 && d.z <= 4.492) { return colorScale[5] }
                                        if (d.z >= 4.493 && d.z <= 5.24) { return colorScale[6] }
                                        if (d.z >= 5.241 && d.z <= 5.988) { return colorScale[7] }
                                        if (d.z >= 5.989 && d.z <= 9.736) { return colorScale[8] }
                                    }
                                    break;
                                case 'pca':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 0.861) { return colorScale[0] }
                                        if (d.z >= 0.862 && d.z <= 1.691) { return colorScale[1] }
                                        if (d.z >= 1.692 && d.z <= 2.521) { return colorScale[2] }
                                        if (d.z >= 2.522 && d.z <= 3.351) { return colorScale[3] }
                                        if (d.z >= 3.352 && d.z <= 4.181) { return colorScale[4] }
                                        if (d.z >= 4.182 && d.z <= 5.011) { return colorScale[5] }
                                        if (d.z >= 5.012 && d.z <= 5.841) { return colorScale[6] }
                                        if (d.z >= 5.842 && d.z <= 6.671) { return colorScale[7] }
                                        if (d.z >= 6.672 && d.z <= 9.501) { return colorScale[8] }
                                    }
                                    break;
                                case 'tsne':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 10.816) { return colorScale[0] }
                                        if (d.z >= 10.817 && d.z <= 21.46) { return colorScale[1] }
                                        if (d.z >= 21.461 && d.z <= 32.104) { return colorScale[2] }
                                        if (d.z >= 32.105 && d.z <= 42.748) { return colorScale[3] }
                                        if (d.z >= 42.749 && d.z <= 53.392) { return colorScale[4] }
                                        if (d.z >= 53.393 && d.z <= 64.036) { return colorScale[5] }
                                        if (d.z >= 64.037 && d.z <= 74.68) { return colorScale[6] }
                                        if (d.z >= 74.681 && d.z <= 85.324) { return colorScale[7] }
                                        if (d.z >= 85.325 && d.z <= 98.968) { return colorScale[8] }
                                    }
                                    break;
                            }
                            break;
                        case 'spain':
                            switch (alg) {
                                case 'mds':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 0.985) { return colorScale[0] }
                                        if (d.z >= 0.986 && d.z <= 1.966) { return colorScale[1] }
                                        if (d.z >= 1.967 && d.z <= 2.947) { return colorScale[2] }
                                        if (d.z >= 2.948 && d.z <= 3.928) { return colorScale[3] }
                                        if (d.z >= 3.929 && d.z <= 4.909) { return colorScale[4] }
                                        if (d.z >= 4.91 && d.z <= 5.89) { return colorScale[5] }
                                        if (d.z >= 5.891 && d.z <= 6.871) { return colorScale[6] }
                                        if (d.z >= 6.872 && d.z <= 7.852) { return colorScale[7] }
                                        if (d.z >= 7.853 && d.z <= 10.833) { return colorScale[8] }
                                    }
                                    break;
                                case 'pca':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 1.003) { return colorScale[0] }
                                        if (d.z >= 1.004 && d.z <= 1.984) { return colorScale[1] }
                                        if (d.z >= 1.985 && d.z <= 2.965) { return colorScale[2] }
                                        if (d.z >= 2.966 && d.z <= 3.946) { return colorScale[3] }
                                        if (d.z >= 3.947 && d.z <= 4.927) { return colorScale[4] }
                                        if (d.z >= 4.928 && d.z <= 5.908) { return colorScale[5] }
                                        if (d.z >= 5.909 && d.z <= 6.889) { return colorScale[6] }
                                        if (d.z >= 6.89 && d.z <= 7.87) { return colorScale[7] }
                                        if (d.z >= 7.871 && d.z <= 10.851) { return colorScale[8] }
                                    }
                                    break;
                                case 'tsne':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 50.362) { return colorScale[0] }
                                        if (d.z >= 50.363 && d.z <= 99.931) { return colorScale[1] }
                                        if (d.z >= 99.932 && d.z <= 149.5) { return colorScale[2] }
                                        if (d.z >= 149.501 && d.z <= 199.069) { return colorScale[3] }
                                        if (d.z >= 199.07 && d.z <= 248.638) { return colorScale[4] }
                                        if (d.z >= 248.639 && d.z <= 298.207) { return colorScale[5] }
                                        if (d.z >= 298.208 && d.z <= 347.776) { return colorScale[6] }
                                        if (d.z >= 347.777 && d.z <= 397.345) { return colorScale[7] }
                                        if (d.z >= 397.346 && d.z <= 480.914) { return colorScale[8] }
                                    }
                                    break;
                            }
                            break;
                        case 'england':
                            switch (alg) {
                                case 'mds':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 0.954) { return colorScale[0] }
                                        if (d.z >= 0.955 && d.z <= 1.903) { return colorScale[1] }
                                        if (d.z >= 1.904 && d.z <= 2.852) { return colorScale[2] }
                                        if (d.z >= 2.853 && d.z <= 3.801) { return colorScale[3] }
                                        if (d.z >= 3.802 && d.z <= 4.75) { return colorScale[4] }
                                        if (d.z >= 4.751 && d.z <= 5.699) { return colorScale[5] }
                                        if (d.z >= 5.7 && d.z <= 6.648) { return colorScale[6] }
                                        if (d.z >= 6.649 && d.z <= 7.597) { return colorScale[7] }
                                        if (d.z >= 7.598 && d.z <= 10.546) { return colorScale[8] }
                                    }
                                    break;
                                case 'pca':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 1.03) { return colorScale[0] }
                                        if (d.z >= 1.031 && d.z <= 2.034) { return colorScale[1] }
                                        if (d.z >= 2.035 && d.z <= 3.038) { return colorScale[2] }
                                        if (d.z >= 3.039 && d.z <= 4.042) { return colorScale[3] }
                                        if (d.z >= 4.043 && d.z <= 5.046) { return colorScale[4] }
                                        if (d.z >= 5.047 && d.z <= 6.05) { return colorScale[5] }
                                        if (d.z >= 6.051 && d.z <= 7.054) { return colorScale[6] }
                                        if (d.z >= 7.055 && d.z <= 8.058) { return colorScale[7] }
                                        if (d.z >= 8.059 && d.z <= 10.062) { return colorScale[8] }
                                    }
                                    break;
                                case 'tsne':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 7.659) { return colorScale[0] }
                                        if (d.z >= 7.66 && d.z <= 15.242) { return colorScale[1] }
                                        if (d.z >= 15.243 && d.z <= 22.825) { return colorScale[2] }
                                        if (d.z >= 22.826 && d.z <= 30.408) { return colorScale[3] }
                                        if (d.z >= 30.409 && d.z <= 37.991) { return colorScale[4] }
                                        if (d.z >= 37.992 && d.z <= 45.574) { return colorScale[5] }
                                        if (d.z >= 45.575 && d.z <= 53.157) { return colorScale[6] }
                                        if (d.z >= 53.158 && d.z <= 60.74) { return colorScale[7] }
                                        if (d.z >= 60.741 && d.z <= 70.323) { return colorScale[8] }
                                    }
                                    break;
                            }
                            break;
                        case 'france':
                            switch (alg) {
                                case 'mds':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 0.8994) { return colorScale[0] }
                                        if (d.z >= 0.9 && d.z <= 1.784) { return colorScale[1] }
                                        if (d.z >= 1.785 && d.z <= 2.669) { return colorScale[2] }
                                        if (d.z >= 2.67 && d.z <= 3.554) { return colorScale[3] }
                                        if (d.z >= 3.555 && d.z <= 4.4399) { return colorScale[4] }
                                        if (d.z >= 4.44 && d.z <= 5.324) { return colorScale[5] }
                                        if (d.z >= 5.325 && d.z <= 6.209) { return colorScale[6] }
                                        if (d.z >= 6.21 && d.z <= 7.094) { return colorScale[7] }
                                        if (d.z >= 7.095 && d.z <= 9.979) { return colorScale[8] }
                                    }
                                    break;
                                case 'pca':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 0.901) { return colorScale[0] }
                                        if (d.z >= 0.902 && d.z <= 1.788) { return colorScale[1] }
                                        if (d.z >= 1.789 && d.z <= 2.675) { return colorScale[2] }
                                        if (d.z >= 2.676 && d.z <= 3.562) { return colorScale[3] }
                                        if (d.z >= 3.563 && d.z <= 4.449) { return colorScale[4] }
                                        if (d.z >= 4.45 && d.z <= 5.336) { return colorScale[5] }
                                        if (d.z >= 5.337 && d.z <= 6.223) { return colorScale[6] }
                                        if (d.z >= 6.224 && d.z <= 7.11) { return colorScale[7] }
                                        if (d.z >= 7.111 && d.z <= 9.997) { return colorScale[8] }
                                    }
                                    break;
                                case 'tsne':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 2.0 && d.z <= 22.576) { return colorScale[0] }
                                        if (d.z >= 22.577 && d.z <= 42.784) { return colorScale[1] }
                                        if (d.z >= 42.785 && d.z <= 62.992) { return colorScale[2] }
                                        if (d.z >= 62.993 && d.z <= 83.2) { return colorScale[3] }
                                        if (d.z >= 83.201 && d.z <= 103.408) { return colorScale[4] }
                                        if (d.z >= 103.409 && d.z <= 123.616) { return colorScale[5] }
                                        if (d.z >= 123.617 && d.z <= 143.824) { return colorScale[6] }
                                        if (d.z >= 143.825 && d.z <= 164.032) { return colorScale[7] }
                                        if (d.z >= 164.033 && d.z <= 188.24) { return colorScale[8] }
                                    }
                                    break;
                            }
                            break;
                        case 'germany':
                            switch (alg) {
                                case 'mds':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 1.037) { return colorScale[0] }
                                        if (d.z >= 1.038 && d.z <= 2.062) { return colorScale[1] }
                                        if (d.z >= 2.063 && d.z <= 3.087) { return colorScale[2] }
                                        if (d.z >= 3.088 && d.z <= 4.112) { return colorScale[3] }
                                        if (d.z >= 4.113 && d.z <= 5.137) { return colorScale[4] }
                                        if (d.z >= 5.138 && d.z <= 6.162) { return colorScale[5] }
                                        if (d.z >= 6.163 && d.z <= 7.187) { return colorScale[6] }
                                        if (d.z >= 7.188 && d.z <= 8.212) { return colorScale[7] }
                                        if (d.z >= 8.213 && d.z <= 10.237) { return colorScale[8] }
                                    }
                                    break;
                                case 'pca':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 0.0 && d.z <= 1.063) { return colorScale[0] }
                                        if (d.z >= 1.064 && d.z <= 2.098) { return colorScale[1] }
                                        if (d.z >= 2.099 && d.z <= 3.133) { return colorScale[2] }
                                        if (d.z >= 3.134 && d.z <= 4.168) { return colorScale[3] }
                                        if (d.z >= 4.169 && d.z <= 5.203) { return colorScale[4] }
                                        if (d.z >= 5.204 && d.z <= 6.238) { return colorScale[5] }
                                        if (d.z >= 6.239 && d.z <= 7.273) { return colorScale[6] }
                                        if (d.z >= 7.274 && d.z <= 8.308) { return colorScale[7] }
                                        if (d.z >= 8.309 && d.z <= 10.343) { return colorScale[8] }
                                    }
                                    break;
                                case 'tsne':
                                    if (d.x == d.y) {
                                        return colorScale[0];
                                    } else {
                                        if (d.z >= 1.0 && d.z <= 71.887) { return colorScale[0] }
                                        if (d.z >= 71.888 && d.z <= 142.113) { return colorScale[1] }
                                        if (d.z >= 142.114 && d.z <= 212.339) { return colorScale[2] }
                                        if (d.z >= 212.34 && d.z <= 282.565) { return colorScale[3] }
                                        if (d.z >= 282.566 && d.z <= 352.791) { return colorScale[4] }
                                        if (d.z >= 352.792 && d.z <= 423.017) { return colorScale[5] }
                                        if (d.z >= 423.018 && d.z <= 493.243) { return colorScale[6] }
                                        if (d.z >= 493.244 && d.z <= 563.469) { return colorScale[7] }
                                        if (d.z >= 563.47 && d.z <= 640.695) { return colorScale[8] }
                                    }
                                    break;
                            }
                            break;
                    }
                })
                //.style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
                .style("color", c("b"))
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
        }

        function mouseover(p) {

            d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
            d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
            for (var i in indexTeams) {
                if (p.x == indexTeams[i][0]) {
                    selectTeamScatter(indexTeams[i][1].split(' ').join(''));
                }
            }
            divMatrix.transition()
                .duration(500)
                .style("opacity", 1);

            var value = parseFloat(p.z).toPrecision(4).toString();

            divMatrix
                .html(value)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 12) + "px");
            //selectTeamScatter(p.x);
        }

        function mouseout(p) {
            //console.log(p.x);
            d3.selectAll("text").classed("active", false);
            for (var i in indexTeams) {
                if (p.x == indexTeams[i][0]) {
                    deselectTeamScatter(indexTeams[i][1].split(' ').join(''));
                }
            }

            divMatrix.transition()
                .duration(500)
                .style("opacity", 0);
        }




        /*d3.select("#order").on("change", function() {
            clearTimeout(timeout);
            //order(this.value_MDS);
        });*/

        // uncomment it for auto-order after 5 seconds

        /*function order(value_MDS) {
            x.domain(orders[value_MDS]);

            var t = svg.transition().duration(2500);

            t.selectAll(".row")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
            .selectAll(".cell")
                .delay(function(d) { return x(d.x) * 4; })
                .attr("x", function(d) { return x(d.x); });

            t.selectAll(".column")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
        }

        var timeout = setTimeout(function() {
            order("group");
            d3.select("#order").property("selectedIndex", 2).node().focus();
        }, 5000);*/
        var gridSize = Math.floor(width / 24);
        var legendElementWidth = gridSize * 2;

        for (c in colorScale) {
            svg.append("rect")
                .attr("x", function() { return (legendElementWidth + 19) * c; })
                .attr("y", height + margin.top)
                .attr("width", legendElementWidth + 19)
                .attr("height", gridSize / 2)
                .style("stroke", "#818181")
                .style("fill", function() { return colorScale[c]; });
            if (c % 2) {
                if (c == 1) {
                    svg.append("text")
                        .text("very similar")
                        .attr("text-ancor", "end")
                        .attr("fill", "white")
                        .attr("font-size", "9px")
                        .attr("x", function(d, i) { return (legendElementWidth + 19) * c; })
                        .attr("y", height + margin.top - 10);
                } else if (c == 3) {
                    svg.append("text")
                        .text("quite similar")
                        .attr("fill", "white")
                        .attr("font-size", "9px")
                        .attr("x", function(d, i) { return (legendElementWidth + 19) * c; })
                        .attr("y", height + margin.top - 10);
                } else if (c == 5) {
                    svg.append("text")
                        .text("dissimilar")
                        .attr("fill", "white")
                        .attr("font-size", "9px")
                        .attr("x", function(d, i) { return (legendElementWidth + 19) * c; })
                        .attr("y", height + margin.top - 10);
                } else {
                    svg.append("text")
                        .text("very dissimilar")
                        .attr("fill", "white")
                        .attr("font-size", "9px")
                        .attr("x", function(d, i) { return (legendElementWidth + 19) * c; })
                        .attr("y", height + margin.top - 10);
                }
            }
        }
    });

}