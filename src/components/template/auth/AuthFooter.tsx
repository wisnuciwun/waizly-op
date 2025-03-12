import React from 'react';
import { Row, Col } from '@/components';
import Link from 'next/link';

const AuthFooter = () => {
  return (
    <div className="nk-footer bg-transparent border-0 shadow-none">
      <div className="container wide-lg">
        <Row className="g-3">
          <Col lg={5} className="order-lg-last">
            <ul className="nav nav-sm justify-content-center justify-content-lg-end">
              <li className="nav-item">
                <Link className="nav-link text-color-primary" href="#">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-color-primary" href="#">
                  Kebijakan Privasi
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-color-primary" href="#">
                  Bantuan
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={7}>
            <div className="nk-block-content text-center text-lg-start">
              <p className="text-color-primary">
                &copy; 2024 Bebas Kirim. All Rights Reserved.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default AuthFooter;
