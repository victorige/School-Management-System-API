/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       required:
 *         - email
 *         - password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *           description: Indicates if the login was successful
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the user
 *                 firstName:
 *                   type: string
 *                   description: The first name of the user
 *                 lastName:
 *                   type: string
 *                   description: The last name of the user
 *                 email:
 *                   type: string
 *                   description: The email address of the user
 *                 role:
 *                   type: string
 *                   description: The role of the user
 *                 schoolId:
 *                   type: string
 *                   description: The ID of the school the user belongs to (if applicable)
 *             token:
 *               type: string
 *               description: Authentication token for the user
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *         message:
 *           type: string
 *           description: Response message
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 * tags:
 *   - name: Authentication
 *     description: Endpoints for user authentication (login, logout, etc.)
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns a JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '400':
 *         description: Bad request, validation error
 *       '401':
 *         description: Invalid email or password
 *       '500':
 *         description: Internal server error
 */
