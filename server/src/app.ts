import express, { Request } from "express";
import crypto from "crypto";
import { URLMetaOutput, URLRequest, URLMeta } from "./models";

const router = express();
const port = 3000;

router.post(
  "/shorty",
  async (
    req: Request<unknown, URLMetaOutput | Error, Partial<URLRequest>>,
    res
  ) => {
    const fullURL = req.body.fullURL;

    if (!fullURL) {
      return res.status(400).send(new Error("fullURL is required."));
    }

    const urlMeta = new URLMeta({ fullURL, shortURL: crypto.randomBytes(5) });

    try {
      const urlMetaOutput = await urlMeta.save();

      return res.send(urlMetaOutput);
    } catch {
      return res.status(500).send(new Error("Failed to save URL."));
    }
  }
);

router.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
