import User from "../../models/user";
import { connectMongo } from "../../utils/connectMongo";
import { connectToDatabase } from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function addUser(req, res) {
  //
  // GET
  //
  if (req.method === "GET") {
    try {
      await connectMongo();
      const users = await User.find();

      res.json({ users });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
  //
  // POST
  //
  else if (req.method == "POST") {
    try {
      await connectMongo();

      const user = await User.create(req.body);

      res.json({ user });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  } else if (req.method == "PUT") {
    try {
      const { db } = await connectToDatabase();
      const temp = req.body;
      console.log(temp);
      const em = temp.user.email;
      const un = temp.user.username;
      const fn = temp.user.firstname;
      const ln = temp.user.lastname;
      //console.log(em);
      const u = await db
        .collection("users")
        .updateOne(
          { email: em },
          { $set: { username: un, firstname: fn, lastname: ln } }
        );
      console.log(u);
      res.json({ u });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
}
