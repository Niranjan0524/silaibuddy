# Silaibuddy Tailor Onboarding Frontend

A comprehensive multi-step onboarding form for tailors built with React, Vite, and modern web technologies.

## Features

- **9-Step Onboarding Process**: Complete tailor profile creation
- **Mobile-First Design**: Responsive UI optimized for all devices
- **Real-time Validation**: Form validation with Zod schemas
- **Auto-save**: Automatic saving to localStorage and mock API
- **File Upload**: Portfolio and identity document uploads
- **State Management**: Zustand for global state management
- **Modern UI**: shadcn/ui components with Tailwind CSS

## Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Form Management**: React Hook Form
- **Validation**: Zod
- **State Management**: Zustand
- **API State**: TanStack Query (React Query)
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   └── ui/              # Reusable UI components (shadcn/ui)
├── pages/
│   ├── onboarding/      # Onboarding step components
│   └── TermsAndConditions.jsx
├── layouts/
│   └── OnboardingLayout.jsx
├── store/
│   └── onboarding.js    # Zustand store
├── schemas/
│   └── onboarding.js    # Zod validation schemas
├── api/
│   └── onboarding.js    # Mock API functions
├── lib/
│   └── utils.js         # Utility functions
└── App.jsx              # Main app component
```

## Onboarding Steps

1. **Basic Info**: Personal and business details
2. **Location**: Address and location information
3. **Specialties**: Service offerings and expertise
4. **Experience**: Years of experience and capacity
5. **Portfolio**: Work samples (3-10 images)
6. **Service Details**: Pricing and delivery options
7. **Identity**: Government ID verification
8. **Payouts**: Bank account or UPI setup
9. **Review**: Final review and submission

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

## Key Features Implementation

### Form Validation
- Zod schemas for each step with cross-field validation
- Real-time validation feedback
- Required field indicators

### State Management
- Zustand store with localStorage persistence
- Auto-save functionality with debouncing
- Progress tracking across steps

### File Uploads
- Drag-and-drop image upload
- File type and size validation
- Image preview with remove functionality
- Mock S3 upload simulation

### Responsive Design
- Mobile-first approach
- Sticky navigation footer
- Adaptive layouts for different screen sizes

### API Integration
- Mock API functions for all operations
- TanStack Query for API state management
- Error handling and loading states

## Mock API Endpoints

- `POST /api/onboarding/draft` - Create draft
- `PATCH /api/onboarding/:id` - Save step data
- `POST /api/onboarding/:id/submit` - Submit application
- `POST /api/upload` - File upload

## Customization

### Adding New Steps
1. Create component in `src/pages/onboarding/`
2. Add Zod schema in `src/schemas/onboarding.js`
3. Update routes in `src/App.jsx`
4. Update navigation in `src/layouts/OnboardingLayout.jsx`

### Styling
- Modify `tailwind.config.js` for theme customization
- Update CSS variables in `src/index.css`
- Customize component styles using Tailwind classes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
