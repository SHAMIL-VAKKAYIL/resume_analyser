# Use a base image that has both Node.js and Python installed
FROM nikolaik/python-nodejs:python3.11-nodejs20

# Set the working directory to the project root
WORKDIR /app

# ---- Python Setup ----
# Copy the ML directory
COPY ml/ ./ml/

# Install the Python dependencies (PyPDF2, scikit-learn, etc.)
RUN pip install --no-cache-dir -r ./ml/requirements.txt

# ---- Node.js Setup ----
# Copy the server directory
COPY server/ ./server/

# Set working directory to the backend server
WORKDIR /app/server

# Add PNPM globally and install server dependencies
RUN npm install -g pnpm
RUN pnpm install

# Expose the backend port
EXPOSE 5000

# Specify that we are running in production
ENV NODE_ENV=production

# Start the Node.js server
CMD ["pnpm", "start"]
