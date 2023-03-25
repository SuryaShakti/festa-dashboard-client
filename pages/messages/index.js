import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const messages = () => {
  const router = useRouter();
  const [status, setStatus] = useState(0);
  const [data, setData] = useState();
  const [search, setSearch] = useState("");
  const [vendorMessages, setVendorMessages] = useState();

  const getVendorsChat = async () => {
    const token = localStorage.getItem("token");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.test.festabash.com/v1/chat/conversation-vendor?$populate=lastMessage",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        $limit: 1000,
        // $populate: {
        //   path: "lastMessage",
        //   populate: ["createdBy"],
        // },
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setVendorMessages(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getChats = async () => {
    const token = localStorage.getItem("token");

    var config = {
      method: "get",
      url: "https://api.test.festabash.com/v1/chat/conversation?$populate=users&$populate=lastMessage",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        $limit: 1000,
        $populate: {
          path: "lastMessage",
          populate: ["createdBy"],
        },
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

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div className="flex z-50 bg-[#0D0821] rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="w-full z-50">
        <div className="md:max-w-3xl z-50">
          <div className="w-full z-50 rounded-xl bg-white shadow grid grid-cols-2 h-10">
            <div
              onClick={() => setStatus(0)}
              className={
                status === 0
                  ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                  : "bg-gray-100 rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
              }
            >
              Co-hosts
            </div>
            <div
              onClick={() => {
                getVendorsChat();
                setStatus(1);
              }}
              className={
                status === 1 || status === 2
                  ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                  : "bg-gray-100 rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
              }
            >
              Vendors
            </div>
          </div>
          {status === 0
            ? data?.map((chat, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`messages/${chat._id}`)}
                  className="w-full flex my-3 items-center bg-gray-100 bg-opacity-20 shadow-xl cursor-pointer rounded-xl p-2 "
                >
                  <div className="flex items-center flex-1">
                    <img src={chat.avatar} className="w-14 h-14 rounded-full" />
                    <div className="ml-3 space-y-1">
                      <div className="text-lg text-white font-bold">
                        {chat.name}
                      </div>
                      <div className="text-xs text-gray-100">
                        {chat?.lastMessage?.createdBy?.name
                          ? chat?.lastMessage?.createdBy?.name
                          : "No messages yet"}
                      </div>
                    </div>
                  </div>
                  <div className="text-white">
                    {chat.lastMessage?.createdBy?.createdAt
                      ? chat.lastMessage?.createdBy?.createdAt.slice(11, 16)
                      : ""}
                  </div>
                </div>
              ))
            : vendorMessages?.map((chat, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`messages/${chat._id}`)}
                  className="w-full flex my-3 items-center bg-gray-100 bg-opacity-20 shadow-xl cursor-pointer rounded-xl p-2 "
                >
                  <div className="flex items-center flex-1">
                    <img src={chat.avatar} className="w-14 h-14 rounded-full" />
                    <div className="ml-3 space-y-1">
                      <div className="text-lg text-white font-bold">
                        {chat.name}
                      </div>
                      <div className="text-xs text-gray-100">
                        {chat?.lastMessage?.createdBy?.name
                          ? chat?.lastMessage?.createdBy?.name
                          : "No messages yet"}
                      </div>
                    </div>
                  </div>
                  <div className="text-white">
                    {chat.lastMessage?.createdBy?.createdAt
                      ? chat.lastMessage?.createdBy?.createdAt.slice(11, 16)
                      : ""}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default messages;
