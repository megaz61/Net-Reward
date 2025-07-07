import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";

actor Token {
    var owner : Principal = Principal.fromText("qn5ij-mfyp4-mnxp2-zaznn-x6jgn-j26im-auhok-wiedf-5fphn-v5cpp-cae");
    var totalSupply : Nat = 1000000000; // 1 billion tokens
    var symbol : Text = "MEG";
    var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

    // Track users yang sudah claim faucet
    var claimedUsers = HashMap.HashMap<Principal, Bool>(1, Principal.equal, Principal.hash);

    // Initialize owner balance
    balances.put(owner, totalSupply);

    public query func balanceOf(who : Principal) : async Nat {
        let balance : Nat = switch (balances.get(who)) {
            case null 0;
            case (?result) result;
        };
        return balance;
    };

    public query func getSymbol() : async Text {
        return symbol;
    };

    // Fungsi untuk check balance faucet (owner)
    public query func getFaucetBalance() : async Nat {
        switch (balances.get(owner)) {
            case null 0;
            case (?result) result;
        };
    };

    public shared (msg) func payOut() : async Text {
        let faucetAmount = 10000;

        // Check apakah user sudah pernah claim menggunakan claimedUsers
        switch (claimedUsers.get(msg.caller)) {
            case (?true) {
                return "Already Claimed";
            };
            case _ {
                // User belum pernah claim, lanjutkan
            };
        };

        // Check apakah owner/faucet masih punya cukup balance
        let ownerBalance = switch (balances.get(owner)) {
            case null 0;
            case (?result) result;
        };

        if (ownerBalance < faucetAmount) {
            return "Faucet is empty! No more tokens available.";
        };

        // Transfer dari owner ke user
        let newOwnerBalance = ownerBalance - faucetAmount;
        balances.put(owner, newOwnerBalance);

        // Set balance user (bisa ditambahkan ke balance existing)
        let currentUserBalance = switch (balances.get(msg.caller)) {
            case null 0;
            case (?result) result;
        };
        balances.put(msg.caller, currentUserBalance + faucetAmount);

        // Mark user sebagai sudah claim
        claimedUsers.put(msg.caller, true);

        Debug.print("Faucet payout: " # Nat.toText(faucetAmount) # " tokens to " # Principal.toText(msg.caller));
        Debug.print("Owner balance after payout: " # Nat.toText(newOwnerBalance));

        return "Success! You received " # Nat.toText(faucetAmount) # " MEG tokens.";
    };

    public shared (msg) func transfer(to : Principal, amount : Nat) : async Text {
        let fromBalance = switch (balances.get(msg.caller)) {
            case null 0;
            case (?result) result;
        };

        if (fromBalance < amount) {
            return "Insufficient balance. Your balance: " # Nat.toText(fromBalance) # " MEG";
        };

        let toBalance = switch (balances.get(to)) {
            case null 0;
            case (?result) result;
        };

        let newFromBalance = fromBalance - amount;
        let newToBalance = toBalance + amount;

        balances.put(msg.caller, newFromBalance);
        balances.put(to, newToBalance);

        Debug.print("Transfer: " # Nat.toText(amount) # " MEG from " # Principal.toText(msg.caller) # " to " # Principal.toText(to));
        Debug.print("Sender new balance: " # Nat.toText(newFromBalance));
        Debug.print("Recipient new balance: " # Nat.toText(newToBalance));

        return "Transfer successful! Sent " # Nat.toText(amount) # " MEG tokens.";
    };

    // Fungsi untuk menghitung total users yang sudah claim
    public query func getTotalUsers() : async Nat {
        var userCount = 0;
        for ((principal, claimed) in claimedUsers.entries()) {
            if (claimed) {
                userCount += 1;
            };
        };
        return userCount;
    };

    // Fungsi untuk menghitung sisa koin yang bisa dibagikan
    public query func getRemainingTokens() : async Nat {
        switch (balances.get(owner)) {
            case null 0;
            case (?result) result;
        };
    };

    // Fungsi tambahan untuk owner menambah dana faucet
    public shared (msg) func addFaucetFunds(amount : Nat) : async Text {
        if (msg.caller != owner) {
            return "Only owner can add faucet funds";
        };

        let currentBalance = switch (balances.get(owner)) {
            case null 0;
            case (?result) result;
        };
        let newBalance = currentBalance + amount;
        balances.put(owner, newBalance);

        return "Added " # Nat.toText(amount) # " tokens to faucet";
    };
};
