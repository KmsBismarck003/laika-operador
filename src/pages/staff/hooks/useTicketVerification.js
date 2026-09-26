import { useState, useCallback } from 'react';
import api from '../../../services/api';
import { useNotification } from '../../../context/NotificationContext';

// SRP: solo verify/redeem de boletos (depende de api.ticket, no de estado del panel)
export const useTicketVerification = ({ accessPoint, pushResult, markRedeemed }) => {
    const { success, error: showError } = useNotification();

    const [ticketCode, setTicketCode] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleVerifyTicket = useCallback(async (code) => {
        const codeToVerify = code || ticketCode;
        if (!codeToVerify || !codeToVerify.trim()) {
            setAlert({ type: 'error', message: 'Ingresa un código de boleto' });
            return;
        }

        setLoading(true);
        setAlert(null);
        setIsScanning(false);

        try {
            const context = {
                platform: 'WEB_OPERATOR',
                accessPoint: accessPoint
            };
            const response = await api.ticket.verify(codeToVerify, context);

            let mappedStatus = 'invalid';
            if (response.actionable || (response.valid && !response.alreadyUsed)) mappedStatus = 'valid';
            else if (response.alreadyUsed || response.statusCode === 'ALREADY_REDEEMED') mappedStatus = 'used';
            else if (response.statusCode === 'FUTURE_EVENT') mappedStatus = 'future';
            else if (response.statusCode === 'CONCLUDED_EVENT') mappedStatus = 'concluded';
            else if (response.statusCode === 'WRONG_FUNCTION') mappedStatus = 'warning';

            const result = {
                valid: response.valid || false,
                actionable: response.actionable !== undefined ? response.actionable : (response.valid && !response.alreadyUsed),
                isError: response.isError || false,
                statusCode: response.statusCode || mappedStatus,
                statusTitle: response.statusTitle || null,
                operatorMessage: response.operatorMessage || response.message || null,
                timeRemainingSeconds: response.timeRemainingSeconds || 0,
                status: mappedStatus,
                ticketCode: codeToVerify,
                eventName: response.event?.name || response.eventName || 'Evento desconocido',
                customerName: response.customer?.name || response.customerName || 'Usuario',
                ticketType: response.ticketType || response.ticket_type || 'General',
                purchaseDate: response.purchaseDate || response.purchase_date || new Date().toISOString(),
                scannedAt: new Date().toISOString(),
                alreadyUsed: response.alreadyUsed || response.already_used || false,
                ticketId: response.id || response.ticketId,
                message: response.operatorMessage || response.message
            };

            setVerificationResult(result);
            setTicketCode('');
            pushResult(result);

            if (result.actionable || (result.valid && !result.alreadyUsed)) {
                success('Boleto válido y listo para ingreso');
            } else if (result.alreadyUsed || result.statusCode === 'ALREADY_REDEEMED') {
                showError('ALERTA: Boleto YA USADO');
            } else {
                showError(result.operatorMessage || 'Boleto inválido o en estado no canjeable');
            }
        } catch (error) {
            console.error('Error al verificar:', error);
            setAlert({ type: 'error', message: error.message || 'Error de conexión' });
        } finally {
            setLoading(false);
        }
    }, [ticketCode, accessPoint, pushResult, success, showError]);

    const handleRedeemTicket = useCallback(async () => {
        if (!verificationResult || (!verificationResult.actionable && !verificationResult.valid) || verificationResult.alreadyUsed) return;
        try {
            const context = {
                platform: 'WEB_OPERATOR',
                accessPoint: accessPoint
            };
            await api.ticket.redeem(verificationResult.ticketCode, context);
            success('Entrada registrada exitosamente');
            setVerificationResult(prev => ({ ...prev, alreadyUsed: true, actionable: false, status: 'used', statusCode: 'REDEEMED_SUCCESS', statusTitle: 'INGRESO REGISTRADO' }));
            markRedeemed();
        } catch (error) {
            showError(error.message || 'Error al registrar entrada');
        }
    }, [verificationResult, accessPoint, markRedeemed, success, showError]);

    const resetScanner = useCallback(() => {
        setVerificationResult(null);
        setAlert(null);
        setTicketCode('');
        setIsScanning(true);
    }, []);

    return {
        ticketCode,
        setTicketCode,
        verificationResult,
        loading,
        alert,
        setAlert,
        isScanning,
        setIsScanning,
        handleVerifyTicket,
        handleRedeemTicket,
        resetScanner
    };
};
