function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
      
      d3.json(`/metadata/${sample}`).then(function(data) {
        //console.log(data);
      var panel = d3.select("#sample-metadata");
      panel.html("");
      
      Object.entries(data).forEach(([key,value]) => {

        panel.append('p').text(`${key}: ${value}`);
      });
});
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {
    const otu_ids = data.otu_ids;
    const sample_values = data.sample_values;
    const otu_labels = data.otu_labels;

  
    // @TODO: Build a Bubble Chart using the sample data
     var tracebubble = {
       x: otu_ids,
       y: sample_values,
       text: otu_labels,
       type: "scatter",
       mode: "markers",
       marker: {
         color: data["otu_ids"],
         size: data["sample_values"]
       }
    };
    var databubble = [tracebubble];
    var layoutbubble = {
      title: "Biodiversity Bubble Chart",
      autorange: true,
      opacity: 0.3
    };
    Plotly.newPlot("bubble", databubble, layoutbubble);

    //@TODO: Build a Pie Chart
    //HINT: You will need to use slice() to grab the top 10 sample_values,
    //otu_ids, and labels (10 each).



    const samples = sample_values.slice(0, 10);
    const ids = otu_ids.slice(0, 10);
    const hover = otu_labels.slice(0, 10);
    var tracepie = {
      labels: ids,
      values: samples,
      hovertext: hover,
      hoverinfo: "hovertext",
      type: 'pie'
    };
    var datapie = [tracepie];
    var layoutpie = {
      title: "Biodiversity Pie Chart"
    };
    Plotly.newPlot("pie", datapie,layoutpie);
  });  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();
