// db.js for initializing the database
const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const { DATABASE_URL } = require("./config.js");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const migrationConf = {
  migrations: {
    glob: "migrations/blogs-backend_*.js",
  },
  storage: new SequelizeStorage({
    sequelize,
    tableName: "blogs_backend_migrations",
  }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);

  const migrations = await migrator.up();

  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("connected to the database");
  } catch (error) {
    console.log("failed to connect to the database");
    console.error(error);
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
