import Footer from "@/src/components/UI/footer";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen p-0">
      <div className="flex-1 min-h-screen">{children}</div>
      <Footer />
    </div>
  );
}
