var samples;
var sample_values;
var otu_ids;
var otu_labels;
var metadata;
var metadata_0;
var samples_dict;
var metadata_dict;
var names;

// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("samples.json").then(function (data) {
    // console.log(typeof(data));;
    // Grab sample_values, otu_ids and otu_labels from the response json object to build the plots
    samples = data.samples;
    sample_values = data.samples[0].sample_values;
    otu_ids = data.samples[0].otu_ids;
    otu_labels = data.samples[0].otu_labels;

    // Declare variables names
    names = data.names;
    //var data_941 = data.samples[1].sample_values;
    // console.log(names)

    //Variable metadata for info Box: 
    metadata = data.metadata; 
    metadata_0 = data.metadata[0];
    
    populateDropdownMenu(names);
    initialiseMetadata(metadata_0);
    displayDefault();

});
//console.log(metadata)
//console.log(metadata_0)
//console.log(metadata_dict)
//console.log(metadata_dict.id)

//Dropdown menu set up with the array "names"
function populateDropdownMenu(names) {
    var dropdownMenu = d3.select("#selDataset")
        .selectAll("option")
        .data(names)
        .enter()
        .append("option")
        .html(function (d) {
            return `<option value=${d}>${d}</option>`;
        });
}

//Setting up the info box with metadata:
// Iterate through each key and value of the metadata dictionary
function initialiseMetadata(metadata_0) {
    Object.entries(metadata_0).forEach(([key, value]) => {
        //Select the 'sample-metadata' area and append and replace it by text with the key value pair of the metadata:
        d3.select("#sample-metadata").append("div").text(`${key}: ${value}`);
    })
}


// This function is called when a dropdown menu item is selected
function getData() {
    var dropdownMenu = d3.select("#selDataset");
    //Selecting the value of the dropdown Menu:
    var dataset = dropdownMenu.property("value");

    for (var i = 0; i < metadata.length; i++) {
        metadata_dict = metadata[i];
        //Conditional based on the selection of the dropdown menu:
        if (dataset == metadata_dict.id) {
            d3.select("#sample-metadata").selectAll("div").remove();
            //Setting up the info box with metadata:
            // Iterate through each key and value of the metadata dictionary 
            Object.entries(metadata_dict).forEach(([key, value]) => {
                //Select the 'sample-metadata' area and append and replace it by text with the key value pair of the metadata:
                d3.select("#sample-metadata").append("div").text(`${key}: ${value}`);
            });
            break;
        }
    }
    // Initialize an empty array for the country's data
    var data = [];
    for (var i = 0; i < samples.length; i++) {
        samples_dict = samples[i];
        //Conditional based on the selection of the dropdown menu:
        if (dataset == samples_dict.id) {
            //Place the display default inside a for loop to get the data 
            data = samples_dict.sample_values;
        }
        // Call function to update the chart
        displayDefault(data);
    }
}

// Call getData when a change takes place to the DOM
d3.select("#selDataset").on("change", getData);



// Display the default plot
function displayDefault() {
    // 1 - The bar chart
    //Sort the sample_values array
    var sortedData = sample_values.sort((a, b) => b - a);
    console.log(sortedData)
    // Slice the first 10 objects for plotting
    var slicedData = sortedData.slice(0, 10);
    var slicedIDs = otu_ids.slice(0, 10);
    var slicedLabels = otu_labels.slice(0, 10);
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

    // 2 - The Bubble Chart:

    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Bubble Chart Hover Text',
        showlegend: false,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);


}

// // Update the restyled plot's values
// function updatePlotly(newdata) {
//     Plotly.restyle("bar", "values", [newdata]);



