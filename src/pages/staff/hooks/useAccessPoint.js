import { useState, useEffect } from 'react';

// SRP: solo gestiona el punto de acceso del operador (persistencia en localStorage)
export const useAccessPoint = (defaultValue = 'Puerta Principal') => {
    const [accessPoint, setAccessPoint] = useState(() => localStorage.getItem('staff_access_point') || defaultValue);

    useEffect(() => {
        localStorage.setItem('staff_access_point', accessPoint);
    }, [accessPoint]);

    return { accessPoint, setAccessPoint };
};
