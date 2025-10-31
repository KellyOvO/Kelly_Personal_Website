(function() { // Use an Immediately Invoked Function Expression (IIFE) to create a module scope

  function dotDensity() {
    let locations = [];
    let dotRadius = 3;
    let dotColor = "steelblue";
    let svg = null; // The D3 selection for the SVG element
    let projection = null; // The D3 projection

    function chart() {
      if (!svg || !projection) {
        console.error("SVG or projection not set.  Call svg() and projection() before calling the chart.");
        return;
      }

      // Add dots for visited locations
      svg.selectAll(".dot")
        .data(locations)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => projection(d.coordinates)[0])
        .attr("cy", d => projection(d.coordinates)[1])
        .attr("r", dotRadius)
        .attr("fill", dotColor)
        .attr("opacity", 0.7);
    }

    chart.locations = function(value) {
      if (!arguments.length) return locations;
      locations = value;
      return chart;
    };

    chart.dotRadius = function(value) {
      if (!arguments.length) return dotRadius;
      dotRadius = value;
      return chart;
    };

    chart.dotColor = function(value) {
      if (!arguments.length) return dotColor;
      dotColor = value;
      return chart;
    };

    chart.svg = function(value) {
      if (!arguments.length) return svg;
      svg = value;
      return chart;
    };

    chart.projection = function(value) {
      if (!arguments.length) return projection;
      projection = value;
      return chart;
    };

    return chart;
  }

  // Expose the dotDensity function globally (or in a module system like CommonJS or ES modules)
  window.dotDensity = dotDensity; // Simplest way for browser environment
})();