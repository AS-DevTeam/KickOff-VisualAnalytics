 // set the dimensions and margins of the graph
 var margin = {
         top: 10,
         right: 30,
         bottom: 50,
         left: 50
     },
     width = document.getElementById("seasonTrend").clientWidth - 100,
     height = document.getElementById("seasonTrend").clientHeight - 100;

 // append the svg object to the body of the page
 var svg = d3.select("#seasonTrend")
     .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .style("left", 1.5 + "vw")
     .style("top", 6 + "vh")
     .append("g")
     .attr("transform",
         "translate(" + 28 + "," + (margin.top + 10) + ")");

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
     .attr("class", "tooltip-barchart")
     .style("opacity", 0);

 // Function to show information of the team on mouseover
 function formattingInfo(team, score) {
     return "<h6>" + team + ": " + parseFloat(score).toFixed(4) + "</h6>";
 }

 function drawTeamsTrend(file, round, selectedTeams) {
     // Remove all bars that are drawed
     d3.select("#seasonTrend").selectAll("g").selectAll("rect")
         .transition()
         .duration(500)
         .attr("y", function(d) {
             return y(0);
         })
         .attr("height", function(d) {
             return height - y(0);
         })
         .remove();

     // Parse the Data
     //console.log(file);
     d3.csv(file, function(data) {
         // Variable containing all the sum of the overall values
         var sum = [];
         // The subgroups are the selected teams
         var subgroups = Array();
         subgroups = selectedTeams;

         // List of groups = species here = value of the first column called group, show them on the X axis
         var groups = d3.map(data, function(d) {
             return (d.MatchDay)
         }).keys()

         // This list will contain the shorter version of the gameweeks labels
         var shortertNames = [];
         if (round == 'first') {
             for (var g = 0; g < 18; g++) {
                 var shortName = "GW-" + groups[g].split("-")[1];
                 shortertNames.push(shortName);

             }
         } else {
             for (var g = 18; g < groups.length; g++) {
                 var shortName = "GW-" + groups[g].split("-")[1];
                 shortertNames.push(shortName);
             }
         }

         // We cut off the data depending on what kind of GIRONE/ROUND we consider (Brute Cut).
         // From the 17-th gameWeek, starts the second round.
         if (round == "first") {
             data = data.slice(0, 18);
         } else {
             data = data.slice(18, groups.length);
         }

         // Scale the range of the data in the domains
         // X axis
         x.domain(shortertNames);

         xAxis.transition().duration(1000).call(d3.axisBottom(x)).selectAll("text")
             .style("font-family", "Montserrat-Bold")
             .style("fill", "#ffffff")
             .style("text-anchor", "end")
             .style("font-size", "10px")
             .attr("dx", "1em")
             .attr("dy", "1em");

         y.domain([0, 1.5]).range([height, 0]);;
         yAxis.transition().duration(1000).call(d3.axisLeft(y)).selectAll("text")
             .style("font-family", "Montserrat-Bold")
             .style("fill", "#ffffff");

         // Another scale for subgroup position?
         var xSubgroup = d3.scaleBand()
             .domain(subgroups)
             .range([0, x.bandwidth()])
             .padding([0.05])

         // color palette = one color per subgroup
         var color = d3.scaleOrdinal()
             .domain(subgroups)
             .range(['#377eb8', '#FF9300'])

         // Show the bars
         var bars = svg.append("g")
             .selectAll("g")
             // Enter in data = loop group per group
             .data(data)
             .enter()
             .append("g")
             .attr("transform", function(d) {
                 return "translate(" + x("GW-" + d.MatchDay.split("-")[1]) + ",0)";
             });

         var selectedRects = bars.selectAll("rect")
             .data(Object(function(d) {
                 return subgroups.map(function(key) {
                     if (selectedTeams.includes(key)) {
                         sum.push(d[key]);
                         return {
                             key: key,
                             value: d[key]
                         };
                     }
                 });
             }))

         selectedRects
             .enter()
             .append("rect")
             .attr("class", "bar-teams")
             .attr("x", function(d) {
                 return xSubgroup(d.key);
             })
             .attr("y", function(d) {
                 return y(0);
             })
             .attr("width", xSubgroup.bandwidth())
             .attr("height", function(d) {
                 return height - y(0);
             })
             .attr("fill", function(d) {
                 return color(d.key);
             })
             .transition()
             .delay(function(d) {
                 return Math.random() * 1000;
             })
             .duration(1000)
             .attr("y", function(d) {
                 return y(d.value);
             })
             .attr("height", function(d) {
                 return height - y(d.value);
             })

         bars.selectAll("rect")
             .data(Object(function(d) {
                 return subgroups.map(function(key) {
                     if (selectedTeams.includes(key)) {
                         return {
                             key: key,
                             value: d[key]
                         };
                     }
                 });
             })).on("mouseenter", function(d) {
                 var circleUnderMouse = this;
                 // Switch off the other bars
                 d3.selectAll(".bar-teams")
                     .attr("fill-opacity", function() {
                         return (this === circleUnderMouse) ? 1.0 : 0.2;
                     })
             })
             .on("mouseover", function(d) {
                 div.transition()
                     .duration(200)
                     .style("opacity", 1)

                 div
                     .style("left", (d3.event.pageX + 10) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
             })
             // For the tooltip
             .on("mousemove", function(d) {
                 div
                     .html(formattingInfo(d.key, d.value))
                     .style("left", (d3.event.pageX + 5) + "px")
                     .style("top", (d3.event.pageY - 12) + "px");
                 teamName = d.key;
                 selectTeamScatter(teamName.split(' ').join(''));
                 selectTeamMatrixBarchart(teamName.split(' ').join(''));
             })
             // On mouse leave everything will be as it was
             .on("mouseleave", function(d) {
                 d3.selectAll(".bar-teams")
                     .attr("fill-opacity", 1);

                 div.transition()
                     .duration(500)
                     .style("opacity", 0);

                 teamName = d.key;
                 deselectTeamScatter(teamName.split(' ').join(''));
                 deselectTeamMatrixBarchart(teamName.split(' ').join(''));
             });

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
             .html("Average Score = " + d3.mean(sum).toPrecision(4));

     });
 }