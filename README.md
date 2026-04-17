⛓️ Insurance Claim Blockchain System

🚀 A full-stack decentralized insurance platform powered by Blockchain + AI

📌 Project Overview

This project is a blockchain-based insurance claim management system where users can:

Purchase insurance policies
Submit claims with documents
Get AI-based fraud detection (Google Gemini)
Store claim results on blockchain (Solidity smart contract)

Admins can review, approve, or reject claims with a transparent and immutable audit trail.

🔄 Claim Lifecycle Flow
User Signup → Buy Policy → Submit Claim → AI Verification → Admin Review → On-chain Record
🛠️ Tech Stack
Frontend
⚛️ React 18 + Vite + TypeScript
🎨 Tailwind CSS + shadcn/ui
Backend
🦁 NestJS
🗃️ Prisma + MongoDB
Blockchain
⛓️ Solidity (Smart Contracts)
🔗 Ethers.js
AI
🤖 Google Gemini AI (Fraud Detection)
Authentication
🔐 JWT + Passport
✨ Key Features
🔒 Role-Based Access (User/Admin)
🤖 AI Fraud Detection System
⛓️ Blockchain Claim Storage
📄 Policy Management
📁 IPFS Document Storage
📊 Admin Analytics Dashboard
🧾 Audit Logs
🔔 Real-time Notifications
👥 User Roles
👤 USER
Signup/Login
Buy policies
Submit claims
Track claim status
View blockchain transaction
🛡️ ADMIN
Manage policies
Review AI-verified claims
Approve/Reject claims
View analytics & logs
📁 Project Structure
Insurance-claim-blockchain/
│
├── src/                 # Frontend (React)
│   ├── pages/
│   │   ├── admin/
│   │   ├── user/
│   │   └── auth/
│   ├── components/
│   ├── hooks/
│   └── lib/
│
├── backend/             # Backend (NestJS)
│   ├── src/
│   │   ├── auth/
│   │   ├── claims/
│   │   ├── policies/
│   │   ├── blockchain/
│   │   └── prisma/
│   └── prisma/
│
└── smart-contract.sol
⛓️ Smart Contract

Main functionalities:

createPolicy() → Create policy
submitClaim() → Submit claim
approveClaim() → Approve claim (Admin only)
rejectClaim() → Reject claim (Admin only)
🗃️ Database Models
User
Policy
Claim
AI_Verification
Document (IPFS)
Audit_Log
🚀 Getting Started
1️⃣ Clone Repository
git clone https://github.com/Sujal-85/Insurance-claim-blockchain.git
cd Insurance-claim-blockchain
2️⃣ Frontend Setup
npm install
npm run dev
3️⃣ Backend Setup
cd backend
npm install
cp .env.example .env
npx prisma generate
npm run dev
⚙️ Environment Variables
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
CONTRACT_ADDRESS=
PRIVATE_KEY=
RPC_URL=
🔌 API Endpoints
Method	Endpoint	Description
POST	/auth/signup	Register user
POST	/auth/login	Login
GET	/policies	Get policies
POST	/policies	Create policy (Admin)
GET	/claims	Get claims
POST	/claims	Submit claim
PATCH	/claims/:id/approve	Approve claim
PATCH	/claims/:id/reject	Reject claim
🏷️ Claim Status
🟡 PENDING
🔵 AI_VERIFIED
🟢 APPROVED
🔴 REJECTED
📊 Future Improvements
🔗 Multi-chain support
📱 Mobile app (Flutter)
🧠 Advanced ML fraud detection
🔔 Real-time notifications
🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

📄 License

MIT License

👨‍💻 Author

Sujal Sadanand Khedekar
📞 9359742537
