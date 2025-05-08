# 🧠 Tuberculosis Detector using Deep Learning

This is a full-stack web application that allows users to upload chest X-ray images and detect the presence of Tuberculosis using a trained deep learning model. The project is built using Next.js, TensorFlow.js, Supabase, and NextAuth.js for authentication.

---

## 🚀 Live Demo

https://tuberculosis-detector.vercel.app/

---

## 🧰 Tech Stack

- **Frontend:** Next.js 13+ (App Router), Tailwind CSS
- **Machine Learning:** TensorFlow.js
- **Backend / DB:** Supabase (PostgreSQL, Row-Level Security)
- **Authentication:** NextAuth.js (Credentials Provider)

---

## 📸 Features

- 🔍 Upload chest X-ray images and run real-time predictions
- 🤖 Model classifies images as either `Normal` or `Tuberculosis`
- 📈 Risk level is calculated based on prediction confidence
- 🔐 Auth system using NextAuth (email/password login)
- 📂 Logged-in users can view their prediction history
- 💾 Data is securely stored in Supabase (with RLS enabled)

---


---

## 📄 How It Works

1. User uploads an X-ray image.
2. Image is processed using a TensorFlow.js model in the browser.
3. Prediction and confidence score are displayed.
4. If user is logged in:
   - Prediction + metadata is saved to Supabase DB.
   - User can view their personal prediction history.

---

## 🔐 Authentication

- Built using **NextAuth.js**
- Supports email/password login with credentials provider
- Uses JWT session strategy
- History page is protected — only logged-in users can access it

---

## 🔍 Supabase Security

- Row Level Security (RLS) is enabled on the `predictions` table.
- Only the user who made a prediction can access their own history.

---

## 🧠 Model

- A lightweight CNN model trained on TB vs Normal chest X-rays.
- Exported using TensorFlow and loaded in the browser with `@tensorflow/tfjs`.

---

## 🖼️ Screenshots

![Screenshot (371)](https://github.com/user-attachments/assets/26a82e32-4802-402b-bfaa-55b82bb0a356)

![Screenshot (372)](https://github.com/user-attachments/assets/79f38ff7-297a-4344-ab99-ed6e1b556a0c)

![Screenshot (373)](https://github.com/user-attachments/assets/b8e4535e-cddc-432e-b159-a4ca025f41e5)

---

## 🛠️ Getting Started (Local Setup)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tuberculosis-detector.git
   cd tuberculosis-detector
   
2. Install dependencies:
    ```bash
        npm install

3. Create .env and add:
    ```bash
        NEXTAUTH_SECRET=your_random_secret
        NEXTAUTH_URL=http://localhost:3000
        NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

4. Run the development server:
    ```bash
        npm run dev

---

## 📚 References

- https://www.tensorflow.org/js
- https://supabase.com
- https://next-auth.js.org
- https://www.who.int/health-topics/tuberculosis

---

## 🙌 Acknowledgements

Built with ❤️ by Prince Singh Chouhan as part of his MCA final-year project.
