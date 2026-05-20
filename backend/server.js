require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const { Resend } = require('resend');

const app = express();
const PORT = 8001;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGORITHM = 'HS256';
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mobpae.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const mongoClient = new MongoClient(MONGO_URL);
let db;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Helpers
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function verifyPassword(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

function createAccessToken(userId, email) {
  return jwt.sign(
    { sub: userId, email, type: 'access' },
    JWT_SECRET,
    { algorithm: JWT_ALGORITHM, expiresIn: '15m' }
  );
}

function createRefreshToken(userId) {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    JWT_SECRET,
    { algorithm: JWT_ALGORITHM, expiresIn: '7d' }
  );
}

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('access_token', accessToken, {
    httpOnly: true, secure: false, sameSite: 'lax',
    maxAge: 15 * 60 * 1000, path: '/'
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true, secure: false, sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, path: '/'
  });
}

async function getCurrentUser(req, res, next) {
  let token = req.cookies.access_token;
  if (!token) {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) token = authHeader.substring(7);
  }
  if (!token) return res.status(401).json({ detail: 'Not authenticated' });
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
    if (payload.type !== 'access') return res.status(401).json({ detail: 'Invalid token type' });
    const user = await db.collection('users').findOne({ _id: new ObjectId(payload.sub) });
    if (!user) return res.status(401).json({ detail: 'User not found' });
    user.id = user._id.toString();
    delete user._id;
    delete user.password_hash;
    req.currentUser = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ detail: 'Token expired' });
    return res.status(401).json({ detail: 'Invalid token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return res.status(403).json({ detail: `${roles.join('/')} access required` });
    }
    next();
  };
}

async function sendEmail(to, subject, html) {
  if (!resend) {
    console.log('Email skipped (no Resend API key):', subject);
    return;
  }
  try {
    await resend.emails.send({ from: SENDER_EMAIL, to: [to], subject, html });
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, company_id } = req.body;
    if (!email || !password || !name || !role) return res.status(400).json({ detail: 'Missing required fields' });
    const emailLower = email.toLowerCase();
    if (await db.collection('users').findOne({ email: emailLower })) {
      return res.status(400).json({ detail: 'Email already registered' });
    }
    if (role === 'employee' && !company_id) return res.status(400).json({ detail: 'Employees must be linked to a company' });
    const userDoc = {
      email: emailLower, password_hash: await hashPassword(password), name, role,
      company_id: company_id || null, created_at: new Date(),
      status: role === 'employee' ? 'active' : 'pending'
    };
    const result = await db.collection('users').insertOne(userDoc);
    const userId = result.insertedId.toString();
    setAuthCookies(res, createAccessToken(userId, emailLower), createRefreshToken(userId));
    res.json({ id: userId, email: emailLower, name, role });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ detail: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ detail: 'Email and password required' });
    const emailLower = email.toLowerCase();
    const user = await db.collection('users').findOne({ email: emailLower });
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ detail: 'Invalid email or password' });
    }
    const userId = user._id.toString();
    setAuthCookies(res, createAccessToken(userId, emailLower), createRefreshToken(userId));
    res.json({
      id: userId, email: emailLower, name: user.name, role: user.role,
      company_id: user.company_id || null, status: user.status || 'active'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ detail: 'Login failed' });
  }
});

app.post('/api/auth/logout', getCurrentUser, (req, res) => {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', getCurrentUser, (req, res) => {
  res.json(req.currentUser);
});

