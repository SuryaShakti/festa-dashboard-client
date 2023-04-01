import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import {
  ChatAltIcon,
  HeartIcon,
  PencilAltIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Image from "next/image";
import MapAutocomplete from "../../src/components/MapAutocomplete";
import ImageUploading from "react-images-uploading";
import Spinner from "../../src/components/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BudgetDialog from "../../src/components/BudgetDialog";
import SubEventDialog from "../../src/components/SubEventsDialog";
import VendorDialog from "../../src/components/VendorDialog";

const index = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [eventId, setEventId] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPath, setProfilePicPath] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  // const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
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
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(0);
  const [data, setData] = useState([]);
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [venueOpen, setVenueOpen] = useState(false);
  const [chatboxOpen, setChatboxOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [postError, setPostError] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [hostLoading, setHostLoading] = useState(false);
  const [addressLine, setAddressLine] = useState("");
  const [cityText, setCityText] = useState("");
  const [address, setAddress] = useState({
    addressLine1: addressLine,
    city: cityText,
    coordinates: [],
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  const onChange = async (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList[0].file);
    setProfilePic(imageList);

    await imageUpload(imageList[0].file, "profile");
  };

  const createPost = async () => {
    const token = localStorage.getItem("token");

    if (postTitle.trim() === "") {
      setPostError("Post title is requied");
      return;
    } else if (postDescription.trim() === "") {
      setPostError("Post description is requied");
      return;
    } else if (postImageUrl.trim() === "") {
      setPostError("Post Image is requied");
      return;
    } else {
      setPostError("");
      setCreatingPost(true);
      var data = JSON.stringify({
        title: postTitle,
        description: postDescription,
        image: postImageUrl,
        event: eventId,
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.test.festabash.com/v1/post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          console.log(response.data);
          setPosts([...posts, response.data]);
          toast.success("Post Created successfully", {
            position: "bottom-right",
          });
          setPostTitle("");
          setPostImage("");
          setPostDescription("");
          setStatus(0);
          setCreatingPost(false);
        })
        .catch(function (error) {
          console.log(error);
          setCreatingPost(false);
        });
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    console.log(new File([u8arr], filename, { type: mime }));
    return new File([u8arr], filename, { type: mime });
  };

  const imageUpload = async (blob, type) => {
    const token = localStorage.getItem("token");

    var formdata = new FormData();
    formdata.append("file", blob);

    console.log(formdata);
    type === "profile"
      ? setProfileUploading(true)
      : type === "post"
      ? setUploadLoading(true)
      : setPhotoUploading(true);

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
        type === "profile"
          ? setProfilePicUrl(result[0].link)
          : setPostImageUrl(result[0].link);
        setUploadLoading(false);
        setProfileUploading(false);
        setPhotoUploading(false);
      })
      .catch((error) => console.log("error", error));
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: `https://api.test.festabash.com/v1/event-management/event/${router?.query.eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        console.log(response.data.attachments[0]);
        setTitle(response.data.name ? response.data.name : "");
        setDescription(
          response.data.description ? response.data.description : ""
        );
        setSelectedEventType(response.data.eventType);
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
        setProfilePicUrl(
          response?.data?.attachments[0] ? response.data.attachments[0] : ""
        );
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
      url: `https://api.test.festabash.com/v1/sub-event-management/sub-event?event=${router.query.eventId}`,
      params: {
        $limit: 1000,
      },
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

  const getPosts = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: `https://api.test.festabash.com/v1/post?event=${router.query.eventId}`,
      params: {
        $limit: 1000,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // write a code for a map component setting address using google maps autocomplete in reactjs

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setPosts(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getPhotos = async () => {
    const token = localStorage.getItem("token");

    var config = {
      method: "get",
      url: `https://api.test.festabash.com/v1/event-management/event-feed?event=${router.query.eventId}`,
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
        setPhotos(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log("hellooo", router.query.eventId);
    if (router.query.eventId) {
      setEventId(router.query.eventId);
      fetchData();
      fetchEventTypes();
      fetchSubEvents();
      getPosts();
      getPhotos();
      getGuestsList();
      getCoHOstList();
    }
  }, [router.query]);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const handleChange = async (e) => {
    const file = e.target.files[0];
    console.log(URL.createObjectURL(file));
    setProfilePic(
      dataURLtoFile(URL.createObjectURL(file), "imageToUpload.png")
    );
    setProfilePicPath(file);

    const blob = new Blob([URL.createObjectURL(file)], { type: file.type });
    console.log(blob);
    await imageUpload(blob);
  };

  const addGuest = async () => {
    const token = localStorage.getItem("token");
    setErrorMessage("");
    var data = JSON.stringify({
      event: eventId,
      guests: [
        {
          name: name,
          phone: phone,
        },
      ],
    });
    setGuestLoading(true);
    var config = {
      method: "post",
      url: "https://api.test.festabash.com/v1/event-management/event-guest",
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
        setGuestLoading(false);
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
        setGuestLoading(false);
      });
  };

  const removeGuest = async (id) => {
    const token = localStorage.getItem("token");
    console.log(id);

    var config = {
      method: "delete",
      url: `https://api.test.festabash.com/v1/event-management/event-guest/${id}?event=${eventId}`,
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

  const publishEvent = async () => {
    const token = localStorage.getItem("token");

    if (title.trim() === "") {
      toast.error("Please enter event name", {
        position: "bottom-right",
      });
      return;
    } else if (description.trim() === "") {
      toast.error("Please enter event description", {
        position: "bottom-right",
      });
      return;
    } else if (profilePicUrl.trim() === "") {
      toast.error("Please upload image for event", {
        position: "bottom-right",
      });
      return;
    } else if (!(selectedDates[0].startDate && selectedDates[0].endDate)) {
      toast.error("Please select Event start time and end time", {
        position: "bottom-right",
      });
      return;
    } else {
      var data = JSON.stringify({
        status: 1,
      });

      var config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `https://api.test.festabash.com/v1/event-management/event/${router.query.eventId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const addCoHost = async () => {
    const token = localStorage.getItem("token");
    setErrorMessage("");
    var data = JSON.stringify({
      event: eventId,
      cohosts: [
        {
          name: name,
          phone: phone,
        },
      ],
    });
    setHostLoading(true);

    var config = {
      method: "post",
      url: "https://api.test.festabash.com/v1/event-management/event-cohost",
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
        setHostLoading(false);
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
        setHostLoading(false);
      });
  };

  const removeCoHost = async (id) => {
    const token = localStorage.getItem("token");

    var config = {
      method: "delete",
      url: `https://api.test.festabash.com/v1/event-management/event-cohost/${id}?event=${eventId}`,
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

  const [draftLoading, setDraftLoading] = useState(false);

  const draftHandler = () => {
    const token = localStorage.getItem("token");
    console.log(data?.attachments[0]);

    var data = {
      attachments: data?.attachments[0] ? data.attachments[0] : [],
    };

    if (title?.trim() !== "") {
      data.name = title;
    }

    description?.trim() !== "" ? (data.description = description) : null;
    selectedDates[0]?.startDate && selectedDates[0]?.endDate
      ? (data.startTime = selectedDates[0].startDate)
      : null;
    selectedDates[0].endDate && selectedDates[0].startDate
      ? (data.endTime = selectedDates[0].endDate)
      : null;
    selectedEventType ? (data.eventType = selectedEventType) : null;
    profilePicUrl ? (data.attachments[0] = profilePicUrl) : null;
    address?.addressLine1.trim() !== "" &&
    address?.city?.trim() !== "" &&
    address?.coordinates?.length > 0
      ? (data.address = address)
      : null;

    console.log(selectedDates);
    setDraftLoading(true);

    var config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/event-management/event/${eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setDraftLoading(false);
        toast.success("Event saved to drafts", {
          position: "bottom-right",
        });

        router.push("/created-events");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getGuestsList = async () => {
    const token = localStorage.getItem("token");

    var data = JSON.stringify({});

    var config = {
      method: "get",
      url: `https://api.test.festabash.com/v1/event-management/event-guest?event=${router.query.eventId}`,
      params: {
        $limit: 1000,
      },
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

  const getCoHOstList = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: `https://api.test.festabash.com/v1/event-management/event-cohost?event=${router.query.eventId}`,
      params: {
        $limit: 1000,
      },
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

  const fetchEventTypes = async () => {
    const token = localStorage.getItem("token");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.test.festabash.com/v1/event-management/event-type",
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
        setEventTypes(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(selectedEventType);
  }, [selectedEventType]);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

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

  const deletePostHandler = () => {
    const token = localStorage.getItem("token");
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/post/${currentPost._id}?event=${router?.query?.eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        var _posts = posts.filter(
          (post, index) => post._id !== response.data._id
        );
        setPosts(_posts);
        setDeleteOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onPostChange = async (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList[0].file);
    setPostImage(imageList);

    await imageUpload(imageList[0].file, "post");
  };

  const [photo, setPhoto] = useState("");

  const onPhotoChange = async (imageList, addUpdateIndex) => {
    console.log(imageList[0].file);
    setPhoto(imageList);

    await imageUpload(imageList[0].file, "photo");
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

  const [budget, setBudget] = useState("");

  const renderDayContents = (day) => {
    return (
      <div>
        <div>{day.getDate()}</div>
        <div>
          <input
            type="time"
            value={selectedDates[0].startDate.toLocaleTimeString()}
            onChange={(e) => {
              const date = new Date(day);
              const [hours, minutes] = e.target.value.split(":");
              date.setHours(hours, minutes);
              setSelectedDates([
                {
                  ...selectedDates[0],
                  startDate: date,
                },
              ]);
            }}
          />
          <span> - </span>
          <input
            type="time"
            value={selectedDates[0].endDate.toLocaleTimeString()}
            onChange={(e) => {
              const date = new Date(day);
              const [hours, minutes] = e.target.value.split(":");
              date.setHours(hours, minutes);
              setSelectedDates([
                {
                  ...selectedDates[0],
                  endDate: date,
                },
              ]);
            }}
          />
        </div>
      </div>
    );
  };

  const [toggle, setToggle] = useState(0);

  return (
    <div className="flex bg-[#0D0821] z-30 rounded-3xl min-h-[95vh] flex-col px-3 md:px-10 py-4 md:mr-6">
      <div className="z-30 py-5 border-b border-gray-200">
        <div className="z-30 -ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="z-30 ml-4 mt-2">
            <h3 className="text-2xl leading-6 font-medium text-white  ">
              Create a new event
            </h3>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => router.push("/created-events")}
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Your Created Events
            </button>
          </div>
          <div className=" mt-3 rounded-xl bg-white shadow grid grid-cols-2 h-9">
            <div
              onClick={() => {
                setToggle(0);
              }}
              className={
                toggle === 0
                  ? "bg-indigo-700 rounded-md px-10 w-full cursor-pointer text-white flex justify-center items-center font-medium "
                  : "bg-white rounded-md px-10 w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium "
              }
            >
              Event Details
            </div>
            <div
              onClick={() => {
                setToggle(1);
              }}
              className={
                toggle === 1
                  ? "bg-indigo-700 rounded-md px-10 w-full cursor-pointer text-white flex justify-center items-center font-medium "
                  : "bg-white rounded-md px-10 w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium "
              }
            >
              Feeds
            </div>
          </div>
        </div>
      </div>
      <div className="z-30 mt-5 w-full grid grid-cols-1 md:grid-cols-2 md:gap-8">
        <div className="col-span-2"> </div>
        {toggle === 0 ? (
          <div className="z-30 space-y-3">
            <div>
              <div className="text-white text-base font-medium mb-1">
                Title <span className="text-red-500 text-base">*</span>
              </div>
              <input
                className="w-full text-white bg-opacity-20 bg-gray-100  py-2 border rounded-lg px-4 border-gray-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"Enter the title of your event"}
              />
            </div>
            <div>
              <div className="text-white text-base font-medium mb-1">
                Description
              </div>
              <textarea
                className="w-full py-2 text-white bg-opacity-20 bg-gray-100 border rounded-lg px-4 border-gray-400"
                value={description}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={"Enter the description of your event"}
              />
            </div>
            <div className="w-full flex justify-start space-x-2 items-center">
              <div>
                <div className="text-white text-base font-medium mb-1">
                  Photo
                </div>
                <div className="flex">
                  <ImageUploading
                    value={profilePic}
                    onChange={onChange}
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
                      // write your building UI

                      <div className="flex space-x-2">
                        {!profilePic && (
                          <button
                            className="w-32 h-32 rounded-xl bg-gray-100 bg-opacity-20 border flex justify-center items-center text-3xl font-black text-gray-600"
                            onClick={onImageUpload}
                            {...dragProps}
                          >
                            +
                          </button>
                        )}
                        {profileUploading && (
                          <div>
                            <Spinner />
                          </div>
                        )}

                        {!profileUploading &&
                          imageList.map((image, index) => (
                            <div key={index} className="">
                              <img src={image.data_url} alt="" width="100" />
                              <div className="flex space-x-3 justify-end pt-1 items-center">
                                <button onClick={() => onImageUpdate(index)}>
                                  <PencilAltIcon className="w-6 text-gray-500" />
                                </button>
                                <button onClick={() => setProfilePic("")}>
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
              {profilePicUrl && (
                <div>
                  <img className="w-32" src={profilePicUrl} />
                </div>
              )}
            </div>
            <div
              onClick={() => setVenueOpen(true)}
              className="mt-3 w-dull py-2 border text-white border-white   flex justify-center items-center hover:bg-teal-50 transition duration-200 hover:text-teal-500 rounded-xl cursor-pointer"
            >
              Enter your venue
            </div>

            <div className="my-4">
              <div className="z-30 text-white my-4 text-center font-semibold text-lg">
                Choose your Event Type
                <span className="text-red-500 text-base">*</span>
              </div>
              <RadioGroup
                className="grid grid-cols-3 gap-3"
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e)}
              >
                {eventTypes?.map((type) => (
                  <RadioGroup.Option
                    className={({ active, checked }) =>
                      `${
                        active
                          ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                          : ""
                      }
                  ${
                    checked
                      ? "bg-sky-900 bg-opacity-75 text-white"
                      : "bg-white text-white bg-opacity-20"
                  }
                    relative flex flex-col justify-center items-center text-white cursor-pointer rounded-lg p-3 shadow-md focus:outline-none`
                    }
                    key={type._id}
                    value={type._id}
                  >
                    <Image
                      src={type.avatar}
                      width={400}
                      height={400}
                      alt={"eventType"}
                      className="w-full rounded-lg h-24"
                    />
                    <div>{type.name}</div>
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>

            <div className="w-full my-3">
              <div className="my-4 text-white text-50 text-center font-semibold text-lg">
                More details
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div
                  onClick={() => setDateOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 text-white flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/Calendar.svg"} />
                  <div>Date and Time</div>
                </div>
                <div
                  onClick={() => setGuestsOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 text-white flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/guests.svg"} />
                  <div>Guests</div>
                </div>
                <div
                  onClick={() => setSubEventsOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 text-white flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/Subevents.svg"} />
                  <div>Sub Events</div>
                </div>
                <div
                  onClick={() => setCoHostOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 text-white flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/co-hostDetails.svg"} />
                  <div>Co-host details</div>
                </div>
                <div
                  onClick={() => setVendorsOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 text-white flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/vendors.svg"} />
                  <div>Vendors</div>
                </div>
                <div
                  onClick={() => setBudgetOpen(true)}
                  className="p-3 flex cursor-pointer shadow-xl hover:bg-slate-700 text-white flex-col text-gray-700 hover:text-white justify-center items-center bg-gray-100 bg-opacity-20 rounded-2xl"
                >
                  <img src={"/images/Budget.svg"} />
                  <div>Budget</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 mt-3">
            <div className=" w-full rounded-xl gap-3 shadow grid grid-cols-3 h-8">
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
              <div className="w-full md:w-1/2 ">
                {" "}
                {posts?.map((post, index) =>
                  post.image ? (
                    <div
                      key={index}
                      className="relative w-full z-30 bg-gray-200 my-3 p-3 rounded-xl"
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
                      <div
                        onClick={() => {
                          setCurrentPost(post);
                          setDeleteOpen(true);
                        }}
                        className="bg-white shadow-sm rounded-full p-2 absolute top-1 right-1 cursor-pointer hover:bg-red-500 transition duration-200 hover:text-white text-red-500"
                      >
                        <TrashIcon className="w-4 cursor-pointer" />
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
                      className=" relative w-full flex justify-between items-center bg-white bg-opacity-20 my-3 p-3 rounded-xl"
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
                      <div
                        onClick={() => setDeleteOpen(true)}
                        className="bg-white shadow-sm rounded-full p-2 absolute top-1 right-1 cursor-pointer hover:bg-red-500 transition duration-200 hover:text-white text-red-500"
                      >
                        <TrashIcon className="w-4 cursor-pointer" />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : status === 1 ? (
              <div className="mt-3 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
                <div className="flex">
                  <ImageUploading
                    // multiple
                    // maxNumber={}
                    value={photo}
                    onChange={onPhotoChange}
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
                      // write your building UI

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
                      </div>
                    )}
                  </ImageUploading>
                </div>
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
              <div className="p-3 my-4 rounded-xl shadow-xl">
                <div>
                  <div className="text-white text-base font-medium mb-1">
                    Title <span className="text-red-500 text-base">*</span>
                  </div>
                  <input
                    className="w-full py-2 border bg-gray-100 bg-opacity-20 rounded-lg px-4 border-gray-400"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder={"Enter the title of your event"}
                  />
                </div>
                <div>
                  <div className="text-white text-base font-medium mb-1">
                    Description
                  </div>
                  <textarea
                    className="w-full py-2 border bg-gray-100 bg-opacity-20 rounded-lg px-4 border-gray-400"
                    value={postDescription}
                    rows={4}
                    onChange={(e) => setPostDescription(e.target.value)}
                    placeholder={"Enter the title of your event"}
                  />
                </div>
                <div className="text-white text-base font-medium mb-1">
                  Photo
                </div>
                <div className="flex">
                  <ImageUploading
                    multiple
                    // maxNumber={}
                    value={postImage}
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
                      // write your building UI

                      <div className="flex space-x-2">
                        <button
                          className="w-32 h-32 rounded-xl text-white bg-gray-100 bg-opacity-20 border flex justify-center items-center text-3xl font-black text-gray-600"
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          +
                        </button>
                        {uploadLoading && (
                          <div>
                            <Spinner />
                          </div>
                        )}

                        {!uploadLoading &&
                          imageList.map((image, index) => (
                            <div key={index} className="">
                              <img src={image.data_url} alt="" width="100" />
                              <div className="flex space-x-3 justify-end pt-1 items-center">
                                <button onClick={() => onImageUpdate(index)}>
                                  <PencilAltIcon className="w-6 text-gray-500" />
                                </button>
                                <button onClick={() => setPostImage("")}>
                                  <TrashIcon className="w-6 text-red-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </ImageUploading>
                </div>
                <div>
                  {postError.trim() !== "" && (
                    <div className=" mt-2 w-full py-2 rounded-lg bg-red-500 text-white shadow flex justify-center items-center">
                      {postError}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => createPost()}
                  disabled={uploadLoading || creatingPost}
                  className="w-full disabled:cursor-wait text-white disabled:bg-gray-100 px-4 py-2 mt-3 border border-gray-300 rounded-xl shadow hover:bg-teal-100 hover:text-teal-500"
                >
                  {creatingPost ? (
                    <div className="flex w-max text-white mx-auto justify-between items-center space-x-2">
                      <Spinner />
                      <div>Add a post</div>
                    </div>
                  ) : (
                    "Add a post"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-full flex justify-end space-x-3">
        <button
          onClick={() => draftHandler()}
          disabled={draftLoading}
          className="py-2 rounded-lg px-5 disabled:cursor-wait disabled:bg-gray-100 bg-indigo-600 hover:bg-indigo-700 transition duration-200 text-white"
        >
          {draftLoading ? (
            <div className="flex w-max mx-auto justify-between items-center space-x-2">
              <Spinner />
              <div>Save as draft</div>
            </div>
          ) : (
            "Save as draft"
          )}
        </button>
        <button
          onClick={() => publishEvent()}
          className="py-2 rounded-lg px-5 bg-indigo-600 hover:bg-indigo-700 transition duration-200 text-white"
        >
          Publish
        </button>
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
                    {/* <p className="text-sm text-gray-500">
                      Show map with longitude {data?.address?.coordinates[0]}{" "}
                      and latitude {data?.address?.coordinates[1]}
                    </p> */}
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
      {vendorsOpen && (
        <VendorDialog
          vendorsOpen={vendorsOpen}
          setVendorsOpen={setVendorsOpen}
          eventId={router?.query?.eventId}
        />
      )}
      {budgetOpen && (
        <BudgetDialog
          budgetOpen={budgetOpen}
          setBudgetOpen={setBudgetOpen}
          subevents={subevents}
          eventId={router?.query?.eventId}
        />
      )}
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
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <SubEventDialog
        subEventsOpen={subEventsOpen}
        setSubEventsOpen={setSubEventsOpen}
        subevents={subevents}
        data={data}
        eventId={router.query.eventId}
      />
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
      <Transition appear show={guestsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
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
                            htmlhtmlFor="name"
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
                            htmlhtmlFor="phone"
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
                        disabled={guestLoading}
                        className="inline-flex disabled:bg-gray-200 justify-center mt-6 w-full rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => addGuest()}
                      >
                        {guestLoading ? (
                          <div className="flex w-max mx-auto justify-between items-center space-x-2">
                            <Spinner />
                            <div>Save</div>
                          </div>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div>All Guests</div>
                    {guests &&
                      guests.map((guest, index) => (
                        <div
                          key={index}
                          className="border-b w-full flex justify-between items-center py-2"
                        >
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
          className="relative z-50"
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
                            htmlhtmlFor="name"
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
                            htmlhtmlFor="phone"
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
                        disabled={hostLoading}
                        className="inline-flex disabled:bg-gray-200 justify-center mt-6 w-full rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => addCoHost()}
                      >
                        {hostLoading ? (
                          <div className="flex w-max mx-auto justify-between items-center space-x-2">
                            <Spinner />
                            <div>Save</div>
                          </div>
                        ) : (
                          "Save"
                        )}
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
      <Transition appear show={deleteOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setDeleteOpen(false)}
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
                    Delete this post?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this post?
                    </p>
                  </div>

                  <div className="flex w-full space-x-6 justify-end items-center mt-4">
                    <button
                      type="button"
                      className="inline-flex px-6 justify-center rounded-md border border-transparent bg-indigo-600 py-1 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setDeleteOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => deletePostHandler()}
                    >
                      Delete
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

export default index;
