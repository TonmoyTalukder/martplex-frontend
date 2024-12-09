"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input, Textarea } from "@nextui-org/react";

const ContactPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const contactData = {
      email,
      subject,
      message,
    };

    console.log("Submitted Data:", contactData);

    // Optionally clear the form after submit
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto py-10">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Contact Us
        </h1>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <Input
            label="Subject"
            placeholder="Enter the subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            required
          />
          <Textarea
            label="Message"
            placeholder="Write your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            required
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Footer Section with Links */}
      <footer className="flex justify-center mt-10 space-x-8 text-lg text-blue-500">
        <a href="/" onClick={() => router.push("/")}>
          Home
        </a>
        <a href="/about-us" onClick={() => router.push("/about-us")}>
          About Us
        </a>
      </footer>
    </div>
  );
};

export default ContactPage;
