/**
 * Devices Router
 *
 * Mounts device registration/unregistration endpoints.
 * Base path: /api/devices
 */

const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { registerValidation, unregisterValidation } = require('./validation')
const { validateMiddleware } = require('../../middlewares/validation')

/**
 * @route   POST /api/devices/register
 * @desc    Register or update device FCM token
 * @access  Public
 */
router.post('/register', registerValidation, validateMiddleware, controller.register)

/**
 * @route   DELETE /api/devices/register
 * @desc    Unregister device (set is_active = false)
 * @access  Public
 */
router.delete('/register', unregisterValidation, validateMiddleware, controller.unregister)

module.exports = router
