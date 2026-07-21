import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Server started on port 3000");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
