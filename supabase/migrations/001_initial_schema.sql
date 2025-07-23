-- Create custom types
CREATE TYPE user_role AS ENUM ('visitor', 'applicant', 'member', 'admin', 'super_admin');
CREATE TYPE nomination_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE profile_tier AS ENUM ('rising', 'elite', 'legacy');
CREATE TYPE profile_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE payment_status AS ENUM ('created', 'authorized', 'captured', 'refunded', 'failed');

-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'visitor',
  profile_id UUID,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nominations table
CREATE TABLE nominations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nominator_email TEXT NOT NULL,
  nominee_name TEXT NOT NULL,
  nominee_email TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  supporting_links JSONB,
  status nomination_status DEFAULT 'pending',
  assigned_tier profile_tier,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  tier profile_tier NOT NULL,
  status profile_status DEFAULT 'draft',
  slug TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  theme_settings JSONB DEFAULT '{}',
  payment_status payment_status DEFAULT 'pending',
  payment_id TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status payment_status DEFAULT 'created',
  tier profile_tier NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_nominations_status ON nominations(status);
CREATE INDEX idx_nominations_nominator_email ON nominations(nominator_email);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_tier ON profiles(tier);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_profile_id ON payments(profile_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nominations_updated_at BEFORE UPDATE ON nominations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
