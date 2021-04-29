import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    purpose: {
      type: String,
      index: true,
    },
    for: { type: [String], index: true },
    city: { type: String, index: true },
    contactName: { type: String },
    contactNumber: { type: String },
    secondaryContactNumber: { type: String },
    patientName: { type: String },
    patientAge: { type: Number },
    patientGender: { type: String },
    otherDetails: { type: String },
    postedBy: { type: String, index: true },
    upVotes: { type: [String], index: true },
    downVotes: { type: [String], index: true },
    isVerified: { type: Boolean, index: true },
  },
  {
    timestamps: true,
  }
);
PostSchema.index({
  purpose: "text",
  for: "text",
  contactName: "text",
  contactNumber: "text",
  secondaryContactNumber: "text",
  patientName: "text",
  patientAge: "text",
  patientGender: "text",
  otherDetails: "text",
  postedBy: "text",
  upVotes: "text",
  downVotes: "text",
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
