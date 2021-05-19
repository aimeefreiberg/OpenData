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


function create_index(pov,name){  ////Finde die richtigen Länder aus den Datensets
    var specific_index=0;
    var uncal_index = pov.filter(word => word.country_name===name);
    console.log("Pov2 "+ pov.length);
    //console.log("Worldmap Ländername "+ name);
    //console.log("Läange "+ uncal_index.length);
    if(uncal_index.length==0){
        specific_index=0;
    }else{
        specific_index=updateData(uncal_index[0]);;
        console.log("Index Ländername "+uncal_index[0].country_name);
        console.log("End Index:  "+specific_index.toFixed(2));
    }
    return specific_index;
}
    

function updateData(index){
    var sum=index_array[0]+index_array[1];
    return 10*(index.normalized_pov_mean*index_array[0]+index.normalized_busi*index_array[1])/sum;
}

function coloring_country(calculated_index){
    var num2=255/10*calculated_index
    num2.toFixed(0);
    var num1=255-num2;
    return num1+","+num2+","+0;
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

//Länder Index Data

//Poverty Index Array
var pov_arr=[];
d3.csv("poverty_index_data.csv")
    .then(data => {
    pov_arr=data;
});

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')          //Länder Daten von JSON variable g genommmen
    .then(data => {



        //Die Weltkarte
        const countries = topojson.feature(data, data.objects.countries); //Alle Länder
        g.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
                .attr('class', 'country')
                .attr('d', path)    //'d' is list of coordinates
                //.text(d =>  d.properties.name)
                .style('fill',function(d) {
                    console.log("Pov1 "+ pov_arr.length);
                    var ind=create_index(pov_arr,d.properties.name);
                    console.log("Index Nummer: "+ind);
                    return 'rgb('+coloring_country(ind)+')';   //  rgb(coloring_country(1))
                    //return 'rgb(25,229,0)'
                    }
                )
                .on('mouseover', function(d){
                    d3.select(this)
                        .classed("mouseeffect",true)	
                        //.style('fill','blue');
                    //create_index(pov_arr,d.properties.name);
                    console.log("Pov3 "+ pov_arr.length);
                    //console.log("name "+d.properties.name);
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
    });



