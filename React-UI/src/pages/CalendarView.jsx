import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { parseISO } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from '../api/axios';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/posts').then(res => {
      const posts = res.data.data || [];
      setEvents(posts.map(post => ({
        id: post.id,
        title: post.title,
        start: parseISO(post.scheduledTime),
        end: parseISO(post.scheduledTime),
        allDay: false,
      })));
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Scheduled Posts Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarView;