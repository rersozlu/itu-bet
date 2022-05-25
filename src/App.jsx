import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";
function App() {
  const [choice, setChoice] = useState(undefined);
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState({});
  const [contract, setContract] = useState({});
  const [amount, setAmount] = useState(0.1);
  const [alimBet, setAlimBet] = useState(0);
  const [refresher, setRefresher] = useState(0);
  const [zaferBet, setZaferBet] = useState(0);
  const [totalBet, setTotalBet] = useState(0);

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
    if (account && choice && amount >= 0.1) {
      const avaxAmount = ethers.utils.parseEther(amount.toString());
      const txn = await contract.bet(choice, { value: avaxAmount });
      await txn.wait();
      setRefresher((prev) => prev + 1);
    }
  }

  async function betClaimer() {
    const txn = await contract.claim();
    await txn.wait();
    setRefresher((prev) => prev + 1);
  }

  async function checkBets() {
    if (account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const viewContract = new ethers.Contract(contractAddress, abi, provider);
      const aalimBet = await viewContract.bets(account, "0");
      const alimEther = ethers.utils.formatEther(aalimBet);
      await setAlimBet(alimEther);
      const zzaferBet = await viewContract.bets(account, "1");
      const zaferEther = ethers.utils.formatEther(zzaferBet);
      await setZaferBet(zaferEther);
      const ttotalBet = await viewContract.balance();
      const totalEther = ethers.utils.formatEther(ttotalBet);
      await setTotalBet(totalEther);
    }
  }

  useEffect(() => {
    async function effectFunc() {
      await connectWallet();
      await setRefresher(10);
      await checkBets();
    }
    effectFunc();
  }, [refresher]);
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
        <div className="buttons">
          <button onClick={async () => await betHandler()} className="btn-grad">
            BET! 💩
          </button>
          <button onClick={async () => await betClaimer()} className="btn-grad">
            CLAIM
          </button>
        </div>
      </div>
      <div className="info">
        <p>Your Bets:</p>
        <p>Alim Şahin: {alimBet}</p>
        <p>Zafer Güray Gündüz: {zaferBet}</p>
        <p>Total Bets in the contract: {totalBet}</p>
      </div>
    </div>
  );
}

export default App;
