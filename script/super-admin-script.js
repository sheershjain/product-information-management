const { sequelize } = require("../models");
const models = require("../models");
const prompt = require("prompt");
const colors = require("@colors/colors/safe");
const { hash } = require("bcrypt");

async function admin() {
  await prompt.start();

  await prompt.get(
    [
      {
        name: "name",
        required: true,
      },
      {
        name: "email",
        required: true,
      },
      {
        name: "password",
        hidden: true,
        conform: function (value) {
          return true;
        },
      },
    ],
    async function (err, result) {
      const t = await sequelize.transaction();
      try {
        const data = await models.User.create(
          {
            name: result.name,
            email: result.email,
            password: await hash(result.password, 10),
            role:"SADM"
          },
          { transaction: t }
        );
        console.log(colors.cyan("You are good to go."));
        await t.commit();
      } catch (error) {
          console.log(error);
        await t.rollback();
      }
    }
  );
}

admin();
