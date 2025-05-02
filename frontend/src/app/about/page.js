// pages/about.js

export default function About() {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-green-900 mb-4 text-center">About Us</h1>
        
        <section className="text-center mb-8">
          <p className="text-xl text-gray-600">
            Welcome to our Mango Store! We are passionate about bringing you the finest mangoes straight from the farms of Gujarat and Maharashtra.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Our Mission</h2>
          <p className="text-gray-700">
            Our mission is to deliver the best quality mangoes, ensuring each fruit is picked with care and delivered fresh to your doorsteps.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">The Mango Journey</h2>
          <p className="text-gray-700">
            Our mangoes are handpicked from the best orchards in India, ensuring premium quality with every bite. From farm to table, we ensure freshness and taste in every mango.
          </p>
        </section>
  
        {/* Our Farm Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Our Farm</h2>
          <p className="text-gray-700">
            Our farm is located in the lush orchards of Gujarat, where we grow the finest Kesar mangoes. We use sustainable, organic farming practices to ensure the highest quality mangoes. From selecting the best seeds to hand-picking every mango, we take pride in offering the freshest and most flavorful mangoes.
          </p>
          <p className="text-gray-700 mt-4">
            Our dedicated farm workers ensure that each mango is grown with care and attention to detail. We believe in a healthy, chemical-free environment, which is why all our mangoes are grown without harmful pesticides.
          </p>
          <section className="relative mb-8">
            <div className=" rounded-lg flex justify-center">
            <video
          className="md:w-3/5 h-2/5 object-cover rounded-lg flex justify-center"
        //   src=".\video\Document - Google Chrome 2024-02-08 19-55-33.mp4"
          src="./poject-videyo.mp4"
          type="video/mp4"
          autoPlay
          muted
          loop
        />

            </div>
        
          {/* Optional overlay */}
      </section>

        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>100% Fresh and Organic Mangoes</li>
            <li>Sourced from trusted farms</li>
            <li>Timely Delivery across the country</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Customer Testimonials</h2>
          <p className="text-gray-700">"Best mangoes I’ve ever tasted! The sweetness and juiciness were just perfect. Highly recommend!" - Ananya Patel</p>
        </section>
  
        <section className="text-center">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Get In Touch</h2>
          <p className="text-gray-700">Email us at: support@mangoes.com</p>
          <p className="text-gray-700">Follow us on Social Media for the latest updates!</p>
        </section>
      </div>
    );
  }
  