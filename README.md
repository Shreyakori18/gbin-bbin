# G-Bin & B-Bin – Smart Waste Management System

A full-stack, responsive, user-friendly web application designed to encourage households to segregate biodegradable and non-biodegradable waste properly and support an organized, regular scheduled municipal waste-management system.

---

## 🌟 Key Features

### 1. Dual-Bin Segregation Architecture
- **G-Bin (Green Bin):**
  - Designated strictly for biodegradable and wet waste (vegetable peels, fruit waste, leftover food scraps, leaves, garden clippings, tea grounds).
  - Diverted to ward composting facilities and aerobic biogas units for zero landfill deposition.
- **B-Bin (Blue Bin):**
  - Designated strictly for dry and recyclable waste (paper, magazines, cardboard boxes, clean plastic bottles, aluminium cans, glass jars, cartons).
  - Directed to Material Recovery Facilities (MRFs) for clean circular reprocessing.

### 2. User & Household Registration
- Household sign-up capturing head of household name, email, password, phone, street address, ward/zone, PIN code, and family members count.
- Automatic generation of a **unique permanent Household ID** (e.g., `GB-HH-4291`).
- Profile view and editing capabilities for updating phone numbers, address, and family count.
- Protected authentication with role-based segregation (`household` vs `admin`).

### 3. Household Dashboard
- Personalized welcome banner showcasing the household's unique ID badge.
- Household profile summary card (Ward, Address, Residents).
- Allocated bin quotas (standard Green and Blue bin status).
- Quick segregation guidelines checklist.
- Scheduled regular waste collection calendar for the household's specific ward.
- Order tracking preview and direct shortcut to the bin shop.

### 4. Waste Segregation Awareness & Educational Hub
- Comprehensive educational section highlighting the scientific differences between wet and dry waste processing.
- Detailed searchable directory of everyday household items with disposal advice.
- Interactive **Waste Sorter Challenge** mini-quiz for testing household segregation knowledge with instant feedback.
- Key environmental impact metrics (trees saved, energy conserved, methane emissions mitigated).

### 5. Regular Waste Collection Management
- Fixed, predictable regular collection schedule by ward and zone.
- Real-time route information including collection days, time windows, assigned sanitation vehicles, and designated driver officers.
- Operational status tracking (`Scheduled`, `In Progress`, `Completed`, `Delayed`).
- *Note:* Per municipal requirements, collections follow published regular schedules rather than ad-hoc pickup requests.

### 6. Municipal Bin Shop & Order Management
- Subsidized bin catalog:
  - G-Bin (Green) Standard 60L
  - B-Bin (Blue) Standard 60L
  - G-Bin & B-Bin Combo Set (60L Duo)
  - Heavy Capacity 120L Wheel Units
  - Deluxe Double Waste Station
- Interactive cart drawer with item quantity adjustments and order subtotal.
- Doorstep delivery ordering without unnecessary payment gateway requirements.
- Order Tracking dashboard with a 4-step delivery pipeline: `Pending` ➔ `Confirmed` ➔ `Out for Delivery` ➔ `Delivered`.

### 7. Municipal Administrative Management
- Dedicated admin portal restricted to authorized personnel:
  - **Registered Households:** Search and filter households by ID, street address, or ward.
  - **Bin Orders Management:** View incoming orders and update delivery fulfillment status in real-time.
  - **Collection Route Management:** Add new scheduled collection routes, assign vehicles, specify drivers, and update operational progress.
  - **Bin Distribution Records:** Track total active Green and Blue bins distributed across households.
  - **Operational Reports:** Export operational summary data to CSV, view ward registration breakdowns, and monitor collection logs.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 with Vite 8
- **Routing:** React Router v7 (`react-router-dom`)
- **Icons & Styling:** Lucide React (`lucide-react`) + Custom CSS Design System
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) & local persistence fallback
- **Theme:** Vibrant Green (`#10b981`) and Blue (`#0284c7`) modern municipal theme

---

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Top navigation with responsive mobile menu & cart
│   │   ├── Footer.jsx      # Municipal footer with links & helpline info
│   │   ├── CartDrawer.jsx  # Slide-out basket & checkout order form
│   │   └── ProtectedRoute.jsx # Role-based route guard
│   ├── context/
│   │   ├── AuthContext.jsx # Authentication, roles & household state
│   │   └── CartContext.jsx # Bin shopping cart state & persistence
│   ├── lib/
│   │   └── supabaseClient.js # Supabase client & local DB persistence engine
│   ├── pages/
│   │   ├── Home.jsx        # Landing page with bin duo showcase & stats
│   │   ├── About.jsx       # Mission, vision, & two-bin processing science
│   │   ├── WasteSegregationGuide.jsx # Items guide & interactive sorter quiz
│   │   ├── BinShop.jsx     # Subsidized bin catalog & basket actions
│   │   ├── Login.jsx       # Login page with quick demo toggles
│   │   ├── Register.jsx    # Household registration & unique ID generation
│   │   ├── HouseholdDashboard.jsx # Resident dashboard & ward schedules
│   │   ├── MyOrders.jsx    # Bin orders history & tracking stepper
│   │   ├── Profile.jsx     # Household profile & settings editor
│   │   ├── AdminDashboard.jsx # Households, orders, collections & distribution
│   │   └── AdminReports.jsx   # Metrics, ward charts & CSV export
│   ├── App.jsx             # Top-level routes configuration
│   ├── index.css           # Green & Blue responsive styling system
│   └── main.jsx            # Entry point
├── schema.sql              # Complete PostgreSQL schema, functions & RLS policies
├── package.json            # Dependencies & build scripts
└── README.md               # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; v22 supported)
- npm or yarn

### Installation
1. Clone the repository and install dependencies:
   ```bash
   git clone <repo-url>
   cd gbin-bbin
   npm install
   ```

2. (Optional) Configure Supabase Environment Variables:
   If connecting to a live Supabase project, create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   *Note: If no Supabase credentials are provided, the system automatically uses its built-in local database engine pre-seeded with sample households, schedules, and orders.*

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🗄️ Database Setup & SQL Scripts

To initialize the PostgreSQL database in Supabase, execute `schema.sql` in the Supabase SQL Editor. The script creates:

1. `profiles`: Links authenticated Supabase users to their profile information.
2. `households`: Maintains unique household IDs (`GB-HH-XXXX`), addresses, wards, and bin quotas.
3. `user_roles`: Manages role assignments (`household` vs `admin`).
4. `collections`: Maintains ward-level scheduled routes, vehicle IDs, drivers, and statuses.
5. `orders`: Records subsidized bin purchases, delivery addresses, and delivery statuses.
6. Row Level Security (RLS) policies ensuring users only view their own records while admins have full management permissions.

---

## 🔑 Pre-seeded Demo Credentials

For quick testing and evaluation without manual signup:

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Municipal Admin** | `admin@gbinbbin.org` | `adminpassword123` | Admin Dashboard, Household DB, Order fulfillment, Collection schedules, Analytics & Reports |
| **Household Resident** | `sarah.household@example.com` | `password123` | Household Dashboard, Unique ID `GB-HH-4291`, Bin Shop, My Orders, Profile settings |
| **Household Resident** | `rohit.sharma@example.com` | `password123` | Household Dashboard, Unique ID `GB-HH-8820`, Bin Shop, My Orders |

*You can also click the **"Quick Demo Login"** buttons on the Login page to instantly authenticate into either role.*
