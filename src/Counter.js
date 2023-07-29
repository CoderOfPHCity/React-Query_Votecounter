import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

const fetchVotes = async () => {
  // Simulate fetching vote count from the server
  const response = await fetch("https://jsonplaceholder.typicode.com/users/");
  if (!response.ok) {
    throw new Error("Failed to fetch votes");
  }
  const data = await response.json();
  return { count: data.length }; // Use the number of users as the vote count for simulation
};

const Counter = () => {
  const [localVotes, setLocalVotes] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery("votes", fetchVotes);

  const voteMutation = useMutation(
    () => {
      // Simulate updating vote count on the server (in this case, the client-side)
      // In a real API, you'd handle the actual voting logic on the server
      return { count: localVotes + 1 };
    },
    {
      onSuccess: (data) => {
        // Update the local state and invalidate the query to refetch data
        setLocalVotes(data.count);
        queryClient.invalidateQueries("votes");
      },
      onError: (error) => {
        console.error("Failed to vote:", error);
      }
    }
  );

  const handleVote = () => {
    voteMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Votes Counter</h1>
      <p>Total Votes (Simulated): {data.count}</p>
      <p>Local Votes (Simulated): {localVotes}</p>
      <button onClick={handleVote}>Vote</button>
    </div>
  );
};

export default Counter;
