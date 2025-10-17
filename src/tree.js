(function(){
       const treeData = {
            "name": "Hobbies",
            "children": [
                {
                    "name": "Art",
                    "children": [
                        {"name": "Painting"},
                        {"name": "Drawing"},
                        {"name": "Sculpting"}
                    ]
                },
                {
                    "name": "Music",
                    "children": [
                        {"name": "Playing Yangqin"},
                        {"name": "Singing"},
                        {"name": "Listening to Music"}
                    ]
                },
                {
                    "name": "Sports",
                    "children": [
                        {"name": "Billiards"},
                        {"name": "Swimming"},
                        {"name": "Running"}
                    ]
                }
            ]
        };

        // Set the dimensions and margins of the diagram
        const margin = {top: 20, right: 200, bottom: 30, left: 130},
            width = 660 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the left margin and the top margin
        const svg = d3.select("#vis-tree").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // declares a tree layout and assigns the size
        const treemap = d3.tree().size([height, width]);

        // assigns the data to a hierarchy using parent-child relationships
        let nodes = d3.hierarchy(treeData, function(d) {
            return d.children;
        });

        // maps the node data to the tree layout
        nodes = treemap(nodes);

        // adds the links between the nodes
        const link = svg.selectAll(".link")
            .data( nodes.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function(d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.parent.y + 50) + "," + d.x
                    + " " + (d.parent.y + 50) + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });

        // adds each node as a group
        const node = svg.selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // adds the circle to the node
        node.append("circle")
            .attr("r", 5);

        // adds the text to the node
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", function(d) { return d.children ? -13 : 13; })
            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(function(d) { return d.data.name; });
})();