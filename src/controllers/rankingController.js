import { connection } from "../databases/postgres.js";

export async function getRank(req, res) {
  const { rows: rank } = await connection.query(
    `SELECT u.id, u.name, COUNT("linksUser"."userId") as "linksCount", SUM("linksUser"."visitCount") as "visitCount" FROM users AS u JOIN "linksUser" ON u.id = "linksUser"."userId" GROUP BY "linksUser"."userId", u.id ORDER BY "visitCount" DESC LIMIT 10`
  );
  const { rows: userWithoutLinks } = await connection.query(
    `SELECT u.id, u.name FROM users AS u`
  );
  function rankingArray() {
    const rankingArray = [];

    rank.map((user) => {
      rankingArray.push({
        id: user.id,
        name: user.name,
        linksCount: user.linksCount,
        visitCount: user.visitCount,
      });
    });
    if (rankingArray.length < 10) {
      userWithoutLinks.map((userWithoutLinks) => {
        rankingArray.push({
          id: userWithoutLinks.id,
          name: userWithoutLinks.name,
          linksCount: 0,
          visitCount: 0,
        });
      });

      if (rankingArray.length === 10) return rankingArray;
    }

    return rankingArray;
  }
  const arrRank = rankingArray();

  res.status(200).send(rank);
}
