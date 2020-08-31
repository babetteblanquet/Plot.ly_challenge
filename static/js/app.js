// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("samples.json").then(function(data) {
    // console.log(typeof(data));;
    // Grab sample_values, otu_ids and otu_labels from the response json object to build the plots
    var sample_data = data.samples[0]
    var sample_values = data.samples[0].sample_values;
    var otu_ids = data.samples[0].otu_ids;
    var otu_labels = data.samples[0].otu_labels;

    // console.log(sample_data)
    // console.log(sample_values)
    // console.log(otu_ids)
    // console.log(otu_labels)
      
    //Sort the sample_values array
    var sortedData = sample_values.sort((a, b) => b - a);
    console.log(sortedData)
    // Slice the first 10 objects for plotting
    var slicedData = sortedData.slice(0, 10);
    var slicedIDs = otu_ids.slice(0,10);
    var slicedLabels = otu_labels.slice(0,10);
    //console.log(slicedData)

    // Reverse the array due to Plotly's defaults
    var reverseData = slicedData.reverse();
    var reverseIDs = slicedIDs.reverse();
    var reverseLabels = slicedLabels.reverse();
    // console.log(reverseData)
    // console.log(reverseIDs)
    // console.log(reverseLabels)

    //Concatenate "OTU" for each otu_ids number to create an ID array with strings such as OTU_1977
    var IDs = [];
    // Iterate through each ID object
        Object.values(reverseIDs).forEach(value => {
            // Concatenate "OTU" with each ID number
            IDs.push(('OTU_').concat(value))
        });
    
    console.log(IDs);
  
    // Trace1 for the sameple values Data
    var trace1 = {
        x: reverseData,
        y: IDs,
        text: reverseLabels,
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