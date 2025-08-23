# Nalang.ai - AI Chat Interface

A modern, full-stack AI chat application built with Next.js 15, featuring real-time AI conversations, user authentication, and a beautiful UI powered by Nalang.ai.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS, Lucide React icons
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API via AI SDK
- **Styling**: Tailwind CSS with custom animations
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks and context

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm, npm, or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nalangai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Set up the following tables in your database:
     - `users` (handled by Supabase Auth)
     - `conversations` (id, title, user_id, created_at, updated_at)
     - `messages` (id, conversation_id, role, content, created_at)
   - Enable Row Level Security (RLS) policies

5. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nalangai/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   ├── chat/          # Chat API endpoint
│   │   └── conversations/ # Conversation management API
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   ├── sign-up/       # Sign up page
│   │   └── error/         # Auth error handling
│   ├── chat/              # Main chat interface
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── ui/                # Reusable UI components
│   └── theme-provider.tsx # Theme context provider
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── api.ts             # API client
│   ├── supabase/          # Supabase configuration
│   └── utils.ts           # Utility functions
├── public/                 # Static assets
├── styles/                 # Additional styles
└── scripts/                # Build and deployment scripts
```

## 🔧 Configuration

### Supabase Setup

1. **Database Tables**
   ```sql
   -- Conversations table
   CREATE TABLE conversations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Messages table
   CREATE TABLE messages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
     role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

   -- RLS Policies
   CREATE POLICY "Users can view own conversations" ON conversations
     FOR ALL USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own messages" ON messages
     FOR ALL USING (
       conversation_id IN (
         SELECT id FROM conversations WHERE user_id = auth.uid()
       )
     );
   ```

2. **Authentication**
   - Enable Email/Password authentication in Supabase Auth
   - Configure redirect URLs for your domain

### OpenAI Configuration

- Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- The app uses GPT-3.5-turbo by default
- You can modify the model and parameters in `app/api/chat/route.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically detect Next.js and build

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🎨 Customization

### Themes
- Modify `components/theme-provider.tsx` to add custom themes
- Update `tailwind.config.js` for custom color schemes

### AI Models
- Change the OpenAI model in `app/api/chat/route.ts`
- Add support for other AI providers (Anthropic, Google, etc.)

### UI Components
- Customize components in `components/ui/`
- Add new components following the existing pattern

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- AI integration via [AI SDK](https://sdk.vercel.ai/)

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [Supabase documentation](https://supabase.com/docs)
- Review [Next.js documentation](https://nextjs.org/docs)

---

**Happy coding! 🚀** 