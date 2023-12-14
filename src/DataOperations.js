import Requests from "./Requests.js"

export default class DataOperations {
  async monthEvents() {


    const start = this.todayDate()
    const end = this.nextMonth()
    const MyRequests = new Requests();
    try {
      const response = await MyRequests.getEvents(start, end);
      if (!response || Object.keys(response).length === 0) {
        console.error("Empty response received or response does not contain valid data.");
        return null;
      }
      
      return response
    
    } catch (error) {
      console.error(error);
      return null
    }
  }

  async weekEvents() {
    const thisWeek = this.thisWeek()
    const start = this.todayDate()
    const end = thisWeek.end
    const MyRequests = new Requests();
    try {
      const response = await MyRequests.getEvents(start, end);
      if (!response || Object.keys(response).length === 0) {
        console.error("Empty response received or response does not contain valid data.");
        return null;
      }
      return response
    } catch (error) {
      console.error(error);
      return null
    }
  }

  async bigEvents() {
    const start = this.todayDate()
    const end = this.endOfYear()
    const MyRequests = new Requests();
    try {
      const response = await MyRequests.getEvents(start, end);
      if (!response || Object.keys(response).length === 0) {
        console.error("Empty response received or response does not contain valid data.");
        return null;
      }
      return this.filterBigGames(response)
    } catch (error) {
      console.error(error);
      return null
    }
  }
  
  thisMonth(){
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 

    const firstDayOfMonth = `${year}-${month}-01`;

    return firstDayOfMonth;
  }

  nextMonth(){
    const today = new Date();

    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');

    const firstDayOfNextMonth = `${year}-${month}-01`;

    return firstDayOfNextMonth
  }

  monthDates(){
    const now = this.thisMonth()
    const next = this.nextMonth()
    
  }

  thisWeek(){
    const today = new Date();
    const currentDay = today.getDay(); 
    const difference = today.getDate() - currentDay;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(difference);
    
    const lastDayDifference = 7 - currentDay;
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + lastDayDifference);

    // Format dates in "YYYY-MM-DD" format
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const firstDayOfWeek = formatDate(startOfWeek);
    const lastDayOfWeek = formatDate(endOfWeek);

    const weekStartEnd = {
      start: firstDayOfWeek,
      end: lastDayOfWeek
    }
    return weekStartEnd
  }


  isBig(value) {
    if (value === 0) {
      return "Common Game";
    } else if (value === 1) {
      return "Big Game";
    } else {
      return "No information";
    }
  }

  filterEventsData(resp){
    let response = []
    resp.forEach((event) => {
      response.push({
        Title: event.title,
        Date: event.start,
        Game_Class: this.isBig(event.is_big),
        url: event.url,
      });
    });

    return response
  }

  todayDate(){
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  
  }

  endOfYear(){
    const currentDate = new Date();
    const nextYear = currentDate.getFullYear() + 1;
    const firstDayNextYear = new Date(nextYear, 0, 1);
    const formattedDate = firstDayNextYear.toISOString().split("T")[0];

    return formattedDate;
  }

  filterBigGames(events){
    let response = []
    events.forEach((event) => {
      if(event.is_big === 1){
        response.push(event)
      }
    })
    return response
  }
}



