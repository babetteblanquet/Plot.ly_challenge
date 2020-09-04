var samples;
var sample_values;
var sample_values0;
var otu_ids0;
var otu_labels0;
var otu_ids;
var otu_labels;
var metadata;
var metadata0;
var samples_dict;
var metadata_dict;
var names;

// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("samples.json").then(function (data) {
    // console.log(typeof(data));;
    // Grab sample_values, otu_ids and otu_labels from the response json object to build the plots
    samples = data.samples;
    sample_values0 = data.samples[0].sample_values;
    otu_ids0 = data.samples[0].otu_ids;
    otu_labels0 = data.samples[0].otu_labels;

    //Access to each dictionnaries in Samples:
    for (var i = 0; i < samples.length; i++) {
        samples_dict = data.samples[i];
    }

    // Declare variables names
    names = data.names;
    
    //Variable metadata for info Box: 
    metadata = data.metadata;
    metadata0 = data.metadata[0];
    for (var i = 0; i < metadata.length; i++) {
        metadata_dict = metadata[i];
    }
    //console.log(metadata)
    console.log(metadata_dict.id);
    console.log(samples_dict.id);

    //Call the functions to initialise the page:
    populateDropdownMenu(names);
    initialiseMetadata(metadata0);
    displayDefault(sample_values0, otu_ids0, otu_labels0);

});

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
function initialiseMetadata(metadata0) {
    Object.entries(metadata0).forEach(([key, value]) => {
        //Select the 'sample-metadata' area and append and replace it by text with the key value pair of the metadata:
        d3.select("#sample-metadata").append("div").text(`${key}: ${value}`);
    })
}

// This function is called when a dropdown menu item is selected
function getData() {
    var dropdownMenu = d3.select("#selDataset");
    //Selecting the value of the dropdown Menu:
    var dataset = dropdownMenu.property("value");
    
    //Looping through metadata array to update the demographic info:
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
    // Bar chart updating based on the selection of the dropdown menu:
    //Selecting the value of the dropdown Menu:
    var dataset = dropdownMenu.property("value");
    for (var i = 0; i < samples.length; i++) {
        samples_dict = samples[i];
        //Conditional based on the selection of the dropdown menu:
        if (dataset == samples_dict.id) {
            // Call function to update the chart
            displayDefault(samples_dict.sample_values, samples_dict.otu_ids, samples_dict.otu_labels);
            // //Place the display default inside a for loop to get the data 
            // data = samples_dict.sample_values;
            break;
        }
    }
}

// Call getData when a change takes place to the DOM
d3.select("#selDataset").on("change", getData);


// Display the default plots for the Bar chart and the Bubble chart:
function displayDefault(sample_values0, otu_ids0, otu_labels0) {
    // 1 - The bar chart
    //Sort the sample_values array - using sample_values0 as the first dictionnary of the array referencing id: 940
    var sortedData = sample_values0.sort((a, b) => b - a);
    console.log(sortedData)
    // Slice the first 10 objects for plotting
    var slicedData = sortedData.slice(0, 10);
    var slicedIDs = otu_ids0.slice(0, 10);
    var slicedLabels = otu_labels0.slice(0, 10);
    //console.log(slicedData)

    // Reverse the array due to Plotly's defaults
    var reverseData = slicedData.reverse();
    var reverseIDs = slicedIDs.reverse();
    var reverseLabels = slicedLabels.reverse();
    // console.log(reverseData)
    // console.log(reverseIDs)
    // console.log(reverseLabels)

    //Concatenate "OTU" for each otu_ids number to create an ID array with strings such as 'OTU 1977'
    var IDs = [];
    // Iterate through each ID object
    Object.values(reverseIDs).forEach(value => {
        // Concatenate "OTU" with each ID number
        IDs.push(('OTU ').concat(value))
    });

    console.log(IDs);

    // Trace1 for the sample values Data
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
        title: "Top 10 OTUs in belly button",
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
        x: otu_ids0,
        y: sample_values0,
        text: otu_labels0,
        mode: 'markers',
        marker: {
            color: otu_ids0,
            size: sample_values0
        }
    };

    var data = [trace1];

    var layout = {
        title: 'OTU ID in individual',
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Quantity" },
        showlegend: false,
        height: 600,
        width: 1000
    };

    Plotly.newPlot('bubble', data, layout);


}



