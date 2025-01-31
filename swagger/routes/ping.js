/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Responds with 'Pong' to verify the server is up
 *     responses:
 *       200:
 *         description: Successful response
 */
app.get("/ping", (req, res) => {
  res.send("Pong");
});
