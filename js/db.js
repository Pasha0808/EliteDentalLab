/* ==========================================================================
   Elite Dental Lab — db.js  (DEMO DATABASE)

   ⚠️ Temporary demo data used only while js/config.js is not yet connected
   to Supabase. Everything here is PUBLIC.

   PRIVACY BY DESIGN: cases contain NO patient information — they are
   identified by lab case number + tooth number only. Keep it that way
   in the real database too.
   ========================================================================== */

window.EDL_DB = {
  offices: [
    { id: "off-smith",  name: "Smith Family Dental" },
    { id: "off-towson", name: "Towson Smiles" }
  ],

  users: [
    {
      username: "drsmith",
      email: "drsmith@demo.test",
      password: "demo123",
      name: "Dr. Sarah Smith",
      role: "office",
      office_id: "off-smith"
    },
    {
      username: "drjones",
      email: "drjones@demo.test",
      password: "demo123",
      name: "Dr. Michael Jones",
      role: "office",
      office_id: "off-towson"
    },
    {
      username: "elitelab",
      email: "admin@demo.test",
      password: "admin123",
      name: "Elite Lab Admin",
      role: "admin",
      office_id: null
    }
  ],

  statuses: ["Received", "In Design", "In Production", "Quality Check", "Shipped"],

  restorations: [
    "Zirconia Crown", "E-MAX Crown", "PFM Crown", "Bridge", "Veneer",
    "Implant Crown", "Custom Abutment", "Hybrid Denture", "Full Denture",
    "Partial Denture", "Flipper", "Night Guard", "Clear Aligner", "Other"
  ],

  cases: [
    {
      id: "demo-1",
      case_number: "EDL-1042",
      office_id: "off-smith",
      doctor: "Dr. Sarah Smith",
      tooth: "#14",
      restoration: "Zirconia Crown",
      received: "2026-07-06",
      due: "2026-07-17",
      status: "In Production",
      notes: "Shade A2."
    },
    {
      id: "demo-2",
      case_number: "EDL-1043",
      office_id: "off-smith",
      doctor: "Dr. Sarah Smith",
      tooth: "#7–#10",
      restoration: "Veneer",
      received: "2026-07-08",
      due: "2026-07-21",
      status: "In Design",
      notes: "E-MAX, shade BL2."
    },
    {
      id: "demo-3",
      case_number: "EDL-1044",
      office_id: "off-smith",
      doctor: "Dr. Sarah Smith",
      tooth: "Upper arch",
      restoration: "Full Denture",
      received: "2026-06-30",
      due: "2026-07-14",
      status: "Shipped",
      notes: "Shipped via UPS."
    },
    {
      id: "demo-4",
      case_number: "EDL-1045",
      office_id: "off-towson",
      doctor: "Dr. Michael Jones",
      tooth: "Full arch",
      restoration: "Night Guard",
      received: "2026-07-10",
      due: "2026-07-18",
      status: "Received",
      notes: "Hard pressed."
    },
    {
      id: "demo-5",
      case_number: "EDL-1046",
      office_id: "off-towson",
      doctor: "Dr. Michael Jones",
      tooth: "#30",
      restoration: "Implant Crown",
      received: "2026-07-03",
      due: "2026-07-16",
      status: "Quality Check",
      notes: "Screw-retained, Nobel Biocare platform."
    }
  ]
};
