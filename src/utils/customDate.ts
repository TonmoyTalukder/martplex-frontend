export const custom_date = (db_date: string) => {
  const date = new Date(db_date);

  // Extract parts
  const day = date.getDate().toString().padStart(2, "0"); // "03"
  const month = date.toLocaleString("en-US", { month: "short" }); // "Jan"
  const year = date.getFullYear().toString().slice(-2); // "25"
  const hours = date.getHours().toString().padStart(2, "0"); // "16"
  const minutes = date.getMinutes().toString().padStart(2, "0"); // "31"
  // const seconds = date.getSeconds().toString().padStart(2, '0'); // "45"

  // Custom format
  const formattedDateTime = `${day} ${month}, ${year} ${hours}:${minutes}`;

  return formattedDateTime;
};
