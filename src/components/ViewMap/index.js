import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import GoogleMapReact from "google-map-react";
import { LocationMarkerIcon } from "@heroicons/react/solid";

// write a ViewMap component as functional comoponent which takes coordinates as prop which has latitute and longitude in an array and it shows the map with a marker pointing to that coordinates using google-map-react library

const ViewMap = ({ isOpen, setIsOpen, coordinates }) => {
  const center = {
    lat: coordinates[0],
    lng: coordinates[1],
  };
  const marker = {
    lat: coordinates[0],
    lng: coordinates[1],
  };
  const zoom = 14;
  console.log(coordinates);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                  className="text-lg mb-2 font-medium leading-6 text-gray-900"
                >
                  Vendor's business location
                </Dialog.Title>

                <div style={{ height: "50vh", width: "100%" }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: "AIzaSyCDCQBnv82-gPUl8bkOuTyQdoELx2nm8eI",
                    }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                  >
                    <Marker lat={marker.lat} lng={marker.lng} />
                  </GoogleMapReact>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Marker = () => (
  <div style={{ color: "red" }}>
    <LocationMarkerIcon className="w-6 text-red-500" />
  </div>
);

export default ViewMap;
