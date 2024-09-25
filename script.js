let web3;
let connectedAccount = null;

const StarDrop_contractAddress = "0x707f38BF46c7EA56e26fC0b66Af8D82509dA3a4c";
const StarDrop_contractABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "initialSupply", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "allowance", "type": "uint256" },
            { "internalType": "uint256", "name": "needed", "type": "uint256" }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            { "internalType": "uint256", "name": "balance", "type": "uint256" },
            { "internalType": "uint256", "name": "needed", "type": "uint256" }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "approver", "type": "address" }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "receiver", "type": "address" }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "account", "type": "address" }
        ],
        "name": "balanceOf",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            { "internalType": "uint8", "name": "", "type": "uint8" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function connectMetaMask(){
    // await을 이용하여 연결하기 때문에 async이용
    if(window.ethereum){
        try{
            // MetaMask 계정 연결 요청
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            // 연결된 첫 번째 계정을 가져옴
            connectedAccount = accounts[0];
            console.log("MetaMask에 연결된 계정:", connectedAccount);

            // 계정을 HTML에 표시
            document.getElementById("account").innerText = `현재 연결 된 지갑 주소\n${connectedAccount}`;
        } catch (error) {
            console.error("MetaMask 연결 오류:", error);
        }
    } else {
        alert("MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.");
    }
}

function disconnectMetaMask() {
    // 실제로 웹 페이지에서 지갑 연결을 해제하는 것은 개인이 직접 해야하기에
    // 기능적인 구현은 불가능하다 (보이는 것만 가능)
    // 계정 정보 초기화
    connectedAccount = null;
    document.getElementById("account").innerText = "No account connected";


    console.log("MetaMask 연결이 해제되었습니다.");
}

async function checkBalance() {
    if (connectedAccount) {
        try {
            // 지갑의 잔액 확인 (wei 단위)
            const balance = await web3.eth.getBalance(connectedAccount);

            // 잔액을 ETH 단위로 변환
            const balanceInEth = web3.utils.fromWei(balance, 'ether');

            // 잔액을 화면에 표시
            document.getElementById("balance").innerText = `${balanceInEth} ETH`;
        } catch (error) {
            console.error("잔액 확인 오류:", error);
        }
    } else {
        alert("먼저 MetaMask에 연결해 주세요.");
    }
}

// 토큰 전송 함수
async function sendToken() {
    console.log("토큰 전송 버튼 클릭")
    const toAddress = document.getElementById("toAddress").value;
    const amount = document.getElementById("amount").value;

    if (connectedAccount && toAddress && amount) {
        try {
            // ERC-20 토큰 계약 인스턴스 생성
            const tokenContract = new web3.eth.Contract(StarDrop_contractABI, StarDrop_contractAddress);

            // 토큰의 단위(Decimals)를 고려하여 전송할 금액 변환 (여기선 기본적으로 18자리 소수점)
            const decimals = 18; // ERC-20 기본 소수점 자리수
            const tokenAmount = web3.utils.toBN(amount * Math.pow(10, decimals)); // 토큰 양을 wei 단위로 변환

            // MetaMask를 통해 토큰 전송 트랜잭션을 전송
            const result = await tokenContract.methods.transfer(toAddress, tokenAmount).send({ from: connectedAccount });
            
            // 결과 출력
            document.getElementById("sendResult").innerText = `전송 성공: ${amount} 토큰을 ${toAddress}로 전송했습니다.`;
            console.log("전송 성공:", result);
        } catch (error) {
            console.error("토큰 전송 오류:", error);
            document.getElementById("sendResult").innerText = `전송 실패: 오류가 발생했습니다.`;
        }
    } else {
        alert("모든 입력 값을 확인해 주세요.");
    }
}

// 페이지 로드 시 Web3 인스턴스 생성
window.addEventListener('load', () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum); // Web3 인스턴스 초기화
    } else {
        alert("MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.");
    }
});

document.getElementById("connectWallet").addEventListener("click", connectMetaMask);
document.getElementById("disconnectButton").addEventListener("click", disconnectMetaMask);
document.getElementById("balanceButton").addEventListener("click", checkBalance);
document.getElementById("sendToken").addEventListener("click", sendToken);