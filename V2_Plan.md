## v2.0.0 Roadmap — The Office Line Generator

Version 2 aims to evolve the project from a simple random quote generator into a dynamic, authenticated subscription-based web app.

---

### Goals
- Introduce **user account management** and **subscriptions**
- Integrate **Keycloak Admin API** for dynamic role updates
- Simulate **payment flows** for learning/demo purposes
- Provide **real-time access control** and **UI feedback**

---

### Planned Features

#### 🔐 Authentication & User Management
- [ ] Add "Create Account" and "My Account" dashboard
- [ ] Display user details, roles, and subscription status
- [ ] Allow admins to create/update users via Keycloak Admin API
- [ ] Secure backend routes for user management actions

#### 💳 Subscriptions & Payment Simulation
- [ ] Implement subscription tiers: **Free**, **Pro**, **Admin**
- [ ] Add subscription management UI (upgrade, cancel, renew)
- [ ] Simulate payment process with test/fake data (optional Stripe test mode)
- [ ] Reflect subscription changes in Keycloak roles

#### ⚡ Real-Time Role Updates
- [ ] Sync user roles live via **WebSockets** or **Server-Sent Events (SSE)**
- [ ] Automatically restrict access when roles are downgraded
- [ ] Provide live UI feedback on subscription changes

#### 🎨 UI/UX Enhancements
- [ ] Add responsive **user dashboard**
- [ ] Support **dark/light themes**

#### 🧱 Backend
- [ ] Create secure admin microservice for Keycloak API calls
- [ ] Update documentation for new architecture

---


