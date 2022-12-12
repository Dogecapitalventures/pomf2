import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import { ethers } from "ethers";
import POMFF from "../../config/contract/abi/POMFF.json";
import { useMoralis } from 'react-moralis'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
  const [activeTime, setActiveTime] = useState<string>();
  const [treasurayAsset, setTreasurayAsset] = useState<string>("0");
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [crSupply, setCrSupply] = useState<string>("0");
  const [marketCap, setMarketCap] = useState<string>("0");
  const [firePitVal, setFirePitVal] = useState<string>("0");
  const [poolVal, setPoolVal] = useState<string>("0");
  const [connectStat, setConnectStat] = useState<boolean>(false);
  const [dcpPrice, setDcpPrice] = useState<string>();
  const [insFund, setInsFund] = useState<string>("0");
  const [initalTime, setInitalTime] = useState<string>();
  const [lastRebaseTime, setLastRebaseTime] = useState<string>();
  const [presentTime, setPresentTime] = useState<string>();
  const {REACT_APP_DEPLOYED_CONTRACT, REACT_APP_TREASURY_WALLET, REACT_APP_RPC_DOGICHAIN, REACT_APP_POOL_VALUE, REACT_APP_DCP_INSURANCE, REACT_APP_SAFEHOUSE} = process.env;

  const {
    account
} = useMoralis()

  useEffect(() => {
    getData();
    walletConnect();
  }, [account]);

  const walletConnect = () => {
    if(!account && !connectStat){
      toast.error("Please Connect you wallet!");
      setConnectStat(true);
    }
  };
  
  var formatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    // currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  

// let presentTime:Number;

const getData = async () => {
  // alert(Number("1344444324214").toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,'))

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


  let priceUsd = await axios.get("https://api.dexscreener.com/latest/dex/pairs/proofofmemes/0x94254B5eCf17AF04282a06D57337fa49D5d2d222")
  if(!priceUsd.data.pair){
    setDcpPrice("0")
  }else {
    setDcpPrice(priceUsd.data.pair.priceUsd)
  }
  let dcpbl = await contract?.balanceOf(REACT_APP_TREASURY_WALLET as string)
  let wdog = await provider?.getBalance(REACT_APP_TREASURY_WALLET as string)
  let poolVDcp = await contract?.balanceOf(REACT_APP_POOL_VALUE as string)
  let poolWdog = await provider?.getBalance(REACT_APP_POOL_VALUE as string)
  let insDcp = await contract?.balanceOf(REACT_APP_DCP_INSURANCE as string)
  let insWdog = await provider?.getBalance(REACT_APP_DCP_INSURANCE as string)
  let fireDcp = await contract?.balanceOf(REACT_APP_SAFEHOUSE as string)

  let ts = await contract?._totalSupply();
  let initTime = await contract?._initRebaseStartTime();
  let lastTime = await contract?._lastRebasedTime();
  setInitalTime((parseInt(initTime)*1000).toString());
  setLastRebaseTime((parseInt(lastTime)*1000).toString());
  // setLastRebaseTime("1663357065328");
  setTotalSupply(ts.toString());
  let cts = parseInt(ts)-(parseInt(fireDcp)/100000);
  // alert(cts)

  
  // alert(formatter.format(Math.round(cts))); /* $2,500.00 */
  // alert(cts)
  setCrSupply(cts.toString())
  setMarketCap(((Number((parseInt(crSupply))?.toString()?.slice(-6)))*parseFloat(priceUsd.data.pair.priceUsd)).toFixed(3).toString());
  // setFirePitVal((parseFloat(dcpbl)/100000).toString());
  // setBalance(ts.toString());
  // bl = await provider.getBalance("0x24B2098605289fFB826115EA0F9f8fC1ab5b816F");
  // setBalance(bl.toString());
  let dcpblU = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(dcpbl)/100000)
  let fireDcpblU = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(fireDcp)/100000)
  setFirePitVal(fireDcpblU.toString());
  let wpom = parseFloat(priceUsd.data.pair.priceUsd)*((parseFloat(wdog)/1000000000000000000) as any)
  setTreasurayAsset((dcpblU+wpom).toString())
  let poolDcpblU = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(poolVDcp)/100000)
  let poolWdoge = parseFloat(priceUsd.data.pair.priceUsd)*((parseFloat(poolWdog)/1000000000000000000) as any)
  setPoolVal((poolDcpblU+poolWdoge).toString())
  let insDcpblU = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(insDcp)/100000)
  let insWdoge = parseFloat(priceUsd.data.pair.priceUsd)*((parseFloat(insWdog)/1000000000000000000) as any)
  setInsFund((insDcpblU+insWdoge).toString())

}

