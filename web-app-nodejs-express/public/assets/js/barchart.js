// url of the .csv file

var fileUrl = "assets/players.csv";

// set the dimensions and margins of the graph
var value = "Overall";

var margin = {
        top: 5,
        right: 50,
        bottom: 200,
        left: 50
    },
    // width = 460,
    width = document.getElementById("barchart").clientWidth - 150,
    height = document.getElementById("barchart").clientHeight - 150;

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#barchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + (margin.left + 10) + "," + margin.top + ")");

// set the ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

// Initialize the X axis
// add the x Axis
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axis");

// set the ranges
var y = d3.scaleLinear()
    .range([height, 0]);

// Initialize the Y axis
// add the y Axis
var yAxis = svg.append("g")
    .attr("class", "axis");

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Function to show information of the player on mouseover
function formattingInfo(player, info) {
    return "<p>" + player + ": " + info + "</p>";
}

function formatNamePlayer(name) {
    var splitName = name.split(" ");

    // If there are extra spaces
    var index = splitName.indexOf("");
    if (index > -1) {
        splitName.splice(index, 1);
    }

    var completeName = "";
    for (var i in splitName) {
        if (i == splitName.length - 1) {
            completeName = completeName + splitName[i];
        } else {
            if (splitName[i].length == 2) {
                completeName = completeName + " " + splitName[i] + " "
            } else {
                completeName = completeName + CSS.escape(splitName[i])[0] + "."
            }
        }
    }
    return completeName;
}


// drawBarchart the values in the bar chart
function drawBarchart(selectedPlayers) { // get the data
    // Variable containing all the sum of the overall values
    var sum = [];
    // data will contains the PAIRS PLAYER-OVERALL_of_THE_PLAYER
    var data = [];
    d3.csv(fileUrl, function(err, csvData) {
        csvData.forEach(elem => {
            // Among the selected players you have to find them in the csv file
            for (var i in selectedPlayers) {
                var completeName = elem.firstName + " " + elem.lastName;
                // If there is a match, then you have to push the player with his overall value
                // inside the data vector.
                if (completeName == selectedPlayers[i]) {
                    data.push([selectedPlayers[i], elem.Overall]);
                    sum.push(elem.Overall);
                }
            }
        });

        var colorScale = d3.scaleLinear().domain([0, data.length])
            // .range(["#EAB13D", "#205AEB"]); // good alternative
            .range(["#FF9300", "#0049FF"]);

        // format the data
        data.forEach(function(d) {
            d[1] = +d[1];
        });

        // Scale the range of the data in the domains
        // X axis
        x.domain(data.map(function(d) {
            return formatNamePlayer(d[0]);
        }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x)).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        // Add Y axis
        y.domain([0, 100]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // append the rectangles for the bar chart
        var u = svg.selectAll("rect")
            .data(data);

        u.enter()
            .append("rect")
            .merge(u)
            .attr("class", "bar")
            .attr("x", function(d) {
                return x(formatNamePlayer(d[0]));
            })
            .attr("width", x.bandwidth())
            .attr("y", function(d) {
                return y(0);
            })
            .attr("height", function(d) {
                return height - y(0);
            })
            .attr("fill", function(d, i) { return colorScale(i); })
            .transition()
            .duration(800)
            .attr("y", function(d) {
                return y(d[1]);
            })
            .attr("height", function(d) {
                return height - y(d[1]);
            });

        // On mouse enter over the bar, just hightlight it, the other will be darker
        svg.selectAll("rect")
            .data(data)
            .on("mouseenter", function(d) {
                var circleUnderMouse = this;
                // Switch off the other bars
                d3.selectAll(".bar")
                    .attr("fill-opacity", function() {
                        return (this === circleUnderMouse) ? 1.0 : 0.2;
                    })

                // Select the polygon
                d3.select("#chart")
                    .selectAll("svg")
                    .selectAll("g")
                    .selectAll("." + selectPolygon(d[0], data))
                    .style("fill-opacity", .7)
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 1);
                div
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            // For the tooltip
            .on("mousemove", function(d) {
                div
                    .html(formattingInfo(d[0], d[1]))
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 12) + "px");
            })
            // On mouse leave everything will be as it was
            .on("mouseleave", function(d) {
                d3.selectAll(".bar")
                    .attr("fill-opacity", 1);

                d3.select("#chart")
                    .selectAll("svg")
                    .selectAll("g")
                    .selectAll("." + selectPolygon(d[0], data))
                    .style("fill-opacity", 0);

                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        u
            .exit()
            .remove();

        // Draw the line representing the average of the overall of the players
        svg.selectAll("line").remove();
        var line = svg.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", y(d3.mean(sum)))
            .attr("y2", y(d3.mean(sum)))
            .attr("stroke-width", 3)
            .attr("stroke", "#dd1c77")
            .attr("stroke-dasharray", "8,8")

        svg.selectAll("#overall-label").remove();
        svg.append("text")
            .attr("id", "overall-label")
            .attr("transform", "translate(" + (width + 3) + "," + y(d3.mean(sum)) + ")")
            .attr("dy", "-1vh")
            .attr("text-anchor", "end")
            .style("fill", "#dd1c77")
            .style("font-family", "Montserrat-Bold")
            .style("font-size", "1.5vh")
            .html("Average Overall = " + d3.mean(sum).toPrecision(4));


    });
}
// selectedPlayers contains the name of the players selected with the dropdown (ONLY THE NAMES!!)
// This function helps to find the correct polygon to highlight
function selectPolygon(d, selectedPlayers) {
    var selectedPolygon;
    for (var i in selectedPlayers) {
        // Once we find a match among the selected players we have the class
        if (selectedPlayers[i][0] == d) {
            selectedPolygon = i;
            break;
        }
    }
    // Since every polygon has as class name "rada-chart-serieX", where X is the index
    // number in the selectedPlayers array, we get the class of the polygon by concatenating
    // the index position found with the loop and the class name.
    return "radar-chart-serie" + selectedPolygon;
}