import dbConnect from "../../../utils/dbConnect";
import Post from "../../../models/Post";
import { getSession } from "next-auth/client";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const posts = await Post.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: posts });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const session = await getSession({ req });
        if (!session || !session.user || !session.user.email) {
          throw new Error("User not found");
        }
        const post = await Post.create({
          ...req.body,
          postedBy: session.user.email,
        }); /* create a new model in the database */
        res.status(201).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
