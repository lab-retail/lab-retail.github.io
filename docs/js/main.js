console.log(dataset);

/**
 * Main function to init all graphics and tables
 * Iterate through the dataset
 */
let init = (dataset) => {
    let mainElement = document.getElementsByTagName('main')[0],
        oneDayOfData,
        sectionElement,
        dateTitleElement,
        nivelElement,
        totalElement;

    for (let x in dataset) {
        oneDayOfData = dataset[x];
        // showMainTable(oneDayOfData);
        sectionElement = document.createElement("section");
        dateTitleElement = document.createElement("h2");
        nivelElement = document.createElement("h2");
        totalElement = document.createElement("h2");
    
        dateTitleElement.innerHTML = oneDayOfData.date;
        nivelElement.innerHTML = "Nivel más visitado: " + oneDayOfData.nivel;
        totalElement.innerHTML = "Todos: " + oneDayOfData.todos;

        sectionElement.append(dateTitleElement);
        sectionElement.append(nivelElement);
        sectionElement.append(totalElement);
        mainElement.append(sectionElement);
    }
}

/**
 * Show Main Table 
 */
let showMainTable = () => {
    let htmlString = '',
    total = 0;
    nivel = 0;
    
    const totalEl = document.getElementById('total');
    const mainTable = document.getElementById('mainTable');
    const nivelEl = document.getElementById('nivelMasVisitado');

    for (let x in dataset) {
        htmlString += '<div class="item">'
        htmlString += dataset[x].date;
        htmlString += '</div>';
        htmlString += '<div class="item">'
        htmlString += dataset[x].prodX
        htmlString += '</div>';
        htmlString += '<div class="item">'
        htmlString += dataset[x].prodY
        htmlString += '</div>';
        total += parseInt(dataset[x].todos);
        nivel = parseInt(dataset[x].nivel);
    }
    
    totalEl.innerHTML = total;
    nivelEl.innerHTML = nivel;
    mainTable.innerHTML += htmlString;
}

/**
 * 
 */
let showDonutChartWithText = () => {
    // let dataArray = dataset;
    let dataArray = [
        {
            "prodX" : dataset[0].prodX
        },
        {
            "prodX" : dataset[0].prodY
        }
    ]

    let pie=d3.pie()
            .value(function(d){
                // return d.value
                return d.prodX
            })
            .sort(null)
            .padAngle(.03);

    let w=300,h=300;

    let outerRadius=w/2;
    let innerRadius=100;

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let arc=d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

    let svg=d3.select("#pieChart")
            .append("svg")
            .attr("width",w)
            .attr("height",h)
            .attr("class", "shadow")
            .append('g')
            .attr("transform",'translate('+w/2+','+h/2+')');

    let path=svg.selectAll('path')
            .data(pie(dataArray))
            .enter()
            .append('path')
            .attr("d",arc)
            .attr("fill",function(d,i){
                return color(d.data.prodX);
            });

    path.transition()
            .duration(1000)
            .attrTween('d', function(d) {
                var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                return function(t) {
                    return arc(interpolate(t));
                };
            });

    let restOfTheData=function(){
        let text=svg.selectAll('text')
                .data(pie(dataArray))
                .enter()
                .append("text")
                .transition()
                .duration(200)
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("dy", ".4em")
                .attr("text-anchor", "middle")
                .text(function(d){
                    // return d.data.value+"%";
                    return d.data.prodX;
                })
                .style('fill','#fff')
                .style('font-size','4vw');

        // let legendRectSize=20;
        // let legendSpacing=7;
        // let legendHeight=legendRectSize+legendSpacing;

        // let legend=svg.selectAll('.legend')
        //         .data(color.domain())
        //         .enter()
        //         .append('g')
        //         .attr('class','legend')
        //         .attr('transform',
        //             function(d,i){
        //                 //Just a calculation for x & y position
        //                 return 'translate(-35,' + ((i*legendHeight)-65) + ')';
        //             });
        // // console.log('color :' + color.domain());
        // legend.append('rect')
        //         .attr('width',legendRectSize)
        //         .attr('height',legendRectSize)
        //         .attr('rx',20,)
        //         .attr('ry',20)
        //         .style({
        //             fill:color,
        //             stroke:color
        //         });

        // legend.append('text')
        //         .attr('x',30)
        //         .attr('y',15)
        //         .text(function(d){
        //             return d;
        //         }).style({
        //             fill:'#929DAF',
        //             'font-size':'14px'
        //         });
    };

    setTimeout(restOfTheData,1000);
}

/**
 * 
 */
let showBarChart = () => {
    const maxAmount = Math.max(parseInt(dataset[0].prodX), parseInt(dataset[0].prodY));
    const dataForBarChart = [
        {
            "productName": "ProdX",
            "value": dataset[0].prodX
        }, {
            "productName": "ProdY",
            "value": dataset[0].prodY
        }
    ];

    const width = 500;
    const height = 400;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };

    const svg = d3.select('#barChart')
        .append('svg')
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleBand()
        .domain(d3.range(dataForBarChart.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    const y = d3.scaleLinear()
        .domain([0, maxAmount])
        .range([height - margin.bottom, margin.top])

    svg
        .append("g")
        .attr("fill", 'orange')
        .selectAll("rect")
        .data(dataForBarChart.sort((a, b) => d3.descending(a.value, b.value)))
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.value))
        .attr('title', (d) => d.value)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());

    function yAxis(g) {
        g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, dataForBarChart.format))
        .attr("font-size", '20px')
    }

    function xAxis(g) {
        g.attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => dataForBarChart[i].productName))
        .attr("font-size", '20px')
    }

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.node();
}

