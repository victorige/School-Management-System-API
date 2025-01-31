/**
 * @swagger
 * components:
 *   schemas:
 *     SchoolRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the school
 *         address:
 *           type: string
 *           description: The address of the school
 *         contactEmail:
 *           type: string
 *           format: email
 *           description: The contact email of the school
 *         phone:
 *           type: string
 *           description: The contact phone number of the school
 *       required:
 *         - name
 *         - contactEmail
 *         - phone
 *     SchoolResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the school
 *         name:
 *           type: string
 *           description: The name of the school
 *         address:
 *           type: string
 *           description: The address of the school
 *         contactEmail:
 *           type: string
 *           description: The contact email of the school
 *         phone:
 *           type: string
 *           description: The contact phone number of the school
 *         createdBy:
 *           type: string
 *           description: The user ID who created the school
 *         updatedBy:
 *           type: string
 *           description: The user ID who last updated the school
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the school
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last updated date of the school
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: The total number of schools
 *         page:
 *           type: integer
 *           description: The current page number
 *         limit:
 *           type: integer
 *           description: The number of schools per page
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
 *   - name: School
 *     description: Endpoints for school management (CRUD operations)
 */
/**
 * @swagger
 * /school/create:
 *   post:
 *     summary: Create a new school
 *     description: Creates a new school in the system
 *     tags:
 *       - School
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchoolRequest'
 *     responses:
 *       '201':
 *         description: School successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   $ref: '#/components/schemas/SchoolResponse'
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '400':
 *         description: Bad request, validation error
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /school/getAll:
 *   get:
 *     summary: Retrieve a list of schools with pagination
 *     description: Fetches a list of schools with optional pagination, sorting, and filtering
 *     tags:
 *       - School
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
 *         description: Number of schools to return per page
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
 *         description: Object to filter the schools
 *     responses:
 *       '200':
 *         description: A list of schools with pagination details
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
 *                     schools:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SchoolResponse'
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

/**
 * @swagger
 * /school/get/{id}:
 *   get:
 *     summary: Retrieve school by ID
 *     description: Fetches a single school by its unique ID
 *     tags:
 *       - School
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the school
 *     responses:
 *       '200':
 *         description: School retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolResponse'
 *       '404':
 *         description: School not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /school/update/{id}:
 *   put:
 *     summary: Update school details
 *     description: Updates the information of an existing school by its ID
 *     tags:
 *       - School
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the school
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchoolRequest'
 *     responses:
 *       '200':
 *         description: School updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolResponse'
 *       '400':
 *         description: Bad request, validation error
 *       '404':
 *         description: School not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /school/delete/{id}:
 *   delete:
 *     summary: Delete a school by ID
 *     description: Deletes a school by its unique ID
 *     tags:
 *       - School
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the school
 *     responses:
 *       '200':
 *         description: School deleted successfully
 *       '404':
 *         description: School not found
 *       '500':
 *         description: Internal server error
 */
