import Image from "next/image";
import React from "react";
import uaFlag from "../../images/ua.webp";

import styles from "./Footer.module.css";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        Все буде Україна <Image src={uaFlag} alt="UA" draggable={false} />
      </div>
    </footer>
  );
};

export default Footer;
