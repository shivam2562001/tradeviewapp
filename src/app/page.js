"use client"

import data1 from '../../data/data1.json' assert { type: 'json' };
import data2 from '../../data/data2.json' assert { type: 'json' };
import data3 from '../../data/data3.json' assert { type: 'json' };

import { useState, useMemo } from 'react';
import ChartComponent from '@/components/ChartComponent'
import {
  convertRawDataToTimeValVol,
  convertToOHLC,
  combineOHLC
} from '@/utils/ConvertRawDataToTimeLTP';
import CheckboxComponent from '@/components/CheckboxComponent';

const interval = 300 //seconds(5 min)
const timeValVolData = convertRawDataToTimeValVol(data1);
const ohlcData = convertToOHLC(timeValVolData, interval);
//console.log(timeValVolData, "here")

const data = [{
  name: "data1",
  value: data1,
  isSelected: false,
}, {
  name: "data2",
  value: data2,
  isSelected: false,
}, {
  name: "data3",
  value: data3,
  isSelected: false,
},
]


export default function Home() {
  const [checkedState, setCheckedState] = useState(
    [...data]
  );
  const [ohlc, setOhlc] = useState(ohlcData);
  const [loading, setIsLoading] = useState(false);


  const handleOnChange = (position) => {

    const updatedCheckedState = checkedState.map((item, index) => {
      if (index === position) item["isSelected"] = !item["isSelected"]
      return item;
    });

    setCheckedState(updatedCheckedState);
  };

  const resetCheckedState = () => {
    setCheckedState(previousCheckedState => {
      return previousCheckedState.map((item) => {
        item["isSelected"] = false
        return item;
      });
    });
  }

  const handleSubmit = (selectedCheckbox, interval) => {
    let timeValVolData, ohlcData, combinedOHLC=[];

    setIsLoading(true);

   selectedCheckbox.forEach((item) => {
      if (item.isSelected) {
        console.log("item",item.name)
        timeValVolData = convertRawDataToTimeValVol(item.value);
        ohlcData = convertToOHLC(timeValVolData, interval);
        combinedOHLC = combineOHLC(combinedOHLC, ohlcData);
      }
    })
    console.log("ohlc",combinedOHLC)
    setOhlc(combinedOHLC);
    resetCheckedState();
    //console.log(combinedOHLC,"..here");
    setIsLoading(false);
  }


  return (
    <>
      <div className="p-6 mt-10 mb-10">
        <ChartComponent data={ohlc} />
      </div>
      <div className="m-5 flex row justify-evenly">
        {
          checkedState && checkedState.map(({ name, isSelected }, index) => {
            return <CheckboxComponent key={name + index} index={index} label={name} isChecked={isSelected} handleOnChange={handleOnChange} />
          })
        }
      </div>
      <div>
        {loading ? "loading...." : ""}
      </div>
      <div className="mt-28 flex row justify-center items-center">
        <button onClick={() => handleSubmit(checkedState, interval)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
          Submit
        </button>
      </div>
    </>
  )
}
