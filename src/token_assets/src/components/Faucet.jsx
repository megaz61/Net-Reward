import React, { useState, useEffect } from "react";
import { token } from "../../../declarations/token";

function Faucet() {
  const [isDisabled, setDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Gimme gimme");
  const [remainingTokens, setRemainingTokens] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Load faucet info saat component mount
  useEffect(() => {
    loadFaucetInfo();
  }, []);

  async function loadFaucetInfo() {
    try {
      const remaining = await token.getRemainingTokens();
      const users = await token.getTotalUsers();
      setRemainingTokens(Number(remaining));
      setTotalUsers(Number(users));
    } catch (error) {
      console.error("Error loading faucet info:", error);
    }
  }

  async function handleClick(event) {
    setDisabled(true);
    setButtonText("Claiming...");

    try {
      const result = await token.payOut();
      setButtonText(result);

      // Refresh faucet info setelah claim
      await loadFaucetInfo();

      setTimeout(() => {
        setDisabled(false);
        setButtonText("Gimme gimme");
      }, 3000);
    } catch (error) {
      console.error("Error claiming tokens:", error);
      setButtonText("Error occurred");
      setDisabled(false);
    }
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free MEG tokens here! Claim 10000 MEG coins to your account.</label>

      {/* Informasi Faucet - Hanya Users Claimed dan Sisa Koin */}
      <div style={{ margin: "10px 0", padding: "10px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "5px" }}>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          👥 Total Users Claimed: {totalUsers}
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          💰 Remaining Tokens: {remainingTokens.toLocaleString()} MEG
        </p>
      </div>

      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {buttonText}
        </button>
      </p>

      <button
        onClick={loadFaucetInfo}
        style={{ marginTop: "10px", padding: "5px 10px", fontSize: "12px" }}
      >
        🔄 Refresh Info
      </button>
    </div>
  );
}

export default Faucet;