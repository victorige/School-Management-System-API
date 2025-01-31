/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the user
 *         firstName:
 *           type: string
 *           description: First name of the user
 *         lastName:
 *           type: string
 *           description: Last name of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         role:
 *           type: string
 *           description: Role of the user (e.g., super_admin)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the user was last updated
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 * tags:
 *   - name: Seed
 *     description: Operations related to seeding data (e.g., creating an admin user)
 */

/**
 * @swagger
 * /seed/admin:
 *   get:
 *     summary: Seed admin user
 *     description: Creates a super admin user if not already created
 *     tags:
 *       - Seed
 *     responses:
 *       '200':
 *         description: Admin user already exists or was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request due to missing or invalid configuration
 *       '500':
 *         description: Internal server error
 */
