import Navbar from "@/components/Navbar";
import SearchBox from "@/components/SearchBox";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <SearchBox />
      {children}
    </>
  );
}
