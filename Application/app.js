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
    c_index.innerHTML = index_array[0] +"x Armut + "+index_array[1]+"x Ease of Business + "+index_array[2]+"x Armut + "+index_array[3]+"x Armut + "+index_array[4]+"x Armut "; 
}

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


function create_index(pov,eob,name){  ////Finde die richtigen Länder aus den Datensets
    var specific_index;
    const pov_result = pov.filter(word => word.countries===name);
    const eob_result = pov.filter(word => word.country_code===pov_result[0].country_code);
    console.log("Finde "+ name);
    console.log("resultat "+pov_result[0].countries+" Länge "+pov_result.length);
    console.log("resultat "+eob_result[0].country_code+" data "+eob_result[0].data_2019+" Länge "+eob_result.length);
    specific_index=updateData(pov_result[0].data,eob_result[0].data_2019);
    console.log("End Index:  "+specific_index);
}

function updateData(pov,eas){
    var sum=index_array[0]+index_array[1];
    return (pov*index_array[0]+eas*index_array[1])/sum;
}


d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')          //Länder Daten von JSON variable g genommmen
    .then(data => {
        //Länder Index Data

        //Poverty Index Array
        var pov_arr=[];
        d3.csv("poverty_index_one.csv")
            .then(data => {
            pov_arr=data;
        });

        //Ease Of Bus Index Array
        var eob_arr=[];
        d3.csv("ease_buis.csv")
            .then(data => {
                eob_arr=data;
        });

        //Die Weltkarte
        const countries = topojson.feature(data, data.objects.countries); //Alle Länder
        g.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            //.style('fill','blue')
            .attr('class', 'country')
            .attr('d', path)    //'d' is list of coordinates
            .on('mouseover', function(d){
                d3.select(this)
                    .classed("mouseeffect",true)
                    .text(function(d) { return d.properties.name; });	
                    //.style('fill','blue');
                create_index(pov_arr,eob_arr,d.properties.name);
            })
            .on('mouseout', function(d){
                d3.select(this)
                    .classed("mouseeffect",false)
            })
            .on("click", function(d){
                var para = new URLSearchParams();
                para.append("KEY",d.properties.name);
                var url = 'laender.html?';
                location.href  = url+para.toString();
            });
    });



