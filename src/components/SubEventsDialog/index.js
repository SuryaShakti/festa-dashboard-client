import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { DateRangePicker } from "react-date-range";
import ImageUploading from "react-images-uploading";
import MapAutocomplete from "../MapAutocomplete";
import Spinner from "../Spinner";

const SubEventDialog = ({
  subEventsOpen,
  setSubEventsOpen,
  subevents,
  data,
  eventId,
}) => {
  const router = useRouter();
  const [createSubEventOpen, setCreateSubEventOpen] = useState(false);
  const [subTitle, setSubTitle] = useState("");
  const [subDescription, setSubDescription] = useState("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [venueOpen, setVenueOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const [addressLine, setAddressLine] = useState("");
  const [cityText, setCityText] = useState("");
  const [address, setAddress] = useState({
    addressLine1: addressLine,
    city: cityText,
    coordinates: [],
  });
  const [loading, setLoading] = useState(false);

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
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}upload`, requestOptions)
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

  // const createSubevent = async () => {
  //   const token = localStorage.getItem("token");
  //   console.log(subDescription, subTitle, photo, photoUrl);
  // };

  const venueSave = () => {
    console.log("++++++++++", {
      ...address,
      addressLine1: addressLine,
      city: cityText,
    });
    setAddress({ ...address, addressLine1: addressLine, city: cityText });
    setVenueOpen(false);
  };

  const createSubEvent = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    var data = JSON.stringify({
      name: subTitle,
      description: subDescription,
      attachments: [photoUrl],
      address: {
        addressLine1: addressLine,
        city: cityText,
        coordinates: address.coordinates,
      },
      startTime: selectedDates[0].startDate.toISOString(),
      endTime: selectedDates[0].endDate.toISOString(),
      event: router.query.eventId,
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}sub-event-management/sub-event/`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setLoading(false);
        setCreateSubEventOpen(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div>
      <Transition appear show={subEventsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setSubEventsOpen(false)}
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
                <Dialog.Panel className="w-full min-h-[80vh] max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Sub Events
                  </Dialog.Title>
                  <div className="mt-2 flex-1">
                    {subevents.length > 0
                      ? subevents?.map((subevent, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              router.push(
                                `/subevent/${subevent._id}?event=${router.query.eventId}`
                              )
                            }
                            className="mb-3 w-full cursor-pointer hover:shaadow-2xl flex space-x-2 px-4 py-2 md:items-center rounded-2xl bg-gray-200 shadow-xl"
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
                              <div className="mb-2">
                                {subevent?.description}
                              </div>
                              <div className="flex justify-start space-x-6">
                                <div>{subevent.startTime.slice(0, 10)}</div>
                                <div>
                                  {" "}
                                  {subevent?.startTime?.slice(11, 16)} -{" "}
                                  {subevent?.endTime?.slice(11, 16)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      : "There are no sub events created for this event"}
                  </div>
                  <div className="mt-full">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setCreateSubEventOpen(true);
                        setSubEventsOpen(false);
                      }}
                    >
                      Create a new sub event
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={createSubEventOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setCreateSubEventOpen(false)}
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
                <Dialog.Panel className="w-full  max-w-2xl transform overflow-hidden p-6 text-left rounded-2xl bg-white align-middle shadow-xl transition-all flex flex-col">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create a Sub Event
                  </Dialog.Title>
                  <div className="mt-2 flex-1">
                    {" "}
                    <div className="p-3 ">
                      <div>
                        <div className="text-gray-700 text-base font-medium mb-1">
                          Title{" "}
                          <span className="text-red-500 text-base">*</span>
                        </div>
                        <input
                          className="w-full py-2 border rounded-lg px-4 border-gray-400"
                          value={subTitle}
                          onChange={(e) => setSubTitle(e.target.value)}
                          placeholder={"Enter the title of your event"}
                        />
                      </div>
                      <div>
                        <div className="text-gray-700 text-base font-medium mb-1">
                          Description
                        </div>
                        <textarea
                          className="w-full py-2 border rounded-lg px-4 border-gray-400"
                          value={subDescription}
                          rows={4}
                          onChange={(e) => setSubDescription(e.target.value)}
                          placeholder={"Enter the title of your event"}
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

                  <div className="mt-2 w-full">
                    <div className="text-gray-700 text-base font-medium mb-1">
                      When to host
                    </div>
                    <div className="w-full py-2 border rounded-lg px-4 border-gray-400">
                      <div
                        onClick={() => setShowCalendar(true)}
                        className="w-full flex space-x-3"
                      >
                        <CalendarIcon className="w-5" />
                        <div>Select a day</div>
                      </div>
                    </div>
                    {showCalendar && (
                      <DateRangePicker
                        ranges={selectedDates}
                        staticRanges={[]}
                        inputRanges={[]}
                        className="my-3"
                        onChange={(item) => {
                          console.log(item.selection.startDate.toISOString());
                          console.log(item.selection.endDate.toISOString());
                          setSelectedDates([item.selection]);
                          // if (
                          //   item.selection.startDate &&
                          //   item.selection.endDate
                          // ) {
                          //   setShowCalendar(false);
                          // }
                        }}
                        minDate={new Date()}
                      />
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-gray-700 text-base font-medium mb-1">
                      Add a note
                    </div>
                    <textarea
                      className="w-full py-2 border rounded-lg px-4 border-gray-400"
                      value={note}
                      rows={2}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={"Add a note"}
                    />
                  </div>

                  <div
                    onClick={() => setVenueOpen(true)}
                    className="mt-3 w-dull py-2 border border-gray-400 flex justify-center items-center hover:bg-teal-50 transition duration-200 hover:text-teal-500 rounded-xl cursor-pointer"
                  >
                    Enter your venue
                  </div>

                  <div className="mt-full mt-4">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => createSubEvent()}
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
      <Transition appear show={venueOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setVenueOpen(false)}
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
            <div className="flex min-h-full  items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Location on map
                  </Dialog.Title>
                  <div className="mt-2 mb-10">
                    <MapAutocomplete
                      city={cityText}
                      setCity={setCityText}
                      addressLine={addressLine}
                      setAddress={setAddress}
                      setAddressLine={setAddressLine}
                      address={address}
                    />
                  </div>

                  <div className="">
                    <button
                      type="button"
                      className="inline-flex mt-10 justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => venueSave()}
                    >
                      {loading ? (
                        <div className="flex w-max mx-auto justify-between items-center space-x-2">
                          <Spinner />
                          <div>Save</div>
                        </div>
                      ) : (
                        "Save"
                      )}
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

export default SubEventDialog;
