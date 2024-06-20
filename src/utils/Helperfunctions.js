export const Lastmodifiedtime = (timestamp) => {
    if (timestamp === undefined) {
      return null;
    }
    let milliseconds = timestamp * 1000;
    const date = new Date(milliseconds);
    console.log(date.getDate(),"Date")
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;//${date.getDate().toString().padStart(2, "0")}/${date.getMonth().toString().padStart(2, "0")}/${date.getFullYear()}  
    return formattedTime;
  };