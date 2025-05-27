import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faXTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons'; // for portfolio

import Link from "next/link";
export default function Footer() {
    return (
        <footer className="bg-yellow-400 text-white text-center py-6 ">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <div className=" p-6 rounded text-center">
                    <img
                        src=".\logo.png"
                        alt="Fresh Mango"
                        className="w-full h-44 object-cover flex justify-center items-center"
                    />
                </div>
                <div className=" p-6 rounded  text-center">
                    <h2 className="text-2xl">Quick Links</h2>
                    <li className="pt-2 list-none"><a href="/" >Home</a></li>
                    <li className="pt-2 list-none"><a href="products" >Products</a></li>
                    <li className="pt-2 list-none"> <a href="about" >About</a></li>
                    <li className="pt-2 list-none"> <a href="contact" >Contact</a></li>
                </div>
                <div className=" p-6 rounded  text-center">
                    <h2 className="text-2xl font-normal mb-4">Follow Us</h2>
                    <div className="flex justify-center items-center gap-5 mt-6">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebookF} className="text-blue-600 text-4xl" />
                        </a>
                        <a href="https://www.instagram.com/comedy._24" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} className="text-pink-500 text-4xl" />
                        </a>
                        <a href="https://x.com/tejas_ayar?t=eVN29XNM08QCMY3fKMvK4Q&s=09" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faXTwitter} className="text-black text-4xl" />
                        </a>
                        <a href="https://www.linkedin.com/in/tejas-naghera-241b092a7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} className="text-blue-700 text-4xl" />
                        </a>
                        <a href="https://tejasnaghera.github.io/-my-portfolio-/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faGlobe} className="text-gray-700 text-4xl" />
                        </a>
                    </div>

                    <h2 className="text-xl font-normal mb-2 mt-2.5">Follow Us</h2>
                </div>

            </div>

            <p className="text-sm">&copy; 2025 OneBoss Kesar. All rights reserved.</p>
            <p className="text-xs">Made with ❤️ in Gujarat</p>
        </footer>
    )
}
