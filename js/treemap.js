function treemapChart() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = 760,
      height = 120,
      tile = d3.treemapSliceDice;

  var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
      color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
      format = d3.format(",d");



  function chart(selection) {
    selection.each(function(data) {

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      var svgEnter = svg.enter().append("svg");
      // Otherwise, create the skeletal chart.
      var gEnter = svgEnter.append("g");

      // Update the outer dimensions.
      svg.merge(svgEnter).attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.merge(svgEnter).select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      console.log(tile);
      var treemap = d3.treemap()
          .tile(tile)
          .size([width, height])
          .round(true)
          .paddingInner(1);


      var root = d3.hierarchy(data)
          .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
          .sum(sumBySize)
          .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

      treemap(root);

      var cell = g.selectAll("g")
        .data(root.leaves());

      var cellEnter = cell
        .enter().append("g")
        .merge(cell)
          .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

      cellEnter.append("rect")
          .attr("id", function(d) { return d.data.id; })
          .merge(cell.select("rect"))
          .attr("width", function(d) { return d.x1 - d.x0; })
          .attr("height", function(d) { return d.y1 - d.y0; })
          .attr("fill", function(d) { return color(d.parent.data.id); });

      cellEnter.append("clipPath")
          .attr("id", function(d) { return "clip-" + d.data.id; })
        .append("use")
          .attr("xlink:href", function(d) { return "#" + d.data.id; });

      var tspans = cell.append("text")
          .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
        .selectAll("tspan")
          .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); });
      tspans
        .enter().append("tspan")
          .merge(tspans)
          .attr("x", 4)
          .attr("y", function(d, i) { return 13 + i * 10; })
          .text(function(d) { return d; });

      cell.append("title")
          .text(function(d) { return d.data.id + "\n" + format(d.value); });


      function sumBySize(d) {
        return d.size;
      }




    });
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.tile = function(_) {
    if (!arguments.length) return tile;
    tile = _;
    return chart;
  };

  return chart;
}