let dataJson = [
    {
        "year":"2017", 
        "total_pills":2000, 
        "errorless":1200, 
        "anything":10
    },
    {
        "year":"2018", 
        "total_pills":3000, 
        "errorless":2250, 
        "anything":10
    },
    {
        "year":"2019", 
        "total_pills":3500, 
        "errorless":3150, 
        "anything":10
    }    
];



window.mobileCheck = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

/**
 * Check Window width to fix CSS for Desktop, when width > 1200px
 */
 let checkWidth = () => {
    if (window.innerWidth > 550) {
        let textElements = document.getElementById('pieChart').getElementsByTagName('text');
        textElements[0].style.fontSize = "17px";
        textElements[1].style.fontSize = "17px";
    }
}

// Bind event listener
window.onresize = checkWidth;


//-------------------------------------------
// init all functions (pageLoad)
init(dataset);
showMainTable();
// showDonutChart();
showDonutChartWithText();
showBarChart();
checkWidth();





/**
 * dataset contains JSON Content from PHP readMail function
 * dataset can be used throughout all functions
 * dataset content format
 * {
 *      dates: 
 *          [
 *              {
 *                  date: DDMMYY, 
 *                  [
 *                       { id: X, value: Y },
 *                       { id: X, value: Y }
 *                  ],
 *              }, 
 *              {
 *                  date: DDMMYY, 
 *                  [
 *                      { id: X, value: Y },
 *                      { id: X, value: Y }
 *                  ],
 *              }    
 *          ]
 * }
 */



// values and colors Arrays will be used by D3 graphs
// let valuesArray = [];
// let colorsArray = ["#53a1aa", "#c6e4e4", "#dbdcc3", "#d66747", "#782e1f"];
// let colorsArray = ["#53a1aa", "#76AFB7", "#c6e4e4", "#dbdcc3", "#d66747", "#782e1f"];


/*

var data = [
    {
        "State": "VT",
        "Under 5 Years": 32635,
        "5 to 13 Years": 62538,
        "14 to 17 Years": 33757,
        "18 to 24 Years": 61679,
        "25 to 44 Years": 155419,
        "45 to 64 Years": 188593,
        "65 Years and Over": 86649
    }, {
        "State": "VA",
        "Under 5 Years": 522672,
        "5 to 13 Years": 887525,
        "14 to 17 Years": 413004,
        "18 to 24 Years": 768475,
        "25 to 44 Years": 2203286,
        "45 to 64 Years": 2033550,
        "65 Years and Over": 940577
    }, {
        "State": "WA",
        "Under 5 Years": 433119,
        "5 to 13 Years": 750274,
        "14 to 17 Years": 357782,
        "18 to 24 Years": 610378,
        "25 to 44 Years": 1850983,
        "45 to 64 Years": 1762811,
        "65 Years and Over": 783877
    }, {
        "State": "WV",
        "Under 5 Years": 105435,
        "5 to 13 Years": 189649,
        "14 to 17 Years": 91074,
        "18 to 24 Years": 157989,
        "25 to 44 Years": 470749,
        "45 to 64 Years": 514505,
        "65 Years and Over": 285067
    }, {
        "State": "WI",
        "Under 5 Years": 362277,
        "5 to 13 Years": 640286,
        "14 to 17 Years": 311849,
        "18 to 24 Years": 553914,
        "25 to 44 Years": 1487457,
        "45 to 64 Years": 1522038,
        "65 Years and Over": 750146
    }, {
        "State": "WY",
        "Under 5 Years": 38253,
        "5 to 13 Years": 60890,
        "14 to 17 Years": 29314,
        "18 to 24 Years": 53980,
        "25 to 44 Years": 137338,
        "45 to 64 Years": 147279,
        "65 Years and Over": 65614
    }
];

let complexBarChart = () => {
    var svg = d3.select("svg"),
        margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

    var y = d3.scaleLinear()
    .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // fix pre-processing
    var keys = [];
    for (key in data[0]){
        if (key != "State")
            keys.push(key);
    }
    data.forEach(function(d){
        d.total = 0;
        keys.forEach(function(k){
            d.total += d[k];
        })
    });

    data.sort(function(a, b) {
        return b.total - a.total;
    });
    x.domain(data.map(function(d) {
        return d.State;
    }));
    y.domain([0, d3.max(data, function(d) {
        return d.total;
    })]).nice();
    z.domain(keys);

    g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
    .attr("fill", function(d) {
        return z(d.key);
    })
    .selectAll("rect")
    .data(function(d) {
        return d;
    })
    .enter().append("rect")
    .attr("x", function(d) {
        return x(d.data.State);
    })
    .attr("y", function(d) {
        return y(d[1]);
    })
    .attr("height", function(d) {
        return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());

    g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
    .attr("x", 2)
    .attr("y", y(y.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text("Population");

  var legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) {
      return d;
    });
}

*/