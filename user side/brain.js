// Handle form submission
document.getElementById('travelForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get the input values
    const place = document.getElementById('place').value;
    const foodPrice = parseFloat(document.getElementById('foodPrice').value);
    const travelPrice = parseFloat(document.getElementById('travelPrice').value);
    const hotelPrice = parseFloat(document.getElementById('hotelPrice').value);

    // Check if all inputs are valid
    if (place && foodPrice > 0 && travelPrice > 0 && hotelPrice > 0) {
        try {
            // 1. Check if MetaMask is installed and connected to the site
            if (typeof window.ethereum === 'undefined') {
                alert("Please install MetaMask!");
                return;
            }

            // 2. Connect to Ethereum (MetaMask)
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Request MetaMask accounts
            const signer = provider.getSigner();

            // 3. Define your contract's ABI and address
            const contractABI = [

                [
                    {
                        "inputs": [
                            {
                                "internalType": "string[3]",
                                "name": "_products",
                                "type": "string[3]"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_auctionDuration",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "constructor"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "uint256",
                                "name": "productId",
                                "type": "uint256"
                            },
                            {
                                "indexed": false,
                                "internalType": "address",
                                "name": "winner",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "winningBid",
                                "type": "uint256"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "refundAmount",
                                "type": "uint256"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "ownerFee",
                                "type": "uint256"
                            }
                        ],
                        "name": "AuctionEnded",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "uint256",
                                "name": "productId",
                                "type": "uint256"
                            },
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "user",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "BasePriceSet",
                        "type": "event"
                    },
                    {
                        "inputs": [],
                        "name": "endAuction",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "uint256",
                                "name": "productId",
                                "type": "uint256"
                            },
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "bidder",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "NewBid",
                        "type": "event"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "productId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "bidAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "placeBid",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256[3]",
                                "name": "basePrices",
                                "type": "uint256[3]"
                            }
                        ],
                        "name": "setBasePrices",
                        "outputs": [],
                        "stateMutability": "payable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "auctionEnded",
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
                        "name": "auctionEndTime",
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
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "productId",
                                "type": "uint256"
                            }
                        ],
                        "name": "getProductDetails",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "owner",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "ownerFeePercentage",
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
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "name": "products",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "benchmarkPrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lowestBid",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "lowestBidder",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "timeLeft",
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
                        "name": "user",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    }
                ]
            ];
            const contractAddress = "0xD2c50c5EEA4e79e2A7f016D0f6515A7f2A942411"; // Replace with your contract address

            // 4. Create a contract instance
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // 5. Send transaction to the contract
            const totalPrice = foodPrice + travelPrice + hotelPrice;

            // Call the contract function
            const tx = await contract.planTrip(place, foodPrice, travelPrice, hotelPrice);
            await tx.wait(); // Wait for the transaction to be mined

            // 6. Display result message on success
            const resultMessage = `You're planning to visit <strong>${place}</strong> with a food cost of <strong>${foodPrice}</strong>, travel cost of <strong>${travelPrice}</strong>, and hotel cost of <strong>${hotelPrice}</strong>. The transaction has been sent to the blockchain.`;

            // Display the result on the current page
            document.getElementById('resultMessage').innerHTML = resultMessage;
            document.getElementById('result').style.display = 'block';

            // After the result is shown, redirect to answer.html
            setTimeout(() => {
                window.location.href = "answer.html"; // Redirect to answer.html
            }, 5000); // Redirect after 5 seconds

        } catch (err) {
            console.error(err);
            alert("An error occurred while sending data to the blockchain.");
        }
    } else {
        alert("Please fill in all fields with valid values.");
    }
});
