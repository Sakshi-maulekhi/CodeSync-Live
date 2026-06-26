/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useState, u, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { isLoggedin, logout } from "../utlis/loginUtils";
import GlobalContext from "../context/GlobalContext";
import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import useProblems from "./hooks/useProblems";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Problems", href: "/problems", current: false },
  // { name: "About Us", href: "/about", current: false },
  { name: "Connect", href: "/connect", current: false },
  // { name: "Join Room", href: "/join", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  useProblems();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProblemPage, setIsProblemPage] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(isLoggedin());
  const { loggedIn, setLoggedIn, username, email } = useContext(GlobalContext);
  useEffect(() => {
    setLoggedIn(isLoggedin());
  }, [setLoggedIn]);
  const url = useLocation();
  useEffect(() => {
    if (url.pathname === "/problems") {
      setCurrentIndex(1);
    } else if (url.pathname === "/about") {
      setCurrentIndex(2);
    } else if (url.pathname === "/problems/3") {
      setCurrentIndex(3);
    } else if (url.pathname === "/connect") {
      setCurrentIndex(4);
    } else {
      setCurrentIndex(0);
    }
  }, [url.pathname]);

  const location = useLocation();
  useEffect(() => {
    // console.log("Head"+location.pathname);
    if (location.pathname.includes("/problems/")) {
      setIsProblemPage(true);
    } else {
      // console.log("IN ELSE PART");
      setIsProblemPage(false);
    }
  }, [location.pathname]);

  // console.log(url.pathname,"url");
  return (
    <Disclosure
      as="nav"
      className={`${isProblemPage ? "hidden" : ""} sticky top-0 z-50 backdrop-blur-md bg-slate-950/75 border-b border-slate-800/80 shadow-lg`}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  <img
                    className="w-8 h-8 mr-2 rounded-full ring-2 ring-indigo-500/25 p-[1px]"
                    src="mainLogo2.png"
                    alt="logo"
                  />
                  CodeSync
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item, index) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setCurrentIndex(index)}
                        className={classNames(
                          index === currentIndex
                            ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.12)]"
                            : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent",
                          "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3 z-50">
                  <div>
                    {loggedIn ? (
                      <Menu.Button className="flex text-sm rounded-md hover:opacity-95 transition-opacity">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-10 w-10 mr-2 rounded-full border-2 border-indigo-500/50 p-[2px] transition-all hover:border-indigo-400"
                          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${localStorage.getItem(
                            "username"
                          )}`}
                          alt=""
                        />
                        <div className="font-medium text-slate-200 my-auto text-left">
                          <div className="text-sm font-semibold">{username}</div>
                        </div>
                      </Menu.Button>
                    ) : (
                      <Link
                        to="/login"
                        className="text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md hover:shadow-indigo-500/20 hover:scale-[1.02] block px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Login
                      </Link>
                    )}
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-md text-white py-1 shadow-2xl focus:outline-none overflow-hidden">
                      {/* display username */}
                      <Menu.Item>
                        <div className="z-10 bg-slate-950/40 divide-y divide-slate-800/50 border-b border-slate-800/80">
                          <div className="px-4 py-3 text-sm">
                            <div className="font-semibold text-slate-200">{username}</div>
                            <div className="font-medium text-slate-400 truncate">{email}</div>
                          </div>
                        </div>
                      </Menu.Item>

                      <Menu.Item className="pt-2">
                        {({ active }) => (
                          <Link
                            to={`/u/${localStorage.getItem("username")}`}
                            className={classNames(
                              active ? "bg-slate-800 text-white" : "text-slate-300",
                              "block px-4 py-2 text-sm transition-colors duration-150"
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
         
                      <Menu.Item className="pb-1">
                        {({ active }) => (
                          <Link
                            to="/"
                            className={classNames(
                              active ? "bg-slate-800 text-rose-400" : "text-slate-300",
                              "block px-4 py-2 text-sm transition-colors duration-150"
                            )}
                            onClick={() => {
                              setLoggedIn(false);
                              logout();
                            }}
                          >
                            Log out
                          </Link>
                        )}
                      </Menu.Item>
                      {/* <Menu.Item>
                        <div className="z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div>Bonnie Green</div>
                            <div className="font-medium truncate">
                              name@flowbite.com
                            </div>
                          </div>
                          <ul
                            className="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="avatarButton"
                          >
                            <li>
                              <a
                                href="#"
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Dashboard
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Settings
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Earnings
                              </a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                              Sign out
                            </a>
                          </div>
                        </div>
                      </Menu.Item> */}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  as="a"
                  to={item.href}
                  onClick={() => setCurrentIndex(index)}
                  className={classNames(
                    currentIndex === index
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={currentIndex === index ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
