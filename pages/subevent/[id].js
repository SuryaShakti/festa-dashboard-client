import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import ImageUploading from "react-images-uploading";
import MapAutocomplete from "../../src/components/MapAutocomplete";
import Spinner from "../../src/components/Spinner";

const subevent = () => {
  const router = useRouter();
  const [data, setData] = useState();
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
  const [dateOpen, setDateOpen] = useState(false);

  const getDetails = async () => {
    const token = localStorage.getItem("token");

    var config = {
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}sub-event-management/sub-event/${router.query.id}`,
      params: {
        $limit: 1000,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log("---", response.data);
        setSubTitle(response.data.name);
        setSubDescription(response.data.description);
        setSelectedDates([
          {
            startDate: response?.data?.startTime
              ? new Date(response.data.startTime)
              : new Date(),
            endDate: response?.data?.endTime
              ? new Date(response.data.endTime)
              : null,
            key: "selection",
          },
        ]);
        setPhotoUrl(
          response?.data?.attachments[0] ? response.data.attachments[0] : ""
        );
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (router.query.id) {
      getDetails();
    }
  }, [router.query.id]);

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
    console.log(imageList[0].file);
    setPhoto(imageList);

    await imageUpload(imageList[0].file);
  };

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
      method: "patch",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}sub-event-management/sub-event/${router.query.id}?event=${router.query.event}`,
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
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="flex bg-[#0D0821] z-50 rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="z-50 py-5 border-b border-gray-200">
        <div className="z-50 -ml-4 -mt-2 w-full flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="z-50 ml-4 mt-2 w-full ">
            <h3 className="z-50 text-2xl leading-6 font-medium text-white">
              Sub Event Details
            </h3>
          </div>
        </div>
      </div>
      <div className="w-full z-50 max-w-xl">
        <div className="mt-2 z-50 flex-1 w-full max-w-xl">
          {" "}
          <div className="p-3 z-50 w-full max-w-xl">
            <div className="w-full">
              <div className="text-white text-base font-medium mb-1">
                Title <span className="text-red-500 text-base">*</span>
              </div>
              <input
                className="w-full py-2 border rounded-lg px-4 border-white bg-transparent text-white"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder={"Enter the title of your event"}
              />
            </div>
            <div>
              <div className="text-white text-base font-medium mb-1">
                Description
              </div>
              <textarea
                className="w-full py-2 border rounded-lg px-4 border-white bg-transparent text-white"
                value={subDescription}
                rows={4}
                onChange={(e) => setSubDescription(e.target.value)}
                placeholder={"Enter the title of your event"}
              />
            </div>
            <div className="text-white text-base font-medium mb-1">Photo</div>
            <div className="flex space-x-3">
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
                      className="w-32 h-32 rounded-xl border flex justify-center items-center text-3xl font-black text-white"
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
                          <img src={image.data_url} alt="" width="100" />
                          <div className="flex space-x-3 justify-end pt-1 items-center">
                            <button onClick={() => onImageUpdate(index)}>
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
              {photoUrl && (
                <div>
                  <img className="w-32" src={photoUrl} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 w-full">
          <div className="text-white text-base font-medium mb-1">
            When to host
          </div>
          <div className="w-full py-2 border rounded-lg px-4 border-white bg-transparent text-white">
            <div
              onClick={() => setDateOpen(true)}
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
          <div className="text-white text-base font-medium mb-1">
            Add a note
          </div>
          <textarea
            className="w-full py-2 border rounded-lg px-4 border-white bg-transparent text-white"
            value={note}
            rows={2}
            onChange={(e) => setNote(e.target.value)}
            placeholder={"Add a note"}
          />
        </div>

        <div
          onClick={() => setVenueOpen(true)}
          className="mt-3 w-dull py-2 border border-white bg-transparent text-white flex justify-center items-center hover:bg-teal-50 transition duration-200 hover:text-teal-500 rounded-xl cursor-pointer"
        >
          Enter your venue
        </div>
      </div>
      <div className="flex w-full justify-end mt-5 z-50">
        <button
          onClick={() => createSubEvent()}
          className="bg-indigo-600 py-2 px-6 text-white rounded-xl hover:bg-indigo-500"
        >
          Save
        </button>
      </div>

      <Transition appear show={dateOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setDateOpen(false)}
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
                    Set Date for the event
                  </Dialog.Title>
                  <div className="mt-2 w-max mx-auto">
                    <DateRangePicker
                      ranges={selectedDates}
                      staticRanges={[]}
                      inputRanges={[]}
                      className="my-3"
                      onChange={(item) => {
                        console.log(item.selection.startDate.toISOString());
                        console.log(item.selection.endDate.toISOString());
                        setSelectedDates([item.selection]);
                      }}
                      minDate={new Date()}
                    />
                  </div>

                  <div className="mt-4 w-full flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setDateOpen(false)}
                    >
                      Save
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

export default subevent;
