const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Deliver test subject ID number
function init(){
    let dropdown = d3.select("#selectDataset");
    d3.json(url).then((data) => {
        jsonData = data;
            let studyID = data.names;
            studyID.foreach((ID) => {
                dropdown
                .append('option')
                .text(ID)
                .property('value', ID);
            });
    });
    buildMetadata(940);
    buildCharts(940);
}

function optionChange(newID) {
    buildMetadata(newID);
    buildCharts(newID);
};

// Deliver demographic info
function buildMetadata(ID) [
    d3.json(url).then((data) => {

        // Define the metadata
        let metadata = data.metadata;

        // Filter by the ID
        let filteredMetadata = metadata.filter(metaObject => metaObject.id == ID)[0-];

        // Create the panel
        let panel = d3.select("#sample_metadata");
        panel.append("h6").text("ID: " + filteredMetadata.id);
        panel.append("h6").text("ETHNICITY: " + filteredMetadata.ethnicity);
        panel.append("h6").text("GENDER: " + filteredMetadata.gender);
        panel.append("h6").text("AGE: " + filteredMetadata.age);
        panel.append("h6").text("LOCATION: " + filteredMetadata.location);
        panel.append("h6").text("BBTYPE: " + filteredMetadata.bbtype);
        panel.append("h6").text("WFREQ: " + filteredMetadata.wfreq);

        // Create the gauge chart
        // Define variable for washing frequency
        var = washFrequency = filteredMetadata.wfreq;

        // Create trace
        var gauge_data = [{
               domain: { x: [0, 1], y: [0,1] },
                value: washFrequency,
                title: { text: "Washing Frequency (No. of Times per Week)" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color: 'white'},
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 2], color: 'rgb(250,189,110)' },
                        { range: [2, 4], color: 'rgb(210,152,93)' },
                        { range: [4, 6], color: 'rgb(169,116,76)' },
                        { range: [6, 8], color: 'rgb(129,79,59)' },
                        { range: [8, 10], color: 'rgb(88,42,42)' },
                    ],
                }
            }
        ];

        // Define layout for plot
        var gauge_layout = {
            width: 500,
            height: 400,
            margin: { t: 0, b: 0 }};

        // Diplay the plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout);
    });
];

// Create charts
function buildCharts(ID) {
    d3.json(url).then((data) => {

        // Define the samples
        let sample = data.samples

        // Filter samples by ID
        let filteredSample = sample.filter(bacteria => bacteria.id == ID[0];
            
        // Create bar chart
        // Create variables
        let sample_values = filteredSample.sample_values
        let sample_ids = filteredSample.sample_ids
        let sample_labels = filteredSample.sample_label

        // Create trace
        var bar_chart_data = [{

            // Defining the x-values as the sample_values
            x: sample_values.slice(0, 10).reverse(),

            // Defining the y-values as the sample_ids
            y: sample_ids.slice(0, 10).map(sample_ids => 'OTU ${sample_ids}').reverse(),

            // Defining text values as sample_labels
            text: sample_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
        }]

        // Define layout for plot
        var bar_chart_layout = {
            title: "Top 10 Microbial Species Found in Belly Buttons",
            xaxis: { title: "Bacteria Sample Values" },
            yaxis: { title: "Sample IDs" }
        };

        // Display the plot
        Plotly.newPlot('bar', bar_chart_data, bar_chart_layout)

        // Create bubble chart
        // Create trace
        var bubble_chart_data = [{
            x: sample_ids,
            y: sample_values,
            text: sample_labels,
            mode: 'markers',
            marker: {
                // Defining marker colors by sample_ids
                color: sample_ids,
                size: sample_values,
                colorscale: 'Electric'
            }
        }];

        // Define layout for plot
        var bubble_chart_layout = {
            title: "Belly Button Samples",
            xaxis: { title: "Sample IDs" },
            yaxis: { title: "Sample Values" }
        };

        // Display the plot
        Plotly.newPlot('bubble', bubble_chart_data, bubble_chart_layout)
    });
};

init();