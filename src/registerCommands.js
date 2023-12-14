import { REST, Routes } from "discord.js";

/** 
To register commands type in terminal: node src/registerCommands.js
*/
const commands = [
  {
    name: "month",
    description: "Will response with this month upcoming events",
  },
  {
    name: "week",
    description: "Will response with this week upcoming events",
  },
  {
    name: "big",
    description: "Will response with upcoming Big Games",
  },
];
const mySecret = process.env["TOKEN"];
const myClientId = process.env["CLIENT_ID"];
const myGuildId = process.env["GUILD_ID"];

const rest = new REST({ version: "10" }).setToken(mySecret);
(async () => {
  try {
    console.log("🟡 Registering slash commands...");
    await rest.put(Routes.applicationGuildCommands(myClientId, myGuildId), {
      body: commands,
    });

    console.log("✅ Slash commands registration successfull");
  } catch (e) {
    console.log(`🔺 Error: ${e}`);
  }
})();
