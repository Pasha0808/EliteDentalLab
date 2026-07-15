/* ==========================================================================
   Elite Dental Lab — db.js  (DEMO DATABASE)

   ⚠️ This is temporary demo data so the login and case-tracking features
   can be seen working. Everything here is PUBLIC — never put real patient
   names, real passwords or any private health information in this file.
   When ready, this will be replaced by a real secure backend
   (e.g. Firebase/Supabase) and this file will be deleted.
   ========================================================================== */

window.EDL_DB = {
  users: [
    {
      username: "drsmith",
      password: "demo123",
      name: "Dr. Sarah Smith",
      practice: "Smith Family Dental"
    },
    {
      username: "drjones",
      password: "demo123",
      name: "Dr. Michael Jones",
      practice: "Towson Smiles"
    },
    {
      username: "elitelab",
      password: "admin123",
      name: "Elite Lab Admin",
      practice: "Elite Dental Lab"
    }
  ],

  /* Case status always one of:
     "Received" → "In Design" → "In Production" → "Quality Check" → "Shipped" */
  statuses: ["Received", "In Design", "In Production", "Quality Check", "Shipped"],

  cases: [
    {
      id: "EDL-1042",
      doctor: "Dr. Sarah Smith",
      patient: "John Carter",
      type: "Zirconia Crown — #14",
      received: "2026-07-06",
      due: "2026-07-17",
      status: "In Production",
      notes: "Shade A2, adjust contact mesial."
    },
    {
      id: "EDL-1043",
      doctor: "Dr. Sarah Smith",
      patient: "Maria Lopez",
      type: "E-MAX Veneers — #7–#10",
      received: "2026-07-08",
      due: "2026-07-21",
      status: "In Design",
      notes: "Patient requests brighter shade, BL2."
    },
    {
      id: "EDL-1044",
      doctor: "Dr. Sarah Smith",
      patient: "Robert Chen",
      type: "Full Denture — Upper",
      received: "2026-06-30",
      due: "2026-07-14",
      status: "Shipped",
      notes: "Shipped via UPS, tracking sent by email."
    },
    {
      id: "EDL-1045",
      doctor: "Dr. Michael Jones",
      patient: "Emily Davis",
      type: "Night Guard — Hard",
      received: "2026-07-10",
      due: "2026-07-18",
      status: "Received",
      notes: ""
    },
    {
      id: "EDL-1046",
      doctor: "Dr. Michael Jones",
      patient: "James Wilson",
      type: "Implant Crown — #30, screw-retained",
      received: "2026-07-03",
      due: "2026-07-16",
      status: "Quality Check",
      notes: "Nobel Biocare platform."
    }
  ]
};
