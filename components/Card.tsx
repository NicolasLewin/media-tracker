"use client"

import Link from "next/link";

export type CardProps = {
    title: string;
    description: string;
    image: string;
    path: string;
}

export const Card = (props: CardProps) => {
    return (
        <div className="max-w-md bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700">
            <Link href={props.path} className="block overflow-hidden">
                <img 
                    className="rounded-t-xl w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300 ease-in-out" 
                    src={props.image} 
                    alt={props.title}
                />
            </Link>
            <div className="p-8">
                <Link href={props.path}>
                    <h5 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 transition-colors duration-200">{props.title}</h5>
                </Link>
                <p className="mb-6 text-lg font-normal text-gray-600 dark:text-gray-400">{props.description}</p>
                <Link 
                    href={props.path} 
                    className="inline-flex items-center px-5 py-3 text-base font-semibold text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Explore
                    <svg 
                        className="rtl:rotate-180 w-4 h-4 ms-3" 
                        aria-hidden="true" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 14 10"
                    >
                        <path 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}