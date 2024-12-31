import { Navbar } from "@/src/components/UI/navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen p-0">
      <Navbar />
      <main
        className="mt-5 sm:mt-0 mx-1 sm:mx-0"
        style={{
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}
