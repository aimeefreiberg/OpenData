var c = document.getElementById('output');
var para = new URLSearchParams(window.location.search);
var country = para.get("KEY");
c.textContent=country;

const DATA = [
    { id: 'd1', value:10, region: 'USA'},
    { id: 'd2', value:11, region: 'Russia'},
    { id: 'd3', value:12, region: 'UK'},
    { id: 'd4', value:13, region: 'Germ'},
    { id: 'd5', value:15, region: 'Deutsch'},
];
    
const xScale = d3.scaleBand()
                .domain(DATA.map((dataPoint) => dataPoint.region))
                .rangeRound([0, 250])
                .padding(0.1);
const yScale = d3.scaleLinear().domain([0,15]).range([200,0]);

const container = d3.select('svg')
    .classed('container',true)

container
    .selectAll('.bar')
    .data(DATA)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width',xScale.bandwidth())
    .attr('height',(data) => 200-yScale(data.value))
    .attr('x',data => xScale(data.region))
    .atrr('y',data => yScale(data.value));
