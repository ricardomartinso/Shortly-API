import { connection } from "../databases/postgres.js";
export async function getUserInfos(req, res) {
  const { accessToken: email } = req.email;

  try {
    const { rows: user } = await connection.query(
      `SELECT u.id, u.name FROM users AS U WHERE email = $1`,
      [email]
    );

    if (user.length === 0) return res.sendStatus(404);

    const { rows: sumLinks } = await connection.query(
      `SELECT SUM("linksUser"."visitCount") AS "visitCount" FROM users AS u JOIN "linksUser" ON "linksUser"."userId" = u.id WHERE email = $1 GROUP BY u.id`,
      [email]
    );

    const { rows: shortenedUrls } = await connection.query(
      `SELECT l.id, l."shortUrl", l.url, l."visitCount" FROM "linksUser" AS l WHERE "userId" = $1`,
      [user[0].id]
    );

    let totalVisits;

    if (sumLinks.length === 0) {
      totalVisits = 0;
    } else {
      totalVisits = sumLinks[0].visitCount;
    }

    const userInfoObject = {
      id: user[0].id,
      name: user[0].name,
      visitCount: totalVisits,
      shortenedUrls: shortenedUrls,
    };

    res.status(200).send(userInfoObject);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
