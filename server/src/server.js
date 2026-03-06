import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'

import connectDB from './config/db.js'
import logger from './config/logger.js'
import authRoutes from './routes/auth.js'
import protectedRoutes from './routes/protected.js'
import userRoutes from './routes/user.routes.js'
import adminRoutes from './routes/admin.routes.js'
import companyRoutes from './routes/company.routes.js'

const app = express()
const __dirname = path.resolve()
const isProd = process.env.NODE_ENV === 'production'

connectDB(process.env.MONGO_URI)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', limiter)

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// routes
app.use('/api/auth', authRoutes)
app.use('/api', protectedRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/company', companyRoutes)

// Global error handler
app.use((err, req, res, _next) => {
  logger.error({ err, method: req.method, url: req.url }, 'Unhandled error')
  const status = err.status || 500
  res.status(status).json({
    message: isProd ? 'Internal server error' : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => logger.info(`Server running on ${PORT} [${isProd ? 'production' : 'development'}]`))
