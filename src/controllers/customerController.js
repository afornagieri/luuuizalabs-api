import { getCustomersAsync } from "../services/customerService.js";

export async function getCustomers(_, res) {
    try {
        const result = await getCustomersAsync();
        res.json(result);
    } catch (error) {
        console.error(error);
    }
}