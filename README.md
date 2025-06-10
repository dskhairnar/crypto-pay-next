# BasicPay - Stellar Payments Platform

A modern, feature-rich Stellar payments application built with React and Vite, demonstrating seamless integration with Stellar's ecosystem and best practices in web development.

## 🚀 Tech Stack

### Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with shadcn/ui
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Animations**: Embla Carousel, React Resizable Panels

### Stellar Integration
- **SDK**: @stellar/stellar-sdk
- **SEPs Implementation**: 
  - SEP-0010 (Web Authentication)
  - SEP-0007 (URI Scheme)
  - SEP-0006 (Deposit/Withdrawal)

## 🛠️ Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts (Stellar, Theme, etc.)
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── pages/         # Route components
└── types/         # TypeScript type definitions
```

## 🔌 API Integration

### Stellar Horizon API
- **Base URL**: `https://horizon.stellar.org`
- **Endpoints**:
  - Account details
  - Transaction history
  - Payment operations
  - Asset information

### Stellar Laboratory API
- Used for testing and development
- Provides test accounts and network access

## 🎨 UI/UX Features

### Components
- **Form Components**: Input, Select, Checkbox, Radio
- **Navigation**: Tabs, Menus, Dropdowns
- **Feedback**: Toasts, Alerts, Progress indicators
- **Data Display**: Tables, Cards, Lists
- **Modals**: Dialogs, Popovers, Tooltips

### Theme Support
- Light/Dark mode
- System preference detection
- Custom color schemes
- Responsive design

## 🔒 Security Features

- Secure key storage
- Transaction signing
- XDR encoding/decoding
- SEP-0010 authentication
- Input validation
- XSS protection

## 🚀 Performance Optimizations

- Code splitting
- Lazy loading
- Bundle optimization
- Asset compression
- Caching strategies

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Stellar account (testnet)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/crypto-pay-next.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
npm run build
```

## 📦 Dependencies

### Core Dependencies
- `@stellar/stellar-sdk`: Stellar blockchain interaction
- `@tanstack/react-query`: Data fetching and caching
- `react-router-dom`: Client-side routing
- `react-hook-form`: Form handling
- `zod`: Schema validation

### UI Dependencies
- `@radix-ui/*`: Accessible UI primitives
- `tailwindcss`: Utility-first CSS
- `shadcn/ui`: Component library
- `recharts`: Data visualization
- `lucide-react`: Icon set

### Development Dependencies
- `typescript`: Type safety
- `vite`: Build tool
- `eslint`: Code linting
- `prettier`: Code formatting
- `tailwindcss`: CSS framework

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stellar Development Foundation](https://stellar.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite](https://vitejs.dev)
- [React](https://reactjs.org)
- [Tailwind CSS](https://tailwindcss.com)
