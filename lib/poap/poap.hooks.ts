import { useState, useEffect } from "react";
import { PoapEvent } from "./poap.types";
import axios from "../axios";

export const usePoapEvents = () => {
  const [events, setEvents] = useState<PoapEvent[]>([]);

  const getEvents = async () => {
    const result = await axios.get("/poap/events");
    setEvents(result.data.events);
  };

  useEffect(() => {
    getEvents();
  }, []);

  return { events };
};
