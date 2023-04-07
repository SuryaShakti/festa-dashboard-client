import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const test = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  //   const handleDateChange = (ranges) => {
  //     setStartDate(ranges.selection.startDate.toISOString());
  //     setEndDate(ranges.selection.endDate.toISOString());
  //   };

  const handleStartTimeChange = (date) => {
    console.log(date);
    const selectedDateTime = new Date(
      selectedDates[0].startDate.toISOString().substring(0, 10) +
        "T" +
        date.format("HH:mm:ss")
    ).toISOString();
    console.log(selectedDateTime);
    setStartDateTime(selectedDateTime);
  };

  const handleEndTimeChange = (date) => {
    const selectedDateTime = new Date(
      selectedDates[0].endDate.toISOString().substring(0, 10) +
        "T" +
        date.format("HH:mm:ss")
    ).toISOString();
    setEndTime(date.toISOString());
    if (selectedDateTime < startDateTime) {
      alert("End date/time must be greater than start date/time");
    } else {
      setEndDateTime(selectedDateTime);
    }
  };

  return (
    <div className="z-50 w-max">
      {/* <DateRangePicker
        ranges={[{ startDate, endDate, key: "selection" }]}
        onChange={handleDateChange}
      /> */}
      <DateRangePicker
        ranges={selectedDates}
        staticRanges={[]}
        inputRanges={[]}
        className="my-3"
        onChange={(item) => {
          console.log(item.selection);
          console.log(item.selection.startDate.toISOString());
          console.log(item.selection.endDate.toISOString());
          setSelectedDates([item.selection]);
        }}
        minDate={new Date()}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Start Time:</label>
          <Datetime
            className="w-max"
            value={startDateTime ? new Date(startDateTime) : null}
            onChange={handleStartTimeChange}
            dateFormat={false}
            inputProps={{
              placeholder: "Select start time",
              className: "inputClass",
            }}
          />
        </div>
        <div>
          <label>End Time:</label>
          <Datetime
            value={endTime ? new Date(endTime) : null}
            onChange={handleEndTimeChange}
            dateFormat={false}
            inputProps={{
              placeholder: "Select end time",
              className: "inputClass",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default test;
