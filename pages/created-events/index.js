import React, { useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import CardsContainer from "../../src/components/CardsContainer";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const createdEvents = () => {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    !localStorage.getItem("token") ? router.push("/") : fetchData();
  }, []);

  const fetchData = async () => {
    var data = JSON.stringify({});
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: "https://api.test.festabash.com/v1/event-management/event?$sort[createdAt]=-1",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const removeDraft = async (id) => {
    const token = localStorage.getItem("token");
    console.log(`Removing ${id}`)

    // var config = {
    //   method: "delete",
    //   maxBodyLength: Infinity,
    //   url: `https://api.test.festabash.com/v1/event-management/event/${id}`,
    //   headers: {
    //     Authorization:
    //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJzdWIiOiI2M2MzY2EwNjAwMDNkYjM2YjNiM2U2MTAiLCJpYXQiOjE2NzQ1Mzk2ODIsImV4cCI6MTY3NzEzMTY4MiwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwianRpIjoiMWFhMTMwZGEtNDAyOS00ZWZlLTgyMDItNTExYTA3ZDNiZDQ3In0.GBYcq4YMikuNGFpL8t6fPrTCjEE1NyqxuDCIjkmM8Iw",
    //   },
    // };

    // await axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //     const _data = data;
    //     setData(_data.filter((item, index) => item._id !== response.data._id));
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  return (
    <div className="flex bg-white rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="bg-white py-5 border-b border-gray-200">
        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-2xl leading-6 font-medium text-gray-900">
              Created Events
            </h3>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => router.push("/create-event")}
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create new Event
            </button>
          </div>
        </div>
      </div>
      <div>
        <CardsContainer
          data={data}
          section="created-events"
          removeDraft={() => removeDraft(id)}
        />
      </div>
    </div>
  );
};

export default createdEvents;
