"use client"

import { useState } from "react";
import { LoginRegisterModal } from "./LoginRegisterModal";
import toast from "react-hot-toast";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from "@/contexts/UserContext";

export const Header = () => {
  const [isLoginRegisterModalOpen, setIsLoginRegisterModalOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLoginRegisterModal = () => {
      setIsLoginRegisterModalOpen(!isLoginRegisterModalOpen);
  };
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
          method: 'POST',
          credentials: 'include',
      });
      if (response.ok) {
          setUser(null);
          toast.success('Logged out successfully');
          router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const getLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return `block py-2 px-3 ${isActive 
      ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' 
      : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'}`;
  };

  return (  
    <div className="max-w-6xl px-4 m-auto flex flex-col">
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Media Tracker</span>
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              {
              user ?
                  <button type="button" onClick={handleLogout} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Logout</button>
                :
                  <button type="button" onClick={toggleLoginRegisterModal} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
              }
              {isLoginRegisterModalOpen && <LoginRegisterModal onClose={toggleLoginRegisterModal} />}
              <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                  <span className="sr-only">Open main menu</span>
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                  </svg>
              </button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link href="/" className={getLinkClassName("/")} aria-current="page">Home</Link>
              </li>
              <li>
                <Link href="/games" className={getLinkClassName("/games")}>Games</Link>
              </li>
              <li>
                <Link href="/movies" className={getLinkClassName("/movies")}>Movies</Link>
              </li>
              {user && (
                <li>
                  <Link href="/my-games" className={getLinkClassName("/my-games")}>My Games</Link>
                </li>
              )}
              {user && (
                <li>
                  <Link href="/my-movies" className={getLinkClassName("/my-movies")}>My Movies</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}