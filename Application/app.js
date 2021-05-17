//Worldmap 

const width = 900;
const height = 600;

const svg = d3.select('#worldmap')
            .attr('viewBox','0 0 900 600')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

const projection = d3.geoMercator().scale(120)
                     .translate([width / 2, height/1.3]);
                     
const path = d3.geoPath(projection)

const g = svg.append('g');

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(data => {
        //Länder Daten von JSON variable g genommmen
        const countries = topojson.feature(data, data.objects.countries); //Alle Länder
        g.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path)    //'d' is list of coordinates
            .on('mouseover', function(d){
                d3.select(this).classed("mouseeffect",true)
            })
            .on('mouseout', function(d){
                d3.select(this).classed("mouseeffect",false)
            })
            .on("click", function(d){
                var para = new URLSearchParams();
                para.append("KEY",d.properties.name);
                var url = 'laender.html?';
                location.href  = url+para.toString();
            });
    });

//Select input
var select = document.getElementById("select");
var select_input = document.getElementById("select_input");
select_input.innerHTML = select.value; 

select.oninput = function() {
    select_input.innerHTML = this.value;
}

//Slider
var slider1 = document.getElementById("score");
var score = document.getElementById("numb");
score.innerHTML = slider1.value; 

slider1.oninput = function() {
    score.innerHTML = this.value;
}
var button1 = document.getElementById("button1");
// Index Data

