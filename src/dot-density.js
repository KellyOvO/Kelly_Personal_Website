(function(){


          // Define the dimensions of the visualization
        const width = 800;
        const height = 600;

        // Create the SVG container within the map-container div
        const svg = d3.select(".map-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Define the projection (Equal Earth is good for true proportions)
        const projection = d3.geoEqualEarth()
            .center([115, 25]) // Roughly center on East Asia
            .scale(500) // Increased scale for initial zoom
            .translate([width / 2, height / 2]);

        // Create a path generator using the projection
        const path = d3.geoPath()
            .projection(projection);

        // Define zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8]) // Limit zoom levels
            .on("zoom", zoomed);

        // Apply zoom behavior to the SVG
        svg.call(zoom);

        function zoomed(event) {
            svg.selectAll("path") // Select both map paths and dots
                .attr("transform", event.transform);
            svg.selectAll(".dot")
                .attr("transform", event.transform);
        }

        // Sample visited locations (latitude, longitude)
        const visitedLocations = [
            { name: "Guangzhou", coordinates: [113.26, 23.13] },
            { name: "Shenzhen", coordinates: [114.06, 22.54] },
            { name: "Beijing", coordinates: [116.40, 39.90] },
            { name: "Guangxi", coordinates: [108.33, 22.82] }, // Using Nanning as a central point for Guangxi
            { name: "Hong Kong", coordinates: [114.17, 22.30] },
            { name: "Taipei", coordinates: [121.56, 25.03] },
            { name: "Xiamen", coordinates: [118.08, 24.47] },
            { name: "Hunan", coordinates: [113.00, 28.20] }, // Using Changsha as a central point for Hunan
            { name: "Singapore", coordinates: [103.82, 1.35] }
        ];

        // Load world map data and draw the map
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
            .then(data => {
                // Use topojson.feature to convert TopoJSON to GeoJSON
                svg.append("path")
                    .datum(topojson.feature(data, data.objects.countries))
                    .attr("d", path)
                    .attr("fill", "#ddd")
                    .attr("stroke", "#aaa")
                    .attr("stroke-width", 0.5);

                // Add dots for visited locations
                svg.selectAll(".dot")
                    .data(visitedLocations)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("cx", d => projection(d.coordinates)[0])
                    .attr("cy", d => projection(d.coordinates)[1])
                    .attr("r", 3); // Adjust dot size as needed
            })
            .catch(error => console.error("Error loading world map:", error));

})()