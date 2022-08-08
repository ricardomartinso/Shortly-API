import { connection } from "../databases/postgres.js";

export async function getRank(req, res) {
  const { rows: rank } = await connection.query(
    `SELECT u.id, u.name, COUNT("linksUser"."userId")::int as "linksCount", COALESCE(SUM("linksUser"."visitCount"),0)::int as "visitCount" FROM users AS u LEFT JOIN "linksUser" ON u.id = "linksUser"."userId" GROUP BY "linksUser"."userId", u.id ORDER BY "visitCount" DESC LIMIT 10`
  );

  res.status(200).send(rank);
}
