import("node-fetch")
  .then((nodeFetch) => {
    const fetch = nodeFetch.default;
  })
  .catch((err) => {
    console.error(err);
  });
export default class Requests {
  
  async getEvents(start, end) {
    try {
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      const queryParams = new URLSearchParams({
        start: start,
        end: end,
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
      // console.log(jsonData);
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  }
}

