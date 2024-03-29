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
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/invited-events`,
      params: {
        $limit: 1000,
      },
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
    <div className="flex bg-[#0D0821] z-50 rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="z-50 py-5 border-b border-gray-200">
        <div className="z-50 -ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="z-50 ml-4 mt-2">
            <h3 className="z-50 text-2xl leading-6 font-medium text-white">
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
