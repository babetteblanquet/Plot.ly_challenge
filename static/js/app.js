// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("samples.json").then((importedData) => {
    console.log(importedData);
    var data = importedData;

    // Sort the data array using the sample values
    var sortedData = data.sort((a, b) => b.sample_values - a.sample_values);
    
    // Slice the first 10 objects for plotting
    var slicedData = data.slice(0, 10);

    // Reverse the array due to Plotly's defaults
    var reverseData = data.reverse();
    
    // Trace1 for the Greek Data
    var trace1 = {
        x: reversedData.map(object => object.samples_values),
        y: reversedData.map(object => object.otu_ids),
        text: reversedData.map(object => object.otu_labels),
        name: "OTUs",
        type: "bar",
        orientation: "h"
    };

    // data
    var data = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
        title: "Top 10 OTUs (operational taxonomic units) in belly button",
       margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", data, layout);

});