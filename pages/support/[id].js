import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect, Fragment } from "react";
import Spinner from "../../src/components/Spinner";

const SupportDetails = () => {
  const router = useRouter();
  const [ticket, setTicket] = useState({});
  const [loading, setLoading] = useState(false);

  const getTicket = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.test.festabash.com/v1/help-center/support-ticket/63fac2db873454cd8467c87d?$populate=event&$sort[createdAt]=-1",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setTicket(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (router.query.id) {
      getTicket();
    }
  }, [router.query.id]);

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <div className="flex text-white bg-[#0D0821] z-30 rounded-3xl min-h-[95vh] flex-col px-3 md:px-10 py-4 md:mr-6">
      <div className="z-30 py-5 border-b border-gray-200">
        <div className="z-30 -ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="z-30 ml-4 mt-2">
            <h3 className="text-2xl leading-6 font-medium text-white  ">
              Support Ticket Details
            </h3>
          </div>
        </div>
      </div>
      <div className="z-50">
        <div className="z-50 mt-5 w-full">
          {loading ? (
            <Spinner />
          ) : (
            <div className="z-50">
              <div>
                <dl class="max-w-md text-white divide-y divide-gray-200 dark:text-white ">
                  <div class="flex flex-col pb-3">
                    <dt class="mb-1 text-white text-left md:text-lg dark:text-gray-400">
                      Ticket Number
                    </dt>
                    <dd class="text-lg text-left font-semibold">
                      {ticket.supportTicketId}
                    </dd>
                  </div>
                  <div class="flex flex-col py-3">
                    <dt class="mb-1 text-white text-left md:text-lg dark:text-gray-400">
                      Date
                    </dt>
                    <dd class="text-lg text-left font-semibold">
                      {formatDate(ticket.createdAt)}
                    </dd>
                  </div>
                  <div class="flex flex-col pt-3">
                    <dt class="mb-1 text-white text-left md:text-lg dark:text-gray-400">
                      Description
                    </dt>
                    <dd class="text-lg text-left font-semibold">
                      {ticket.description}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <div className="text-xl mt-10 font-semibold">Photos </div>
                <div className="grid grid-cols-3 mt-3 md:grid-cols-4">
                  {ticket.attachments?.map((img, index) => (
                    <div key={index} className="w-full">
                      <img className="w-56 h-56 rounded-xl" src={img} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex w-full justify-end">
                <button
                  onClick={() => router.push(`/support/chat?id=${ticket._id}`)}
                  className="z-50 inline-flex text-white hover:bg-gray-200 justify-center rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-b from-violet-400 via-violet-700 to-violet-900 "
                >
                  Have a Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportDetails;
