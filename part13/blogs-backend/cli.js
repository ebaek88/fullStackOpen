require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });
    const editedResult = blogs.map(
      (blog) => `${blog.author}: '${blog.title}', ${blog.likes} likes`,
    );
    for (const result of editedResult) {
      console.log(result);
    }
    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();
