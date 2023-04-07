import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../src/components/Spinner";
import { socketClient, socketApp } from "../_app";

const ChatBox = () => {
  const router = useRouter();
  const [messages, setMessages] = useState();
  const [text, setText] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    console.log(socketClient);
    if (messages?.length > 0) {
      const token = localStorage.getItem("token");
      socketClient.emit(
        "create",
        "authentication",
        {
          strategy: "jwt",
          accessToken: token,
        },
        function (e, res) {
          if (e) {
            console.log(e);
            toast.error(e.message ? e.message : "error", "bottom-right");
          } else {
            console.log(res);
            console.log("Authenticated admin");

            socketApp
              .service("v1/chat/chat-message")
              .on("created", (message) => {
                console.log("******", message);
                const _message = [...messages];
                console.log(messages);
                console.log([..._message, message]);
                setMessages([..._message, message]);
              });
          }
        }
      );
    }
    // socketClient.on("connect", () => {

    // });
  }, [messages]);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");

    var config = {
      method: "get",
      url:
        router.query.user === "user"
          ? `${process.env.NEXT_PUBLIC_API_URL}chat/chat-message?$sort[createdAt]=1&$populate=createdBy&conversation=${router?.query?.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}chat/chat-message?$sort[createdAt]=1&$populate=createdBy&conversationVendor=${router?.query?.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setMessages(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const messageSnedHandler = async () => {
    const token = localStorage.getItem("token");
    var data;
    router.query.user === "user"
      ? (data = JSON.stringify({
          conversation: router?.query.id,
          message: text,
        }))
      : (data = JSON.stringify({
          conversationVendor: router?.query.id,
          message: text,
        }));

    var config = {
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}chat/chat-message?$populate=createdBy`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        const _data = [...messages];
        setMessages([..._data, response.data]);
        setText("");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addVendor = async () => {
    const token = localStorage.getItem("token");
    setAddLoading(true);
    let data = JSON.stringify({
      status: 1,
    });

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-vendor/${router.query.vendor}?event=${router.query.eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        toast.success("Vendor added successfully", {
          position: "bottom-right",
        });
        setAddLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setAddLoading(false);
        toast.error("Something went wrong. please try again later.", {
          position: "bottom-right",
        });
      });
  };

  useEffect(() => {
    if (router?.query?.id) {
      console.log(router.query.id);
      console.log(JSON.parse(localStorage.getItem("user"))._id);
      fetchMessages();
    }
  }, [router.query.id]);

  return (
    <div className="flex z-50 bg-[#0D0821]  rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      {router?.query?.user === "vendor" && router.query.status === "2" && (
        <div className="flex h-10 text-white border border-white items-center">
          <div className="w-9/12 px-3">
            Do you want to approve this vendor for your event?
          </div>
          <div className="w-3/12 h-full border-l border-white text-center">
            <button
              onClick={() => addVendor()}
              className="w-full h-full text-center text-white hover:bg-gray-100 hover:bg-opacity-20"
            >
              {addLoading ? (
                <div className="flex justify-center items-center space-x-3">
                  {" "}
                  <Spinner /> <div>Approve</div>
                </div>
              ) : (
                "Approve"
              )}
            </button>
          </div>
        </div>
      )}
      <div className="min-h-[95vh] flex flex-col py-4">
        <div className="flex-1 z-50 flex justify-end flex-col rounded-2xl p-2 sm:p-3 md:p-5">
          <div className="z-50 flex flex-col">
            {messages?.map((message, index) => (
              <div
                key={message._id}
                className={
                  message?.createdBy?._id ===
                  JSON.parse(localStorage.getItem("user"))._id
                    ? "justify-end flex items-start my-3"
                    : "justify-start flex items-start"
                }
              >
                {message?.createdBy?.avatar && (
                  <img
                    className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                    src={message?.createdBy?.avatar}
                  ></img>
                )}
                <div className="ml-2 my-1 md:ml-4 max-w-[70%] md:max-w-[50%] p-3 text-xs md:text-sm bg-white rounded-bl-xl rounded-r-xl">
                  {message?.message}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t-2 mt-5 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            <div className="relative flex">
              <span className="absolute inset-y-0 flex items-center"></span>
              <input
                type="text"
                placeholder="Write your message!"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-2 bg-slate-50  rounded-md py-3"
              />
              <div className="absolute right-0 items-center inset-y-0 flex">
                <button
                  type="button"
                  onClick={() => messageSnedHandler()}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                >
                  <span className="font-bold">Send</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 ml-2 transform rotate-90 hidden md:block"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
