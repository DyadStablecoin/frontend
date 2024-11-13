import { useMemo, useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import useKerosenePrice from "./useKerosenePrice";

export default function useAverageYield() {
    const [averageYield, setAverageYield] = useState(0);
    const [totalLiquidity, setTotalLiquidity] = useState(0);

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

    const {kerosenePrice} = useKerosenePrice();
    const { loading, error, data } = useQuery(GET_REWARDS, { fetchPolicy: 'network-only' });

    useEffect(() => {
        if (data && data.rewards && data.rewards.items.length > 0) {
            const totalRewards = data.rewards.items.reduce((sum, item) => {
                const amount = Number(item.amount);
                return sum + (isNaN(amount) ? 0 : amount); // Ensure only valid numbers are summed
            }, 0);

            console.log('totalRewards', totalRewards * kerosenePrice /  totalLiquidity);
            console.log('kero', kerosenePrice);

        }
    }, [data, totalLiquidity]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://api.dyadstable.xyz/api/yields/0');
            const data = await response.json();
            console.log("SSSS", data); // Handle the fetched data as needed
            
            // New code to sum totalLiquidity
            const totalLiquidityValue = Object.values(data).reduce((sum, item) => {
                const liquidity = Number(item.totalLiquidity);
                return sum + (isNaN(liquidity) ? 0 : liquidity); // Ensure only valid numbers are summed
            }, 0);
            setTotalLiquidity(totalLiquidityValue); // Set the totalLiquidity state
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, []);

    return { averageYield, loading, error };
}
