const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then((data) => {
    bellybutton_data = data;
    init();
});

function buildMetadata(newSample) {
    
      
      // Filter the data for the object with the desired sample number
      filter = bellybutton_data.metadata.filter(sampleObj => sampleObj.id == newSample)[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      let demoInfo = d3.select("#sample-metadata");
            // Use `.html("") to clear any existing metadata
        demoInfo.html("");
         // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(filter).forEach(function([key, value]) {
        demoInfo.append("p").text(`${key}: ${value}`);
    });
    }
    
  
  
    function buildCharts(newSample) {
        d3.json(url).then((data) => {
            // Filter the data for the object with the desired sample number
            let sampleData = bellybutton_data.samples.filter(sampleObj => sampleObj.id == newSample)[0];
            let otu_ids = sampleData.otu_ids;
            let otu_labels = sampleData.otu_labels;
            let sample_values = sampleData.sample_values;
            // Build a Bar Chart using the sample data
            let barData = [{
                x: sample_values.slice(0, 10).reverse(),
                y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }];
            let barLayout = {
                title: "Top 10 Bacteria Cultures Found"
            };
    
            Plotly.newPlot("bar", barData, barLayout);
    
            // Build a Bubble Chart
            let bubbleData = [{
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }];
            let bubbleLayout = {
                title: "Bacteria Cultures Per Sample",
                xaxis: { title: "OTU ID" },
                hovermode: "closest"
            };
            Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        });
    }
    
  
  function init() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json(url).then((data) => {
        bellybutton_data = data;
      bellybutton_data.names.forEach(function(name){
        selector.append("option")
        .text(name)
        .property("value", name);
      });
  
      // Use the first sample from the list to build the initial plots
      let firstSample = bellybutton_data.names[0];
      buildCharts(firstSample);
    buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();

