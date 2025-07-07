import React, { useCallback, useState } from "react";
import { Principal } from "@dfinity/principal";
import { token } from "../../../declarations/token";

function Balance() {
  const [inputValue, setInput] = useState("");
  const [balanceResult, setBalance] = useState("");
  const [cryptoSymbol, setSymbol] = useState("");
  const [error, setError] = useState("");

  async function handleClick() {
    try {
      // Ensure that the input is a valid Principal ID
      const principal = Principal.fromText(inputValue);

      // Fetch balance of the entered principal
      const balance = await token.balanceOf(principal);
      setBalance(balance.toString());

      // Fetch the symbol for the token (MEG)
      const symbol = await token.getSymbol();
      setSymbol(symbol);

      // Reset any previous error message
      setError("");
    } catch (err) {
      // Handle error (e.g., invalid Principal input)
      setError("Invalid Principal ID. Please try again.");
      setBalance(""); // Reset balance display
    }
  }

  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={(e) => setInput(e.target.value)} // Update input value
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      {/* Display balance result or error message */}
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>This account has a balance of {balanceResult} {cryptoSymbol}</p>
      )}
    </div>
  );
}

export default Balance;
