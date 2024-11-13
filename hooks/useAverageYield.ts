import { useMemo, useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

export default function useAverageYield() {
    const [averageYield, setAverageYield] = useState(0);

    const GET_REWARDS = gql`
        query {
            rewards(limit: 1000) {
                items {
                    id
                    amount
                }
            }
        }
    `;

    const { loading, error, data } = useQuery(GET_REWARDS, { fetchPolicy: 'network-only' });

    useEffect(() => {
        if (data && data.rewards && data.rewards.items.length > 0) {
            const totalAmount = data.rewards.items.reduce((sum, item) => {
                const amount = Number(item.amount);
                return sum + (isNaN(amount) ? 0 : amount); // Ensure only valid numbers are summed
            }, 0);

            console.log('totalAmount', totalAmount);

            const average = totalAmount / data.rewards.items.length;
            console.log('totalAmount', average);
            setAverageYield(average);
        }
    }, [data]);

    return { averageYield, loading, error };
}
