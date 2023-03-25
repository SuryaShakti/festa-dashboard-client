import React, { useState, useRef } from "react";

export default function OtpInput({ otp, setOtp }) {
  const inputRefs = useRef([]);

  // This function is called whenever an input field is changed
  function handleInputChange(index, event) {
    const value = event.target.value;

    // Only allow digits
    const regex = /^\d*$/;

    // Check if the input matches the regex
    if (regex.test(value)) {
      // Update the OTP value in state
      const newOtp = otp.substring(0, index) + value + otp.substring(index + 1);
      setOtp(newOtp);

      // Focus on the next input field if it exists
      if (index < inputRefs.current.length - 1 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    }
  }

  // This function is called when the user presses backspace
  function handleBackspace(index, event) {
    if (event.key === "Backspace") {
      // Update the OTP value in state
      const newOtp = otp.substring(0, index) + "_" + otp.substring(index + 1);
      setOtp(newOtp);

      // Focus on the previous input field if it exists
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  }

  // Create an array of input fields based on the length of the OTP value
  const inputs = Array.from({ length: 6 }, (_, i) => (
    <input
      key={i}
      type="text"
      className="w-14 h-14 rounded-lg flex justify-center items-center text-center bg-transparent text-white border border-white"
      maxLength={1}
      value={otp[i] !== "_" ? otp[i] : ""}
      onChange={(event) => handleInputChange(i, event)}
      onKeyDown={(event) => handleBackspace(i, event)}
      ref={(el) => (inputRefs.current[i] = el)}
    />
  ));

  return <div className="otp-input grid grid-cols-6 gap-2">{inputs}</div>;
}
