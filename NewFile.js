
const fs = require('fs');

// Read the inputData file and parse the data
const input = fs.readFileSync('./DataFiles/heartrate.json','utf8');
const data = JSON.parse(input);


// Divided the data by date wise and grouped the data
const groupedData = {};
for(const totalData of data){
    const date = totalData.timestamps.startTime.substring(0, 10);
    if (!groupedData[date]) {
        groupedData[date] = [];
    }
    groupedData[date].push(totalData);
}
        //console.log(groupedData)

// Calculate the required values for each day
    const result = [];
    for(const date of Object.keys(groupedData)){
    const totalDayData = groupedData[date];
    const beatsPerMinute = totalDayData.map(m => m.beatsPerMinute);

    // To get the median
    beatsPerMinute.sort((a, b) => a - b);
    let median;
    if(beatsPerMinute.length % 2 === 0){
        median= (beatsPerMinute[beatsPerMinute.length/2 - 1] + beatsPerMinute[beatsPerMinute.length/2])/2
    }else{
       median = beatsPerMinute[(beatsPerMinute.length - 1)/ 2]
    }

    // To get the latestDataTimestamp
    const latestDataTimestamp = totalDayData[totalDayData.length - 1].timestamps.endTime

    // Push the required data into result list
    result.push({
        "date": date,
        "min": Math.min(...beatsPerMinute),
        "max": Math.max(...beatsPerMinute),
        "median": median,
        "latestDataTimestamp": latestDataTimestamp,
    });
}

    //Create and write the result into output.json file
    let myJson = JSON.stringify(result);
    fs.writeFile('./DataFiles/output.json', myJson, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('output.json file created successfully! in the DataFiles folder');
});