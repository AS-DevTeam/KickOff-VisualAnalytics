function drawParallelCoordinates(chosenAttributes, userSelection, lassoSelection) {

    var margin = { top: 70, right: 90, bottom: 20, left: 50 },
        width = document.getElementById("parallel-coordinates").clientWidth - margin.left - margin.right,
        height = document.getElementById("parallel-coordinates").clientHeight - margin.top - margin.bottom,
        innerHeight = height - 2;

    var devicePixelRatio = window.devicePixelRatio || 1;

    // var color = d3.scaleOrdinal()
    // .range(["#0000ff", "#00ff00", "#ff0000", "#ff8c00"]);

    // Color depending of the role
    var color = { "Goalkeeper": "#1e89dc", "Defender": "#ecd723", "Midfielder": "#64B057", "Forward": "#ea2b2b" };

    var types = {
        "Number": {
            key: "Number",
            coerce: function(d) { return +d; },
            extent: d3.extent,
            within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
            defaultScale: d3.scaleLinear().range([innerHeight, 0])
        },
        "String": {
            key: "String",
            coerce: String,
            extent: function(data) { return data.sort(); },
            within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
            defaultScale: d3.scalePoint().range([0, innerHeight])
        }
    };

    var dimensions = []

    for (var i in chosenAttributes) {
        dimensions.push({
            key: chosenAttributes[i],
            description: chosenAttributes[i],
            type: types["Number"],
            scale: d3.scaleSqrt().range([innerHeight, 0])
        })

    }

    var xscale = d3.scalePoint()
        .domain(d3.range(dimensions.length))
        .range([0, width]);

    var yAxis = d3.axisLeft();

    // Fort updating the barchart, first remove the old one
    d3.select("#parallel-coordinates").selectAll("div").remove();

    var container = d3.select("#parallel-coordinates").append("div")
        .attr("class", "parcoords")
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + margin.top + margin.bottom + "px");

    var svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var canvas = container.append("canvas")
        .attr("width", width * devicePixelRatio)
        .attr("height", height * devicePixelRatio)
        .style("width", width + "px")
        .style("height", height + "px")
        .style("margin-top", margin.top + "px")
        .style("margin-left", margin.left + "px");

    var ctx = canvas.node().getContext("2d");
    ctx.globalCompositeOperation = 'darken';
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1.5;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // var output = d3.select("body").append("pre");

    var axes = svg.selectAll(".axis-parallel")
        .data(dimensions)
        .enter().append("g")
        .attr("class", function(d) { return "axis-parallel " + d.key.replace(/ /g, "_"); })
        .attr("transform", function(d, i) { return "translate(" + xscale(i) + ")"; });

    d3.csv("assets/players.csv", function(error, data) {
        //data = data.slice(0,50);
        if (error) throw error;

        data.forEach(function(d) {
            dimensions.forEach(function(p) {
                d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
            });

            // We have NO NEED TO 
            // truncate long text strings to fit in data table
            // for (var key in d) {
            // if (d[key] && d[key].length > 35) d[key] = d[key].slice(0, 36);
            // }
        });

        // type/dimension default setting happens here
        dimensions.forEach(function(dim) {
            if (!("domain" in dim)) {
                // detect domain using dimension type's extent function
                dim.domain = d3_functor(dim.type.extent)(data.map(function(d) { return d[dim.key]; }));
            }
            if (!("scale" in dim)) {
                // use type's default scale for dimension
                dim.scale = dim.type.defaultScale.copy();
            }
            dim.scale.domain(dim.domain);
        });

        var render = renderQueue(draw).rate(50);

        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = d3.min([0.85 / Math.pow(data.length, 0.3), 1]);
        render(data);

        axes.append("g")
            .each(function(d) {
                var renderAxis = "axis-parallel" in d ?
                    d.axis.scale(d.scale) // custom axis
                    :
                    yAxis.scale(d.scale); // default axis
                d3.select(this).call(renderAxis);
            })
            .append("text")
            .attr("class", "title")
            .attr("text-anchor", "start")
            .text(function(d) { return "description" in d ? d.description : d.key; });

        // Add and store a brush for each axis.
        axes.append("g")
            .attr("class", "brush")
            .each(function(d) {
                d3.select(this).call(d.brush = d3.brushY()
                    .extent([
                        [-10, 0],
                        [10, height]
                    ])
                    .on("start", brushstart)
                    .on("brush", brush)
                    .on("end", brush)
                )
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

        d3.selectAll(".axis-parallel.food_group .tick text")
            .style("fill", "#fffff");

        if (lassoSelection && lassoSelection.length > 0) {
            console.log(lassoSelection)
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = d3.min([0.85 / Math.pow(lassoSelection.length, 0.3), 1]);
            render(lassoSelection);
        }

        function project(d) {
            return dimensions.map(function(p, i) {
                // check if data element has property and contains a value
                if (!(p.key in d) ||
                    d[p.key] === null
                ) return null;

                return [xscale(i), p.scale(d[p.key])];
            });
        };

        function draw(d) {
            ctx.strokeStyle = color[d.role];
            ctx.beginPath();
            var coords = project(d);
            coords.forEach(function(p, i) {
                // this tricky bit avoids rendering null values as 0
                if (p === null) {
                    // this bit renders horizontal lines on the previous/next
                    // dimensions, so that sandwiched null values are visible
                    if (i > 0) {
                        var prev = coords[i - 1];
                        if (prev !== null) {
                            ctx.moveTo(prev[0], prev[1]);
                            ctx.lineTo(prev[0] + 6, prev[1]);
                        }
                    }
                    if (i < coords.length - 1) {
                        var next = coords[i + 1];
                        if (next !== null) {
                            ctx.moveTo(next[0] - 6, next[1]);
                        }
                    }
                    return;
                }

                if (i == 0) {
                    ctx.moveTo(p[0], p[1]);
                    return;
                }

                ctx.lineTo(p[0], p[1]);
            });
            ctx.stroke();
        }

        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            render.invalidate();

            var actives = [];
            svg.selectAll(".axis-parallel .brush")
                .filter(function(d) {
                    return d3.brushSelection(this);
                })
                .each(function(d) {
                    actives.push({
                        dimension: d,
                        extent: d3.brushSelection(this)
                    });
                });

            var selected = data.filter(function(d) {
                if (actives.every(function(active) {
                        var dim = active.dimension;
                        // test if point is within extents for each active brush
                        return dim.type.within(d[dim.key], active.extent, dim);
                    })) {
                    return true;
                }
            });

            deleteChanges();

            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = d3.min([0.85 / Math.pow(selected.length, 0.3), 1]);
            render(selected);

            // Apply changes on the other views once there is the selection 
            applySelection(selected);

            //output.text(d3.tsvFormat(selected.slice(0, 24)));
        }
    });

    function d3_functor(v) {
        return typeof v === "function" ? v : function() { return v; };
    };

}

