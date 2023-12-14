import schedule from "node-schedule";
import fetch from "node-fetch";
import { EmbedBuilder } from "discord.js";

export default class APIScheduler {
  constructor(client) {
    this.client = client;
    this.lastApiResponse = [];
    this.scheduleJob();
  }

  scheduleJob() {
    //'0 */12 * * *' - every 12h
    //'*/5 * * * *' - every 5 minutes
    schedule.scheduleJob('*/55 * * * *', async () => {
      try {
        const newApiResponse = await this.makeAPICall();

        if (this.lastApiResponse.length === 0) {
          this.lastApiResponse = newApiResponse;
          return;
        }

        const addedObjects = this.findAddedObjects(newApiResponse);

        if (addedObjects.length > 0) {
          this.sendObjectsAsMessages(addedObjects);
        }

        this.lastApiResponse = newApiResponse;
      } catch (error) {
        console.error("Error during scheduled API call:", error.message);
      }
    });
  }

  async makeAPICall() {
    try {
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      const queryParams = new URLSearchParams({
        start: this.todayDate(),
        end: this.dateAfterYear(),
        _: timestamp,
      });
      const apiUrl = `https://sratas.lt/renginiai/d?${queryParams}`;
      console.log(apiUrl);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  }

  todayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  dateAfterYear() {
    const currentDate = new Date();
    const dateAfterOneYear = new Date(currentDate);
    dateAfterOneYear.setFullYear(currentDate.getFullYear() + 1);
    const formattedDate = dateAfterOneYear.toISOString().split("T")[0];
    return formattedDate;
  }

  findAddedObjects(newApiResponse) {
    return newApiResponse.filter((newObject) => {
      return !this.lastApiResponse.some((oldObject) => {
        return newObject.id === oldObject.id;
      });
    });
  }

  sendObjectsAsMessages(addedObjects) {
    const channel = this.client.channels.cache.get("939528249413881886");
    if (!channel) {
      console.error("Channel not found.");
      return;
    }

    addedObjects.forEach((addedObject) => {
      const embed = new EmbedBuilder()
        .setTitle(addedObject.title)
        .setURL(addedObject.url)
        .setDescription(`Startas: ${addedObject.start}, Pabaiga: ${addedObject.end}`)
        .setThumbnail(addedObject.organizatorImage)
        .setColor('Random')
        .addFields(
          {
            name: "Data",
            value: addedObject.start,
            inline: true,
          },
          {
            name: "žaidimo nuoroda",
            value: addedObject.url,
            inline: true,
          },
        );
      channel.send("Paskelbtas naujas žaidimas!! ╰(*°▽°*)╯");
      channel.send({ embeds: [embed] });
    });
  }
}
