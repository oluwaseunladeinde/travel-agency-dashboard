import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string): string => {
    return dayjs(dateString).format("MMMM DD, YYYY");
};

export function formatNumber(num: number | string): string {
    const parsed = typeof num === 'number' ? num : parseFloat(num);
    if (isNaN(parsed)) return 'Invalid number';
    return parsed.toLocaleString('en-US');
}

export function formatCurrency(amountString: string): string {
    // 1. Strip the dollar sign
    const numericString = amountString.replace('$', '');

    // 2. Convert the numeric string to a number
    const amount = parseFloat(numericString);

    // 3. Check if the conversion was successful
    if (isNaN(amount)) {
        return 'Invalid amount';
    }

    // 4. Format the number as currency (using the user's locale by default)
    const formattedCurrency = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD', // You can change this to your desired currency code (e.g., 'NGN' for Nigerian Naira)
    }).format(amount);

    return formattedCurrency;
}


export function parseMarkdownToJson(markdownText: string): unknown | null {
    const regex = /```json\n([\s\S]+?)\n```/;
    const match = markdownText.match(regex);

    if (match && match[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }
    console.error("No valid JSON found in markdown text.");
    return null;
}

export function parseTripData(jsonString: string): Trip | null {
    try {
        const data: Trip = JSON.parse(jsonString);

        return data;
    } catch (error) {
        console.error("Failed to parse trip data:", error);
        return null;
    }
}

export function getFirstWord(input: string = ""): string {
    return input.trim().split(/\s+/)[0] || "";
}

export const calculateTrendPercentage = (
    countOfThisMonth: number,
    countOfLastMonth: number
): TrendResult => {
    if (countOfLastMonth === 0) {
        return countOfThisMonth === 0
            ? { trend: "no change", percentage: 0 }
            : { trend: "increment", percentage: 100 };
    }

    const change = countOfThisMonth - countOfLastMonth;
    const percentage = Math.abs((change / countOfLastMonth) * 100);

    if (change > 0) {
        return { trend: "increment", percentage };
    } else if (change < 0) {
        return { trend: "decrement", percentage };
    } else {
        return { trend: "no change", percentage: 0 };
    }
};

export const formatKey = (key: keyof TripFormData) => {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
};