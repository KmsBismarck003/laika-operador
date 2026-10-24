import { useState, useCallback } from 'react';
import api from '../../../services/api';

// SRP: solo carga los eventos publicados para el selector del operador
export const useAssignedEvents = () => {
    const [selectedEventId, setSelectedEventId] = useState('');
    const [events, setEvents] = useState([]);

    const fetchEvents = useCallback(async () => {
        try {
            const data = await api.event.getAll({ status_filter: 'published' });
            setEvents(data);
            if (data.length > 0 && !selectedEventId) {
                setSelectedEventId(data[0].id);
            }
        } catch (err) {
            console.error('Error fetching events:', err);
        }
    }, [selectedEventId]);

    return { selectedEventId, setSelectedEventId, events, fetchEvents };
};
