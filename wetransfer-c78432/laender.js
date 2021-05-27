var c = document.getElementById('country_name');
var para = new URLSearchParams(window.location.search);
var country = para.get("KEY");
c.textContent=country;


var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 3000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;




d3.csv("poverty_index_data.csv", function(error, data) {
    x.domain(data.map(function(d) { return d.countries; }));
    y.domain([0, d3.max(data, function(d) { return d.data; })]);
    var maxDate;
    var minDate;
    var maxY=d3.max(date,function(d){ return d.})

});
/*
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("#bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("poverty_index_data.csv", function(error, data) {
  x.domain(data.map(function(d) { return d.countries; }));
  y.domain([0, d3.max(data, function(d) { return d.data; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("data");

  svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.countries); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.data); })
      .attr("height", function(d) { return height - y(d.data); });
});
*/