useEffect(() => {
  timmerFun();
}, [initalTime]);
const timmerFun = () => {
  let h = 0;
  let m = 15;
  let s = 0;
  // alert(new Date().getTime() + ' initTime:'+ parseInt(initalTime))
  
  if(new Date().getTime() > parseInt(initalTime)) {
    let remainingTime = new Date(parseInt(lastRebaseTime) + (15 * 60 * 1000)).getTime() - new Date().getTime()
    // setPresentTime((parseInt(lastRebaseTime) - new Date().getTime()).toString());
    let rtime = new Date(remainingTime)
    m = rtime.getMinutes();
    s = rtime.getSeconds();
    // alert('hello!')
    setInterval(() => {
      s--;
      if (s < 0) {
        s = 59;
        m--;
        if (m < 0) {
          m = 59;
          h--;
          if (h < 0) {
            location.reload();
          }
        }
      }
      const time =
        ("0" + h).slice(-2) +
        ":" +
        ("0" + m).slice(-2) +
        ":" +
        ("0" + s).slice(-2);
      setActiveTime(time);
    }, 1000);

  } else {
    h = m = s = 0;
    // alert('dhuke nai!')
  }
  
  };
  return (
    <section className="dashboard-section">
      <div className="row top">
      <ToastContainer />
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column left align-items-center">
          <div className="card parallel-border-lr mx-2 mb-4">
            <div className="card-title-regular">
              Market Value of Treasury Asset
            </div>
            <div className="card-value">
              ${/*parseInt(treasurayAsset)*/}
            </div>
          </div>

        <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">Total Supply</div>
            <div className="card-value">100,000</div>
          </div>
           <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">Circulating Supply</div>
            <div className="card-value">{/*formatter.format(parseInt( String(Number(crSupply))))?.slice(-7)*/}100,000</div>
          </div>


         {/*} <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">Total Supply</div>
            <div className="card-value">{formatter.format(parseInt( String(Number(totalSupply))))?.slice(-7)}</div>
          </div>
          <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">Circulating Supply</div>
            <div className="card-value">{formatter.format(parseInt( String(Number(crSupply))))?.slice(-7)}</div>
          </div> */}
        </div>
        <div className="col-lg-4 col-md-12 middle d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex align-items-center justify-content-center flex-column">
            <div className="btn--outline card parallel-border-lr">
              POMF PRICE
            <div className="card-value1">${/*dcpPrice*/}</div>
            </div>
            <div className="card card-timmer mx-2">
              {/* <div className="card-value">$3.14</div> */}
              <div className="timer-sec d-flex">
                <div className="span">
                <span>{activeTime}</span>
                <span className="card-title-regular loading-dot mt-2">
                  Rebasing
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column left align-items-center">
          <div className="mx-2 card parallel-border-lr mb-4">
            <div className="card-title-regular">POMF Insurance Fund Value</div>
            <div className="card-value">${/*parseInt(insFund)*/}</div>
          </div>
          <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">MarketCap</div>
            <div className="card-value">${/*marketCap*/}</div>
          </div>
          <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">Pool Value</div>
            <div className="card-value">${/*parseInt(poolVal)*/}</div>
          </div>
        </div>
      </div>

      <div className="row bottom mt-2">
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column left align-items-center">
          {/* <div className="card parallel-border">
            <div className="card-title-regular"># Value of SAFEHOUSE</div>
            <div className="card-value">5,765,134.72 POMF</div>
          </div> */}
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column middle align-items-center">
          <div className="card parallel-border">
            <div className="card-title-regular">$ Value of SAFEHOUSE</div>
            <div className="card-value">${parseInt(firePitVal)}</div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column right align-items-center">
          {/* <div className="card parallel-border">
            <div className="card-title-regular">% SAFEHOUSE : Supply</div>
            <div className="card-value">24.90%</div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
