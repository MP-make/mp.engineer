# Marlon Pecho - Portfolio Website

This is the professional portfolio website for Marlon Pecho, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark Mode**: Default dark theme with cyan accent colors
- **Sections**: Home, About Me, Projects, Contact
- **Functional Contact Form**: Sends emails using Resend API
- **Modern UI**: Clean, minimalistic design with smooth animations

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Email Service**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mp.engineer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local` and add your Resend API key:
     ```
     RESEND_API_KEY=your_actual_resend_api_key
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Connect your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. Configure environment variables in Vercel:
   - Go to your project settings
   - Add `RESEND_API_KEY` with your Resend API key

4. Deploy:
   - Vercel will automatically build and deploy your app
   - Your site will be available at `https://your-project-name.vercel.app`

### Domain Setup

To use the custom domain `mp.engineer`:

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add `mp.engineer` as a custom domain
4. Follow Vercel's instructions to configure DNS records with your domain registrar

## Configuration

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file
4. For production, add it to Vercel environment variables

### Customizing Content

- **Personal Info**: Update `src/app/page.tsx` with your information
- **Projects**: Modify the projects section in `page.tsx`
- **Skills**: Update the skills in the About section
- **Styling**: Adjust Tailwind classes for colors and layout

## Project Structure

```
src/
├── app/
│   ├── api/contact/route.ts    # Contact form API
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page
└── components/
    ├── ContactForm.tsx         # Contact form component
    └── Navbar.tsx              # Navigation bar
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is private and proprietary.
