// Index Implementierung
//import json;

var index_array = [2,1,1,1,1];

function decrease(obj){
    var value=document.getElementById("index"+obj).value;
    value--;
    document.getElementById("index"+obj).value = value;
    index_array[parseInt(obj)]=value;
    update_IndexOutput();
    update_map();
    
}
function increase(obj){
    var value=document.getElementById("index"+obj).value;
    value++;
    document.getElementById("index"+obj).value = value;
    index_array[parseInt(obj)]=value;
    update_IndexOutput();
    update_map();
}

function update_IndexOutput(){
    var c_index = document.getElementById("curr_index");
    c_index.innerHTML = index_array[0] +"x Poverty + "+index_array[1]+"x Ease of Business + "
        +index_array[2]+"x Gini + "+index_array[3]+"x Gender Equality"//+index_array[4]+"x Child Education"; 
}

function update_map(){
    map.then(data => {
        g.selectAll('path')
                .transition()
                .style('fill', 'blue')
                .style('fill',function(d) {
                    console.log(d.properties.name);
                    var ind=create_index(pov_arr,d.properties.name);
                    console.log(coloring_country(ind));
                    return 'rgb('+coloring_country(ind)+')';   //  rgb(coloring_country(1))
                    }
                )
                .duration(1000);
        console.log("geuppdatet");
    })
}


function create_index(pov,name){  ////Finde die richtigen Länder aus den Datensets
    var specific_index=0;
    var uncal_index = pov.filter(word => word.country_name===name);
    if(uncal_index.length==0){
        specific_index=0;
    }else{
        specific_index=updateData(uncal_index[0]);
    }
    return specific_index;
}
    

function updateData(index){
    var sum=index_array[0]+index_array[1]+index_array[2]+index_array[3];  //+index_array[4]
    return 10*(index.normalized_pov_mean*index_array[0]+index.normalized_busi*index_array[1]
        +index.normalized_gini*index_array[2]+index.normalized_gender_eq*index_array[3])/sum;  //+index.normalized_child_ed*index_array[5]
}

function coloring_country(calculated_index){
    var num2=255/10*calculated_index
    num2.toFixed(0);
    var num1=255-num2;
    if(calculated_index==0){
        return 0+","+0+","+255;
    }
    return num1+","+num2+","+0;
}

//Worldmap 

const width = 3000;
const height = 1200;

const svg = d3.select('#worldmap')
            .append('svg')
            .attr('width', width)
            .attr('height', height)

const projection = d3.geoMercator().scale(150)
                     .translate([width / 2, height/1.3]);
                     
const path = d3.geoPath(projection)

const g = svg.append('g')
            .attr('viewBox','0 0 3000 1200')
            .classed("svg-content", true);

//Länder Index Data

//Poverty Index Array
var pov_arr=[];
d3.csv("poverty_index_data.csv")
    .then(data => {
    pov_arr=data;
});

var map = d3.json("world_atlas_datasets.json")          //Länder Daten von JSON variable g genommmen
    .then(data => {
        //Die Weltkarte
        const countries = topojson.feature(data, data.objects.countries); //Alle Länder
        g.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
                .attr('class', 'country')
                .attr('d', path)    //'d' is list of coordinates
                .style('fill',function(d) {
                    var ind=create_index(pov_arr,d.properties.name);
                    return 'rgb('+coloring_country(ind)+')'; 
                    }
                )
                .on('mouseover', function(d){
                    d3.select(this)
                        .classed("mouseeffect",true)	
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
                }) 
            .append('title')
                .text(function(d){
                    return d.properties.name+", Index: "+(create_index(pov_arr,d.properties.name)).toFixed(2);
                    }
                );    
    });



