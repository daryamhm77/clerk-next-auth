import NavbarItem from './NavbarItem';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-card-border bg-nav backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-5">
        <NavbarItem title="Trending" param="trending" />
        <NavbarItem title="Top Rated" param="top_rated" />
      </div>
    </nav>
  );
}