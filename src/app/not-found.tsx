import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center max-h-screen p-6">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404!</h1>
      <p className="text-xl text-slate-500 mb-6">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link href="/">
        <p className="text-lg text-blue-500 hover:underline cursor-pointer">
          Return to Home
        </p>
      </Link>
    </div>
  );
}
