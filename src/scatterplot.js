
        // Sample data (replace with your actual data)
        (function(){
        const data = [
            { year: 2018, type: "Writing", count: 5 },
            { year: 2018, type: "Painting", count: 2 },
            { year: 2019, type: "Writing", count: 8 },
            { year: 2019, type: "Photography", count: 3 },
            { year: 2019, type: "Sculpture", count: 1 },
            { year: 2020, type: "Writing", count: 12 },
            { year: 2020, type: "Painting", count: 5 },
            { year: 2020, type: "Photography", count: 6 },
            { year: 2021, type: "Writing", count: 7 },
            { year: 2021, type: "Painting", count: 3 },
            { year: 2021, type: "Digital Art", count: 4 },
            { year: 2022, type: "Writing", count: 10 },
            { year: 2022, type: "Photography", count: 7 },
            { year: 2022, type: "Digital Art", count: 5 },
            { year: 2023, type: "Writing", count: 15 },
            { year: 2023, type: "Painting", count: 8 },
            { year: 2023, type: "Sculpture", count: 2 },
            { year: 2023, type: "Digital Art", count: 9 },
            { year: 2024, type: "Writing", count: 6 },
            { year: 2024, type: "Photography", count: 4 },
            { year: 2024, type: "Sculpture", count: 3 },
        ];

        // Dimensions and margins
        const margin = { top: 20, right: 40, bottom: 50, left: 180 },
            width = 800 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // Append the SVG object to the section
        const svg = d3.select("#vis-scatterplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define scales
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year)) // Use extent to get min and max
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.type))
            .range([0, height])
            .padding(1); // Add padding to the bars

        const z = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([4, 30]); // Adjust the range for dot size

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d"))) // Format ticks as integers
            .selectAll("text")
            .style("text-anchor", "middle");

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Create a tooltip div
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event, d) {
            tooltip.style("display", "block")
        }
        const mousemove = function(event, d) {
            tooltip
              .html("Year: " + d.year + "<br>Type: " + d.type + "<br>Count: " + d.count)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 15) + "px")
        }
        const mouseleave = function(event, d) {
            tooltip.style("display", "none")
        }

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.type) + y.bandwidth()/2) // Center the circles on the band
            .attr("r", d => z(d.count))
            .style("fill", "#69b3a2")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        // X axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 5)
            .text("Year");

        // Y axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -height / 2)
            .text("Type of Work");
})();
