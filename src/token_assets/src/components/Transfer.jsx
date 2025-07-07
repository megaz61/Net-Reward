import React, { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import { token } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";

function Transfer() {
  const [recipientId, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    loadCurrentBalance();
  }, []);

  async function loadCurrentBalance() {
    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      const balance = await token.balanceOf(principal);
      setCurrentBalance(Number(balance));
    } catch (error) {
      console.error("Error loading balance:", error);
    }
  }

  async function handleClick() {
    setMessage("");

    if (!recipientId.trim()) {
      setMessage("Please enter recipient Principal ID");
      setMessageType("error");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter valid amount");
      setMessageType("error");
      return;
    }

    setDisabled(true);
    setMessage("Processing transfer...");
    setMessageType("info");

    try {
      const recipient = Principal.fromText(recipientId);
      const amountToTransfer = Number(amount);

      const result = await token.transfer(recipient, amountToTransfer);

      setMessage(result);
      setMessageType(result.includes("successful") ? "success" : "error");

      if (result.includes("successful")) {
        setId("");
        setAmount("");
        // Refresh balance setelah transfer berhasil
        await loadCurrentBalance();
      }

    } catch (error) {
      console.error("Transfer error:", error);
      setMessage("Invalid Principal ID or network error");
      setMessageType("error");
    } finally {
      setDisabled(false);
    }
  }

  return (
    <div className="window white">
      <div className="transfer">
        {/* Current Balance Display */}
        {/* <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
          <strong>💰 Your Balance: {currentBalance.toLocaleString()} MEG</strong>
          <button
            onClick={loadCurrentBalance}
            style={{ marginLeft: "10px", padding: "2px 8px", fontSize: "11px" }}
          >
            🔄
          </button>
        </div> */}

        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientId}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter a Principal ID"
                style={{ width: "100%", fontSize: "12px" }}
                disabled={isDisabled}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to transfer"
                min="1"
                max={currentBalance}
                disabled={isDisabled}
              />
            </li>
          </ul>
        </fieldset>

        {message && (
          <div
            style={{
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
              backgroundColor:
                messageType === "success" ? "#d4edda" :
                  messageType === "error" ? "#f8d7da" :
                    "#d1ecf1",
              color:
                messageType === "success" ? "#155724" :
                  messageType === "error" ? "#721c24" :
                    "#0c5460"
            }}
          >
            {message}
          </div>
        )}

        <p className="trade-buttons">
          <button
            id="btn-transfer"
            onClick={handleClick}
            disabled={isDisabled}
            style={{
              opacity: isDisabled ? 0.6 : 1,
              cursor: isDisabled ? "not-allowed" : "pointer"
            }}
          >
            {isDisabled ? "Processing..." : "Transfer"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Transfer;