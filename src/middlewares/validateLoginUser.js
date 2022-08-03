import { connection } from "../databases/postgres.js";
import { signInSchema } from "../schemas/signInSchema.js";
import bcrypt from "bcrypt";

export async function validateLoginUser(req, res, next) {
  const user = req.body;

  const { error } = signInSchema.validate(user, { abortEarly: false });

  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);

    console.log(errorsMessageArray);
    return res.status(422).send(errorsMessageArray);
  }

  try {
    const { rows } = await connection.query(
      "SELECT * FROM users WHERE email = $1",
      [user.email]
    );

    if (rows.length === 0) {
      return res.status(401).send("Email or password wrong!");
    }
    const validPassword = bcrypt.compareSync(user.password, rows[0].password);

    if (!validPassword) {
      return res.status(401).send("Email or password wrong!");
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
