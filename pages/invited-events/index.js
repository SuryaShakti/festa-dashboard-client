import React, { useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import CardsContainer from "../../src/components/CardsContainer";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
const invitedEvents = () => {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    !localStorage.getItem("token") ? router.push("/login") : fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: "https://api.test.festabash.com/v1/event-management/invited-events",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  return (
    <div className="flex bg-white rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="bg-white py-5 border-b border-gray-200">
        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-2xl leading-6 font-medium text-gray-900">
              Invited Events
            </h3>
          </div>
        </div>
      </div>
      <div>
        <CardsContainer data={data} section="invited-events" />
      </div>
    </div>
  );
};

export default invitedEvents;
