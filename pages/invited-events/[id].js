import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChatAlt2Icon, ChatAltIcon, HeartIcon } from "@heroicons/react/outline";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const InvitedEventDetails = () => {
  const [status, setStatus] = useState(0);
  const router = useRouter();
  const [data, setData] = useState();
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [chatboxOpen, setChatboxOpen] = useState(false);
  const [photos, setPhotos] = useState([]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const postLike = async (id) => {
    const token = localStorage.getItem("token");
    var data2 = JSON.stringify({
      entityType: "post",
      entityId: id,
    });

    var config = {
      method: "post",
      url: "https://api.test.festabash.com/v1/likes",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data2,
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getPosts = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: `https://api.test.festabash.com/v1/post?event=${router?.query?.id}`,
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
      url: `https://api.test.festabash.com/v1/event-management/invited-events/${router?.query?.id}?$populate="user"`,
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

  const getPhotos = async () => {
    const token = localStorage.getItem("token");

    var config = {
      method: "get",
      url: `https://api.test.festabash.com/v1/event-management/event-feed?event=${router.query.id}`,
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

  useEffect(() => {
    console.log(router.query.id);
    if (router.query.id) {
      fetchData();
      getPosts();
      getPhotos();
    }
  }, [router.query.id]);

  const containerStyle = {
    width: "400px",
    height: "400px",
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCDCQBnv82-gPUl8bkOuTyQdoELx2nm8eI",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div className="flex z-50 bg-[#0D0821] rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="z-50">
        <div className="z-50 py-5 border-b border-gray-200">
          <div className="z-50 -ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="z-50 text-2xl leading-6 font-medium text-white">
                Event Details
              </h3>
            </div>
          </div>
        </div>
        <div className="z-50 mt-6 grid grid-cols-1 md:grid-cols-2">
          <div className="z-50 flex flex-col items-center md:items-start">
            <div className="z-50 w-full md:w-10/12 shadow-xl rounded-2xl">
              <div className="h-12 rounded-t-2xl bg-white px-5 flex justify-between items-center text-xs md:text-lg text-gray-700 font-semibold">
                <div>{data?.startTime.slice(0, 10)}</div>
                <div>
                  Time : {data?.startTime.slice(11, 16)} -{" "}
                  {data?.endTime.slice(11, 16)}
                </div>
              </div>
              <div className="p-3 md:p-5 bg-gray-100 bg-opacity-20 rounded-b-2xl flex space-x-3">
                <div className="">
                  <img
                    className="h-24 w-24 md:h-32 md:w-32 rounded-lg"
                    src={data?.attachments[0]}
                  />
                </div>
                <div className="flex-1 text-white">
                  <div className="font-semibold">{data?.name}</div>
                  <div className="text-xs md:text-base ">
                    {data?.description}
                  </div>
                  <div className="hidden md:flex space-x-2">
                    <div className="">{data?.address?.addressLine1} ,</div>
                    <div className="">{data?.address?.city}</div>
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
            <div className="my-4 font-semibold text-lg text-white">
              Sub Events
            </div>
            {data?.subEvents.length > 0
              ? data?.subEvents?.map((subevent, index) => (
                  <div
                    key={index}
                    className="z-50 mb-3 w-full md:w-10/12 flex space-x-2 px-4 py-2 md:items-center rounded-2xl bg-white bg-opacity-20 shadow-xl"
                  >
                    <div className="">
                      <img
                        className="h-24 w-24 md:w-auto md:h-40 rounded-lg"
                        src={subevent?.attachments[0]}
                      />
                    </div>
                    <div className="flex-1 text-white">
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
          </div>
          <div className="">
            <div className=" w-full rounded-xl bg-white shadow grid grid-cols-2 h-10">
              <div
                onClick={() => setStatus(0)}
                className={
                  status === 0
                    ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                    : "bg-gray-100 rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                }
              >
                Post
              </div>
              <div
                onClick={() => setStatus(1)}
                className={
                  status === 1 || status === 2
                    ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                    : "bg-gray-100 rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                }
              >
                Photos
              </div>
            </div>
            {status === 0 ? (
              <div className="">
                {posts?.map((post, index) =>
                  post.image ? (
                    <div
                      key={index}
                      className="w-full z-50 bg-gray-100 text-white bg-opacity-20 shadow-xl my-3 p-3 rounded-xl"
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
                      className="w-full flex justify-between items-center bg-white text-white bg-opacity-20 my-3 p-3 rounded-xl"
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
                          <div>{post.likeCount}</div>
                          <ChatAltIcon className="w-4 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 mt-5 gap-3">
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
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={{
                            lat: data?.address?.coordinates[1],
                            lng: data?.address?.coordinates[0],
                          }}
                          zoom={10}
                          onLoad={onLoad}
                          onUnmount={onUnmount}
                        >
                          {/* Child components, such as markers, info windows, etc. */}
                          <></>
                        </GoogleMap>
                      ) : (
                        <></>
                      )}
                      {/* <div className="h-60 w-full bg-green-100 my-2"></div> */}
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
      </div>
    </div>
  );
};

export default InvitedEventDetails;