// ENQUIRY
app.post('/api/enquiry/submit', async (req, res) => {
  try {
    const enquiryDoc = { ...req.body, status: 'pending', created_at: new Date() };
    const result = await db.collection('enquiries').insertOne(enquiryDoc);
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1D4ED8;">Thank You for Your Enquiry</h2>
        <p>Dear ${req.body.contact_person_name},</p>
        <p>We have received your enquiry from <strong>${req.body.company_name}</strong>.</p>
        <p>Our team will review your request and get back to you within 24-48 hours.</p>
        <p style="margin-top: 30px;">Best regards,<br>Mob Pae Team</p>
      </div>`;
    sendEmail(req.body.work_email, 'Mob Pae - Enquiry Received', html);
    res.json({ message: 'Enquiry submitted successfully', enquiry_id: result.insertedId.toString() });
  } catch (err) {
    console.error('Enquiry error:', err);
    res.status(500).json({ detail: 'Failed to submit enquiry' });
  }
});

// ADMIN
app.get('/api/admin/enquiries', getCurrentUser, requireRole('admin'), async (req, res) => {
  const enquiries = await db.collection('enquiries').find({}).toArray();
  res.json(enquiries.map(e => { const { _id, ...rest } = e; return { ...rest, id: _id.toString() }; }));
});

app.post('/api/admin/approve-employer', getCurrentUser, requireRole('admin'), async (req, res) => {
  try {
    const { enquiry_id, employer_email, employer_password } = req.body;
    const enquiry = await db.collection('enquiries').findOne({ work_email: enquiry_id });
    if (!enquiry) return res.status(404).json({ detail: 'Enquiry not found' });
    const employerDoc = {
      email: employer_email.toLowerCase(), password_hash: await hashPassword(employer_password),
      name: enquiry.contact_person_name || 'Employer', role: 'employer',
      company_name: enquiry.company_name, phone_number: enquiry.phone_number,
      city: enquiry.city, industry: enquiry.industry,
      created_at: new Date(), status: 'active'
    };
    const result = await db.collection('users').insertOne(employerDoc);
    const companyId = result.insertedId.toString();
    await db.collection('enquiries').updateOne(
      { _id: enquiry._id },
      { $set: { status: 'approved', employer_id: companyId } }
    );
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1D4ED8;">Welcome to Mob Pae!</h2>
        <p>Dear ${enquiry.contact_person_name || 'Employer'},</p>
        <p>Your employer account has been approved.</p>
        <p><strong>Login Credentials:</strong></p>
        <p>Email: ${employer_email}<br>Password: ${employer_password}</p>
        <p style="margin-top: 30px;">Best regards,<br>Mob Pae Team</p>
      </div>`;
    sendEmail(employer_email, 'Mob Pae - Account Approved', html);
    res.json({ message: 'Employer approved and account created', employer_id: companyId });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ detail: 'Failed to approve employer' });
  }
});

app.get('/api/admin/users', getCurrentUser, requireRole('admin'), async (req, res) => {
  const users = await db.collection('users').find({}).toArray();
  res.json(users.map(u => { const { _id, password_hash, ...rest } = u; return { ...rest, id: _id.toString() }; }));
});

app.get('/api/admin/advance-requests', getCurrentUser, requireRole('admin'), async (req, res) => {
  const requests = await db.collection('advance_requests').find({}).toArray();
  res.json(requests.map(r => { const { _id, ...rest } = r; return { ...rest, id: _id.toString() }; }));
});

// EMPLOYER
app.post('/api/employer/add-employee', getCurrentUser, requireRole('employer'), async (req, res) => {
  try {
    const { name, email, phone_number, monthly_salary, advance_limit_percentage, department } = req.body;
    const emailLower = email.toLowerCase();
    if (await db.collection('users').findOne({ email: emailLower })) {
      return res.status(400).json({ detail: 'Email already exists' });
    }
    const employeeDoc = {
      email: emailLower, password_hash: await hashPassword('employee123'),
      name, role: 'employee', company_id: req.currentUser.id, phone_number,
      monthly_salary: parseFloat(monthly_salary),
      advance_limit_percentage: parseFloat(advance_limit_percentage) || 30,
      department: department || null, created_at: new Date(), status: 'active'
    };
    const result = await db.collection('users').insertOne(employeeDoc);
    res.json({ message: 'Employee added successfully', employee_id: result.insertedId.toString() });
  } catch (err) {
    console.error('Add employee error:', err);
    res.status(500).json({ detail: 'Failed to add employee' });
  }
});

