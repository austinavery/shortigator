import express, { Request } from "express";
import cryptoRandomString from "crypto-random-string";
import bodyParser from "body-parser";
import { URLMetaOutput, URLRequest, URLMeta } from "./models";
import mongoose from "mongoose";

const router = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

interface ShortyError {
  error: string;
}

router.post(
  "/api/shorty",
  async (
    req: Request<unknown, URLMetaOutput | ShortyError, Partial<URLRequest>>,
    res
  ) => {
    const fullURL = req.body.fullURL;

    // TODO: add real URL validation
    if (!fullURL) {
      return res.status(400).send({ error: "FullURL is required!" });
    }

    const urlMeta = new URLMeta({
      fullURL,
      // TODO: do we want fullURL to seed this random string?
      shortURL: cryptoRandomString({ length: 5 }),
    });

    try {
      const urlMetaOutput = await urlMeta.save();

      return res.send(urlMetaOutput);
    } catch (e) {
      console.log(e.message);
      return res.status(500).send({ error: "Failed to save URL." });
    }
  }
);

router.get("/:shortURL", async (req, res) => {
  const shortURL = req.params.shortURL;

  try {
    const urlMetaValues = await URLMeta.find({ shortURL });

    if (urlMetaValues.length === 0) {
      return res.status(500).send({ error: "No matches found." });
    }

    if (urlMetaValues.length > 1) {
      return res.status(500).send({ error: "Found more than one URL match." });
    }

    const urlMeta = urlMetaValues.shift();

    return res.redirect(urlMeta.fullURL);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ error: "Failed to retrieve URL." });
  }
});

router.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
