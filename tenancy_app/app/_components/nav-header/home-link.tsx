import Link from "next/link";
import Image from "next/image";

import Icon from "@/public/tenancy-icon.png";
import LogoWide from "@/public/tenancy-logo-wide.png";
import Logo from "@/public/tenancy-logo.png";

export function HomeLink() {
  return (
    <Link
      className="flex items-center shrink-0"
      href="/"
      aria-roledescription="home"
    >
      <Image
        src={LogoWide}
        alt="Tenancy Help Logo"
        className="shrink-0 hidden xl:block h-12 w-auto"
      />
      <Image
        src={Logo}
        alt="Tenancy Help Logo"
        className="shrink-0 hidden lg:block xl:hidden h-12 w-auto"
      />
      <Image
        src={Icon}
        alt="Tenancy Help Logo"
        className="shrink-0 lg:hidden h-12 w-auto"
      />
    </Link>
  );
}
