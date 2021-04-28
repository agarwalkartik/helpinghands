import dbConnect from "../../../utils/dbConnect";
import Post from "../../../models/Post";
import { getSession } from "next-auth/client";

export default async function handler(req, res) {
  const { method, query } = req;
  await dbConnect();
  const session = await getSession({ req });
  switch (method) {
    case "GET":
      try {
        if (!session || !session.user || !session.user.email) {
          throw new Error("User not found");
        }
        const { postId, type } = req.query;
        const post = await Post.findById(postId);
        if (
          post &&
          post.upVotes.indexOf(session.user.email) < 0 &&
          post.downVotes.indexOf(session.user.email) < 0
        ) {
          if (type == "upvote") {
            post.upVotes.push(session.user.email);
          } else if (type == "downvote") {
            post.downVotes.push(session.user.email);
          }
          await post.save();
        } else {
          throw new Error("Post not found");
        }
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
