"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSending(true);
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Failed to send message");
      return;
    }

    toast.success("Message sent! We'll get back to you soon. 🎉");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  } catch {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setSending(false);
  }
};

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
     
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
          Contact Us
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900">Get in Touch</h1>
        <p className="text-gray-600 mt-3 max-w-xl mx-auto">
          Have a question, want to book catering, or just say hi? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
       
        <div className="lg:col-span-2 space-y-5">
          {[
            { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
            { icon: Mail, label: "Email", value: "hello@cornerstonecatering.com" },
            { icon: MapPin, label: "Location", value: "Serving across the USA" },
            { icon: Clock, label: "Hours", value: "Mon–Sat: 9am – 8pm" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 bg-orange-50 rounded-2xl p-4">
              <div className="w-10 h-10 shrink-0 bg-orange-500 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-gray-900 font-semibold text-sm mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

       
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Name *</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (000) 000-0000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Subject *</label>
              <select
              title="o"
               required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition bg-white">
                <option value="">Select a subject</option>
                <option value="catering">Catering Enquiry</option>
                <option value="order">Order Question</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Message *</label>
              <textarea required rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Tell us how we can help..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition resize-none" />
            </div>
            <button type="submit" disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all disabled:opacity-60">
              <Send size={16} />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}