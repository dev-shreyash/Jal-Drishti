import { useState } from "react";

export default function OperatorIssues() {
  const [issue, setIssue] = useState("");

  const submitIssue = async () => {
    await fetch("http://localhost:3000/operator/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: issue }),
    });

    alert("Issue reported");
    setIssue("");
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Report Issue</h1>

      <textarea
        value={issue}
        onChange={e => setIssue(e.target.value)}
        className="border w-full p-2 mb-3"
        placeholder="Describe the issue"
      />

      <button
        onClick={submitIssue}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Submit Issue
      </button>
    </>
  );
}
