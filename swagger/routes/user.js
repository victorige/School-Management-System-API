/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password for the user
 *         role:
 *           type: string
 *           enum:
 *             - school_admin
 *             - super_admin
 *           description: The role of the user
 *         schoolId:
 *           type: string
 *           description: The school ID if the user is a school admin
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the user
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *         schoolId:
 *           type: string
 *           description: The ID of the school the user belongs to (if applicable)
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created this user
 *         updatedBy:
 *           type: string
 *           description: The ID of the user who last updated this user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *     UserResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: The total number of users
 *         page:
 *           type: integer
 *           description: The current page number
 *         limit:
 *           type: integer
 *           description: The number of users per page
 *         totalPages:
 *           type: integer
 *           description: The total number of pages
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 * tags:
 *   - name: User
 *     description: Endpoints for user management (CRUD operations)
 */
/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user in the system
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       '201':
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '400':
 *         description: Bad request, validation error
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/getAll:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Fetches users with optional pagination, sorting, and filtering
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users to return per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: "createdAt"
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: "asc"
 *         description: Order of sorting (ascending or descending)
 *       - in: query
 *         name: filters
 *         schema:
 *           type: object
 *         description: Object to filter the users
 *     responses:
 *       '200':
 *         description: A list of users with pagination details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *                     appliedFilters:
 *                       type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                 message:
 *                   type: string
 *                   description: Response message
 *       '500':
 *         description: Internal server error
 */
