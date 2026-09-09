/**
 * TicketService - Manejo de boletos y pagos
 */
import { apiClient } from './apiClient'

export const ticketAPI = {
    purchase: purchaseData => apiClient.post('/staff/purchase', purchaseData),
    getMyTickets: () => apiClient.get('/staff/my-tickets'),
    getBusySeats: (eventId, functionId = null) => {
        const url = functionId ? `/staff/busy-seats/${eventId}?function_id=${functionId}` : `/staff/busy-seats/${eventId}`;
        return apiClient.get(url);
    },
    verify: (ticketCodeOrObj, context = {}) => {
        const payload = typeof ticketCodeOrObj === 'object' ? ticketCodeOrObj : { ticketCode: ticketCodeOrObj, ...context };
        return apiClient.post('/staff/verify', payload);
    },
    redeem: (ticketCodeOrObj, context = {}) => {
        const payload = typeof ticketCodeOrObj === 'object' ? ticketCodeOrObj : { ticketCode: ticketCodeOrObj, ...context };
        return apiClient.post('/staff/redeem', payload);
    },
    getValidationHistory: () => apiClient.get('/staff/validations/history'),
    getTicketHistory: (ticketCode) => apiClient.get(`/staff/validations/ticket/${ticketCode}`),
    getByCode: ticketCode => apiClient.get(`/staff/${ticketCode}`),
    cancel: ticketId => apiClient.delete(`/staff/${ticketId}`),
    refund: refundData => apiClient.post('/staff/refund', refundData),
    luckySeatAssign: (eventId, data) => apiClient.post('/staff/lucky-seat/assign', { event_id: eventId, ...data }),
    resendTicket: (ticketCode) => apiClient.post(`/staff/${ticketCode}/resend`)
}

export const paymentAPI = {
    createIntent: paymentData => apiClient.post('/staff/payments/create-intent', paymentData),
    confirm: paymentId => apiClient.post(`/staff/payments/${paymentId}/confirm`),
    getHistory: () => apiClient.get('/staff/payments/history'),
    refund: paymentId => apiClient.post(`/staff/payments/${paymentId}/refund`)
}

export const refundAPI = {
    checkPolicy: eventId => apiClient.get(`/staff/refund/policy/${eventId}`),
    requestRefund: (ticketId, reason) => {
        const body = typeof ticketId === 'object'
            ? { ticket_id: ticketId.ticketId || ticketId.ticket_id, reason: ticketId.reason, detail: ticketId.detail }
            : { ticket_id: ticketId, reason: reason };
        return apiClient.post('/staff/refund/request', body);
    },
    getMyRefunds: () => apiClient.get('/staff/refund/my-refunds')
}
