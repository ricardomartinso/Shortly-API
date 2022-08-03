import { connection } from "../databases/postgres.js";
import { createUserSchema } from "../schemas/createUserSchema.js";

export async function validateCreateUser(req, res, next) {
  const user = req.body;

  const { error } = createUserSchema.validate(user, { abortEarly: false });

  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);

    console.log(errorsMessageArray);
    return res.status(422).send(errorsMessageArray);
  }

  if (user.password !== user.confirmPassword) {
    return res.status(422).send("Passwords do not match");
  }

  try {
    const { rows } = await connection.query(
      "SELECT * FROM users WHERE email = $1",
      [user.email]
    );

    if (rows.length === 1) {
      return res.status(409).send("Email already exists");
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
