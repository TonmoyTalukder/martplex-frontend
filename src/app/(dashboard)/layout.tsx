import Sidebar from "@/src/components/sidebar/Sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    // <div className="relative flex flex-col h-screen">
    //   <Navbar />
    //   <main
    //     style={{
    //       overflowX: "hidden",
    //     }}
    //     className="mt-5 sm:mt-0 mx-1 sm:mx-0"
    //   >
    //     {children}
    //   </main>
    // </div>

    <div className="min-h-screen p-0">
      <div className="flex gap-4 min-h-screen">
        <div className="flex-none w-34 border-gray-500 p-0 m-0">
          <Sidebar />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
