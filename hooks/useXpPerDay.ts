import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

export default function useXpPerDay() {
  const [xpPerDay, setXpPerDay] = useState<any>(0);

  const GET_REWARDS = gql`
    query {
      rewardRates(limit: 1000) {
        items {
          id
          rate
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_REWARDS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data && data.rewardRates && data.rewardRates.items.length > 0) {
      const totalRewards = data.rewardRates.items.reduce(
        (sum: any, item: any) => {
          const amount = Number(item.rate);
          return sum + (isNaN(amount) ? 0 : amount); // Ensure only valid numbers are summed
        },
        0
      );

      const xpPerDay = totalRewards * 86400;
      setXpPerDay(xpPerDay);
    }
  }, [data]);

  return { xpPerDay, loading, error };
}
