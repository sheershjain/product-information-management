const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");
const { sequelize } = require("../models");
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const sendMail = require("../mailer/mail");
const { scrapData } = require("../scraping/scrap-data");
const { writeFile } = require("fs/promises");
const imapConfig = {
  user: process.env.EMAIL,
  password: process.env.PASSWORD,
  host: process.env.IMAP_HOST,
  port: process.env.IMAP_PORT,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
};

const mailParse = async (payload) => {
  const existingUser = await models.User.findOne({
    where: { email: payload.email },
  });
  if (!existingUser) {
    throw new Error("User not exists");
  }
  const imap = new Imap(imapConfig);
  await imap.once("ready", () => {
    imap.openBox("INBOX", false, () => {
      imap.search([["HEADER", "SUBJECT", "Product Data"]], (err, result) => {
        const f = imap.fetch(result[result.length - 1], { bodies: "" });
        f.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, async (err, parsed) => {
              const { date, attachments } = parsed;
              attachments.map(async (item) => {
                const value = item.content;
                var temp = value.toString();
                await writeFile("data.json", temp);
              });
              return parsed;
            });
          });
        });
        f.once("error", (ex) => {
          throw new Error(ex);
        });
        f.once("end", () => {
          imap.end();
        });
      });
    });
  });
  imap.once("error", (error) => {
    throw new Error(error);
  });

  imap.once("end", () => {
    console.log("Connection ended");
  });

  if (imap.state != "authenticated") {
    imap.connect();
  }
};
const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await models.User.findOne({
    where: {
      email: email
    },
  });
 console.log("innnnnnnn",user);
  if (!user) {
    throw new Error("User Not Found!");
  }
  const match = await bcrypt.compareSync(password, user.dataValues.password);
  if (!match) {
    throw new Error("Wrong email or password");
  }
  const accessToken = jwt.sign(
    { userId: user.dataValues.id },
    process.env.SECRET_KEY_ACCESS,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    }
  );
  const refreshToken = jwt.sign(
    { userId: user.dataValues.id },
    process.env.SECRET_KEY_REFRESH,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    }
  );
  return {
    id: user.id,
    email: user.email,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};
const refreshToken = async (refreshToken, userId) => {
  let newAccessToken = jwt.sign(
    { userId: userId },
    process.env.SECRET_KEY_ACCESS,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    }
  );
  return {
    accessToken: newAccessToken,
    refreshToken,
  };
};

const emailFile = async (payload) => {
  try {
    console.log(payload.email);
    const user = await models.User.findOne({
      where: { email: payload.email },
    });
    if (!user) {
      throw new Error("User Not Found!");
    }
    await sendMail({
      sendTo: payload.email,
    });
    return `Email sent successfully to  ${payload.email}`;
  } catch (error) {
    throw new Error(error);
  }
};
const createUser = async (payload) => {
  console.log("------------",payload);
  payload.password = await bcrypt.hash(payload.password, 10);
  const existingUser = await models.User.findOne({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }
  const user = await models.User.create(payload);
  if (!user) {
    throw new Error("Something went wrong");
  }
  return user;
};

const getData = async () => {
  const value = await scrapData();
  if (!value) {
    throw new Error("Something Went wrong");
  }
  return "Data Is Scraped Successfully!!!";
};

const deactivateUser = async (payload) => {
  const { userId } = payload;
  const user = await models.User.findOne({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.dataValues.role == "SADM") {
    throw new Error("Access denied");
  }

  await models.User.destroy({
    where: {
      id: userId,
    },
  });

  return "User deactivate";
};

const userDetail = async (payload) => {
  const id = payload.userId;
  const userData = await models.User.findOne({ where: { id: id } });
  if (!userData) {
    throw new Error("User Doesn't exists");
  }
  return userData;
};

const detailById = async (payload) => {
  const data = await models.User.findOne({ where: { id: payload.id } });
  if (!data) {
    throw new Error("User Doesn't exists");
  }
  if (data.dataValues.role == "SADM" || data.dataValues.role == "ADM") {
    throw new Error("You are not authorized.");
  }
  return data;
};
const userDetailById = async (payload) => {
  const data = await models.User.findOne({ where: { id: payload.id } });
  if (!data) {
    throw new Error("User Doesn't exists");
  }
  return data
};

module.exports = {
  loginUser,
  refreshToken,
  emailFile,
  createUser,
  mailParse,
  getData,
  deactivateUser,
  userDetail,
  detailById,
  userDetailById
};
