export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen">
      {/* <Navbar /> */}
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
