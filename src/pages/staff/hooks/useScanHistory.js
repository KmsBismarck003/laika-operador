import { useState, useEffect, useMemo } from 'react';

// SRP: historial de escaneos (persistencia) + métricas de sesión
export const useScanHistory = () => {
    const [scanHistory, setScanHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('staff_scan_history');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error parsing scan history', e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('staff_scan_history', JSON.stringify(scanHistory));
    }, [scanHistory]);

    const pushResult = (result) => setScanHistory(prev => [result, ...prev.slice(0, 19)]);

    const markRedeemed = () => setScanHistory(prev => prev.map((item, index) =>
        index === 0
            ? { ...item, alreadyUsed: true, actionable: false, status: 'used', statusCode: 'REDEEMED_SUCCESS' }
            : item
    ));

    const sessionStats = useMemo(() => {
        const now = new Date();
        const start = new Date();
        start.setHours(now.getHours() - 1);

        return {
            total: scanHistory.length,
            valids: scanHistory.filter(h => h.status === 'valid' || h.status === 'used').length,
            invalids: scanHistory.filter(h => h.status === 'invalid').length,
            startTime: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    }, [scanHistory]);

    return { scanHistory, setScanHistory, pushResult, markRedeemed, sessionStats };
};
