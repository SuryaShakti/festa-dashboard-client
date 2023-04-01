import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Spinner from "../../src/components/Spinner";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import ViewMap from "../../src/components/ViewMap";
import ImageFull from "../../src/components/imageFull";

const Vendor = () => {
  const router = useRouter();
  const [vendor, setvendor] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const [ratings, setRatings] = useState(0);
  const [packageLoading, setPackageLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const thirdExample = {
    size: 20,
    count: 5,
    isHalf: false,
    value: vendor?.averageRating ? vendor?.averageRating : 0,
    color: "#cccccc",
    activeColor: "yellow",
    onChange: (newValue) => {},
  };

  const getDetails = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/vendor-management/vendor/${router.query.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        $populate: {
          path: "categories",
          populate: ["category"],
        },
      },
    };
    setLoading(true);
    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setvendor(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const getPackages = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/vendor-management/vendor-package?vendor=${vendor._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setPackageLoading(true);
    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setPackageLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setPackageLoading(false);
      });
  };

  useEffect(() => {
    if (router.query.id) {
      getDetails();
    }
  }, [router.query.id]);

  return (
    <div className="flex z-50 bg-[#0D0821] rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="z-50 text-white py-5 border-b border-gray-200">
        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-2xl leading-6 font-medium">Vendor Details</h3>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {loading ? (
          <Spinner />
        ) : (
          <div className="w-full z-50">
            <div className="flex flex-col justify-center text-center items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
                <div className="w-max">
                  {vendor &&
                  vendor?.attachments &&
                  vendor.attachments.length > 0 ? (
                    <img
                      src={vendor?.attachments[0]}
                      className="mx-auto h-40 w-40 z-50 rounded-full"
                    />
                  ) : (
                    <div className="bg-gray-200 w-40 h-40 rounded-full"></div>
                  )}
                  <div className="">
                    <div className="text-xl text-white font-semibold">
                      {vendor.brand}
                    </div>
                    <div className="text-gray-300">
                      {" "}
                      {vendor?.address?.addressLine1}
                    </div>
                    <ReactStars
                      classNames={"mx-auto"}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fa fa-star-half-alt"></i>}
                      fullIcon={<i className="fa fa-star"></i>}
                      {...thirdExample}
                    />
                    <div className="flex space-x-3 items-center mx-auto w-max">
                      {vendor?.socialLinks?.facebook.trim() !== "" && (
                        <a
                          href={vendor?.socialLinks?.facebook}
                          target="_blank"
                          className="hover:bg-gray-100 hover:bg-opacity-20 rounded-full p-2"
                        >
                          <img src={"/images/facebook.svg"} />
                        </a>
                      )}
                      {vendor?.socialLinks?.instagram.trim() !== "" && (
                        <a
                          href={vendor?.socialLinks?.instagram}
                          target="_blank"
                          className="hover:bg-gray-100 hover:bg-opacity-20 rounded-full p-2"
                        >
                          <img src={"/images/instagram.svg"} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 bg-gray-100 rounded-xl bg-opacity-20 shadow-xl p-4 h-max">
                  <div className="text-left  text-white text-lg font-semibold">
                    About us
                  </div>
                  <div className="text-left max-w-2xl text-white">
                    {vendor.description}
                  </div>
                  <div
                    onClick={() => setIsOpen(true)}
                    className="mt-3 w-dull py-2 border text-white border-white flex justify-center items-center hover:bg-teal-50 transition duration-200 hover:text-teal-500 rounded-xl cursor-pointer"
                  >
                    View Location
                  </div>
                </div>
              </div>

              <div className="my-4 z-50 w-full">
                <div className="rounded-xl shadow grid grid-cols-3 h-8 gap-5">
                  <div
                    onClick={() => setStatus(0)}
                    className={
                      status === 0
                        ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                        : "bg-white rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                    }
                  >
                    Overview
                  </div>
                  <div
                    onClick={() => {
                      getPackages();
                      setStatus(1);
                    }}
                    className={
                      status === 1
                        ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                        : "bg-white rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                    }
                  >
                    Packages
                  </div>
                  <div
                    onClick={() => setStatus(2)}
                    className={
                      status === 2
                        ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                        : "bg-white rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                    }
                  >
                    Reviews
                  </div>
                </div>
                {status === 0 ? (
                  <div>
                    <div className="mt-5">
                      <dl class="max-w-md text-white divide-y divide-gray-200 dark:text-white ">
                        <div class="flex flex-col pb-3">
                          <dt class="mb-1 text-white text-left md:text-lg dark:text-gray-400">
                            Brand Name
                          </dt>
                          <dd class="text-lg text-left font-semibold">
                            {vendor.brand}
                          </dd>
                        </div>
                        <div class="flex flex-col py-3">
                          <dt class="mb-1 text-white text-left md:text-lg dark:text-gray-400">
                            Address
                          </dt>
                          <dd class="text-lg text-left font-semibold">
                            {vendor?.address?.addressLine1}
                          </dd>
                        </div>
                        <div class="flex flex-col pt-3">
                          <dt class="mb-1 text-white text-left md:text-lg dark:text-gray-400">
                            Categories
                          </dt>
                          <dd class="text-lg text-left font-semibold">
                            {vendor?.categories?.map((cat, index) => (
                              <div className="my-1">
                                {cat.category.title
                                  ? cat.category.title
                                  : "N/A"}
                              </div>
                            ))}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="my-10 z-50 w-full">
                      <Swiper
                        slidesPerView={1}
                        spaceBetween={2}
                        loop={true}
                        autoplay={{
                          delay: 2500,
                          disableOnInteraction: false,
                        }}
                        pagination={{
                          clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                        breakpoints={{
                          640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                          },
                          768: {
                            slidesPerView: 3,
                            spaceBetween: 40,
                          },
                          1024: {
                            slidesPerView: 4,
                            spaceBetween: 50,
                          },
                        }}
                      >
                        {vendor?.attachments?.map((vendor, index) => (
                          <SwiperSlide key={index}>
                            <img
                              onClick={() => {
                                setCurrentImage(vendor);
                                setImageOpen(true);
                              }}
                              src={vendor}
                              className="w-60 h-60 cursor-pointer object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                ) : status === 1 ? (
                  <div>
                    <div className="my-10 z-50 w-full">
                      <Swiper
                        slidesPerView={1}
                        spaceBetween={2}
                        loop={true}
                        autoplay={{
                          delay: 2500,
                          disableOnInteraction: false,
                        }}
                        pagination={{
                          clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                        breakpoints={{
                          640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                          },
                          768: {
                            slidesPerView: 3,
                            spaceBetween: 40,
                          },
                          1024: {
                            slidesPerView: 4,
                            spaceBetween: 50,
                          },
                        }}
                      >
                        {vendor?.packages?.map((vendor, index) => (
                          <SwiperSlide key={index}>
                            <img
                              onClick={() => {
                                setCurrentImage(vendor);
                                setImageOpen(true);
                              }}
                              src={vendor}
                              className="w-60 h-60 cursor-pointer object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {isOpen && (
        <ViewMap
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          coordinates={vendor.coordinates}
        />
      )}
      {currentImage && imageOpen && (
        <ImageFull
          imageOpen={imageOpen}
          setImageOpen={setImageOpen}
          image={currentImage}
        />
      )}
    </div>
  );
};

export default Vendor;
