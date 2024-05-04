import Link from "next/link";

export function InternalLink({
  href,
  children,
  target = "_self",
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
}) {
  return (
    <Link href={href} className="leading-4 underline" target={target}>
      <span>{children}</span>
      <svg
        aria-hidden="true"
        height="7"
        viewBox="0 0 6 6"
        width="7"
        className="opacity-70 align-top inline mt-1 ml-1"
      >
        <path
          d="M1.25215 5.54731L0.622742 4.9179L3.78169 1.75597H1.3834L1.38936 0.890915H5.27615V4.78069H4.40513L4.41109 2.38538L1.25215 5.54731Z"
          fill="currentColor"
        ></path>
      </svg>
    </Link>
  );
}
