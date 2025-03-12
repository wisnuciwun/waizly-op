import colors from '@/utils/colors';

const Footer = () => {
  return (
    <div className="nk-footer bg-transparent border-0">
      <div className="container-fluid">
        <div className="nk-footer-wrap">
          <div style={{ color: colors.black}} className="nk-footer-copyright">
            &copy; 2024 Bebas Kirim. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
