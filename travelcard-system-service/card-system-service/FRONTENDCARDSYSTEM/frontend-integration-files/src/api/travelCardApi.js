import apiClient from './apiClient';

// ─────────────────────────────────────────────────────────────
// Health
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/card/ping
 * Returns a plain-text "Service is UP and Running" string.
 */
export const ping = () => apiClient.get('/api/card/ping');

// ─────────────────────────────────────────────────────────────
// Cards
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/card
 * Returns an array of all registered card number strings.
 * @returns {Promise<string[]>}
 */
export const fetchAllCards = () => apiClient.get('/api/card');

/**
 * GET /api/card/:cardNumber
 * Returns the TravelCardResponse for the given card number.
 * Response: { cardNumber, balance, inTransit, transportType }
 * @param {string} cardNumber
 */
export const getCardDetails = (cardNumber) =>
  apiClient.get(`/api/card/${encodeURIComponent(cardNumber)}`);

/**
 * POST /api/card/register
 * Registers a new travel card.
 * @param {{ cardNumber: string, balance: number }} data
 */
export const registerCard = (data) => apiClient.post('/api/card/register', data);

/**
 * POST /api/card/recharge/:rechargeAmount
 * Recharges a travel card by the given amount.
 *
 * NOTE: The backend's @RequestBody String is bound from a raw plain-text body.
 * We therefore send the card number as a text/plain string (no JSON wrapping).
 *
 * @param {string} cardNumber
 * @param {number} amount
 */
export const rechargeCard = (cardNumber, amount) =>
  apiClient.post(`/api/card/recharge/${amount}`, cardNumber, {
    headers: { 'Content-Type': 'text/plain' },
  });

// ─────────────────────────────────────────────────────────────
// Journey (swipe — used for both check-in and check-out)
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/card/swipe
 * Swipes a card at a station.
 *  - If the card is NOT in transit → treated as CHECK-IN (start journey).
 *    The maximum fare for the transport type is held on the card.
 *  - If the card IS in transit → treated as CHECK-OUT (end journey).
 *    The actual fare is calculated and deducted.
 *
 * Returns the updated TravelCardResponse.
 *
 * @param {{ cardNumber: string, stationName: string, transportType: 'TRAIN' | 'BUS' }} swipeRequest
 */
export const swipeCard = (swipeRequest) =>
  apiClient.post('/api/card/swipe', swipeRequest);

// ─────────────────────────────────────────────────────────────
// Stations & Zones
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/card/stations
 * Returns all stations with their associated fare zones.
 * Response: Array<{ stationName: string, zones: ('ONE'|'TWO'|'THREE')[] }>
 */
export const getStationsAndZones = () => apiClient.get('/api/card/stations');
