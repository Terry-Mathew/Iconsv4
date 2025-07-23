-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update user roles" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Nominations table policies
CREATE POLICY "Anyone can create nominations" ON nominations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own nominations" ON nominations
  FOR SELECT USING (
    nominator_email = (SELECT email FROM users WHERE id = auth.uid())
    OR nominee_email = (SELECT email FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can view all nominations" ON nominations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update nominations" ON nominations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Profiles table policies
CREATE POLICY "Published profiles are viewable by everyone" ON profiles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own profiles" ON profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own profiles" ON profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profiles" ON profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Payments table policies
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own payments" ON payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update payment status" ON payments
  FOR UPDATE USING (true);

CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'visitor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
