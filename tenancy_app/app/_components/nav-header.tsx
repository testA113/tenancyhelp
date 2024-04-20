"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import Icon from "../../public/tenancy-icon.png";
import LogoWide from "../../public/tenancy-logo-wide.png";
import Logo from "../../public/tenancy-logo.png";

export const NavHeader: React.FC = () => {
  const session = useSession();
  return (
    <header className="fixed left-0 right-0 top-0 z-40 bg-gradient-to-b from-background from-25% to-background/0 mx-auto">
      <div className="flex justify-between text-default py-3 px-3 md:px-6 mx-auto w-full">
        <Link
          className="flex items-center"
          href="/"
          aria-roledescription="home"
        >
          <Image
            src={LogoWide}
            alt="Tenancy Help Logo"
            className="hidden xl:block h-12 w-auto"
          />
          <Image
            src={Logo}
            alt="Tenancy Help Logo"
            className="hidden lg:block xl:hidden h-12 w-auto"
          />
          <Image
            src={Icon}
            alt="Tenancy Help Logo"
            className="lg:hidden h-12 w-auto"
          />
        </Link>
        {session.status === "authenticated" && session.data.user?.image ? (
          <Image
            src={session.data.user.image}
            width={64}
            height={64}
            alt="User Profile Image"
            className="h-12 w-auto rounded-full"
          />
        ) : (
          <>no auth!</>
        )}
      </div>
    </header>
  );
};
