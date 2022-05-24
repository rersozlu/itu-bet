import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";
function App() {
  const [choice, setChoice] = useState(undefined);
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState({});
  const [contract, setContract] = useState({});
  const [amount, setAmount] = useState(0.1);

  const contractAddress = "0x1A523b07C5BbDdD1a240895DD8E780c326073495";
  async function connectWallet() {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xA86A" }],
        });
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setAccount(accounts[0]);
        await setSigner(signer);
        const betContract = new ethers.Contract(contractAddress, abi, signer);
        setContract(betContract);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function betHandler() {
    if (account && amount && choice && amount >= 0.1) {
      const avaxAmount = ethers.utils.parseEther(amount.toString());
      const txn = await contract.bet(choice, { value: avaxAmount });
      await txn.wait();
    }
  }

  useEffect(() => {
    connectWallet();
  }, []);
  return (
    <div className="App">
      <h1 className="header">BET FOR THE ITU BLOCKCHAIN ELECTIONS</h1>
      <div className="images"></div>
      <form>
        <div className="candidate">
          <img src="/imgs/alim.png" alt="alim" />
          <label htmlFor="alim">ALIM SAHIN</label>
          <input
            onClick={(e) => setChoice(e.target.id)}
            type="radio"
            id="0"
            name="election"
            value={choice}
          />
        </div>
        <div className="candidate">
          <img src="/imgs/caner.png" alt="caner" />
          <label htmlFor="caner">ZAFER GURAY GUNDUZ</label>
          <input
            onClick={(e) => setChoice(e.target.id)}
            type="radio"
            id="1"
            name="election"
            value={choice}
          />
        </div>
      </form>
      <div className="input-container">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.1"
        />
        <button onClick={async () => await betHandler()} className="btn-grad">
          BET! 💩
        </button>
      </div>
    </div>
  );
}

export default App;
