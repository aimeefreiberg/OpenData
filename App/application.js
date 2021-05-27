function showindex() { 
    document.getElementById("index_button").style.display= "inline"; 
}     
setTimeout("showindex()", 18000);      
function showinfo() { 
    document.getElementById("info_button").style.display= "inline"; 
}   
setTimeout("showinfo()", 18000);   
function showAboutUs() { 
    document.getElementById("about_us_link_appear").style.display= "inline"; 
}
setTimeout("showAboutUs()", 18000);
//-----------------------------------------------------Weltkarte--------------------------------------------------
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
                    var ind=create_index(pov_arr,d.properties.name);
                    return 'rgb('+coloring_country(ind)+')';   //  rgb(coloring_country(1))
                    }
                )
                .duration(1000);
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
function return_id(pov,name){
    var uncal_index = pov.filter(word => word.country_name===name);
    console.log("id: "+uncal_index[0].id)
    return uncal_index[0].id
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
var current_country=null;
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
                    var c = document.getElementById('country_name');
                    c.textContent=d.properties.name;
                    activate_linechart(return_id(pov_arr,d.properties.name));
                    document.getElementById('linechart_page').scrollIntoView(
                        {
                            behavior: 'smooth'
                        }
                    );

                }) 
            .append('title')
                .text(function(d){
                    return d.properties.name+", Index: "+(create_index(pov_arr,d.properties.name)).toFixed(2);
                    }
                );    
    }
);
//--------------------------------------------------------------Evolution Page ---------------------------------------------------------------------------
const lc_width = 3000;
const lc_height = 1500;
const margin = 50;
const padding = 2;
const adj = 30;
const lc_svg = d3.select("#linechart_graph").append("svg")
    .attr("id",'linechar')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-"
          + adj + " -"
          + adj + " "
          + (lc_width + adj *30) + " "
          + (lc_height + adj*3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content2", true);

//----------------------------SCALES----------------------------//
const xScale = d3.scaleLinear().rangeRound([0,lc_width]);
const yScale = d3.scaleLinear().rangeRound([lc_height, 0]);
var xScale2 = d3.scaleLinear().rangeRound([0,lc_width]);
var yScale2 = d3.scaleLinear().rangeRound([lc_height, 0]);
xScale.domain([1960,2019]);
yScale.domain([0,1]);
xScale2.domain([1960,2019]);
yScale2.domain([0,1]);

var linechart=Promise.all([
    d3.csv("POV_norm.csv"),
    d3.csv("FDI_norm.csv"),
    d3.csv("GDPpC_norm.csv"),
    d3.csv("GDP_norm.csv")
])


//-----------------------------AXES-----------------------------//
const yaxis = d3.axisLeft()
    .ticks(20)
    .scale(yScale);
const xaxis = d3.axisBottom()
    .ticks(30)
    .scale(xScale);
/*var xaxis2 = d3.axisBottom()
    .scale(xScale2);       
const brush = d3.brushX().extent([0,0], [lc_width,height]) 
    .extent([[0, 0], [lc_width, height]])
    .on("brush end", brushed);*/

//---------------------------------------------------------//
var allGroup = ["Pov", "FDI", "GBD"]
var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);
//-----------------------------DATA-----------------------------//
var count=0;
function activate_linechart(id){
    if(count==0){
        count++;
        create_linechart(id)
    }else{
        update_linechart(id)
    }
}
function update_linechart(id){
    linechart.then(function(dataset){
        var p=dataset[0].find(d => d.id==id);
        var fdi=dataset[1].find(d => d.id==id);
        var gpc=dataset[2].find(d => d.id==id);
        var g=dataset[3].find(d => d.id==id);
        const matrix = {
            p,
            fdi,
            gpc,
            g
        }
        var vala=[];
        var slices=[];
        for(var a in matrix){
            for (var prop in matrix[a]) {
                var val = {
                    year:prop.slice(1),
                    wert:+matrix[a][prop]
                }
                vala.push(val)
            } 
            vala=vala.slice(2);
            tuple={
                name:a,
                values:vala
            }
            vala=[];
            slices.push(tuple);
        console.log(slices)
        } 
        //----------------------------LINES-----------------------------//

        const line = d3.line()
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.wert); }); 

        lc_svg.transition().selectAll("lines")
            .select("line")
            .attr("d", function(d) { return line(d.values); })
            .attr("stroke", function(d){ return myColor(d.name) })
            .style("stroke-width", 20);

        var lines=lc_svg.selectAll("lines")
            .data(slices)

    })
};

