import NavbarItem from './NavbarItem';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-5">
        <NavbarItem title="Trending" param="trending" />
        <NavbarItem title="Top Rated" param="top_rated" />
      </div>
    </nav>
  );
}