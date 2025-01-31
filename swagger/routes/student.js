/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the student
 *         schoolId:
 *           type: string
 *           description: The school ID the student belongs to
 *         classroomId:
 *           type: string
 *           description: The classroom ID the student is in
 *         firstName:
 *           type: string
 *           description: The first name of the student
 *         lastName:
 *           type: string
 *           description: The last name of the student
 *         email:
 *           type: string
 *           description: The email of the student
 *         enrollmentDate:
 *           type: string
 *           format: date-time
 *           description: The date the student was enrolled
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the student record
 *         updatedBy:
 *           type: string
 *           description: The ID of the user who last updated the student record
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the student was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the student was last updated
 *     StudentRequest:
 *       type: object
 *       properties:
 *         classroomId:
 *           type: string
 *           description: The classroom ID the student will belong to
 *         firstName:
 *           type: string
 *           description: The first name of the student
 *         lastName:
 *           type: string
 *           description: The last name of the student
 *         email:
 *           type: string
 *           description: The email of the student
 *         enrollmentDate:
 *           type: string
 *           format: date-time
 *           description: The date the student is enrolled
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 * tags:
 *   - name: Students
 *     description: Operations related to students
 */

/**
 * @swagger
 * /student/create:
 *   post:
 *     summary: Create a new student
 *     description: Creates a new student for a specific school and classroom
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentRequest'
 *     responses:
 *       '201':
 *         description: Successfully created student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       '400':
 *         description: Bad request, invalid data
 *       '403':
 *         description: Forbidden, unable to create student for another school
 *       '404':
 *         description: Classroom not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /student/transfer:
 *   patch:
 *     summary: Transfer student to another classroom
 *     description: Transfers a student to a different classroom
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: The student ID to transfer
 *               classroomId:
 *                 type: string
 *                 description: The target classroom ID
 *     responses:
 *       '200':
 *         description: Successfully transferred student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       '400':
 *         description: Bad request, invalid data
 *       '404':
 *         description: Student or classroom not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /student/getAll:
 *   get:
 *     summary: Get all students
 *     description: Retrieves a paginated list of all students
 *     tags:
 *       - Students
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
 *         description: Limit number of students returned
 *         required: false
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Field to sort the students by
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
 *         description: Filters to apply for student search
 *         required: false
 *         schema:
 *           type: object
 *     responses:
 *       '200':
 *         description: Successfully retrieved students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
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
 * /student/get/{id}:
 *   get:
 *     summary: Get student by ID
 *     description: Retrieves a student by its ID
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the student
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       '404':
 *         description: Student not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /student/update/{id}:
 *   put:
 *     summary: Update student by ID
 *     description: Updates a student's details by its ID
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the student
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentRequest'
 *     responses:
 *       '200':
 *         description: Successfully updated student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       '400':
 *         description: Bad request, invalid data
 *       '404':
 *         description: Student not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /student/delete/{id}:
 *   delete:
 *     summary: Delete student by ID
 *     description: Deletes a student by its ID
 *     tags:
 *       - Students
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the student
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted student
 *       '404':
 *         description: Student not found
 *       '500':
 *         description: Internal server error
 */
