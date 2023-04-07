import React, { useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import CardsContainer from "../../src/components/CardsContainer";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const createdEvents = () => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const [status, setStatus] = useState(0);

  const fetchData = async () => {
    var data = JSON.stringify({});
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event?$sort[createdAt]=-1&limit=100`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        $limit: 1000,
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log("sjnsj", response.data);
        setData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const removeDraft = async (id) => {
    const token = localStorage.getItem("token");
    console.log(`Removing ${id}`);

    var config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const _data = data;
        setData(_data.filter((item, index) => item._id !== response.data._id));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const createEventHandler = () => {
    var data = JSON.stringify({});
    const token = localStorage.getItem("token");

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        router.push(`/create-event?eventId=${response.data._id}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="flex relative bg-[#0D0821] rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="z-30 py-5 border-b border-gray-200">
        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-2xl leading-6 font-medium text-white">
              Created Events
            </h3>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => createEventHandler()}
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create new Event
            </button>
          </div>
          <div className="mt-3 rounded-xl bg-white shadow grid grid-cols-2 h-9">
            <div
              onClick={() => {
                setStatus(0);
              }}
              className={
                status === 0
                  ? "bg-indigo-700 rounded-md px-10 w-full cursor-pointer text-white flex justify-center items-center font-medium "
                  : "bg-white rounded-md px-10 w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium "
              }
            >
              Published Event
            </div>
            <div
              onClick={() => {
                setStatus(1);
              }}
              className={
                status === 1
                  ? "bg-indigo-700 rounded-md px-10 w-full cursor-pointer text-white flex justify-center items-center font-medium "
                  : "bg-white rounded-md px-10 w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium "
              }
            >
              Drafts
            </div>
          </div>
        </div>
      </div>
      <div className="z-20">
        <CardsContainer
          data={
            status === 0
              ? data.filter((data) => data.status === 1)
              : data.filter((data) => data.status === 2)
          }
          section="created-events"
          removeDraft={(id) => removeDraft(id)}
        />
      </div>
    </div>
  );
};

export default createdEvents;
