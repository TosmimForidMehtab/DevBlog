import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const FooterComponent = () => {
    return (
        <Footer container className="border border-t-8 border-green-400">
            <div className="mx-auto w-full max-w-screen-xl p-4">
                <div className="grid justify-between w-full sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link to="/" className="text-lg sm:text-xl font-semibold whitespace-nowrap self-center dark:text-white">
                            <span className="px-2 py-1 mr-1 bg-indigo-500 rounded-s-full text-white">Dev's</span>
                            <span className="px-2 py-1 bg-red-500 rounded-e-full text-white">Blog</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 mt-4 sm:gap-6">
                        <div>
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col={true}>
                                <Footer.Link href={`${import.meta.env.VITE_APP_URL}/about`} target="_blank" rel="noreferrer noopener">
                                    Dev's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title="Follow Us" />
                            <Footer.LinkGroup col={true}>
                                <Footer.Link href="https://github.com/TosmimForidMehtab" target="_blank" rel="noreferrer noopener">
                                    Github
                                </Footer.Link>
                                <Footer.Link href="https://www.linkedin.com/in/tosmimforidmehtab" target="_blank" rel="noreferrer noopener">
                                    LinkedIn
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col={true}>
                                <Footer.Link href="#" target="_blank" rel="noreferrer noopener">
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href="#" target="_blank" rel="noreferrer noopener">
                                    Terms & Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Dev's Blog" year={new Date().getFullYear()} />

                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href="https://github.com/TosmimForidMehtab" icon={FaGithub} target="_blank" />
                        <Footer.Icon href="https://www.linkedin.com/in/tosmimforidmehtab" icon={FaLinkedin} target="_blank" />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default FooterComponent;
