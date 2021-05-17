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

// Index Implementierung

var index_array = [1,1,1,1,1];

function decrease(obj){
    var value=document.getElementById("index"+obj).value;
    value--;
    document.getElementById("index"+obj).value = value;
    index_array[parseInt(obj)]=value;
    hey();
}
function increase(obj){
    var value=document.getElementById("index"+obj).value;
    value++;
    document.getElementById("index"+obj).value = value;
    index_array[parseInt(obj)]=value;
    hey();
}

function hey(){
    var c_index = document.getElementById("curr_index");
    c_index.innerHTML = index_array[0] +"x Armut + "+index_array[1]+"x Armut + "+index_array[2]+"x Armut + "+index_array[3]+"x Armut + "+index_array[4]+"x Armut "; 
}

//Index Data
var data= d3.csv("poverty_index_one.csv");
console.log(data);

