const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");
const { sequelize } = require("../models");
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const sendMail = require("../mailer/mail");
const { scrapData } = require("../scraping/scrap-data");
const { writeFile } = require("fs/promises");
const redisClient = require("../helper/redis.helper");

const imapConfig = {
  user: process.env.EMAIL,
  password: process.env.PASSWORD,
  host: process.env.IMAP_HOST,
  port: process.env.IMAP_PORT,
  tls: true,
  authTimeout: 10000,
  connTimeout: 30000,
  keepalive: true,
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
   imap.once("ready", () => {
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
        f.once("start", () => {
          imap.connect();
        })
      });
    });
  });
  imap.once("error", (error) => {
    console.log("--------------------------", error);
    throw new Error(error);
  });

  imap.once("end", () => {
    console.log("Connection ended");
  });

  imap.connect();
};

const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await models.User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User Not Found!");
  }

  let key = user.id + "-refresh-token";
  let refreshToken = await redisClient.get(key);
  if (!refreshToken) {
    const match = await bcrypt.compareSync(password, user.dataValues.password);
    if (!match) {
      throw new Error("Wrong email or password");
    }
    refreshToken = jwt.sign(
      { userId: user.dataValues.id },
      process.env.SECRET_KEY_REFRESH,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }
    );
  }

  const accessToken = jwt.sign(
    { userId: user.dataValues.id },
    process.env.SECRET_KEY_ACCESS,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    }
  );

  await redisClient.set(key, refreshToken, 60 * 24);

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
  const user = await models.User.findOne({
    where: {
      id: payload.id,
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
      id: payload.id,
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
  return data;
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
  userDetailById,
};
