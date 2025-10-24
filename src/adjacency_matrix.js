(function(){
 const data = [{
  id: "Robotics Teacher",
  label: "Robotics Teacher",
  proficiency: 0.9,
  workAmount: 8
  },
  {
  id: "Mobile App Sales",
  label: "Mobile App Sales",
  proficiency: 0.8,
  workAmount: 6
  },
  {
  id: "Software Developer",
  label: "Software Developer",
  proficiency: 0.5,
  workAmount: 4
  },
  {
  id: "Project Manager",
  label: "Project Manager",
  proficiency: 0.4,
  workAmount: 3
  },
  {
  id: "Data Analyst",
  label: "Data Analyst",
  proficiency: 0.3,
  workAmount: 2
  }
  ];
 

  const size = 600; // Size of the matrix
  const margin = {
  top: 120, // Increased top margin for column labels
  right: 20,
  bottom: 80, // Increased bottom margin for better label display
  left: 120 // Increased left margin for row labels
  };
  const cellSize = (size - margin.top - margin.bottom) / data.length;
 

  const svg = d3.select("#vis-adjacency_matrix")
  .append("svg")
  .attr("width", size)
  .attr("height", size);
 

  // Create scales for positions
  const x = d3.scaleBand()
  .range([0, data.length * cellSize]) // Adjusted range
  .domain(data.map(d => d.label))
  .padding(0.05);
 

  const y = d3.scaleBand()
  .range([0, data.length * cellSize]) // Adjusted range
  .domain(data.map(d => d.label))
  .padding(0.05);
 

  // Create a group for the matrix
  const matrix = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
 

  // Create cells
  matrix.selectAll(".matrix-cell")
  .data(data.flatMap((row, i) => data.map((col, j) => ({
  row: row,
  col: col,
  i: i,
  j: j
  }))))
  .enter()
  .append("rect")
  .attr("class", "matrix-cell")
  .attr("x", d => x(data[d.j].label))
  .attr("y", d => y(data[d.i].label))
  .attr("width", x.bandwidth())
  .attr("height", y.bandwidth())
  .style("fill", d => {
  // Combine proficiency and workAmount to determine the color
  const combinedValue = (d.row.proficiency + d.col.workAmount / 10); // Normalize workAmount
  return d3.interpolateRdBu(combinedValue / 2); // Scale to 0-1 range for color interpolation
  })
  .style("stroke", "black") // Added stroke for better cell separation
  .style("stroke-width", "0.2px")
  .append("title")
  .text(d => `${d.row.label} to ${d.col.label}: Proficiency ${d.row.proficiency}, Work Amount ${d.col.workAmount}`);
 

  // Add row labels
  svg.append("g")
  .attr("transform", `translate(${margin.left - 10},${margin.top})`) // Adjusted position
  .selectAll(".row-label")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "matrix-label axis-label") // Added axis-label class
  .attr("x", -5)
  .attr("y", (d, i) => y(d.label) + y.bandwidth() / 2)
  .attr("dy", "0.32em")
  .attr("text-anchor", "end")
  .text(d => d.label);
 

  // Add column labels
  svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top - 10})`) // Adjusted position
  .selectAll(".col-label")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "matrix-label axis-label") // Added axis-label class
  .attr("x", (d, i) => x(d.label) + x.bandwidth() / 2)
  .attr("y", -5)
  .attr("dy", "-0.32em")
  .attr("text-anchor", "middle") // Changed to middle for better alignment
  .attr("transform", (d, i) => `rotate(-90, ${x(d.label) + x.bandwidth() / 2}, ${-5})`)
  .text(d => d.label);
})();