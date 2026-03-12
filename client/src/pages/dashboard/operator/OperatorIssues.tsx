import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../../services/api";

const postIssue = async (description: string) => {
  const response = await api.post("/operator/issues", { description });
  return response.data;
};

export default function OperatorIssues() {
  const [issue, setIssue] = useState("");

  const mutation = useMutation({
    mutationFn: postIssue,
    onSuccess: () => {
      alert("Issue reported successfully!");
      setIssue("");
    },
    onError: () => {
      alert("Failed to report issue. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!issue.trim()) return; 
    
    mutation.mutate(issue);
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Report Issue</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor="issue-description" className="font-semibold text-gray-700">
          Describe the issue
        </label>
        
        <textarea
          id="issue-description"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className="border w-full p-2 mb-3"
          placeholder="Pump 3 is leaking..."
          disabled={mutation.isPending}
          required
        />

        <button
          type="submit"
          disabled={mutation.isPending || !issue.trim()}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </>
  );
}