// Handle the selection and reflect it on the other views
function applySelection(selection) {
    var color = { "Goalkeeper": "#1e89dc", "Defender": "#ecd723", "Midfielder": "#64B057", "Forward": "#ea2b2b" };
    var namesSurnames = [];

    // Put names and surnames
    for (var i in selection) {
        var photo;
        var flag = selection[i]["Flag"].split(".png")[0] + "@2x.png"; //3x for getting bigger img
        // If there is no pic of the player we select a default one
        if (selection[i]["Photo"] == "empty") {
            photo = "https://image.flaticon.com/icons/svg/1163/1163063.svg"
        } else {
            photo = selection[i]["Photo"].split(".png")[0] + "@3x.png"; //3x for getting bigger img
        }
        var infoPlayer = {
            "player": selection[i].firstName + " " + selection[i].lastName,
            "birth": selection[i].birthDate,
            "foot": selection[i].foot,
            "role": selection[i].role,
            "team": selection[i]["team-official-name"],
            "img": photo,
            "flag": flag
        };

        namesSurnames.push(infoPlayer);
    }

    // This check is necessary in order to avoid that all dots became bigger at the beginning, meaning when 
    // the parallel coordinates is loading.
    // Remove the previous card
    d3.select("#selection").selectAll("ul").selectAll("li").exit().remove();
    d3.select("#selection").selectAll("ul").remove();
    var ul = d3.select("#selection").append("ul").attr("id", "listOfPlayers");

    if (userSelection && userSelection.length > 0) {
        for (var i in userSelection) {
            $("#listOfPlayers").append(userSelection[i]["outerHTML"]);
        }
    }
    if (namesSurnames.length < 3200) {
        // In namesSurname we have the firstName and the lastName of every player. Since the id of every dot
        // of the scatterplot is simply the firstName and the lastName of the corresponding player, separated
        // by a blank we just need to enlarge the dots with that name and surname.
        for (var d in namesSurnames) {
            //d3.select("#scatterplot").selectAll("svg").selectAll("g").selectAll(".dot").attr("fill-opacity", .2)
            d3.select("#scatterplot").selectAll("svg").selectAll("g").select("#" + CSS.escape(namesSurnames[d].player))
                .attr("r", 3.5)
                .transition()
                .duration(800)
                .attr("r", 7)
                .attr("fill-opacity", 1);

            var li = ul.append("li").attr("id", "li-" + namesSurnames[d].player);
            var div = li.append("div").attr("class", "section")
            var text = div.append("div").attr("class", "player-card");

            text.append('img')
                .attr('class', 'image')
                .attr('src', namesSurnames[d].img)
                .attr('alt', "")
                // Handling the case in which the img is not reachable
                .attr('onerror', "this.onerror=null;this.src='https://image.flaticon.com/icons/svg/1163/1163063.svg';");

            // Each button has as id the name of the player of the associated card
            text.append("button").attr("class", "fab").html("&#43;")
                .attr("id", "add_" + namesSurnames[d].player)
                .attr("onclick", "choosePlayer(this.id)")
                .attr("data-click", 0); // The attribute data-click tells how many times the button was clicked

            text.append("a").html(namesSurnames[d].player).style("font-family", "Montserrat-Bold");
            text.append('img')
                .attr('class', 'flag')
                .attr('src', namesSurnames[d].flag)
                .attr('alt', "No flag")
                // Handling the case in which the img is not reachable
                .attr('onerror', "this.onerror=null;this.src='https://image.flaticon.com/icons/svg/2001/2001580.svg';");
            text.append("h5").html("Foot: " + namesSurnames[d].foot);
            text.append("h5").html("Team: " + namesSurnames[d].team);
            text.style("border-left", "5px solid " + color[namesSurnames[d].role]);
            text.style("opacity", 0).transition().duration(900).style("opacity", 1).delay(700);
        }
    }

}

function deleteChanges() {
    // Get all the circles in the scatterplot and turn everything as it was
    var dots = d3.select("#scatterplot").selectAll("svg").selectAll("g").selectAll(".dot")
        .attr("r", 3.5)
        .attr("fill-opacity", .5);
    // Remove the previous card 
    d3.select("#selection").selectAll("ul").selectAll("li").exit().remove();
    d3.select("#selection").selectAll("ul").remove();
}