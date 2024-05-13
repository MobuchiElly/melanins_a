Melanin A Blog
Description
Melanin A Blog is a full-stack web application for publishing and managing blog articles. It allows users to read articles, search for specific topics, and filter articles by tags. Admin users have additional capabilities such as creating, editing, and deleting articles, as well as approving comments.

Stack Used
Frontend: Next.js, React, Tailwind CSS
Backend: Node.js, Express.js, MongoDB
Authentication: JWT
Deployment: Heroku (Backend), Vercel (Frontend)
Features
Authentication: Users can sign up, sign in, and sign out. Admins have additional access rights.
CRUD Operations: Admins can create, read, update, and delete articles. Users can read articles and comment on them.
Search and Filtering: Users can search for articles by title, content, or tags. They can also filter articles by tags.
Admin Approval: Comments require admin approval before being published.
Responsive Design: The application is designed to be responsive and work well on mobile, tablet, and desktop devices.
Getting Started
Prerequisites
Node.js (v14 or later)
MongoDB (local or cloud-based instance)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/melanin-a-blog.git
Install dependencies:

bash
Copy code
cd melanin-a-blog
npm install
Set up environment variables:

Create a .env file in the root directory and add the following:

plaintext
Copy code
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
Start the development server:

bash
Copy code
npm run dev
Open http://localhost:3000 in your browser to view the application.

Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.