    (function() {
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
        let selectedCountry = null; // Store the currently selected country

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8]) // Limit zoom scale
            .on("zoom", zoomed);

        svg.call(zoom); // Apply zoom to the SVG

        function zoomed(event) {
            svg.selectAll('path')  // select all paths (countries)
                .attr('transform', event.transform); // apply the transform to the paths

            svg.selectAll('.dot') // select all dots
                .attr('transform', event.transform); // apply the transform to the dots
        }

        // Function to handle country click
        function countryClicked(event, d) {
            // 'd' is the data associated with the clicked country (feature)

            // Reset the selected country if it was already selected
            if (selectedCountry === d) {
                selectedCountry = null;
                d3.selectAll(".country").classed("selected", false); // Remove 'selected' class from all
                resetZoom();  // Optionally, reset the zoom
            } else {
                // Unselect the previously selected country
                d3.selectAll(".country").classed("selected", false);

                // Select the clicked country
                selectedCountry = d;
                d3.select(event.target).classed("selected", true);  // Add 'selected' class to the clicked country

                // Zoom to the selected country
                zoomToCountry(d);
            }
        }

        function resetZoom() {
            svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity); // Reset to initial zoom
        }

        function zoomToCountry(d) {
            const bounds = path.bounds(d);
            const dx = bounds[1][0] - bounds[0][0];
            const dy = bounds[1][1] - bounds[0][1];
            const x = (bounds[0][0] + bounds[1][0]) / 2;
            const y = (bounds[0][1] + bounds[1][1]) / 2;

            const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
            const translate = [width / 2 - scale * x, height / 2 - scale * y];

            svg.transition()
                .duration(750)
                .call(
                    zoom.transform,
                    d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
                );
        }

        // Load world map data and draw the map
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
            .then(data => {
                world = data; // Store the world data

                // Draw the countries
                svg.append("g") // Append a group element to hold the countries
                    .attr("class", "countries")
                    .selectAll("path")
                    .data(topojson.feature(data, data.objects.countries).features)
                    .enter().append("path")
                    .attr("class", "country")
                    .attr("d", path)
                    .attr("fill", "#ddd")
                    .attr("stroke", "#aaa")
                    .attr("stroke-width", 0.5)
                    .on("click", countryClicked); // Attach click handler


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

                        // Iterate through features *backwards* to prioritize smaller countries
                        for (let i = features.length - 1; i >= 0; i--) {
                            const feature = features[i];
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

                    // Ensure the visitor is within the SVG bounds *after* projection
                    const projectedCoordinates = projection(visitor.coordinates);
                    if (projectedCoordinates &&
                        projectedCoordinates[0] >= 0 && projectedCoordinates[0] <= width &&
                        projectedCoordinates[1] >= 0 && projectedCoordinates[1] <= height) {

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
                }

                // Simulate new visitors every 1 second
                setInterval(addVisitorDot, 1000);
            })
            .catch(error => console.error("Error loading world map:", error));

    })();