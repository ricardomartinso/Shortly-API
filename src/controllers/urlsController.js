import { nanoid } from "nanoid";
import { connection } from "../databases/postgres.js";

export async function createShortUrl(req, res) {
  let url = req.body.url;
  const id = req.id;
  const longUrl = url;
  const shortenedUrl = (url = nanoid(8));

  try {
    await connection.query(
      `INSERT INTO "linksUser" ("userId", url, "shortUrl", "visitCount") VALUES ($1, $2, $3, $4)`,
      [id, longUrl, shortenedUrl, 0]
    );

    res.status(201).send({ shortUrl: shortenedUrl });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getUrlById(req, res) {
  const { id } = req.params;

  try {
    const { rows: url } = await connection.query(
      `SELECT id, "shortUrl", url FROM "linksUser" WHERE id = $1`,
      [id]
    );

    if (url.length === 0) return res.sendStatus(404);

    res.status(200).send(url[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function openShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const { rows: linkUser } = await connection.query(
      `SELECT * FROM "linksUser" WHERE "shortUrl" = $1`,
      [shortUrl]
    );

    if (linkUser.length === 0) return res.sendStatus(404);

    await connection.query(
      `UPDATE "linksUser" SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1`,
      [shortUrl]
    );

    res.redirect(linkUser[0].url);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteShortUrl(req, res) {
  const { id } = req.params;
  const { accessToken: email } = req.email;

  const { rows: linkToDelete } = await connection.query(
    `SELECT * FROM "linksUser" WHERE id = $1`,
    [id]
  );
  if (linkToDelete.length === 0) return res.sendStatus(404);

  const { rows: user } = await connection.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (user[0].id !== linkToDelete[0].userId) res.sendStatus(401);

  await connection.query(`DELETE FROM "linksUser" WHERE id = $1`, [id]);

  res.sendStatus(204);
}
