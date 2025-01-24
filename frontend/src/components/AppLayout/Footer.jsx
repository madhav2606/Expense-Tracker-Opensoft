import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, CircleDollarSign } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 px-4 mt-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="w-2/5">
                        <div className="text-2xl font-bold mb-4 md:mb-0 flex items-center space-x-2">
                            <CircleDollarSign className="text-purple-400" /> <p className="text-purple-400">SPEND</p><p> Sense</p>
                        </div>
                        <div className="text-sm mt-2">
                            SpendSense is here to help you take control of your financial journey.
                            With our intuitive platform, you can easily track your spending, set budgets,
                            and gain valuable insights to make smarter financial decisions.
                            Whether you're saving for a future goal or simply looking to manage your day-to-day expenses, SpendSense empowers you with the tools you need to optimize your finances.
                            Start today and take the first step towards a smarter, more secure financial future
                        </div>
                    </div>
                    <div className="flex flex-col space-x-6 space-y-2 mb-4 md:mb-0">
                        <a href="#features" className="hover:text-purple-400">
                            Features
                        </a>
                        <a href="#pricing" className="hover:text-purple-400">
                            Pricing
                        </a>
                        <a href="#about" className="hover:text-purple-400">
                            About Us
                        </a>
                        <a href="#contact" className="hover:text-purple-400">
                            Contact
                        </a>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank">
                                <Facebook className="w-8 h-8 hover:text-purple-400" />
                            </a>
                            <a href="https://twitter.com" target="_blank">
                                <Twitter className="w-8 h-8 hover:text-purple-400" />
                            </a>
                            <a href="https://instagram.com" target="_blank">
                                <Instagram className="w-8 h-8 hover:text-purple-400" />
                            </a>
                            <a href="https://linkedin.com" target="_blank">
                                <Linkedin className="w-8 h-8 hover:text-purple-400" />
                            </a>
                        </div>
                        <div className="mt-5">
                            <p>Contact:+91 1234567890</p>
                        </div>
                        <div>
                            <p>Email: abc123@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} SpendSense. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
