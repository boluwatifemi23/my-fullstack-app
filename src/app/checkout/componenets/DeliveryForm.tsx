"use client";

import { useState } from "react";
import { CustomerInfo } from "../page";
import { MapPin, User, Clock } from "lucide-react";
import { isDeliverable } from "@/app/lib/deliveryZones";

const STATE_CITIES: Record<string, string[]> = {
  IL: [
    "Chicago", "Aurora", "Naperville", "Joliet", "Rockford", "Springfield",
    "Elgin", "Peoria", "Champaign", "Waukegan", "Cicero", "Evanston",
    "Schaumburg", "Bolingbrook", "Arlington Heights", "Palatine", "Skokie",
    "Des Plaines", "Orland Park", "Oak Lawn", "Berwyn", "Mount Prospect",
    "Tinley Park", "Oak Park", "Downers Grove",
  ],
  MN: [
    "Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington",
    "Brooklyn Park", "Plymouth", "St. Cloud", "Eagan", "Woodbury",
    "Maple Grove", "Coon Rapids", "Burnsville", "Apple Valley", "Edina",
    "St. Louis Park", "Minnetonka", "Mankato", "Blaine", "Maplewood",
    "Shakopee", "Richfield", "Cottage Grove", "Roseville", "Inver Grove Heights",
  ],
};

const US_STATES = ["IL", "MN"];

function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function DeliveryForm({ initial, onSubmit }: {
  initial: CustomerInfo;
  onSubmit: (info: CustomerInfo) => void;
}) {
  const [form, setForm] = useState<CustomerInfo>(initial);

  const set = (field: keyof CustomerInfo, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleStateChange = (state: string) => {
    setForm(prev => ({ ...prev, state, city: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const cities = form.state ? STATE_CITIES[form.state] || [] : [];

  const zipStatus = form.zip.length === 5
    ? isDeliverable(form.zip) ? "valid" : "invalid"
    : "none";

  const inputClass = "w-full bg-white/5 border border-white/10 focus:border-orange-500/50 focus:bg-white/8 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

     
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <User size={18} className="text-orange-400" /> Personal Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input required className={inputClass} placeholder="Jane Doe"
              value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input required type="email" className={inputClass} placeholder="jane@email.com"
              value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Phone Number *</label>
            <input required type="tel" className={inputClass} placeholder="+1 (312) 000-0000"
              value={form.phone} onChange={e => set("phone", e.target.value)} />
          </div>
        </div>
      </div>

     
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <MapPin size={18} className="text-orange-400" /> Delivery Address
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Street Address *</label>
            <input required className={inputClass} placeholder="123 Main St, Apt 4B"
              value={form.address} onChange={e => set("address", e.target.value)} />
          </div>

          
          <div>
            <label className={labelClass}>State *</label>
            <select title="Please Select" required className={inputClass + " cursor-pointer"}
              value={form.state} onChange={e => handleStateChange(e.target.value)}>
              <option value="" disabled className="bg-gray-900">Select state</option>
              {US_STATES.map(s => (
                <option key={s} value={s} className="bg-gray-900">
                  {s === "IL" ? "Illinois (IL)" : "Minnesota (MN)"}
                </option>
              ))}
            </select>
          </div>

          
          <div>
            <label className={labelClass}>City *</label>
            <select title="Please Select" required className={inputClass + " cursor-pointer"}
              value={form.city} onChange={e => set("city", e.target.value)}
              disabled={!form.state}>
              <option value="" disabled className="bg-gray-900">
                {form.state ? "Select city" : "Select state first"}
              </option>
              {cities.map(c => (
                <option key={c} value={c} className="bg-gray-900">{c}</option>
              ))}
            </select>
          </div>

         
          <div className="sm:col-span-2">
            <label className={labelClass}>ZIP Code *</label>
            <div className="relative">
              <input
                required
                className={`${inputClass} pr-10 ${
                  zipStatus === "valid" ? "border-green-500/50 focus:border-green-500/50" :
                  zipStatus === "invalid" ? "border-red-500/50 focus:border-red-500/50" : ""
                }`}
                placeholder="60601"
                maxLength={5}
                value={form.zip}
                onChange={e => set("zip", e.target.value.replace(/\D/g, ""))}
              />
              {zipStatus === "valid" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-lg font-bold">✓</span>
              )}
              {zipStatus === "invalid" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-lg font-bold">✗</span>
              )}
            </div>
            {zipStatus === "valid" && (
              <p className="text-green-400 text-xs mt-1">✓ Great! We deliver to this area.</p>
            )}
            {zipStatus === "invalid" && (
              <p className="text-red-400 text-xs mt-1">✗ Sorry, we do not deliver to this ZIP code yet.</p>
            )}
            {zipStatus === "none" && (
              <p className="text-gray-500 text-xs mt-1">We deliver to Chicago and Minnesota areas</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <Clock size={18} className="text-orange-400" /> Delivery Schedule
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Preferred Date *</label>
            <input title="Input" required type="date" min={getMinDate()}
              className={inputClass + " cursor-pointer"}
              value={form.deliveryDate} onChange={e => set("deliveryDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Preferred Time *</label>
            <select title="Please Select" required className={inputClass + " cursor-pointer"}
              value={form.deliveryTime} onChange={e => set("deliveryTime", e.target.value)}>
              <option value="" disabled className="bg-gray-900">Select time</option>
              <option value="10:00 AM - 12:00 PM" className="bg-gray-900">10:00 AM – 12:00 PM</option>
              <option value="12:00 PM - 2:00 PM" className="bg-gray-900">12:00 PM – 2:00 PM</option>
              <option value="2:00 PM - 4:00 PM" className="bg-gray-900">2:00 PM – 4:00 PM</option>
              <option value="4:00 PM - 6:00 PM" className="bg-gray-900">4:00 PM – 6:00 PM</option>
              <option value="6:00 PM - 8:00 PM" className="bg-gray-900">6:00 PM – 8:00 PM</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Special Instructions (Optional)</label>
            <textarea rows={3} className={inputClass + " resize-none"}
              placeholder="Gate code, allergies, extra napkins..."
              value={form.specialInstructions} onChange={e => set("specialInstructions", e.target.value)} />
          </div>
        </div>
      </div>

      <button type="submit"
        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95">
        Continue to Review →
      </button>
    </form>
  );
}