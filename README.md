# TradeLens - AI-Powered Analytics Platform

TradeLens is a comprehensive analytics platform built with React and Django, designed to help users make informed decisions with powerful visualization and AI-driven insights.

## Key Features

- **Modern User Interface**: Clean, responsive design with dark/light mode support
- **Real-time Analytics**: Track key metrics and visualize data with interactive charts
- **AI-Powered Insights**: Get intelligent recommendations and analysis
- **User Authentication**: Secure login and subscription management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [Python](https://www.python.org/) (3.8+)
- [MongoDB](https://www.mongodb.com/) (or access to a MongoDB instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/puskarpreconet123/tradelens.git
   cd tradelens
   ```

2. **Backend Setup**

   ```bash
   cd backend
   pip install -r requirements.txt
   # Configure your environment variables
   cp .env.example .env
   # Edit .env with your database credentials, Razorpay keys, etc.
   python manage.py runserver
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   # Configure your environment variables
   cp .env.example .env
   # Edit .env with your backend API URL
   npm start
   ```

4. **Access the Application**

   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)

## Technology Stack

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Recharts** - Charting library
- **Axios** - HTTP client

### Backend
- **Django** - Web framework
- **Django REST Framework** - API development
- **PyJWT** - Authentication
- **MongoDB** - Database

## Folder Structure

```
tradelens/
├── backend/          # Django backend
│   ├── core/         # Core Django apps
│   ├── api/          # API endpoints
│   └── ...
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   └── ...
│   └── ...
├── .gitignore
└── README.md
```

## Environment Configuration

Create a `.env` file in the `backend/` and `frontend/` directories with the following variables:

### Backend (`backend/.env`)

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=tradelens
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
JWT_SECRET=dev-secret-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=168
USD_TO_INR=83.0
```

### Frontend (`frontend/.env`)

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Running Tests

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
