import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect, Fragment, useRef } from "react";
import Spinner from "../../src/components/Spinner";
import ImageUploading from "react-images-uploading";
import { Dialog, Transition, Menu } from "@headlessui/react";
import {
  CalendarIcon,
  ChevronDownIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState({});
  const [events, setEvents] = useState([]);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

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

  useEffect(() => {
    fetchData();
  }, []);

  const imageUpload = async (blob) => {
    const token = localStorage.getItem("token");

    var formdata = new FormData();
    formdata.append("file", blob);

    console.log(formdata);
    setPhotoUploading(true);

    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
      redirect: "follow",
    };
    await fetch("https://api.test.festabash.com/v1/upload", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result[0].link);
        setPhotoUrl(result[0].link);
        setPhotoUploading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setPhotoUploading(false);
      });
  };

  const onPostChange = async (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList[0].file);
    setPhoto(imageList);

    await imageUpload(imageList[0].file);
  };

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

  const createSupportTicket = async () => {
    var data = JSON.stringify({
      event: selectedEvent._id,
      description: description,
      attachments: [photoUrl],
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.test.festabash.com/v1/help-center/support-ticket",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJzdWIiOiI2M2MzY2EwNjAwMDNkYjM2YjNiM2U2MTAiLCJpYXQiOjE2NzcxNTk5NTAsImV4cCI6MTY3OTc1MTk1MCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwianRpIjoiNDAzM2U3YjYtNWFhNC00ZjA1LTliMTgtNmFiZjQ5NGJmODI0In0.sTryq_tULACZoaXCmJgeSq5g92L22x2SHZuui-aQzV0",
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const _tickets = tickets;
        setTickets([..._tickets, response.data]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
                  className="border p-3 my-2 border-gray-300 rounded-xl"
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
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-[90vh] max-w-2xl transform overflow-hidden p-6 text-left rounded-2xl bg-white align-middle shadow-xl transition-all flex flex-col">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create a support ticket
                  </Dialog.Title>
                  <div className="mt-2 flex-1">
                    {" "}
                    <div className="p-3">
                      <div>
                        <div className="text-gray-700 text-base font-medium mb-1">
                          Event{" "}
                          <span className="text-red-500 text-base">*</span>
                        </div>
                        <Menu
                          as="div"
                          className="relative  w-full inline-block text-left mt-2"
                        >
                          <div>
                            <Menu.Button className="z-50 inline-flex text-white hover:bg-gray-200 w-full  justify-between rounded-md px-4 py-2 text-sm font-medium border border-gray-300  hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-opacity-75">
                              {selectedEvent?.name
                                ? data.filter(
                                    (data) => data._id === selectedEvent._id
                                  )[0]?.title
                                : "Select an event"}
                              <ChevronDownIcon
                                className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                aria-hidden="true"
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute  mt-2 w-max px- origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="px-1 py-1 ">
                                {data?.map((cat, index) => (
                                  <Menu.Item
                                    key={index}
                                    onClick={() => setSelectedEvent(cat)}
                                  >
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active
                                            ? "bg-violet-500 text-white"
                                            : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      >
                                        {cat.name}
                                      </button>
                                    )}
                                  </Menu.Item>
                                ))}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                      <div>
                        <div className="text-gray-700 text-base font-medium mb-1">
                          Description
                        </div>
                        <textarea
                          className="w-full py-2 border rounded-lg px-4 border-gray-400"
                          value={description}
                          rows={4}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder={"Write your concern"}
                        />
                      </div>
                      <div className="text-gray-700 text-base font-medium mb-1">
                        Photo
                      </div>
                      <div className="flex">
                        <ImageUploading
                          multiple
                          value={photo}
                          onChange={onPostChange}
                          dataURLKey="data_url"
                          acceptType={["jpg", "jpeg", "png", "svg"]}
                        >
                          {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                          }) => (
                            <div className="flex space-x-2">
                              <button
                                className="w-32 h-32 rounded-xl bg-gray-100 border flex justify-center items-center text-3xl font-black text-gray-600"
                                onClick={onImageUpload}
                                {...dragProps}
                              >
                                +
                              </button>
                              {photoUploading && (
                                <div>
                                  <Spinner />
                                </div>
                              )}

                              {!photoUploading &&
                                imageList.map((image, index) => (
                                  <div key={index} className="">
                                    <img
                                      src={image.data_url}
                                      alt=""
                                      width="100"
                                    />
                                    <div className="flex space-x-3 justify-end pt-1 items-center">
                                      <button
                                        onClick={() => onImageUpdate(index)}
                                      >
                                        <PencilAltIcon className="w-6 text-gray-500" />
                                      </button>
                                      <button onClick={() => setPhoto("")}>
                                        <TrashIcon className="w-6 text-red-500" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </ImageUploading>
                      </div>
                    </div>
                  </div>

                  <div className="mt-full mt-4">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => createSupportTicket()}
                    >
                      Create
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Support;