function create_linechart(id){
    console.log(id) 
    var id=parseInt(id)
    console.log(id) 
    linechart.then(function(dataset){
        var p=dataset[0].find(d => d.id==id);
        var fdi=dataset[1].find(d => d.id==id);
        var gpc=dataset[2].find(d => d.id==id);
        var g=dataset[3].find(d => d.id==id);
        const matrix = {
            p,
            fdi,
            gpc,
            g
        }
        var vala=[];
        var slices=[];
        for(var a in matrix){
            for (var prop in matrix[a]) {
                var val = {
                    year:prop.slice(1),
                    wert:+matrix[a][prop]
                }
                vala.push(val)
            } 
            vala=vala.slice(2);
            tuple={
                name:a,
                values:vala
            }
            vala=[];
            slices.push(tuple);
        console.log(slices)
        } 
        //----------------------------LINES-----------------------------//
        const line = d3.line()
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.wert); }); 
        const line2 = d3.line()
            .x(function(d) { return xScale2(d.year); })
            .y(function(d) { return yScale2(d.wert); }); 
        //-------------------------2. DRAWING---------------------------//
        lc_svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + lc_height + ")")
            .call(xaxis)
            .append("text")
                .attr("dx", "0.75em")
                .attr("x", 5)
                .style("text-anchor", "start")
                .style("font", "40px")
                .text("Jahr");
        lc_svg.append("g")
            .attr("class", "axis")
            .call(yaxis)       
        //----------------------------LINES-----------------------------//
        var lines = lc_svg.selectAll("lines")
            .data(slices)
            .enter()
            .append("g")
                .style("fill", function(d){ return myColor(d.name) })
                .style("fill", "none");

            lines.append("path")
                .attr("class", "line")
                .attr("d", function(d) { return line(d.values); })
                .attr("stroke", function(d){ return myColor(d.name) })
                .style("stroke-width", 20);
            
            lines.append("text")  
                .attr("class","serie_label")
                .datum(function(d) {
                    return {
                        name: d.name,
                        value: d.values[d.values.length - 1]
                    };
                })
                .attr("transform", function(d) {
                        console.log(d)
                        return "translate(" + (xScale(d.value.year) + 10)  
                        + "," + (yScale(d.value.wert) + 5 ) + ")"; })
                .attr("x", 5)
                .text(function(d) { return ("Datensatz: ")+ d.name; });

            lines.select("myDots")
                .data(slices)
                .enter()
                .append('g')
                .style("fill", function(d){ return myColor(d.name) })
                    .selectAll("myPoints")
                    .data(function(d){ return d.values })
                    .enter()
                    .append("circle")
                        .attr("cx", function(d) { return xScale(d.year) } )
                        .attr("cy", function(d) { return yScale(d.wert) } )
                        .attr("r", 25)
                        .attr("stroke", "white")
                        .on('mouseover', function(d){
                            d3.select(this)
                                .transition()
                                    .duration(500)
                                    .attr("r",35)
                            d3.select(this)        
                                .append('title')
                                    .text("Jahr: "+d.year+", Wert: "+d.wert);
                        })
                        .on('mouseout', function(d){
                            d3.select(this)
                                .transition()
                                    .duration(500)
                                    .attr("r",25);
                
                        })
            /*lines.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + (height-420) + ")")
                .call(xaxis2);
            
            lines.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, xScale.range());

            lc_svg.append("rect")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, xScale.range());*/
        
    })   
}
function brushed() {
   var s = d3.event.selection || xScale2.range();
   xScale.domain(s.map(xScale2.invert, xScale2));
   //linechart.select(".line").attr("d", line);
    //focus.select(".axis--x").call(xAxis);

}



