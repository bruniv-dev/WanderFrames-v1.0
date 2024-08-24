import React from "react";
import "./footer.css"; // Assuming your CSS is named Footer.css

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container grid grid--footer">
        <div className="footer__logo-col">
          <a href="/" className="footer__logo">
            {/* <img
              className="footer__logo-img"
              alt="Omnifood logo"
              src="img/omnifood-logo.png"
            /> */}
            BRUNIV
          </a>
          <ul className="footer__social-links">
            <li>
              <a className="footer__social-link" href="/">
                <ion-icon
                  className="footer__social-icon"
                  name="logo-instagram"
                ></ion-icon>
              </a>
            </li>
            <li>
              <a className="footer__social-link" href="/">
                <ion-icon
                  className="footer__social-icon"
                  name="logo-facebook"
                ></ion-icon>
              </a>
            </li>
            <li>
              <a className="footer__social-link" href="/">
                <ion-icon
                  className="footer__social-icon"
                  name="logo-twitter"
                ></ion-icon>
              </a>
            </li>
          </ul>
          <p className="footer__copyright">
            Copyright &copy; <span className="footer__year">2027</span> by
            Omnifood, Inc. All rights reserved.
          </p>
        </div>

        <div className="footer__address-col">
          <p className="footer__heading">Contact Us</p>
          <address className="footer__contacts">
            <p className="footer__address">
              623 Harrison St., 2nd Floor, San Francisco, CA 94107
            </p>
            <p>
              <a className="footer__link" href="tel:415-201-6370">
                415-201-6370
              </a>
              <br />
              <a className="footer__link" href="mailto:hello@omnifood.com">
                hello@omnifood.com
              </a>
            </p>
          </address>
        </div>

        <nav className="footer__nav-col">
          <p className="footer__heading">Account</p>
          <ul className="footer__nav">
            <li>
              <a className="footer__link" href="/">
                Create Account
              </a>
            </li>
            <li>
              <a className="footer__link" href="/">
                Sign In
              </a>
            </li>
            <li>
              <a className="footer__link" href="/">
                iOS App
              </a>
            </li>
            <li>
              <a className="footer__link" href="/">
                Android App
              </a>
            </li>
          </ul>
        </nav>

        <nav className="footer__nav-col">
          <p className="footer__heading">Company</p>
          <ul className="footer__nav">
            <li>
              <a className="footer__link" href="/">
                About Omnifood
              </a>
            </li>
            <li>
              <a className="footer__link" href="/">
                For Business
              </a>
            </li>
            <li>
              <a className="footer__link" href="/">
                Cooking Partners
              </a>
            </li>
            <li>
              <a className="footer__link" href="/">
                Career
              </a>
            </li>
          </ul>
        </nav>

        <nav className="footer__nav-col">
          <p className="footer__heading">Resources</p>
          <ul className="footer__nav">
            <li>
              <a className="footer__link" href="/">
                Recipe Directory
              </a>
            </li>
            <li>
              <a className="footer__link" href="/">
                Help Centre
              </a>
            </li>
            <li>
              <a className="footer__link" href="/">
                Privacy & Terms
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
