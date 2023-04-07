import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChatAlt2Icon,
  ChatAltIcon,
  HeartIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import { TrashIcon } from "@heroicons/react/solid";

const createdEventDetails = () => {
  const [status, setStatus] = useState(0);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPath, setProfilePicPath] = useState("");
  const [data, setData] = useState();
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [chatboxOpen, setChatboxOpen] = useState(false);
  const [subevents, setSubevents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [guests, setGuests] = useState([]);
  const [coHosts, setCoHosts] = useState([]);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [subEventsOpen, setSubEventsOpen] = useState(false);
  const [coHostOpen, setCoHostOpen] = useState(false);
  const [vendorsOpen, setVendorsOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const postLike = async (id) => {
    const token = localStorage.getItem("token");
    var data = JSON.stringify({
      entityType: "post",
      entityId: id,
    });

    var config = {
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}likes`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getLikes = async () => {};

  const getGuestsList = async () => {
    const token = localStorage.getItem("token");

    var data = JSON.stringify({});

    var config = {
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-guest?event=${router?.query?.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setGuests(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const getPosts = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}post?event=${router?.query?.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setPosts(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event/${router?.query.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const fetchSubEvents = async () => {
    const token = localStorage.getItem("token");

    var config = {
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}sub-event-management/sub-event?event=${router?.query.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log("***********", response.data.data);
        setSubevents(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getPhotos = async () => {
    const token = localStorage.getItem("token");

    var config = {
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-feed?event=${router.query.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setPhotos(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getCoHOstList = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-cohost?event=${router.query.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setCoHosts(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(router.query.id);
    if (router.query.id) {
      fetchData();
      fetchSubEvents();
      getPosts();
      getPhotos();
      getGuestsList();
      getCoHOstList();
    }
  }, [router.query.id]);

  const addGuest = async () => {
    const token = localStorage.getItem("token");
    setErrorMessage("");
    var data = JSON.stringify({
      event: router.query.id,
      guests: [
        {
          name: name,
          phone: phone,
        },
      ],
    });

    var config = {
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-guest`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        const _data = guests;
        setGuests([...guests, response.data[0]]);
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
      });
  };

  const removeGuest = async (id) => {
    const token = localStorage.getItem("token");
    console.log(id);

    var config = {
      method: "delete",
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-guest/${id}?event=${router.query.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        const _data = guests;
        setGuests(
          _data.filter((guest, index) => guest._id !== response.data._id)
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addCoHost = async () => {
    const token = localStorage.getItem("token");
    setErrorMessage("");
    var data = JSON.stringify({
      event: router.query.id,
      cohosts: [
        {
          name: name,
          phone: phone,
        },
      ],
    });

    var config = {
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-cohost`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        const _data = coHosts;
        setCoHosts([...coHosts, response.data[0]]);
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
      });
  };

  const removeCoHost = async (id) => {
    const token = localStorage.getItem("token");

    var config = {
      method: "delete",
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-cohost/${id}?event=${router.query.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        const _data = coHosts;
        setCoHosts(
          _data.filter((cohost, index) => cohost._id !== response.data._id)
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex z-50 bg-[#0D0821] rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="z-50">
        <div className="z-50 py-5 border-b border-gray-200">
          <div className="z-50-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="z-50 ml-4 mt-2">
              <h3 className="text-2xl leading-6 font-medium text-gray-900">
                Event Details
              </h3>
            </div>
          </div>
        </div>
        <div className=" z-50 mt-6 grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-full md:w-10/12 shadow-xl rounded-2xl">
              <div className="z-50 first-letter:h-12 rounded-t-2xl bg-teal-500 px-5 flex justify-between items-center text-xs md:text-lg text-white font-semibold">
                <div>{data?.startTime.slice(0, 10)}</div>
                <div>
                  Time : {data?.startTime.slice(11, 16)} -{" "}
                  {data?.endTime.slice(11, 16)}
                </div>
              </div>
              <div className="p-3 md:p-5 bg-gray-200 rounded-b-2xl flex space-x-3">
                <div className="">
                  <img
                    className="h-24 w-24 md:h-32 md:w-32 rounded-lg"
                    src={data?.attachments[0]}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{data?.name}</div>
                  <div className="text-xs md:text-base text-gray-400">
                    {data?.description}
                  </div>
                  <div className="hidden md:flex space-x-2">
                    <div className="text-gray-400">
                      {data?.address?.addressLine1} ,
                    </div>
                    <div className="text-gray-400">{data?.address?.city}</div>
                  </div>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="text-white bg-indigo-600 w-max px-3 py-1 mt-2 shadow-xl rounded-md"
                  >
                    View on map
                  </button>
                </div>
              </div>
            </div>
            <div className="my-4 font-semibold text-lg">Sub Events</div>
            {subevents.length > 0
              ? subevents?.map((subevent, index) => (
                  <div
                    key={index}
                    className="mb-3 w-full md:w-10/12 flex space-x-2 px-4 py-2 md:items-center rounded-2xl bg-gray-200 shadow-xl"
                  >
                    <div className="">
                      <img
                        className="h-24 w-24 md:w-auto md:h-40 rounded-lg"
                        src={subevent?.attachments[0]}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold md:text-xl mb-2">
                        {subevent?.name}
                      </div>
                      <div className="mb-2">{subevent?.description}</div>
                      <div className="flex justify-start space-x-6">
                        <div>{subevent.startTime.slice(0, 10)}</div>
                        <div>
                          {" "}
                          {data?.startTime.slice(11, 16)} -{" "}
                          {data?.endTime.slice(11, 16)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : "There are no sub events created for this event"}
            <div className="w-full my-3">
              <div className="my-4 text-center font-semibold text-lg">
                More details
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl">
                  <img src={"/images/Calendar.svg"} />
                  <div>Date and Time</div>
                </div>
                <div
                  onClick={() => setGuestsOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/guests.svg"} />
                  <div>Guests</div>
                </div>
                <div
                  onClick={() => setSubEventsOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/Subevents.svg"} />
                  <div>Sub Events</div>
                </div>
                <div
                  onClick={() => setCoHostOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/co-hostDetails.svg"} />
                  <div>Co-host details</div>
                </div>
                <div
                  onClick={() => setVendorsOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/vendors.svg"} />
                  <div>Vendors</div>
                </div>
                <div
                  onClick={() => setBudgetOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/Budget.svg"} />
                  <div>Budget</div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className=" w-full rounded-xl bg-white shadow grid grid-cols-3 h-8">
              <div
                onClick={() => setStatus(0)}
                className={
                  status === 0
                    ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                    : "bg-white rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                }
              >
                Post
              </div>
              <div
                onClick={() => setStatus(1)}
                className={
                  status === 1
                    ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                    : "bg-white rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                }
              >
                Photos
              </div>
              <div
                onClick={() => setStatus(2)}
                className={
                  status === 2
                    ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                    : "bg-white rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                }
              >
                Write a post
              </div>
            </div>
            {status === 0 ? (
              <div className="">
                {posts?.map((post, index) =>
                  post.image ? (
                    <div
                      key={index}
                      className="w-full z-50 bg-gray-200 shadow-xl my-3 p-3 rounded-xl"
                    >
                      <img
                        className="w-full mb-2 rounded-lg"
                        src={post.image[0]}
                      />
                      <div className="w-full flex justify-between items-center">
                        <div className="flex-1">
                          <div className="text-lg font-bold mb-2">
                            {post.title}
                          </div>
                          <div>{post.description}</div>
                        </div>
                        <div className="flex space-x-3">
                          <div className="flex items-center space-x-1">
                            <div>{post.likeCount}</div>
                            <HeartIcon
                              onClick={() => postLike(post._id)}
                              className="w-4 cursor-pointer"
                            />
                          </div>
                          <div className="flex items-center space-x-1">
                            <div>{post.commentCount}</div>
                            <ChatAltIcon
                              onClick={() => setChatboxOpen(!chatboxOpen)}
                              className="w-4 cursor-pointer"
                            />
                          </div>
                        </div>
                        <div className=" ">
                          <TrashIcon className="w-4 h-4 cursor-pointer" />
                        </div>
                      </div>
                      <div>
                        {chatboxOpen ? (
                          <div className="mt-2">djkhkdjhkd</div>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="w-full flex justify-between items-center bg-white bg-opacity-20 my-3 p-3 rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="text-lg font-bold mb-2">
                          {post.title}
                        </div>
                        <div>{post.description}</div>
                      </div>
                      <div className="flex space-x-3">
                        <div className="flex items-center space-x-1">
                          <div>{post.likeCount}</div>
                          <HeartIcon className="w-4 cursor-pointer" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <div>{post.commentCount}</div>
                          <ChatAltIcon className="w-4 cursor-pointer" />
                        </div>
                      </div>
                      <div className=" ">
                        <TrashIcon className="w-4 cursor-pointer" />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : status === 1 ? (
              photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 mt-5 gap-3">
                  <div className="bg-gray-200 w-32 h-32 rounded-xl"></div>
                  {photos.map((photo, index) => (
                    <div>
                      <img
                        className="w-32 h-32 rounded-xl shadow-lg"
                        src={photo.thumbnailImage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                "No photos yet"
              )
            ) : (
              <div className="p-3 border border-gray-300 mt-4 rounded-xl shadow-xl">
                <div>
                  <div className="text-gray-700 text-base font-medium mb-1">
                    Title <span className="text-red-500 text-base">*</span>
                  </div>
                  <input
                    className="w-full py-2 border rounded-lg px-4 border-gray-400"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={"Enter the title of your event"}
                  />
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
                    placeholder={"Enter the title of your event"}
                  />
                </div>
                <div className="w-full">
                  <div className="text-gray-700 text-base font-medium mb-1">
                    Photos
                  </div>
                  <label
                    for="dropzone-file"
                    className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center px-  py-5">
                      <p>+</p>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </label>
                </div>
                <button className="w-full px-4 py-2 mt-3 border border-gray-300 rounded-xl shadow hover:bg-teal-100 hover:text-teal-500">
                  Add a post
                </button>
              </div>
            )}
          </div>
        </div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Location on map
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Show map with longitude {data?.address?.coordinates[0]}{" "}
                        and latitude {data?.address?.coordinates[1]}
                      </p>
                      <div className="h-60 w-full bg-green-100 my-2"></div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <Transition appear show={guestsOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              setGuestsOpen(false);
              setName("");
              setPhone("");
              setErrorMessage("");
            }}
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Guests
                    </Dialog.Title>
                    <div className="mt-2">
                      <div>
                        <div>
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="name"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="shadow-sm border p-2  focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Enter your name"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm mt-1 font-medium text-gray-700"
                            >
                              Phone
                            </label>
                            <div className="mt-1">
                              <input
                                type="phone"
                                name="phone"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Enter your phone number"
                              />
                            </div>
                          </div>
                        </div>
                        {errorMessage && (
                          <div className="bg-red-400 rounded-lg w-full text-center text-xs text-white mt-2 p-2">
                            {errorMessage}
                          </div>
                        )}
                        <button
                          type="button"
                          className="inline-flex justify-center mt-6 w-full rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => addGuest()}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div>All Guests</div>
                      {guests &&
                        guests.map((guest, index) => (
                          <div className="border-b w-full flex justify-between items-center py-2">
                            <div className="flex flex-1 items-center space-x-3">
                              <div>
                                <UserCircleIcon className="w-7 text-gray-400" />
                              </div>
                              <div>
                                <div>{guest.name}</div>
                                <div className="text-xs text-gray-600">
                                  {guest.phone}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeGuest(guest._id)}
                              className="w-max px-2 py-1 bg-gray-300 text-xs rounded-md"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <Transition appear show={coHostOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              setCoHostOpen(false);
              setName("");
              setPhone("");
              setErrorMessage("");
            }}
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Co Hosts
                    </Dialog.Title>
                    <div className="mt-2">
                      <div>
                        <div>
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="name"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="shadow-sm border p-2  focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Enter your name"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm mt-1 font-medium text-gray-700"
                            >
                              Phone
                            </label>
                            <div className="mt-1">
                              <input
                                type="phone"
                                name="phone"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Enter your phone number"
                              />
                            </div>
                          </div>
                        </div>
                        {errorMessage && (
                          <div className="bg-red-400 rounded-lg w-full text-center text-xs text-white mt-2 p-2">
                            {errorMessage}
                          </div>
                        )}
                        <button
                          type="button"
                          className="inline-flex justify-center mt-6 w-full rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => addCoHost()}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div>All Co Hosts</div>
                      {coHosts &&
                        coHosts.map((guest, index) => (
                          <div className="border-b w-full flex justify-between items-center py-2">
                            <div className="flex flex-1 items-center space-x-3">
                              <div>
                                <UserCircleIcon className="w-7 text-gray-400" />
                              </div>
                              <div>
                                <div>{guest.name}</div>
                                <div className="text-xs text-gray-600">
                                  {guest.phone}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeCoHost(guest._id)}
                              className="w-max px-2 py-1 bg-gray-300 text-xs rounded-md"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default createdEventDetails;
