//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better 
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end, 
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

var RadarChart = {
    draw: function(id, d, options) {
        var cfg = {
            radius: 5, // Radius of the point of the polygon
            w: 600, //Width of the circle
            h: 600, //Height of the circle
            factor: 1, // Scale or zoom (DO NOT TOUCH)
            factorLegend: .85, // Distance of the legend
            levels: 5, //How many levels or inner ploygon should there be drawn
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0, //0.2 //The opacity of the area of the polygon
            ToRight: 5,
            TranslateX: 90,
            TranslateY: 40,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: d3.schemeCategory10
        };

        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    cfg[i] = options[i];
                }
            }
        }
        //If the supplied maxValue is smaller than the actual one, replace by the max in the data
        cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i) { return d3.max(i.map(function(o) { return o.value; })) }));

        var allAxis = (d[0].map(function(i, j) { return i.axis }));
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

        // Data format of the values in the radar chart
        var Format = d3.format('.0f');
        d3.select(id).select("svg").remove();

        var g = d3.select(id)
            .append("svg")
            .attr("width", cfg.w + 200)
            .attr("height", cfg.h + 100)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");;

        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .style("opacity", 0) // set the tooltip invisible at the beginning
            .style('position', 'absolute')
            .style('text-align', 'center')
            .style('font-weight', 'bold')
            .style('font-size', '16px')
            .style('font-family', 'Montserrat-Bold')
            .style('width', '40px')
            .style('height', '25px')
            .style('border-radius', '10px')
            .style('border', '2px solid #818181')
            .style('background', 'white')
            .style('pointer-events', 'none');

        //Text ON THE AXIS indicating at what % each level is
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function(d) { return levelFactor * (1 - cfg.factor * Math.sin(0)); })
                .attr("y", function(d) { return levelFactor * (1 - cfg.factor * Math.cos(0)); })
                .attr("class", "")
                .style("font-family", "Montserrat")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
                .attr("fill", "white")
                .attr("margin", "5px")
                .text(Format((j + 1) * cfg.maxValue / cfg.levels));
        }

        series = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        // Axis of the radar chart
        axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function(d, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
            .attr("y2", function(d, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
            .attr("class", "line")
            .style("stroke", "#E9ECE5")
            .style("stroke-width", "2px");

        // Name of the attribute on the axis
        axis.append("text")
            .attr("class", "attributes-legend")
            .text(function(d) { return d })
            .style("font-family", "Montserrat")
            .style("font-size", "1.3vh")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i) { return "translate(-5, -20)" })
            .attr("x", function(d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
            .attr("y", function(d, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total); });


        d.forEach(function(y, x) {
            dataValues = [];
            g.selectAll(".nodes")
                .data(y, function(j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)),
                        j.overall
                    ]);
                });
            dataValues.push(dataValues[0]);
            // Polygons reflecting the skilss of the player
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series)
                .style("stroke-width", function(d) { return overallEncoding(d[0][2]) })
                .style("stroke", cfg.color(series))
                .attr("points", function(d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return str;
                })
                .style("fill", function(j, i) { return cfg.color(series) })
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function(d) {
                    z = "polygon." + d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);

                    g.selectAll("circle")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                })
                .on('mouseout', function() {
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);

                    g.selectAll("circle")
                        .transition(200)
                        .style("fill-opacity", .9);
                });
            series++;
        });
        series = 0;


        d.forEach(function(y, x) {
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie" + series)
                .attr('r', cfg.radius)
                .attr("alt", function(j) { return Math.max(j.value, 0) })
                .attr("cx", function(j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("cy", function(j, i) {
                    return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("data-id", function(j) { return j.axis })
                // Invisible circles (disable the colors and the opacity)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on('mouseover', function(d) {

                    newX = parseFloat(d3.select(this).attr('cx')) - 10;
                    newY = parseFloat(d3.select(this).attr('cy')) - 5;

                    // Update the value of the tooltip
                    div.transition()
                        .duration(200)
                        .style("opacity", 1.0)
                        .style("margin", "10px");
                    div.html(Format(d.value))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");

                    z = "polygon." + d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);

                    g.selectAll("circle")
                        .transition(200)
                        .style("fill-opacity", .1);
                })
                .on('mouseout', function() {
                    div
                        .transition(200)
                        .style('opacity', 0);

                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);

                    g.selectAll("circle")
                        .transition(200)
                        .style("fill-opacity", .9);
                })
                // Unecessary additional tooltip
                //.append("svg:title").style('font-family', 'Montserrat')
                //.text(function(j) { return Math.max(j.value, 0) });

            series++;
        });
    }
};

// Function that encodes the overall as stroke of the polygon in the radar chart
function overallEncoding(overallValue) {
    var strokeWidth;
    // Depending on the overallValue, we set a different stroke width
    if (overallValue < 70) {
        strokeWidth = "4px"
    } else if (overallValue >= 70 && overallValue < 85) {
        strokeWidth = "8px"
    } else if (overallValue >= 85) {
        strokeWidth = "16px"
    }

    return strokeWidth;
}