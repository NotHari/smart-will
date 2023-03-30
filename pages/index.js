import Head from "next/head";
import { useState, useEffect } from "react";
import Web3 from "web3";
import smartwill from "../blockchain/will";
import "bulma/css/bulma.css";
import styles from "../styles/smartWill.module.css";

const smartWill = () => {
  const [error, setError] = useState("");

  const [balance, setBalance] = useState("");
  const [benefeciary, setBenefeciary] = useState("");
  const [inactivityTime, setInactivityTime] = useState("");
  const [lastAccess, setLastAccess] = useState("");
  const [owner, setOwner] = useState("");
  const [willExpiry, setWillExpiry] = useState("");
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("");
  const [difference, setDifference] = useState("");
  const [value, setValue] = useState("");

  const [web, setWeb3] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    getBenefeciary();
    getOwner();
    getInactivityTime();
    getLastAccess();
    getWillExpiry();
    getBalanceHandler();
  });

  const getBalanceHandler = async () => {
    const balance = await smartwill.methods.getBalance().call();
    setBalance(balance / Math.pow(10, 18));
  };

  const getBenefeciary = async () => {
    const benefeciary = await smartwill.methods.beneficiary().call();
    setBenefeciary(benefeciary);
  };

  const getOwner = async () => {
    const owner = await smartwill.methods.owner().call();
    setOwner(owner);
  };

  const getInactivityTime = async () => {
    const inactivityTime = await smartwill.methods.inactivityTime().call();
    switch (inactivityTime) {
      case "10":
        setInactivityTime("10 seconds");
        break;
      case "3600":
        setInactivityTime("1 hour");
        break;
      case "2629743":
        setInactivityTime("1 month");
        break;
      case "31556926":
        setInactivityTime("1 year");
        break;
      case "157784630":
        setInactivityTime("5 years");
        break;
    }
  };

  const getLastAccess = async () => {
    const lastAccess = await smartwill.methods.lastAccess().call();
    var a = new Date(lastAccess * 1000);
    const humanDateFormat = a.toLocaleString();

    setLastAccess(humanDateFormat);
  };

  const getWillExpiry = async () => {
    const willExpiry = await smartwill.methods.willExpiry().call();
    var a = new Date(willExpiry * 1000);
    const humanDateFormat = a.toLocaleString();

    setWillExpiry(humanDateFormat);
  };

  const updateAddress = (event) => {
    setAddress(event.target.value);
  };

  const updateValue = (event) => {
    setValue(event.target.value);
  };

  const updateTime = (event) => {
    setTime(event.target.value);
  };

  const updateInactivityTime = (event) => {
    const chosen = event.target.value;
    switch (chosen) {
      case "10 seconds":
        setDifference(10);
        break;
      case "1 hour":
        setDifference(3600);
        break;
      case "1 month":
        setDifference(2629743);
        break;
      case "1 year":
        setDifference(31556926);
        break;
      case "5 years":
        setDifference(157784630);
        break;
    }
  };

  const updateBenefeciaryHandler = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      window.ethereum.on("accountsChanged", function (accounts) {
        console.log("acct is " + accounts[0]);
      });

      await smartwill.methods.setBeneficiary(address).send({
        from: account,
      });
      location.reload();
    } catch (err) {
      alert("Not the Owner");
    }
  };

  const updateExpiryTimeHandler = async () => {
    try {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setAccount(account);
      const date = new Date(time).getTime() / 1000;
      await smartwill.methods.setWillExpiry(date).send({
        from: account,
      });
      location.reload();
    } catch (err) {
      setError("Not the Owner");
    }
  };

  const updateInactivityTimeHandler = async () => {
    try {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setAccount(account);
      await smartwill.methods.setInactivityTime(difference).send({
        from: account,
      });
      location.reload();
    } catch (err) {
      setError("Not the Owner");
    }
  };

  const updateLastAccessHandler = async () => {
    try {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setAccount(account);
      await smartwill.methods.setLastAccess().send({
        from: account,
      });
      location.reload();
    } catch (err) {
      setError("Not the Owner");
    }
  };

  const transferFundsHandler = async () => {
    try {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setAccount(account);
      await smartwill.methods.transferFunds(value).send({
        from: account,
      });
      location.reload();
    } catch (err) {
      alert("Balance insufficient");
    }
  };

  const connectWalletHandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);

        setAccount(accounts[0]);
      } catch (err) {
        setError(err.message);
      }
    } else {
      console.log("Please install Metamask");
    }
  };

  return (
    <div className={styles.main}>
      <Head>
        <title>Smart Will</title>
        <meta name="description" content="Crypto-asset management app" />
      </Head>
      <nav className="navbar mt-4 mb-4">
        <div className="container">
          <div className="navbar-brand">
            <h1>Smart Will</h1>
          </div>
          <div className="navbar-end">
            <button
              onClick={connectWalletHandler}
              className="button is-primary"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>
      <section>
        <div className="container">
          <table className="table is-hoverable ">
            <tbody>
              <tr>
                <th>Contract Balance</th>
                <td>{balance} ETH</td>
              </tr>
              <tr>
                <th>Benefeciary Address</th>
                <td>{benefeciary}</td>
              </tr>
              <tr>
                <th>Owner Address</th>
                <td>{owner}</td>
              </tr>
              <tr>
                <th>Inactivity Time</th>
                <td>{inactivityTime}</td>
              </tr>
              <tr>
                <th>Will Expiry</th>
                <td>{willExpiry}</td>
              </tr>
              <tr>
                <th>Last Access Time</th>
                <td>{lastAccess}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-5">
        <div className="container">
          <div className="columns">
            <div className="column is-two-sixths">
              <div className="field">
                <label className="label mb-0">Set Benefeciary Address:</label>
                <div className="control"></div>
              </div>
            </div>
            <div className="column is-two-thirds">
              <input
                onChange={updateAddress}
                className="input is-rounded"
                type="type"
                placeholder="0x0000000000000000000000000000000000000000"
              ></input>
            </div>
            <div className="column is-one-sixths">
              <button
                onClick={updateBenefeciaryHandler}
                className="button is-warning is-rounded"
              >
                setBenefeciary()
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-2">
        <div className="container">
          <div className="columns">
            <div className="column is-two-sixths">
              <div className="field">
                <label className="label mb-0">Set Inactivity Time:</label>
                <div className="control"></div>
              </div>
            </div>
            <div className="column is-two-thirds">
              <input
                type="radio"
                name="inactivity"
                className="pr-4"
                onChange={updateInactivityTime}
                value="10 seconds"
              />
              10 seconds &nbsp;
              <input
                type="radio"
                name="inactivity"
                className="pr-4"
                onChange={updateInactivityTime}
                value="1 hour"
              />
              1 hour &nbsp;
              <input
                type="radio"
                name="inactivity"
                className="pr-4"
                onChange={updateInactivityTime}
                value="1 month"
              />
              1 month &nbsp;
              <input
                type="radio"
                name="inactivity"
                className="pr-4"
                onChange={updateInactivityTime}
                value="1 year"
              />
              1 year &nbsp;
              <input
                type="radio"
                name="inactivity"
                className="pr-4"
                onChange={updateInactivityTime}
                value="5 years"
              />
              5 years &nbsp;
            </div>
            <div className="column is-one-sixths">
              <button
                onClick={updateInactivityTimeHandler}
                className="button is-warning mt-2 is-rounded"
              >
                setInactivityTime()
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-2">
        <div className="container">
          <div className="columns">
            <div className="column is-two-sixths">
              <div className="field">
                <label className="label mb-0">Set Will Expiry:</label>
                <div className="control"></div>
              </div>
            </div>
            <div className="column is-two-thirds">
              <input
                onChange={updateTime}
                className="input is-rounded"
                type="datetime-local"
                placeholder="0x0000000000000000000000000000000000000000"
              ></input>
            </div>
            <div className="column is-one-sixths">
              <button
                onClick={updateExpiryTimeHandler}
                className="button is-warning mt-2 is-rounded"
              >
                setWillExpiry()
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-2">
        <div className="container">
          <div className="columns">
            <div className="column is-2">
              <div className="field">
                <label className="label mb-0">Set Last Access:</label>
                <div className="control"></div>
              </div>
            </div>
            <div className="column is-2">
              <button
                onClick={updateExpiryTimeHandler}
                className="button is-warning mt-2 is-rounded"
              >
                setLastAccess()
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-2">
        <div className="container">
          <div className="columns">
            <div className="column is-two-sixths">
              <div className="field">
                <label className="label mb-0">Transfer Funds:</label>
                <div className="control"></div>
              </div>
            </div>
            <div className="column is-two-thirds">
              <input
                onChange={updateValue}
                className="input  is-rounded"
                type="type"
                placeholder="0x0000000000000000000000000000000000000000"
              ></input>
            </div>
            <div className="column is-one-sixths">
              <button
                onClick={transferFundsHandler}
                className="button is-danger mt-2 is-rounded"
              >
                transferFunds()
              </button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container has-text-danger">
          <p>{error}</p>
        </div>
      </section>
    </div>
  );
};

export default smartWill;
