// next
import Image from 'next/image';
// asset
import waizlyLogo from '@/assets/images/logo/waizly-logo.svg';
import waizlyLogoName from '@/assets/images/logo/waizly-logo-name.svg';

import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/dashboard" className="logo-link">
      <Image
        src={waizlyLogo}
        width={50}
        height={130}
        alt="waizly-logo"
        style={{ marginLeft: -12 }}
      />
      <Image
        src={waizlyLogoName}
        width={115}
        height={115}
        alt="waizly-logo"
        style={{ marginLeft: 12, marginTop: 8 }}
      />
    </Link>
  );
};

export default Logo;
