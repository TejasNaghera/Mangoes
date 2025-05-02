
import React from 'react';

const Contact = () => {
  return (
    <div className='bg-gray-100'>
 <div className="max-w-4xl mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Contact Us</h1>
      
      <p className="text-center mb-6 text-gray-700">
        Have any questions? We'd love to hear from you!
      </p>

      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your Email"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your Message"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-black py-2 px-4 rounded-md shadow-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Send Message
        </button>
      </form>

      <div className="mt-8 text-gray-700">
        <h2 className="text-xl font-semibold">Our Contact Information</h2>
        <ul className="mt-4 space-y-2">
          <li><strong>Phone:</strong> +1 (234) 567-890</li>
          <li><strong>Email:</strong> contact@yourdomain.com</li>
          <li><strong>Address:</strong> 123 Mango Street, City Name, Country</li>
        </ul>
      </div>
    </div>
    </div>
   
  );
};

export default Contact;
