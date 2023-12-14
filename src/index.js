import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import DataOperations from "./DataOperations.js";
import APIScheduler from './APIScheduler.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", () => {
  console.log(`✅ ${client.user.tag} is online`);
  new APIScheduler(client);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case "month":
      try {
        const events = await new DataOperations().monthEvents();
        if (events === null || events.length < 1) {
        interaction.reply("Neradau jokių žaidimų šį mėnesį 😢 pabandyk: https://sratas.lt/renginiai");
        return
        }
        
        const sortByStartDate = (a, b) => {
          const dateA = new Date(a.start);
          const dateB = new Date(b.start);

          return dateA - dateB;
        };
        const response = events.sort(sortByStartDate);

        if (response !== null && response.length > 0) {
          const embeds = [];

          for (let e = 0; e < response.length; e++) {
            const embed = new EmbedBuilder()
              .setTitle(response[e].title)
              .setURL(response[e].url)
              .setDescription(`Startas: ${response[e].start}, Pabaiga: ${response[e].end}`)
              .setThumbnail(response[e].organizatorImage)
              .setColor('Random')
              .addFields(
                {
                  name: "Data",
                  value: response[e].start,
                  inline: true,
                },
                {
                  name: "žaidimo nuoroda",
                  value: response[e].url,
                  inline: true,
                }
              );

            embeds.push(embed);
          }

          if (embeds.length > 0) {
            console.log(embeds);
            await interaction.reply({ embeds });
          } else {
            interaction.reply("Can't do that right now");
            console.log("Received null or empty response");
          }
        }
      } catch (error) {
        console.error(error);
      }
      break;
      case "week":
        try {
          const events = await new DataOperations().weekEvents();
          if (events === null || events.length < 1) {
          interaction.reply("Neradau jokių žaidimų šią savaitę 😢 pabandyk: https://sratas.lt/renginiai");
          return
          }

          const sortByStartDate = (a, b) => {
            const dateA = new Date(a.start);
            const dateB = new Date(b.start);

            return dateA - dateB;
          };
          const response = events.sort(sortByStartDate);

          if (response !== null && response.length > 0) {
            const embeds = [];

            for (let e = 0; e < response.length; e++) {
              const embed = new EmbedBuilder()
                .setTitle(response[e].title)
                .setURL(response[e].url)
                .setDescription(`Startas: ${response[e].start}, Pabaiga: ${response[e].end}`)
                .setThumbnail(response[e].organizatorImage)
                .setColor('Random')
                .addFields(
                  {
                    name: "Data",
                    value: response[e].start,
                    inline: true,
                  },
                  {
                    name: "žaidimo nuoroda",
                    value: response[e].url,
                    inline: true,
                  }
                );

              embeds.push(embed);
            }

            if (embeds.length > 0) {
              console.log(embeds);
              await interaction.reply({ embeds });
            } else {
              interaction.reply("Can't do that right now");
              console.log("Received null or empty response");
            }
          }
        } catch (error) {
          console.error(error);
        }
        break;
      case "big":
        try {
          const events = await new DataOperations().bigEvents();
          if (events === null || events.length < 1) {
            interaction.reply("Neradau jokių didelių žaidimų šiais metais 😢 pabandyk: https://sratas.lt/renginiai");
            return
          }
          const sortByStartDate = (a, b) => {
            const dateA = new Date(a.start);
            const dateB = new Date(b.start);

            return dateA - dateB;
          };

          if (response !== null && response.length > 0) {
            const response = events.sort(sortByStartDate);
            const embeds = [];

            for (let e = 0; e < response.length; e++) {
              const embed = new EmbedBuilder()
                .setTitle(response[e].title)
                .setURL(response[e].url)
                .setDescription(`Startas: ${response[e].start}, Pabaiga: ${response[e].end}`)
                .setThumbnail(response[e].organizatorImage)
                .setColor('Random')
                .addFields(
                  {
                    name: "Data",
                    value: response[e].start,
                    inline: true,
                  },
                  {
                    name: "žaidimo nuoroda",
                    value: response[e].url,
                    inline: true,
                  }
                );

              embeds.push(embed);
            }

            if (embeds.length > 0) {
              console.log(embeds);
              await interaction.reply({ embeds });
            } else {
              interaction.reply("Can't do that right now");
              console.log("Received null or empty response");
            }
          }
        } catch (error) {
          console.error(error);
        }
        break;
  }
});



const mySecret = process.env["TOKEN"];
client.login(mySecret);
