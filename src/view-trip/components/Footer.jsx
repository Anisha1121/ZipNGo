import React from 'react';
import { FaCopyright } from 'react-icons/fa6';

function Footer() {
  return (
    <div className="my-7">
      <h2 className="text-center text-gray-400 flex justify-center items-center gap-1 text-sm">
        <FaCopyright className="text-xs" />
        {new Date().getFullYear()} &nbsp;
        <span>
          Created by{' '}
          <a
            href="https://www.linkedin.com/in/anishadwivedi1121" // Replace with your real link
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 transition"
          >
            Anisha Dwivedi
          </a>
        </span>
      </h2>
    </div>
  );
}

export default Footer;
