import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect, Fragment } from "react";
import Spinner from "../../src/components/Spinner";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const router = useRouter();

  const getTickets = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.test.festabash.com/v1/help-center/support-ticket?$populate=event&$sort[createdAt]=-1",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setTickets(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getTickets();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

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
              Support Tickets
            </h3>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create a support ticket
            </button>
          </div>
        </div>
      </div>
      <div className="z-50 mt-5 w-full">
        {loading ? (
          <Spinner />
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-3">
            {tickets.length > 0 &&
              tickets.map((ticket, index) => (
                <div
                  key={index}
                  className="border p-3 border-gray-300 rounded-xl"
                >
                  <div className="w-full flex justify-between items-start">
                    <div className="">
                      <div className="flex items-center space-x-2">
                        <div>
                          {user.avatar ? (
                            <img
                              className="inline-block h-9 w-9 rounded-full"
                              src={user.avatar ? user.avatar : "s"}
                              alt=""
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-teal-300 flex justify-center items-center text-white shadow-lg text-xl font-bold">
                              {user?.name ? user.name[0] : ""}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-lg">
                            {user.name}
                          </div>
                          <div className="text-gray-200 text-sm">
                            {ticket?.event?.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-200 mt-1 text-sm">
                        {ticket.description}
                      </div>
                    </div>
                    <div className="text-white text-sm">
                      <div>Ticket No. {ticket.supportTicketId}</div>
                      <div>{formatDate(ticket.createdAt)}</div>
                    </div>
                  </div>
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => router.push(`/support/${ticket._id}`)}
                      className="z-50 inline-flex text-white hover:bg-gray-200 justify-center rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-b from-violet-400 via-violet-700 to-violet-900 "
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
