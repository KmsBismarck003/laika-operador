import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAccessPoint } from './useAccessPoint';
import { useScanHistory } from './useScanHistory';
import { useAssignedEvents } from './useAssignedEvents';
import { useTicketVerification } from './useTicketVerification';

// Fachada: compone los hooks SRP en una sola API (misma firma que la versión monolítica,
// por lo que los consumidores existentes no cambian)
export const useStaffTerminal = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Navegación por pestañas (?tab=scanner|helpdesk|boxoffice)
    const [activeTab, setActiveTab] = useState('scanner');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['scanner', 'helpdesk', 'boxoffice'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        navigate(`/staff?tab=${tab}`);
    }, [navigate]);

    // 2-4. Lógica delegada en hooks especializados
    const { accessPoint, setAccessPoint } = useAccessPoint();
    const { scanHistory, pushResult, markRedeemed, sessionStats } = useScanHistory();
    const { selectedEventId, setSelectedEventId, events, fetchEvents } = useAssignedEvents();
    const { ticketCode, setTicketCode, verificationResult, loading, alert, setAlert, isScanning, setIsScanning, handleVerifyTicket, handleRedeemTicket, resetScanner } = useTicketVerification({ accessPoint, pushResult, markRedeemed });

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        // State
        user,
        activeTab,
        selectedEventId,
        events,
        ticketCode,
        verificationResult,
        loading,
        alert,
        scanHistory,
        isScanning,
        accessPoint,
        sessionStats,

        // Setters/Handlers
        setTicketCode,
        setSelectedEventId,
        setIsScanning,
        setAccessPoint,
        setAlert,
        handleTabChange,
        handleVerifyTicket,
        handleRedeemTicket,
        resetScanner
    };
};
