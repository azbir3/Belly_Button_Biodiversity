function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    // version 1 (D3A3 & D2D3)
  const url = `/metadata/${sample}`; // not sure if samle is pulled in properly
 
  // Use d3 to select the panel with id of `#sample-metadata`
   d3.json(url).then((sample) =>{
    const panel = d3.select(`#sample-metadata`);
    console.log(sample);
  
    // Use `.html("") to clear any existing metadata
    panel.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  Object.entries(sample).forEach(([key, value])=>{
    panel.append("h6").text(`${key}: ${value}`);
  })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // set up variables for info to be retrieved
  const url = `/samples/${sample}`;
  d3.json(url).then((data) =>{
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
  // @TODO: Build a Bubble Chart using the sample data
  // https://plot.ly/javascript/bubble-charts/
      const bubbleData = {
        x: otu_ids,
        y: sample_values,
        hovertext: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        }
      };

      //const bubbles = [bubbleData];

      const bubbleLayout = {
        title: "Sample Population",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Value" },
        showlegend: false,
        margin: {t:30, l:250},
        height: 600,
        width: 1200
      };

      Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // refer to D1A2; D1A6 slice; D3D4; 
    // do not need this in addition to line 29 - function buildPie(sample) {
      const pieData = [{
        values: sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hovertext: otu_labels.slice(0,10),
        hoverinfo: "hovertext",
        type: "pie"
      }];
      
      const pieLayout = {
        margin: {t:30, l:0},
        title: 'Top 10 Samples',
      };
      
      Plotly.plot("pie", pieData, pieLayout);

// BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    // https://plot.ly/javascript/gauge-charts/ - pass
  });
  }
    
function init() {
  // Provided - Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Provided - Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Provided - Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Provided - Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Provided - Initialize the dashboard
init();