'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarItemProps {
  title: string;
  param: string;
}

export default function NavbarItem({
  title,
  param,
}: NavbarItemProps) {
  const pathname = usePathname();
  const genre = pathname.split('/')[2];

  const active = genre === param;

  return (
    <Link
      href={`/top/${param}`}
      className={`relative px-1 py-2 text-sm font-semibold transition-all duration-300 hover:text-amber-500 ${
        active ? 'text-amber-500' : 'text-foreground'
      }`}
    >
      {title}

      <span
        className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-amber-500 transition-all duration-300 ${
          active ? 'w-full' : 'w-0'
        }`}
      />
    </Link>
  );
}