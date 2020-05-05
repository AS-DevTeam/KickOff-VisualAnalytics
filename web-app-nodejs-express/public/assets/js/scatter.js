function drawScatterPlot(chosenAttributes, userSelection) {
    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip-scatterplot")
        .style("opacity", 0);

    // setup x 
    var xValue = function(d) {
            return d.averageScore / 38;
        }, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) {
            return xScale(xValue(d));
        }, // data -> display
        xAxis = d3.axisBottom(xScale);

    // setup y
    var yValue = function(d) {
            return d.minutesPlayed;
        }, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) {
            return yScale(yValue(d));
        }, // data -> display
        yAxis = d3.axisLeft(yScale);

    var margin = {
            top: 10,
            right: 60,
            bottom: 60,
            left: 50
        },
        width = document.getElementById("scatterplot").clientWidth - margin.left - margin.right,
        height = document.getElementById("scatterplot").clientHeight - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    // var color = d3.scaleOrdinal(d3.schemeCategory10);
    var color = { "Goalkeeper": "#1e89dc", "Defender": "#ecd723", "Midfielder": "#64B057", "Forward": "#ea2b2b" };

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    d3.select("#scatterplot").selectAll("svg").remove();

    var svg = d3.select("#scatterplot").append("svg")
        .attr("width", document.getElementById("scatterplot").clientWidth)
        .attr("height", height + "vh")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Lasso functions to execute while lassoing
    var lasso_start = function() {
        lasso.items()
            .attr("r", 3.5) // reset size
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

    var lasso_end = function() {
        // Reset the color of all dots
        lasso.items()
            .style("fill", function(d) {
                return color[d.role];
            })
            .classed("not_possible", false)
            .classed("possible", false);

        // Style the selected dots
        lasso.selectedItems()
            .classed("selected", true)
            .attr("r", 7)
            .attr("fill-opacity", 1);

        // players selected with the lasso
        var lassoSelection = lasso.selectedItems()._groups[0];

        // Array of the selected players by the lasso
        var selected = [];
        for (var i in lassoSelection) {
            selected.push(JSON.parse(lassoSelection[i].attributes.data.value))
        }

        // Use the function of the parallel coordinates to print a card
        // for eache selected player
        applySelection(selected);

        // In the case I use the lasso for selecting the player, I must
        // redraw the parallel coordinate graph
        drawParallelCoordinates(chosenAttributes, userSelection, selected);

        // Reset the style of the not selected dots
        lasso.notSelectedItems()
            .attr("r", 3.5)
            .attr("fill-opacity", .5);

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

    d3.csv("assets/players.csv", function(error, data) {
        data.forEach(function(d) {
            d.averageScore = +d.averageScore;
            d.minutesPlayed = +d.minutesPlayed;
        });

        x.domain(d3.extent(data, function(d) {
            return d.averageScore / 38;
        })).nice();
        y.domain(d3.extent(data, function(d) {
            return d.minutesPlayed;
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
            .style("font-family", "Montserrat")
            .text("Average Score");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-family", "Montserrat")
            .text("Minutes Played");

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("id", function(d, i) {
                return d.firstName + " " + d.lastName;
            }) // added
            .attr("data", function(d, i) {
                return JSON.stringify(d)
            })
            .attr("class", "dot")
            .attr("r", 3.5) // size of the circles
            .attr("fill-opacity", .5) //opacity
            .attr("cx", function(d) {
                return x(d.averageScore / 38);
            })
            .attr("cy", function(d) {
                return y(d.minutesPlayed);
            })
            .style("fill", function(d) {
                return color[d.role];
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(d.firstName + " " + d.lastName + "<br/> (" + xValue(d).toFixed(2) +
                        ", " + yValue(d) + ")")
                    .style("left", (d3.event.pageX + 0) + "px")
                    .style("top", (d3.event.pageY - 100) + "px")
                    .style("background-color", "#FFFFFF")
                    .style("color", "#00000");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0)
            });


        lasso.items(d3.selectAll(".dot"));

        var legendColors = [];
        var dataLegend = [];

        for (var i in color) {
            legendColors.push(color[i])
            dataLegend.push(i);
        }


        var legend = svg.selectAll(".legend")
            .data(dataLegend)
            .enter().append("g")
            .attr("class", "legend")
            .style("font-family", "Montserrat")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
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
                return d;
            });
    });
}