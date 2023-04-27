import "dotenv/config";
import { spawn } from "child_process";
import { connectToDatabase } from "../../../lib/mongodb";

const processResult = async (input, array) => {
  let pythonProcess;
  pythonProcess = spawn("python", [process.env.NEXT_PUBLIC_PY_PATH, input, array]);
  let data = "";
  for await (const chunk of pythonProcess.stdout) {
    // console.log("stdout chunk: " + chunk);
    data += chunk;
  }
  let error = "";
  for await (const chunk of pythonProcess.stderr) {
    console.error("stderr chunk: " + chunk);
    error += chunk;
  }
  const exitCode = await new Promise((resolve, reject) => {
    pythonProcess.on("close", resolve);
  });

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}, ${error}`);
  }

  return data;
};

function convObj2Arr(ds, mapping) {
  let sortable = [];
  for (let nam in ds) {
    sortable.push([nam, ds[nam]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  return sortable;
}

// Checks whether a Campaign is Approved or not.
const isApproved = (camp) => {
  return camp.isApproved;
};

export default async function addCampaign(req, res) {
  // PUT
  if (req.method === "PUT") {
    const name = req.body.name;
    const desc = req.body.description;
    try {
      const { db } = await connectToDatabase();

      let campaign = await db.collection("campaigns").find({}).toArray();

      // Remove unapproved campaigns
      campaign = campaign.filter(isApproved);
      // Remove the source campaign
      for (let camp of campaign) {
        if (camp.name === name) {
          campaign = campaign.filter((item) => item.name !== name);
        }
      }

      let arr = [];
      // Remove any commas if present in the name + description
      for (let camp of campaign) {
        let tempStr = camp.name + " " + camp.description + " " + camp.name;
        while (tempStr.includes(",")) {
          tempStr = tempStr.replace(",", "");
        }
        arr.push(tempStr);
      }

      // Get the similarity scores
      let data = await processResult(name + " " + desc + " " + name, arr);

      let ans = JSON.parse(data);
      let ds = {};

      for (let i = 0; i < ans.length; i++) {
        ds[campaign[i].name] = ans[i];
      }
      let dsArr = convObj2Arr(ds);
      // console.log(dsArr);
      res.json({ dsArr });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
}
