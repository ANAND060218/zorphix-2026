"use client";

import React from 'react';
// import Image from 'next/image';


const Footer: React.FC = () => {
    return (
        <div id="footer" className="footer">
            <div className="footer__logo-box">
                <picture className="footer__logo">
                <img src={"/img/footer.png"}/>
                </picture>
            </div>
            <div className="row">
                <div className="col-1-of-2">
                    <p className="footer__copyright">
                        Zorphix is a national level techno-management symposium organized by the
                        Department of Computer Science and Business Systems at Chennai Institute of Technology.
                    </p>
                </div>

                <div className="col-1-of-2">
                    <div className="footer__navigation">
                        <div className="f">
                            <h3>CONNECT WITH US</h3>
                            <div className="f_inner">
                                <a
                                    href="https://www.instagram.com/zorphix.cit/"
                                    target="_blank"
                                    rel='noreferrer'
                                >
                                    <img className="footer__img"
                                    src={"/img/insta-footer.png"}/>
                                </a>
                                <a
                                    href="mailto:zorphix@citchennai.net"
                                    target="_blank"
                                    rel='noreferrer'
                                >
                                    <img className="footer__img" 
                                    src={"/img/gmail.png"} 
                                    alt="Gmail" 
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-center'>
                <span className="copyright" style={{paddingLeft:50}} >©Zorphix 2025 All rights reserved</span>
            </div>
        </div>
    );
}

export default Footer;