app.get('/api/employer/employees', getCurrentUser, requireRole('employer'), async (req, res) => {
  const employees = await db.collection('users').find({
    company_id: req.currentUser.id, role: 'employee'
  }).toArray();
  res.json(employees.map(e => { const { _id, password_hash, ...rest } = e; return { ...rest, id: _id.toString() }; }));
});

app.get('/api/employer/advance-requests', getCurrentUser, requireRole('employer'), async (req, res) => {
  const requests = await db.collection('advance_requests').find({
    employer_id: req.currentUser.id
  }).toArray();
  res.json(requests.map(r => { const { _id, ...rest } = r; return { ...rest, id: _id.toString() }; }));
});

app.post('/api/employer/handle-request', getCurrentUser, requireRole('employer'), async (req, res) => {
  try {
    const { request_id, action, rejection_reason } = req.body;
    const advanceRequest = await db.collection('advance_requests').findOne({ request_id });
    if (!advanceRequest) return res.status(404).json({ detail: 'Request not found' });
    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      updated_at: new Date()
    };
    if (action === 'reject' && rejection_reason) updateData.rejection_reason = rejection_reason;
    await db.collection('advance_requests').updateOne({ request_id }, { $set: updateData });
    res.json({ message: `Request ${action}d successfully` });
  } catch (err) {
    console.error('Handle request error:', err);
    res.status(500).json({ detail: 'Failed to handle request' });
  }
});

// EMPLOYEE
app.post('/api/employee/request-advance', getCurrentUser, requireRole('employee'), async (req, res) => {
  try {
    const { amount, reason, repayment_date } = req.body;
    const user = await db.collection('users').findOne({ email: req.currentUser.email });
    if (!user) return res.status(404).json({ detail: 'User not found' });
    const monthlySalary = user.monthly_salary || 0;
    const advanceLimitPct = user.advance_limit_percentage || 30;
    const maxAdvance = (monthlySalary * advanceLimitPct) / 100;
    const requestedAmount = parseFloat(amount);
    if (requestedAmount > maxAdvance) {
      return res.status(400).json({ detail: `Amount exceeds limit of ${maxAdvance}` });
    }
    const pendingRequest = await db.collection('advance_requests').findOne({
      employee_email: req.currentUser.email, status: 'pending'
    });
    if (pendingRequest) return res.status(400).json({ detail: 'You already have a pending request' });
    const requestDoc = {
      request_id: uuidv4(),
      employee_email: req.currentUser.email,
      employee_name: req.currentUser.name,
      employer_id: user.company_id,
      amount: requestedAmount,
      reason: reason || null,
      repayment_date, status: 'pending', created_at: new Date()
    };
    await db.collection('advance_requests').insertOne(requestDoc);
    res.json({ message: 'Advance request submitted successfully', request_id: requestDoc.request_id });
  } catch (err) {
    console.error('Request advance error:', err);
    res.status(500).json({ detail: 'Failed to submit request' });
  }
});

app.get('/api/employee/my-requests', getCurrentUser, requireRole('employee'), async (req, res) => {
  const requests = await db.collection('advance_requests').find({
    employee_email: req.currentUser.email
  }).toArray();
  res.json(requests.map(r => { const { _id, ...rest } = r; return { ...rest, id: _id.toString() }; }));
});

app.get('/api/employee/dashboard-stats', getCurrentUser, requireRole('employee'), async (req, res) => {
  const user = await db.collection('users').findOne({ email: req.currentUser.email });
  if (!user) return res.status(404).json({ detail: 'User not found' });
  const monthlySalary = user.monthly_salary || 0;
  const advanceLimitPct = user.advance_limit_percentage || 30;
  const maxAdvance = (monthlySalary * advanceLimitPct) / 100;
  const approvedRequests = await db.collection('advance_requests').find({
    employee_email: req.currentUser.email, status: 'approved'
  }).toArray();
  const totalUsed = approvedRequests.reduce((sum, r) => sum + (r.amount || 0), 0);
  res.json({
    monthly_salary: monthlySalary,
    available_advance: maxAdvance - totalUsed,
    max_advance: maxAdvance,
    total_used: totalUsed,
    usage_percentage: maxAdvance > 0 ? (totalUsed / maxAdvance) * 100 : 0
  });
});

