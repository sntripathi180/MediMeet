#  Hospital Management System  

A full-stack **Hospital Management System** built with the **MERN stack**.  
This project was created as part of my learning/practice journey to explore role-based authentication, payment gateway integration, and responsive UI design.  

---
## Have a look

- User
  ```bash
  https://hms-frontend-ndpu.onrender.com
  ```
- Admin/doctor
  ```bash
  https://hms-admin-i1tc.onrender.com
  ```
- Doctor login details
  ```
  Email : Amelia@gmail.com
  Password : qwerty123456
  ```
  

##  Features  

###  Admin  
- Add doctors  
- View all appointments  
- Cancel appointments  
- Set doctor availability  

###  Doctor  
- Accept/Reject appointments  
- Update profile  
- Manage availability  

### User (Patient)  
- Register/Login & update profile  
- Book appointments with doctors  
- Pay online via **Razorpay** 💳 or by cash  
- Cancel appointments  
- Search/Sort doctors by specialty  

---

## Tech Stack  

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Payment Gateway:** Razorpay API  
- **Authentication:** JWT (JSON Web Tokens)  

---
### Steps  

1. **Clone the repo**  
   ```bash
   git clone https://github.com/sntripathi180/MediMeet.git
   cd MediMeet
   ```
2. ** Backend Setup
   ```bash
    cd backend
    npm install     
   ```
- Create a .env file inside backend with the help of env.sample from project
- Start backend:
  ```bash
    npm run dev
  ```
3. **Frontend setup**

  ```bash
    cd ../frontend
    npm install
    npm run dev
  ```
  
