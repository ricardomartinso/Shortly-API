import { connection } from "../databases/postgres.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function createUser(req, res) {
  const user = req.body;
  const encryptedPassword = bcrypt.hashSync(user.password, 10);

  try {
    await connection.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [user.name, user.email, encryptedPassword]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function login(req, res) {
  const email = req.body.email;

  try {
    const token = jwt.sign({ accessToken: email }, process.env.ACCESS_TOKEN);

    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
