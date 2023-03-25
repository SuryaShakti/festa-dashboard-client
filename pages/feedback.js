import axios from "axios";
import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";

const feedback = () => {
  const [type, setType] = useState(1);
  const [ratings, setRatings] = useState(0);
  const [description, setDescription] = useState("");

  const thirdExample = {
    size: 40,
    count: 5,
    isHalf: false,
    value: ratings,
    color: "#cccccc",
    activeColor: "yellow",
    onChange: (newValue) => {
      setRatings(newValue);
      console.log(`Example 3: new value is ${newValue}`);
    },
  };

  const sendFeedback = async () => {
    const token = localStorage.getItem("token");
    var data =
      ratings > 0
        ? JSON.stringify({
            rating: ratings,
            type: type,
            description: description,
          })
        : JSON.stringify({
            type: type,
            description: description,
          });

    var config = {
      method: "post",
      url: "https://api.test.festabash.com/v1/feedback",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex z-50 bg-[#0D0821]  rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="z-50 py-5 border-b border-gray-200">
        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="z-50 text-2xl leading-6 font-medium text-white">
              Feedback
            </h3>
          </div>
        </div>
      </div>
      <div className="z-50 first-letter:mt-5">
        <div className="text-xl text-white font-semibold ">
          Send us your feedback to us!
        </div>
        <div className="text-sm text-white">
          Do you have a suggestion or found some bug? Let us know in the field
          below.
        </div>
        <ReactStars
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
          {...thirdExample}
        />
        <textarea
          className="border p-3 w-full border-gray-400 bg-transparent text-white  rounded-xl md:w-1/2"
          value={description}
          placeholder="Describe your feedback"
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
        />
        <div className="my-2 flex items-center space-x-3">
          <div className="flex items-center ">
            <input
              checked={type === 1}
              id="default-radio-1"
              type="radio"
              value={1}
              name="default-radio"
              onChange={(e) => {
                console.log(e.target.value);
                setType(1);
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-radio-1"
              className="ml-2 text-sm font-medium text-white dark:text-gray-300"
            >
              Suggestion
            </label>
          </div>
          <div className="flex items-center">
            <input
              checked={type === 2}
              id="default-radio-2"
              type="radio"
              value={2}
              name="default-radio"
              onChange={(e) => {
                console.log(e.target.value);
                setType(2);
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-radio-2"
              className="ml-2 text-sm font-medium text-white dark:text-gray-300"
            >
              Issue
            </label>
          </div>
          <div className="flex items-center">
            <input
              checked={type === 3}
              id="default-radio-3"
              type="radio"
              value={3}
              name="default-radio"
              onChange={(e) => {
                console.log(e.target.value);
                setType(3);
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-radio-3"
              className="ml-2 text-sm font-medium text-white dark:text-gray-300"
            >
              Others
            </label>
          </div>
        </div>
        <button
          onClick={() => sendFeedback()}
          className="w-full md:w-[200px] mt-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xl"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default feedback;
