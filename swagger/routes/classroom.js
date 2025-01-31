/**
 * @swagger
 * components:
 *   schemas:
 *     Classroom:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the classroom
 *         schoolId:
 *           type: string
 *           description: The school ID the classroom belongs to
 *         name:
 *           type: string
 *           description: The name of the classroom
 *         capacity:
 *           type: number
 *           description: The capacity of the classroom
 *         resources:
 *           type: array
 *           items:
 *             type: string
 *           description: List of resources available in the classroom
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the classroom
 *         updatedBy:
 *           type: string
 *           description: The ID of the user who last updated the classroom
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the classroom was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the classroom was last updated
 *     ClassroomRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the classroom
 *         capacity:
 *           type: number
 *           description: The capacity of the classroom
 *         resources:
 *           type: array
 *           items:
 *             type: string
 *           description: List of resources available in the classroom
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 * tags:
 *   - name: Classrooms
 *     description: Operations related to classrooms
 */

/**
 * @swagger
 * /classroom/create:
 *   post:
 *     summary: Create a new classroom
 *     description: Creates a new classroom for a specific school
 *     tags:
 *       - Classrooms
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassroomRequest'
 *     responses:
 *       '201':
 *         description: Successfully created classroom
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       '400':
 *         description: Bad request, invalid data
 *       '403':
 *         description: Forbidden, unable to create classroom for another school
 *       '404':
 *         description: School not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /classroom/getAll:
 *   get:
 *     summary: Get all classrooms
 *     description: Retrieves a paginated list of all classrooms
 *     tags:
 *       - Classrooms
 *      security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Limit number of classrooms returned
 *         required: false
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Field to sort the classrooms by
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Sort order, either "asc" or "desc"
 *         required: false
 *         schema:
 *           type: string
 *       - name: filters
 *         in: query
 *         description: Filters to apply for classroom search
 *         required: false
 *         schema:
 *           type: object
 *     responses:
 *       '200':
 *         description: Successfully retrieved classrooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classrooms:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Classroom'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       '400':
 *         description: Bad request, invalid parameters
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /classroom/getAll:
 *   get:
 *     summary: Get all classrooms
 *     description: Retrieves a paginated list of all classrooms
 *     tags:
 *       - Classrooms
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Limit number of classrooms returned
 *         required: false
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Field to sort the classrooms by
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Sort order, either "asc" or "desc"
 *         required: false
 *         schema:
 *           type: string
 *       - name: filters
 *         in: query
 *         description: Filters to apply for classroom search
 *         required: false
 *         schema:
 *           type: object
 *     responses:
 *       '200':
 *         description: Successfully retrieved classrooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classrooms:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Classroom'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       '400':
 *         description: Bad request, invalid parameters
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /classroom/get/{id}:
 *   get:
 *     summary: Get classroom by ID
 *     description: Retrieves a classroom by its ID
 *     tags:
 *       - Classrooms
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the classroom
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved classroom
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       '404':
 *         description: Classroom not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /classroom/update/{id}:
 *   put:
 *     summary: Update classroom by ID
 *     description: Updates a classroom's details by its ID
 *     tags:
 *       - Classrooms
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the classroom
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassroomRequest'
 *     responses:
 *       '200':
 *         description: Successfully updated classroom
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       '400':
 *         description: Bad request, invalid data
 *       '404':
 *         description: Classroom not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /classroom/delete/{id}:
 *   delete:
 *     summary: Delete classroom by ID
 *     description: Deletes a classroom by its ID
 *     tags:
 *       - Classrooms
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the classroom
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted classroom
 *       '404':
 *         description: Classroom not found
 *       '500':
 *         description: Internal server error
 */
