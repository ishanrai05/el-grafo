d3.json("
https: //api.github.com/gists/1129492", function(data) {
    var json = JSON.parse(data.files['readme.json'].content); // lee el json dsd una url

    var link = svg.selectAll("line")
        .data(json.links)
        .enter().append("line");

    var node = svg.selectAll("circle")
        .data(json.nodes)
        .enter().append("circle")
        .attr("r", r - .75)
        .style("fill", function(d) {
            return fill(d.group);
        })
        .style("stroke", function(d) {
            return d3.rgb(fill(d.group)).darker();
        })
        .call(force.drag).on("mouseover", fade(.1)).on("mouseout", fade(1));;

    force.nodes(json.nodes).links(json.links).on("tick", tick).start();

    var linkedByIndex = {};
    json.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    function tick() {
        node.attr("cx", function(d) {
            return d.x = Math.max(r, Math.min(w - r, d.x));
        }).attr("cy", function(d) {
            return d.y = Math.max(r, Math.min(h - r, d.y));
        });

        link.attr("x1", function(d) {
            return d.source.x;
        }).attr("y1", function(d) {
            return d.source.y;
        }).attr("x2", function(d) {
            return d.target.x;
        }).attr("y2", function(d) {
            return d.target.y;
        });
    }

    function fade(opacity) {
        return function(d) {
            node.style("stroke-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            link.style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
        };
    }
});