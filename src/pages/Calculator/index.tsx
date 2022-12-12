import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import POMFF from "../../config/contract/abi/POMFF.json";
import axios from "axios";
import "./Calculator.scss";

const Accountpage = () => {
  const [dcpAmount, setDCPAmount] = useState<string>("");
  const [apy, setApy] = useState<string>("383025.8");
  const [purchase, setPurchase] = useState<string>("3.07");
  const [marketPrice, setMarketPrice] = useState<string>("3.07");
  const [days, setDays] = useState<string>("87");
  const [dcpPrice, setDcpPrice] = useState<string>("0");
  const [balanceUsd, setBalanceUsd] = useState<string>("0");
  const [initInv, setInitInv] = useState<string>("0");
  const [dcpReward, setDcpReward] = useState<string>("0");
  const [potReturn, setPotReturn] = useState<string>("0");

  const {REACT_APP_DEPLOYED_CONTRACT, REACT_APP_TREASURY_WALLET, REACT_APP_RPC_DOGICHAIN} = process.env;

  useEffect(() => {
    addCss();
    getData();
  }, []);

  // useEffect(() => {
  //    console.log("safuuAmount", safuuAmount, days);
  // }, [safuuAmount, days]);

  const getData = async () => {
    const provider: any = new ethers.providers.Web3Provider(
      // REACT_APP_RPC_DOGICHAIN as any
      window.ethereum as any
    )
  //   try {
  //     provider.send('eth_requestAccounts', []);
  //   } catch (error) {
  //     return error;
  //   }
  // //   // get the end user
  // const signer = provider.getSigner()
    const contract = new ethers.Contract(
        REACT_APP_DEPLOYED_CONTRACT as string,
        POMFF,
        provider
    )
  
    let priceUsd = await axios.get("https://api.dexscreener.com/latest/dex/pairs/dogechain/0xab485504F5E522BdAa81efce6320c15cC63517ED")
    let dcpbl = await contract?.balanceOf(REACT_APP_TREASURY_WALLET as string)
    let dcpblUsd = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(dcpbl)/100000)
    setDcpPrice(priceUsd.data.pair.priceUsd)
    setBalanceUsd(dcpblUsd.toString());
    // let initInvVal = parseFloat(dcpAmount)*parseFloat(priceUsd.data.pair.priceUsd);
    // setInitInv(initInvVal.toString());
  }
  const onChangeData = () => {
    if(dcpAmount){
    let initInvVal = parseFloat(dcpAmount)*parseFloat(dcpPrice);
    setInitInv(initInvVal.toString());
    let dcpR = parseFloat(dcpAmount)*Math.pow(1+0.023,parseInt(days))
    let potR = (Number(dcpPrice) * Number(dcpR)).toString()
    setDcpReward(dcpR.toString());
    setPotReturn(potR.toString());
    } else {
      setInitInv("0");
      setDcpReward("0");
      setPotReturn("0");
    }
  };  
  useEffect(() => {
    onChangeData()
  }, [dcpAmount,days]);

  const addCss = () => {
    const progress = document.querySelector(".progresss");

    progress.addEventListener("input", function () {
      const value = this.value;
      this.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${value}%, #fff ${value}%, white 100%)`;
    });
  };

  return (
    <section className="calculator-sec pb-4">
      <div className="row card-lr">
        <div className="col-md-12 col-md-12 d-flex flex-column align-items-center justify-content-center">
          <p className="header">Calculator</p>
          <p className="sub-header">Estimate your returns</p>
        </div>
        <div className="col-lg-4 col-md-12 mt-3 d-flex flex-column align-items-center justify-content-center">
          <div className="w-85 d-flex justify-content-center align-items-center flex-column">
            <p className="sub-card-title">Current POMF PRICE</p>
            <p className="sub-card-value">${dcpPrice}</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 mt-3 d-flex flex-column align-items-center justify-content-center">
          <div className="w-85 d-flex justify-content-center align-items-center flex-column">
            <p className="sub-card-title">Current APY</p>
            <p className="sub-card-value">383,025.8%</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 mt-3 d-flex flex-column align-items-center justify-content-center">
          <div className="w-85 d-flex justify-content-center align-items-center flex-column">
            <p className="sub-card-title">Your POMF Balance</p>
            <p className="sub-card-value">${balanceUsd}</p>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-contorl">
            <label>POMF Amount</label>
            <input
              onChange={(e) => setDCPAmount(e.target.value)}
              defaultValue={dcpAmount}
              type="number"
              className="noscroll"
              min={0}
            />
            <div className="input-right">Max</div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-contorl">
            <label>APY%</label>
            <input
              onChange={(e) => setApy(e.target.value)}
              defaultValue={apy}
              disabled
            />
            <div className="input-right">Current</div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-contorl">
            <label>POMF PRICE at purchase ($)</label>
            <input
              onChange={(e) => setPurchase(e.target.value)}
              // defaultValue={purchase}
              value={dcpPrice}
              disabled
            />
            <div className="input-right">Current</div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-contorl">
            <label>Future POMF market price ($)</label>
            <input
              onChange={(e) => setMarketPrice(e.target.value)}
              defaultValue={marketPrice}
              disabled
            />
            <div className="input-right">Current</div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-control-range">
            <div className="d-flex justify-content-between pe-5">
              <span className="total-days">{days} days</span>
              <span>First year: 0.02355% Pre EPOCH</span>
            </div>
            <input
              className="progresss"
              onChange={(e) => setDays(e.target.value)}
              type="range"
              min="0"
              max="365"
              value={days}
            />
          </div>
        </div>
        {/* <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-control-range">
            <span>Second year: 0.02355% Pre EPOCH</span>
            <input
            value={days}
              className="progresss"
              onChange={(e) => setDays(e.target.value)}
              type="range"
              min="174"
              max="430"
            />
          </div>
        </div> */}

        <div className="col-md-12 mt-4 bottom-sec">
          <div className="d-flex justify-content-between">
            <p>Your initial investment</p>
            <p>${initInv}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>Current wealth</p>
            <p>${initInv}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>POMF rewards estimation</p>
            <p>{dcpReward} POMF</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>Potential return</p>
            <p>${potReturn}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accountpage;
