// import React from "react";

// const DefaultLayout = ({ children }) => {
//   return (
//     <div className="w-full ">
//       DefaultLayout
//       <main>{children}</main>
//     </div>
//   );
// };

// export default DefaultLayout;
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";

const navigation = [
  {
    name: "Created Events",
    href: "/created-events",
    icon: HomeIcon,
    current: false,
  },
  {
    name: "Invited Events",
    href: "/invited-events",
    icon: UsersIcon,
    current: false,
  },
  { name: "Vendors", href: "/vendors", icon: FolderIcon, current: false },
  { name: "Messages", href: "/messages", icon: CalendarIcon, current: false },
  // { name: "Offers", href: "#", icon: InboxIcon, current: false },
  // {
  //   name: "Support Stream",
  //   href: "/support",
  //   icon: ChartBarIcon,
  //   current: false,
  // },
  { name: "Feedback", href: "/feedback", icon: ChartBarIcon, current: false },
  { name: "Support", href: "/support", icon: ChartBarIcon, current: false },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
    icon: ChartBarIcon,
    current: false,
  },
  {
    name: "Terms and Conditions",
    href: "/terms-conditions",
    icon: ChartBarIcon,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DefaultLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({});
  const router = useRouter();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [placeName, setPlaceName] = useState(null);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setPlaceName(data.address.city);
            })
            .catch((error) => {
              console.error(error);
            });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    getLocation();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      <div className="fixed z-10 top-0 left-60 w-60 h-60 rounded-full blur-3xl bg-opacity-40 bg-orange-500" />
      <div className="fixed z-10 bottom-20 right-0 w-60 h-60 rounded-full blur-3xl bg-opacity-40 bg-orange-500 " />
      <div className="fixed z-10 top-1/3 left-1/2 w-60 h-60 rounded-full blur-3xl bg-opacity-40 bg-blue-500 " />
      <div className="fixed z-10 top-2/3 left-60 w-60 h-60 rounded-full blur-3xl bg-opacity-40 bg-blue-500 " />
      <div className="z-50 bg-gray-900">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-50 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full z-50 bg-gray-900">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex border-b border-indigo-800 p-4">
                    <a href="#" className="flex-shrink-0 group block">
                      <div className="flex items-center">
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
                        <div className="ml-3">
                          <p className="text-base font-medium text-white">
                            {user.name}
                          </p>
                          <p className="text-sm font-medium text-indigo-200 group-hover:text-white">
                            {user.phone}
                          </p>
                          <p className="text-sm font-medium text-indigo-200 group-hover:text-white">
                            {placeName}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-indigo-800 text-white"
                            : "text-white hover:bg-indigo-600 hover:bg-opacity-75",
                          "group z-50 flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                    <button
                      // key={item.name}
                      // href={}
                      onClick={() => logoutHandler()}
                      className={classNames(
                        "text-white w-full hover:bg-indigo-600 hover:bg-opacity-75",
                        "group z-50 flex items-center px-2 py-2 text-base font-medium rounded-md"
                      )}
                    >
                      <UsersIcon
                        className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"
                        aria-hidden="true"
                      />
                      Logout
                    </button>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="relative z-50 flex-1 flex flex-col min-h-0 bg-gray-900">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="w-full mt-5">
                <img src={"/images/logofinal.png"} className="w-7/12 mx-auto" />
              </div>
              <div className="flex-shrink-0 flex p-4 mt-2">
                <a href="#" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      {user.avatar ? (
                        <img
                          className="inline-block h-16 w-16 rounded-full"
                          src={user.avatar ? user.avatar : "s"}
                          alt=""
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-teal-300 flex justify-center items-center text-white shadow-lg text-xl font-bold">
                          {user?.name ? user.name[0] : ""}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-medium text-white">
                        {user?.name ? user.name : ""}
                      </p>
                      <p className="text-sm font-medium text-white group-hover:text-white">
                        {user.phone ? user.phone : ""}
                      </p>
                      <p className="text-sm font-medium text-white group-hover:text-white">
                        {placeName ? placeName : ""}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
              <nav className=" mt-2 flex-1 pl-2 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      router.pathname === item.href
                        ? "bg-white text-teal-500"
                        : "text-white hover:bg-white hover:text-gray-900 hover:bg-opacity-75",
                      "group z-50 flex items-center px-2 py-2 text-base font-medium rounded-l-full"
                    )}
                  >
                    <item.icon
                      // className="mr-3 flex-shrink-0 h-6 w-6 text-white"
                      className={classNames(
                        router.pathname === item.href
                          ? "text-teal-500"
                          : "text-white  hover:bg-opacity-75",
                        "mr-3 z-50 flex-shrink-0 h-6 w-6 text-white"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={() => logoutHandler()}
                  className={classNames(
                    "text-white w-full hover:bg-white hover:text-gray-900 hover:bg-opacity-75",
                    "group z-50 flex items-center px-2 py-2 text-base font-medium rounded-l-full"
                  )}
                >
                  <UsersIcon
                    // className="mr-3 flex-shrink-0 h-6 w-6 text-white"
                    className={classNames(
                      "text-white  hover:bg-opacity-75",
                      "mr-3 z-50 flex-shrink-0 h-6 w-6 text-white"
                    )}
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </nav>
            </div>
            {/* <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
              <a href="#" className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Tom Cook</p>
                    <p className="text-xs font-medium text-indigo-200 group-hover:text-white">
                      View profile
                    </p>
                  </div>
                </div>
              </a>
            </div> */}
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-50 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100 bg-opacity-20">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <main className="flex-1 py-5 box-border	 ">{children}</main>
        </div>
      </div>
    </>
  );
}
