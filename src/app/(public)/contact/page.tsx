"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setMessage("");
    }, 4000);
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      "Hello Thrithi Nakshatra! I'd like to schedule an appointment to visit your boutique and check the jewellery collection."
    );
    window.open(`https://wa.me/919999999999?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Title Header */}
      <section className="bg-[#F3EAD3] border-b border-[#C9A24B]/35 py-8 sm:py-16 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2 sm:space-y-4">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#7A1F2B] font-bold">
            Connect With Us
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-[#111111] tracking-tight">
            Contact Our Boutique
          </h1>
          <div className="h-0.5 w-12 sm:w-16 bg-[#C9A24B] mx-auto mt-2 sm:mt-3" />
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Column 1: Store info & Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#111111]">Visit Our Boutique</h2>
              <p className="text-[#444444] text-sm leading-relaxed max-w-md">
                Walk into our boutique to check the quality, size, and fit of our bridal jewelry sets in person. We suggest booking an appointment for personalized bridal styling sessions.
              </p>
            </div>

            {/* Details List */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#C9A24B]/10 border border-[#C9A24B]/35 rounded-lg text-[#7A1F2B] shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Boutique Location
                  </h4>
                  <p className="text-[#555555] text-xs leading-relaxed max-w-xs">
                    5th Cross Rd, near KMC Hospital, <br />
                    Attavar, Mangaluru, <br />
                    Karnataka - 575001
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#C9A24B]/10 border border-[#C9A24B]/35 rounded-lg text-[#7A1F2B] shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Store Hours
                  </h4>
                  <p className="text-[#555555] text-xs leading-relaxed">
                    Tuesday – Sunday: 10:30 AM to 8:30 PM <br />
                    (Mondays Closed)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#C9A24B]/10 border border-[#C9A24B]/35 rounded-lg text-[#7A1F2B] shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Call / WhatsApp
                  </h4>
                  <a
                    href="tel:+919999999999"
                    className="block text-[#444444] hover:text-[#C9A24B] text-xs font-semibold transition duration-200"
                  >
                    +91 99999 99999
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#C9A24B]/10 border border-[#C9A24B]/35 rounded-lg text-[#7A1F2B] shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Email Support
                  </h4>
                  <a
                    href="mailto:info@thrithinakshatra.com"
                    className="block text-[#444444] hover:text-[#C9A24B] text-xs font-semibold transition duration-200"
                  >
                    info@thrithinakshatra.com
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="bg-[#C9A24B]/10 border border-[#C9A24B]/35 p-6 rounded-lg space-y-4 max-w-md">
              <h3 className="font-serif text-base font-bold text-[#111111] flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#7A1F2B]" />
                <span>Instant Bridal Styling Consultation</span>
              </h3>
              <p className="text-[#444444] text-xs leading-relaxed">
                Connect directly with our customer support and styling experts on WhatsApp for product videos, pricing inquiries, or to secure a booking date range instantly.
              </p>
              <button
                onClick={handleWhatsAppChat}
                className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black font-bold uppercase tracking-widest text-xs py-3 transition duration-300 rounded shadow-md flex items-center justify-center gap-2"
              >
                Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Column 2: Contact Form & Map */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg border border-[#C9A24B]/25 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#111111] uppercase tracking-wider mb-6">
                Send an Inquiry Message
              </h3>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-500/30 text-emerald-900 p-6 rounded text-center text-sm space-y-2 animate-in zoom-in-95 duration-200">
                  <span className="text-2xl">✨</span>
                  <p className="font-bold uppercase tracking-wider text-[#7A1F2B] text-xs">
                    Inquiry Sent Successfully!
                  </p>
                  <p className="text-[11px] text-[#555555] leading-normal">
                    Thank you. We have received your query. A stylist from Thrithi Nakshatra will respond to you via email or phone shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-[#222222] mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anjali Rao"
                      className="w-full bg-[#FAF7F0] border border-gray-300 rounded px-4 py-3 text-sm text-[#111111] placeholder-gray-405 focus:outline-none focus:border-[#C9A24B] transition duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-[#222222] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. anjali@gmail.com"
                      className="w-full bg-[#FAF7F0] border border-gray-300 rounded px-4 py-3 text-sm text-[#111111] placeholder-gray-405 focus:outline-none focus:border-[#C9A24B] transition duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-[#222222] mb-2">
                      Describe your requirements
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mention the products, dates of rental, or custom sizing requirements..."
                      className="w-full bg-[#FAF7F0] border border-gray-300 rounded px-4 py-3 text-sm text-[#111111] placeholder-gray-405 focus:outline-none focus:border-[#C9A24B] transition duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full gold-gradient hover:opacity-95 text-black font-bold uppercase tracking-widest text-xs py-3.5 transition duration-300 rounded shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Simulated Google Map */}
            <div className="h-64 relative bg-[#FAF7F0] border border-[#C9A24B]/35 rounded-lg overflow-hidden flex items-center justify-center text-center p-6 group shadow-sm">
              {/* Premium light aesthetic map placeholder */}
              <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800')" }} />
              <div className="absolute inset-0 bg-[#F3EAD3]/60" />
              <div className="relative z-10 space-y-3">
                <MapPin className="h-8 w-8 text-[#7A1F2B] mx-auto animate-bounce" />
                <h4 className="font-serif text-sm font-bold text-[#111111]">Mangaluru Boutique</h4>
                <p className="text-[#444444] text-xs leading-normal max-w-xs mx-auto">
                  5th Cross Rd, near KMC Hospital, Attavar, Mangaluru <br />
                  <span className="text-[#7A1F2B] font-bold text-[10px] tracking-wider uppercase mt-2 inline-block">
                    Click to Open in Google Maps
                  </span>
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=5th+Cross+Rd,+near+KMC+Hospital,+Attavar,+Mangaluru,+Karnataka+575001"
                target="_blank"
                className="absolute inset-0 z-20"
                aria-label="Google Maps Link"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
