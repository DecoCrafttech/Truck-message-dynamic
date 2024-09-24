import React from "react";
import { Link } from "react-router-dom";
import Copyright from "./copyright";
import { IoIosMail } from "react-icons/io";
import { FaMapLocationDot, FaPhoneVolume } from "react-icons/fa6";

const Footer_v1 = () => {
  let publicUrl = process.env.PUBLIC_URL + "/";

  return (
    <footer className="ltn__footer-area overflow-hidden">
      <div className="footer-top-area  section-bg-2 plr--5">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-8 ">
              <div className="footer-widget footer-about-widget">
                <div className="footer-logo">
                  <div>
                    <img
                      className="site-logofooter "
                      src="https://ddyz8ollngqwo.cloudfront.net/trucklogo.png"
                      alt="truck message Logo - All in one truck solutions"
                    />
                  </div>
                </div>
                {/* <p className='footercls'>Truck Message</p>	 */}
                <div className="footer-address">
                  <ul>
                    <li>
                      <div className=" para footer-address-icon">
                      <FaMapLocationDot />
                      </div>
                      <div className="footer-address-info footercls">
                        10/61,North Street, Near Sri Ambiga Press,
                        P.Velur,Namakkal-638182
                      </div>
                    </li>
                    <li>
                      <div className="footer-address-icon para">
                      <FaPhoneVolume />
                      </div>
                      <div className="footer-address-info">
                        <a style={{ textDecoration: "none", color: "white" }} href="tel:8300745340">+91 83007 45340</a>
                        <br />
                        <a style={{ textDecoration: "none", color: "white" }} href="tel:8300678740">+91 83006 78740 </a>
                      </div>
                    </li>
                    <li>
                      <div className="footer-address-icon"><IoIosMail />

                        
                      </div>
                      <div className="footer-address-info footercls ">
                        <a style={{ textDecoration: "none", color: "white" }} href="mailto:info@truckmessage.com">
                          info@truckmessage.com
                        </a>{" "}
                        <br />
                        <a style={{ textDecoration: "none", color: "white" }} href="mailto:sales@truckmessage.com">
                          sales@truckmessage.com
                        </a>
                        <br />
                        <a style={{ textDecoration: "none", color: "white" }} href="mailto:service@truckmessage.com">
                          service@truckmessage.com
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4 ">
              <div className="footer-widget footer-menu-widget clearfix">
                <h4 className="footer-title">TruckMessage </h4>
                <div className="footer-menu go-top">
                  <ul>
                    <li>
                      <Link to="/contact" className="footercls">
                        Contact us
                      </Link>
                    </li>
                    <li><Link to="/" className='footercls'>Terms &amp; Conditions</Link></li>
                    <li><Link to="/" className='footercls'>Privacy &amp; Policy</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Copyright />
    </footer>
  );
}

export default Footer_v1;