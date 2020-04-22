d3.json("data/samples.json").then((data) => {
    console.log(data)
});

function get_demographics(subject_id) {
    // find data
    d3.json("data/samples.json").then((data) => {
        // store location of Demographic data in list
        var demo_array = data.metadata;
        // loop through info to find specified subject
        var demo_info = demo_array.filter((subject) => subject.id == subject_id);
        // Check the product
        console.log(demo_info);
        // Filter creates list - go into list
        demographics = demo_info[0]
        // Print the object we will loop through
        console.log(demographics);
        // Save location in HTML for Demographic data
        var demo_section = d3.select("#demographic_info");
        // remove data from demographics card
        demo_section.html("");
        // loop through metadata to store demographic data
        Object.entries(demographics).forEach(([key, value]) => {
            // verify demographic data printing sequentially
            console.log(key + ": " + value);
            // add each 'key' 'value' to demographic section
            demo_section
                .append("h5")
                .text(key + ": " + value)

        });
    });
}

function create_charts(subject_id) {
    d3.json("data/samples.json").then((data) => {
        // get the array of data objects from samples
        var data_array = data.samples;
        // store needed subject's object data in list by filtering
        var object_needed = data_array.filter(data_object => data_object.id = subject_id);
        // access the object
        var object_data = object_needed[0];

        // get metric ID in list for x-axis
        var metric_ids = object_data.otu_ids;
        // get metric values in list for y-axis
        var metric_values = object_data.sample_values;
        // get metric lables in list for hovering
        var metric_labels = object_data.otu_labels;

        //BAR CHART
        // Horizontal - x and y switch, orientation = h, data input botton to top
        var axis_ids = metric_ids.slice(0,10).map(otu_id => `OTU: ${otu_id}`);
        // get top 10 data points (already in order - scrape first 10)
        var bar_data = {
            // convert value to string
            y: axis_ids,
            x: metric_values.slice(0,10),
            text: metric_labels.slice(0,10),
            type: "bar",
            orientation: "h"
        };
        // Package in trace
        var bar_trace = [bar_data];
        // Add a title
        var bar_layout = {
            title: "Top 10 OIDs"
        };
        // contruct/place chart
        Plotly.newPlot("bar_chart", bar_trace, bar_layout);

        //BUBBLE CHART
        //id value vs count of instances with size equal to the count of instances
        var bubble_data = {
            x: metric_ids,
            y: metric_values,
            text: metric_labels,
            mode: "markers",
            marker: {
              size: metric_values,
            }
        };
        //package up the bubble data in a trace
        var bubble_trace = [bubble_data]
        // edit the layout of the bubble chart
        var bubble_layout = {
            title: "Count of Each OTU",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Count" }
          };

        Plotly.newPlot("bubble_chart", bubble_trace, bubble_layout);
    });
}

function initialize_webpage() {
    // store location of select feature for options
    var options_location = d3.select("#selector_choice");

    // get data
    d3.json("data/samples.json").then((data) => {
        // get IDs for selector
        var list_subjects = data.names;
        // Print IDs (Check)
        console.log(list_subjects);
        // for each ID in list, create new option row
        list_subjects.forEach((subject_id) => {

            // DID NOT WORK!
            // create options element
            //var opt = document.createElement('option');
            // create value
            //opt.setAttribute("value", subject_id);
            // create text
            //opt.text = subject_id;
            // add HTML Option to select
            //options_location.appendChild(opt);
            
            // WORKS!
            options_location
                .append("option")
                .text(subject_id)
                .property("value", subject_id);
        });
        // get first Subject from list to build charts
        initial_id = list_subjects[0]
        get_demographics(initial_id);
        create_charts(initial_id);
    });
}

function id_choice(id_selection) {
    get_demographics(id_selection);
    create_charts(id_selection);
}

initialize_webpage();



