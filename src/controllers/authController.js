export async function createUser(req, res) {
  const body = req.body;

  try {
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
