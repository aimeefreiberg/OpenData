
const width = 900;
const height = 600;


const svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

const projection = d3.geoMercator().scale(140)
            .translate([width / 2, height / 1.4]);
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