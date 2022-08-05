import { urlSchema } from "../schemas/urlsSchema.js";
import { connection } from "../databases/postgres.js";
export async function validateShortUrl(req, res, next) {
  const objectUrl = req.body;
  const url = req.body.url;
  const email = req.email.accessToken;

  const { error } = urlSchema.validate(objectUrl, { abortEarly: false });
  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);

    console.log(errorsMessageArray);
    return res.status(422).send(errorsMessageArray);
  }

  const { rows: user } = await connection.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  const { rows: isLinkEqual } = await connection.query(
    `SELECT url FROM "linksUser" WHERE url = $1 AND "linksUser"."userId" = $2`,
    [url, user[0].id]
  );

  if (isLinkEqual.length > 0) return res.status(422).send("Url já encurtado");

  try {
    req.id = user[0].id;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
