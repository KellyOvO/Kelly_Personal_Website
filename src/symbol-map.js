(function(){
            // Define the dimensions of the visualization

        const width = 800;
        const height = 800;

        // Create the SVG container within the map-container div
        const svg = d3.select(".map-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Define the projection (Equal Earth is good for true proportions)
        const projection = d3.geoEqualEarth()
            .scale(150)
            .translate([width / 2, height / 2]);

        // Create a path generator using the projection
        const path = d3.geoPath()
            .projection(projection);

        let world; // Store the world geometry data

        // Load world map data and draw the map
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
            .then(data => {
                world = data; // Store the world data
                // Use topojson.feature to convert TopoJSON to GeoJSON
                svg.append("path")
                    .datum(topojson.feature(data, data.objects.countries))
                    .attr("d", path)
                    .attr("fill", "#ddd")
                    .attr("stroke", "#aaa")
                    .attr("stroke-width", 0.5);

                // Function to generate random visitor data *on land*
                function generateRandomVisitor() {
                    let longitude, latitude;
                    let onLand = false;

                    // Keep generating coordinates until we find one on land
                    while (!onLand) {
                        longitude = Math.random() * 360 - 180; // Longitude: -180 to 180
                        latitude = Math.random() * 180 - 90;   // Latitude: -90 to 90

                        // Check if the point is on land using d3-geo-polygon contains
                        const point = [longitude, latitude];
                        const features = topojson.feature(world, world.objects.countries).features;
                        for (const feature of features) {
                            if (feature.geometry.type === "Polygon") {
                                if (d3.geoContains(feature, point)) {
                                    onLand = true;
                                    break; // Found land, exit the loop
                                }
                            } else if (feature.geometry.type === "MultiPolygon") {
                                for (const polygon of feature.geometry.coordinates) {
                                    const geojsonPolygon = { type: "Polygon", coordinates: polygon };
                                    if (d3.geoContains(geojsonPolygon, point)) {
                                        onLand = true;
                                        break; // Found land, exit the loop
                                    }
                                }
                                if (onLand) break; // Found land in MultiPolygon, exit outer loop
                            }
                        }
                    }

                    return {
                        coordinates: [longitude, latitude],
                        timestamp: Date.now()
                    };
                }

                let visitorCount = 0;
                let visitors = []; // Array to store all visitor data

                // Function to add a new visitor dot
                function addVisitorDot() {
                    const visitor = generateRandomVisitor();
                    visitorCount++;
                    visitors.push(visitor); // Add the visitor to the array

                    // Update the data binding
                    svg.selectAll(".dot")
                        .data(visitors) // Bind the updated 'visitors' array
                        .enter().append("circle") // Create new circles for new data points
                        .attr("class", "dot")
                        .attr("cx", d => projection(d.coordinates)[0])
                        .attr("cy", d => projection(d.coordinates)[1])
                        .attr("r", 2)
                        .style("fill", "steelblue")
                        .style("opacity", 0.7);

                    // Update the visitor count
                    d3.select("#visitor-count").text("Visitors: " + visitorCount);
                }

                // Simulate new visitors every 1 second
                setInterval(addVisitorDot, 1000);
            })
            .catch(error => console.error("Error loading world map:", error));

})();