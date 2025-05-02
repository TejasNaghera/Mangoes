import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
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
                    <li className="pt-2 list-none"><a href="" >Home</a></li>
                    <li className="pt-2 list-none"><a href="" >Products</a></li>
                    <li className="pt-2 list-none"> <a href="" >About</a></li>
                    <li className="pt-2 list-none"> <a href="">Contact</a></li>
                </div>
                <div className=" p-6 rounded  text-center">
                    <h2 className="text-2xl font-normal mb-4">Follow Us</h2>
                   <div className="flex justify-center items-center gap-5">
                    <FontAwesomeIcon icon={faFacebookF} className="text-blue-600 text-4xl h-45" />
                    <FontAwesomeIcon icon={faInstagram} className="text-pink-500 text-4xl" />
                    <FontAwesomeIcon icon={faXTwitter} className="text-black text-4xl" />
                   </div>
                   <h2 className="text-xl font-normal mb-2 mt-2.5">Follow Us</h2>
                </div>

            </div>

            <p className="text-sm">&copy; 2025 OneBoss Kesar. All rights reserved.</p>
            <p className="text-xs">Made with ❤️ in Gujarat</p>
        </footer>
    )
}
