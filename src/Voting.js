import { useState,useEffect } from "react";
import {ethers} from 'ethers';
import Connected from "./Connected";
import AddCandidate from "./AddCandidate";
const Voting = ()=>{

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract,setContract] = useState(null);
    const [account,setAccount] = useState(null);
    const [voteList,setVoteList] = useState(null);
    const [status,setStatus] = useState(true);
    const [number,setNumber] = useState(null);
    const [timeStatus,setTimeStatus] = useState(true);
    const [remainingTime,setRemainingTime] = useState('');
    const [isConnected,setIsConnected] = useState(false);
    const [candidate,setCandidate] = useState("");
    const [page,setPage] = useState(1);

       const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "addCandidate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string[]",
                    "name": "_candidateNames",
                    "type": "string[]"
                },
                {
                    "internalType": "uint256",
                    "name": "_durationInMinutes",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_candidateIndex",
                    "type": "uint256"
                }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "candidates",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "voteCount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAllVotesOfCandiates",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "voteCount",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct Voting.Candidate[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getRemainingTime",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getVotingStatus",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "voters",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "votingEnd",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "votingStart",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const contractAddress = "0xd83acd6ffc34dc1e2a32534d3c6d631c79986f54";

    useEffect( () => {
       
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
    
        return() => {
          if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          }
        }
        
      });

      useEffect(()=>{
        if (account){
        fetchRemainingTime();
        currentVotingStatus();
        canVote();
    }
      },[account])

    function handleAccountsChanged(accounts) {
        if (accounts.length > 0 && account !== accounts[0]) {
          setAccount(accounts[0]);
          setContract(null);
          setVoteList(null);
          connectWallet();
          } else {
          setIsConnected(false);
          setAccount(null);
          setContract(null); // Reset the contract on account disconnect
        }
      }


    const connectWallet = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();
            setProvider(provider);
            setSigner(signer);

            const accountAddress = await signer.getAddress();
            setAccount(accountAddress);

            console.log(accountAddress);

            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(contract);
            setIsConnected(true)
            fetchRemainingTime();
            setTimeStatus(false)

      // Start the interval to keep updating the remaining time
      const intervalId = setInterval(() => {
        fetchRemainingTime();
      }, 1000); // Update every second

      // Cleanup interval on component unmount or when account changes
      return () => clearInterval(intervalId);
           
           

        } catch (error) {
            console.error("Error connecting to wallet: ", error);
        }

    };

    const fetchVoters = async()=>{
        try{
            const voteList = await contract.getAllVotesOfCandiates()
            console.log(voteList)
            setVoteList(voteList)
        }catch(error){
            console.error("Error fetching patient records",error)
        }
    }

    const currentVotingStatus = async()=>{
        if (contract) {
            try {
              const status = await contract.getVotingStatus();
              setTimeStatus(status);
            } catch (error) {
              console.error("Error fetching voting status", error);
            }
          }
        };
        
        
        const fetchRemainingTime = async()=>{
        if (contract) {
            try {
              const Time = await contract.getRemainingTime();
              setRemainingTime(parseInt(Time, 16)); // Make sure you are parsing properly
            } catch (error) {
              console.error("Error fetching remaining time", error);
            }
          }
        };


    const vote = async(number)=>{
        const tx = await contract.vote(number);
        canVote();
    }

    const addCandidate = async()=>{
        try{
        const cand = await contract.addCandidate(candidate);
        fetchVoters()
        }catch(error){
            alert(" Account cannot add")
            }
    }

    const canVote= async()=>{
        if (contract && account) {
            try {
              const voteStatus = await contract.voters(account);
              console.log(voteStatus);
              setStatus(voteStatus);
            } catch (error) {
              console.error("Error checking vote eligibility", error);
            }
          }
        };
const changeCandidate = async(e)=>{
    setCandidate(e.target.value)
}
    
const renderCountdown = () => {
    if (remainingTime === null) {
      return <p>Loading...</p>;
    }

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return <p>Time Remaining: {minutes}m {seconds}s</p>;
  };

  const changePage = (p)=>{
    setPage(p)
    fetchVoters()
  }
    return(
        <>
        {isConnected ? (
          <div className="flex flex-col items-center p-4">
           <div className="w-full bg-gray-800 p-4 mb-8">
  <div className="w-full flex justify-between items-center">
    <div className="flex space-x-4 text-2xl">
      <button
        onClick={() => changePage(1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
      >
        Cast a Vote
      </button>
      <button
        onClick={() => changePage(2)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
      >
        Add Candidates
      </button>
    </div>
    <button
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
      onClick={()=>setIsConnected(false)}
    >
      Logout
    </button>
  </div>
</div>

            {page === 1 ? (
              <div className="w-full max-w-4xl text-xl p-6 bg-white shadow-lg rounded-lg">
                {timeStatus ? (
                  <Connected
                    account={account}
                    fetchVoters={fetchVoters}
                    remainingTime={remainingTime}
                    status={status}
                    voteList={voteList}
                    vote={vote}
                    renderCountdown={renderCountdown}
                  />
                ) : (
                  <p className="text-red-500 text-center">Finished Voting</p>
                )}
              </div>
            ) : (
              <div className="w-full max-w-4xl text-xl p-6 bg-white shadow-lg rounded-lg">
                <AddCandidate
                  addCandidate={addCandidate}
                  candidate={candidate}
                  changeCandidate={changeCandidate}
                />
                <table className="w-full mt-4 table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">#</th>
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voteList ? (
                      voteList.map((candidate, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border">{index + 1}</td>
                          <td className="px-4 py-2 border">{candidate.name}</td>
                          <td className="px-4 py-2 border">{candidate.voteCount.toNumber()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-2 border text-center">
                          No data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
            <div className="flex items-center justify-center min-h-screen">
            <button
              onClick={connectWallet}
              className="px-8 py-4 bg-green-500 text-white rounded-lg text-xl hover:bg-green-700 transition"
            >
              Connect To Wallet
            </button>
            
          </div>
          
        )}
      </>
      
    )
}

export default Voting;