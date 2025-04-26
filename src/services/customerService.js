import { getAll } from '../repositories/customerRepository.js';

export function getCustomersAsync() { return getAll(); }
