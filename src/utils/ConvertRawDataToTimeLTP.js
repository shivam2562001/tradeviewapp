





export function convertRawDataToTimeValVol(data) {
    return data.map((item) => ({ time: Math.floor(new Date(item[0]).getTime()/1000), value: item[1],volume:item[2] }));
}





function groupDataToIntervals(inputData,interval){
    return inputData.reduce((acc, data) => {
        const intervalTimestamp = Math.floor(data.time / interval) * interval;
        if (!acc[intervalTimestamp]) {
          acc[intervalTimestamp] = {
            values: [],
            volumes: [],
          };
        }
        acc[intervalTimestamp].values.push(data.value);
        acc[intervalTimestamp].volumes.push(data.volume);
        return acc;
      }, {});
    
}


function convertGroupDataToOHLC(groupedData){
    let ohlcData = [];
    for (const timestamp in groupedData) {
        const { values, volumes } = groupedData[timestamp];
        const ohlc = {
          time: parseInt(timestamp),
          open: values[0],
          high: Math.max(...values),
          low: Math.min(...values),
          close: values[values.length - 1],
          volume: volumes.reduce((sum, volume) => sum + volume, 0),
        };
        ohlcData.push(ohlc);
      }

      return ohlcData;
} 

// Function to convert data to OHLC format
export function convertToOHLC(inputData, interval) {
    // Group the data by time intervals
   const groupedData= groupDataToIntervals(inputData, interval);
    // Convert grouped data to OHLC format
   const ohlcData = convertGroupDataToOHLC(groupedData);
  
    return ohlcData;
  }
  
 export function combineOHLC(existingData, newData) {
    const combinedData = [...existingData];
  
    newData.forEach((data) => {
      const existingIndex = combinedData.findIndex((item) => item.time === data.time);
      
      if (existingIndex !== -1) {
        const existingData = combinedData[existingIndex];
  
        existingData.high = Math.max(existingData.high, data.high);
        existingData.low = Math.min(existingData.low, data.low);
        existingData.close = data.close;
        existingData.volume += data.volume;
      } else {
        combinedData.push(data);
      }

    });
  
    return combinedData;
  }
