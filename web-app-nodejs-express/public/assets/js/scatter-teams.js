function drawScatterPlotTeams(country, alg, clust, update) {
    // add the tooltip area to the webpage



    // set alg variable

    algorithm1 = alg + "_score1";
    algorithm2 = alg + "_score2";

    // setup x 
    var xValue = function(d) {
            return d[algorithm1];
        }, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) {
            return xScale(xValue(d));
        }, // data -> display
        xAxis = d3.axisBottom(xScale);

    // setup y
    var yValue = function(d) {
            return d[algorithm2];
        }, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) {
            return yScale(yValue(d));
        }, // data -> display
        yAxis = d3.axisLeft(yScale);

    var margin = {
            top: 10,
            right: 30,
            bottom: 50,
            left: 50
        },
        width = document.getElementById("scatterplot_teams").clientWidth - 100,
        height = document.getElementById("scatterplot_teams").clientHeight - 100;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    // var color = d3.scaleOrdinal(d3.schemeCategory10);
    var color = { "0": "#1e89dc", "1": "#ecd723", "2": "#64B057", "3": "#ea2b2b", "4": "#E47DE8" };

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    d3.select("#scatterplot_teams").selectAll("svg").remove();

    var svg = d3.select("#scatterplot_teams").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("left", 1.5 + "vw")
        .style("top", 6 + "vh")
        //.attr("transform", "translate(" + -270 + "," + 0 + ")")
        .append("g")
        .attr("transform",
            "translate(" + 28 + "," + margin.top + ")");

    // Lasso functions to execute while lassoing
    var lasso_start = function() {
        lasso.items()
            .attr("r", 4.5) // reset size
            .classed("not_possible", true)
            .classed("selected", false);
    };

    var lasso_draw = function() {

        // Style the possible dots
        lasso.possibleItems()
            .classed("not_possible", false)
            .classed("possible", true);

        // Style the not possible dot
        lasso.notPossibleItems()
            .classed("not_possible", true)
            .classed("possible", false);
    };


    var nClusters = "MDS_" + clust + "cluster";

    var lasso_end = function() {
        // Reset the color of all dots
        lasso.items()
            .style("fill", function(d) {
                return color[d[nClusters]];
            })
            .classed("not_possible", false)
            .classed("possible", false);

        var selected = [];
        var deselected = [];
        // Style the selected dots
        lasso.selectedItems()
            .classed("selected", true)
            .attr("r", 9)
            .attr("fill-opacity", 1)
            .attr("id", function(d, i) {
                selected.push(d.teamName.split(' ').join(''));
                return d.teamName.split(' ').join('')
            })

        // players selected with the lasso
        var lassoSelection = lasso.selectedItems()._groups[0];

        // Array of the selected players by the lasso


        selectTeamMatrix(selected);

        // Reset the style of the not selected dots
        lasso.notSelectedItems()
            .attr("r", 4.5)
            .attr("fill-opacity", .5)
            .attr("id", function(d, i) {
                //deselectTeamMatrix(selected);
                deselected.push(d.teamName.split(' ').join(''));
                return d.teamName.split(' ').join('')
            })

        deselectTeamMatrix(deselected);

    };

    // Create the area where the lasso event can be triggered
    var lasso_area = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("opacity", 0);

    // Define the lasso
    var lasso = d3.lasso()
        .closePathDistance(75) // max distance for the lasso loop to be closed
        .closePathSelect(true) // can items be selected by closing the path?
        .hoverSelect(true) // can items by selected by hovering over them?
        .targetArea(lasso_area) // area where the lasso can be started
        .on("start", lasso_start) // lasso start function
        .on("draw", lasso_draw) // lasso draw function
        .on("end", lasso_end); // lasso end function

    // Init the lasso on the svg:g that contains the dots
    svg.call(lasso);


    var teamCountry = "assets/team_MDS_PCA_tSNE_" + country + "_2components.csv";

    d3.csv(teamCountry, function(error, data) {

        data.forEach(function(d) {
            d[algorithm1] = +d[algorithm1];
            d[algorithm2] = +d[algorithm2];
        });

        x.domain(d3.extent(data, function(d) {
            return d[algorithm1];
        })).nice();
        y.domain(d3.extent(data, function(d) {
            return d[algorithm2];
        })).nice();

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .style("font-family", "Montserrat");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-family", "Montserrat");


        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("id", function(d, i) {
                return d.teamName.split(' ').join('');
            }) // added
            .attr("class", "dot")
            .attr("r", 4.5) // size of the circles
            .attr("fill-opacity", .5) //opacity
            .attr("cx", function(d) {
                return x(d[algorithm1]);
            })
            .attr("cy", function(d) {
                return y(d[algorithm2]);
            })
            .style("fill", function(d) {
                return color[d[nClusters]];
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(d.teamName + "<br/> (" + xValue(d).toFixed(2) +
                        ", " + yValue(d).toFixed(2) + ")")
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 75) + "px")
                    .style("background-color", "#FFFFFF")
                    .style("color", "#00000");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0)
            });

        /*var xCentroids = []
        var yCentroids = []
        var size = 0;

        svg.selectAll(".dot")
                    .data(dataK)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", 5) // size of the circles
                    .attr("fill-opacity", .5) //opacity
                    .attr("cx", function(d) {
                        return x(d.xCen);
                    })
                    .attr("cy", function(d) {
                        return y(d.yCen);
                    })
                    .style("fill", "red");*/

        /*dataK.forEach(function(d) {
            if (d.nClusters == numClust && d.algorithm == "MDS") {
                xCentroids.push(d.xCen)
                yCentroids.push(d.yCen)
                size++;
                
                svg.selectAll(".dot")
                    .data(dataK)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", 5) // size of the circles
                    .attr("fill-opacity", .5) //opacity
                    .attr("cx", function(d) {
                        return x(d.xCen);
                    })
                    .attr("cy", function(d) {
                        return y(d.yCen);
                    })
                    .style("fill", "red");
            }
        });*/

        /*for (var i in xCentroids) {
            console.log(xCentroids[i])
            svg.selectAll(".dot")
                    .data(dataK)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", 5) // size of the circles
                    .attr("fill-opacity", .5) //opacity
                    .attr("cx", function(d) {
                        return x(xCentroids[i]);
                    })
                    .attr("cy", function(d) {
                        return y(yCentroids[i]);
                    })
                    .style("fill", "red");
        }*/

        lasso.items(d3.selectAll(".dot"));

        var legendColors = [];
        var dataLegend = [];

        for (var i = 0; i < clust; i++) {
            legendColors.push(color[i])
            dataLegend.push(i);
        }


        var legend = svg.selectAll(".legend")
            .data(dataLegend)
            .enter().append("g")
            .attr("class", "legend")
            .style("font-family", "Montserrat")
            .attr("transform", function(d, i) {
                return "translate(30," + i * 25 + ")";
            });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("y", function(d, i) {
                return i * 2;
            })
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", function(d) { return color[d]; });


        legend.append("text")
            .attr("x", width - 24)
            .attr("y", function(d, i) {
                return i * 2 + 5;
            })
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
                return d + 1;
            });
    });
}