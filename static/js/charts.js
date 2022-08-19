function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    console.log(firstSample);
    buildMetadata(firstSample);
    buildCharts(firstSample);
    
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0]
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleAll = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleFilter = sampleAll.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleFirst = sampleFilter[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleFirst.otu_ids;
    var otuLabels = sampleFirst.otu_labels;
    var sampleValues = sampleFirst.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {
          color: 'yellowgreen'
        }
      }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "<b>Top 10 Bacteria Cultures Found</b>", font: {size:16},
      hovermode: "closest",
      hoverlabel: {bgcolor: "white", font: {size: 8}}
    }
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          
        }
      }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "<b>Bacteria Cultures Per Sample</b>", font: {size: 18} },
        margin: { t: 0 },
        hovermode: "closest",
        hoverlabel: {font: {size: 8}},
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataFilter = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata0 = metadataFilter[0];
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    var wFreq = parseFloat(metadata0.wfreq);
    console.log(`wfreq = ${wFreq}`);
    
    // 4. Create the trace for the gauge chart.
       var gaugeData = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: wFreq,
              title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week</br>", font: { size: 16 } },
              gauge: {
                axis: { range: [null, 10], tickwidth: 1, tickmode: "auto", nticks: 6, tickcolor: "black" },
                bar: { color: "black" },
                bgcolor: "white",
                borderwidth: 1,
                bordercolor: "black",
                steps: [
                  { range: [0, 2], color: "red" },
                  { range: [2, 4], color: "darkorange" },
                  { range: [4, 6], color: "yellow"},
                  { range: [6, 8], color: "yellowgreen"},
                  { range: [8, 10], color: "green"}
                ],
              }
            }
        ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 350,
      height: 400,
      margin: {t: 25, r: 25, l: 25, b: 25},
      paper_bgcolor: "white",
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
