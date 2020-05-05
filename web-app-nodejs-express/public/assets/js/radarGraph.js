// Function to update the view once the user press the button
function update(selectedPlayers, chosenAttributes) {
    var w = document.getElementById("chart").clientWidth - 160,
        h = document.getElementById("chart").clientHeight - 60;

    d3.csv("assets/players.csv", function(error, data) {
        // Data
        var final_data = [];

        // If some values have been selected we can update the chart

        var alert = document.getElementById("warning");
        alert.innerHTML = "";
        // Looking for the selectedPlayers in the dataset
        for (var elem in data) {
            for (var p in selectedPlayers) {
                // If the name is equal to the lastName of the first player
                if (data[elem].firstName + " " + data[elem].lastName == selectedPlayers[p]) {

                    // Store the info of the first player
                    var info_player_i = [];
                    for (var i in chosenAttributes) {
                        // Checking if the value is defined or not
                        var value = data[elem][chosenAttributes[i]];
                        if (value == "") {
                            value = 0;
                        }

                        info_player_i.push({
                            axis: chosenAttributes[i],
                            overall: data[elem]["Overall"],
                            value: parseInt(value)
                        });
                    }
                    final_data.push(info_player_i);
                }
            }
        }

        var colorScale = d3.scaleLinear().domain([0, final_data.length])
            // .range(["#EAB13D", "#205AEB"]); // good alternative
            .range(["#FF9300", "#0049FF"]);

        //Options for the Radar chart, other than default
        var mycfg = {
            w: w,
            h: h,
            ExtraWidthX: 200,
            color: colorScale,
            maxValue: 100
        }

        //Call function to draw the Radar chart
        //Will expect that data is in %'s
        RadarChart.draw("#chart", final_data, mycfg);

        ////////////////////////////////////////////
        /////////// Initiate legend ////////////////
        ////////////////////////////////////////////
        /*
        var svg = d3.select('#legend')
            .selectAll('svg')
            .remove();

        svg = d3.select('#legend')
            .append('svg')
            .attr("width", 400)
            .attr("height", 45 * LegendOptions.length)
            .attr("float", "left")

        //Create the title for the legend
        var text = svg.append("text")
            .attr("class", "title")
            .attr('transform', 'translate(90,0)')
            .attr("x", -65)
            .attr("y", 20)
            .attr("font-size", "24px")
            .attr("font-family", "Montserrat-Bold")
            .attr("fill", "white")
            .text("Selected Players (" + selectedPlayers.length.toString() + ")");

        //Initiate Legend	
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("height", 100)
            .attr("width", 200)
            .attr('transform', 'translate(90,20)');

        //Create colour squares
        legend.selectAll('rect')
            .data(LegendOptions)
            .enter()
            .append("rect")
            .attr("x", -55)
            .attr("y", function(d, i) {
                return i * 30 + 15;
            })
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", function(d, i) {
                return colorScale(i);
            });

        //Create text next to squares
        legend.selectAll('text')
            .data(LegendOptions)
            .enter()
            .append("text")
            .attr("x", -25)
            .attr("y", function(d, i) {
                return i * 30 + 32;
            })
            .attr("font-size", "20px")
            .attr("fill", "white")
            .text(function(d) {
                return d;
            });*/

    });
}