app.get('/api/', (req, res) => {
  res.json({ message: 'Mob Pae API is running' });
});

// STARTUP
async function startup() {
  await mongoClient.connect();
  db = mongoClient.db(DB_NAME);
  console.log('Connected to MongoDB');

  try {
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
  } catch (err) {
    console.log('Index already exists');
  }

  const existingAdmin = await db.collection('users').findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    await db.collection('users').insertOne({
      email: ADMIN_EMAIL,
      password_hash: await hashPassword(ADMIN_PASSWORD),
      name: 'Admin', role: 'admin',
      created_at: new Date(), status: 'active'
    });
    console.log('Admin user created');
  } else if (!(await verifyPassword(ADMIN_PASSWORD, existingAdmin.password_hash))) {
    await db.collection('users').updateOne(
      { email: ADMIN_EMAIL },
      { $set: { password_hash: await hashPassword(ADMIN_PASSWORD) } }
    );
    console.log('Admin password updated');
  }

  // Seed default employer
  const DEFAULT_EMPLOYER_EMAIL = 'employer@acme.com';
  const DEFAULT_EMPLOYER_PASSWORD = 'employer123';
  let employerId;
  const existingEmployer = await db.collection('users').findOne({ email: DEFAULT_EMPLOYER_EMAIL });
  if (!existingEmployer) {
    const result = await db.collection('users').insertOne({
      email: DEFAULT_EMPLOYER_EMAIL,
      password_hash: await hashPassword(DEFAULT_EMPLOYER_PASSWORD),
      name: 'John Doe', role: 'employer',
      company_name: 'Acme Corp', phone_number: '9876543210',
      city: 'Mumbai', industry: 'Tech',
      created_at: new Date(), status: 'active'
    });
    employerId = result.insertedId.toString();
    console.log('Default employer created');
  } else {
    employerId = existingEmployer._id.toString();
    if (!(await verifyPassword(DEFAULT_EMPLOYER_PASSWORD, existingEmployer.password_hash))) {
      await db.collection('users').updateOne(
        { email: DEFAULT_EMPLOYER_EMAIL },
        { $set: { password_hash: await hashPassword(DEFAULT_EMPLOYER_PASSWORD) } }
      );
      console.log('Employer password updated');
    }
  }

  // Seed default employee linked to the default employer
  const DEFAULT_EMPLOYEE_EMAIL = 'employee@acme.com';
  const DEFAULT_EMPLOYEE_PASSWORD = 'employee123';
  const existingEmployee = await db.collection('users').findOne({ email: DEFAULT_EMPLOYEE_EMAIL });
  if (!existingEmployee) {
    await db.collection('users').insertOne({
      email: DEFAULT_EMPLOYEE_EMAIL,
      password_hash: await hashPassword(DEFAULT_EMPLOYEE_PASSWORD),
      name: 'Jane Smith', role: 'employee',
      company_id: employerId,
      phone_number: '9876543211',
      monthly_salary: 50000,
      advance_limit_percentage: 30,
      department: 'Engineering',
      created_at: new Date(), status: 'active'
    });
    console.log('Default employee created');
  } else {
    if (!(await verifyPassword(DEFAULT_EMPLOYEE_PASSWORD, existingEmployee.password_hash))) {
      await db.collection('users').updateOne(
        { email: DEFAULT_EMPLOYEE_EMAIL },
        { $set: { password_hash: await hashPassword(DEFAULT_EMPLOYEE_PASSWORD), company_id: employerId } }
      );
      console.log('Employee password updated');
    } else if (!existingEmployee.company_id || existingEmployee.company_id !== employerId) {
      await db.collection('users').updateOne(
        { email: DEFAULT_EMPLOYEE_EMAIL },
        { $set: { company_id: employerId } }
      );
      console.log('Employee company_id linked');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mob Pae Node.js backend running on port ${PORT}`);
  });
}

startup().catch(err => {
  console.error('Startup error:', err);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await mongoClient.close();
  process.exit(0);
});
